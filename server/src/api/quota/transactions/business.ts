import {
  BudgetTransaction,
  createTransaction,
  getTransaction,
  updateTransaction,
} from ".";
import * as BudgetAccountController from "../account";
import { updateAccountFromTransaction } from "../account";
import * as BudgetCategoryController from "../categories";
import { getCategory } from "../categories";
import {
  DocumentReference,
  documentReferenceType,
} from "../gateway/persistence";
import { PlaidTransaction } from "../gateway/plaid";
import * as BudgetInstitutionController from "../institution";
import * as BudgetPayeeController from "../payees";
import * as BudgetScheduledController from "../scheduled";
import { createAndPostTransaction } from "./persistence";

export const addManualTransaction = async (
  userRef: DocumentReference,
  {
    accountId,
    payeeId,
    categoryId,
    amount,
    date,
    cleared,
    flagColor,
    note,
  }: {
    accountId: documentReferenceType;
    payeeId: documentReferenceType;
    categoryId: documentReferenceType;
    amount: number;
    date: string;
    note: string;
    flagColor: string;
    cleared?: boolean;
  }
): Promise<BudgetTransaction> => {
  const account = await BudgetAccountController.getAccount(userRef, {
    accountId: accountId,
  }).then((account) =>
    BudgetAccountController.updateAccount(account, {
      availableBalance: account.availableBalance + amount,
      currentBalance: account.currentBalance + (cleared ? amount : 0),
    })
  );
  const payee = await BudgetPayeeController.getPayee(userRef, {
    payeeId: payeeId,
  });

  const category = await BudgetCategoryController.getCategory(userRef, {
    categoryId: categoryId,
  });

  const transaction = await createAndPostTransaction({
    accountId: account.id,
    accountName: account.name,
    amount: amount,
    cleared: cleared,
    note: note,
    date: new Date(date),
    payeeId: payee.id,
    payeeName: payee.name,
    userId: userRef,
    categoryId: category.id,
    categoryName: category.name,
    flagColor,
  });

  await BudgetAccountController.updateAccountMonthBalance(userRef, account, {
    date,
  });

  await BudgetCategoryController.updateCategoryMonthBalance(userRef, category, {
    date,
  });

  return transaction;
};

export const convertScheduledTransaction = async (
  userRef: DocumentReference,
  scheduledTransactionId: documentReferenceType
): Promise<BudgetTransaction> =>
  BudgetScheduledController.getScheduled(userRef, scheduledTransactionId).then(
    (scheduledTransaction) =>
      addManualTransaction(userRef, {
        accountId: scheduledTransaction.accountId,
        amount: scheduledTransaction.amount,
        cleared: true,
        note: scheduledTransaction.note,
        date: scheduledTransaction.date.toISOString(),
        payeeId: scheduledTransaction.payeeId,
        categoryId: scheduledTransaction.categoryId,
        flagColor: scheduledTransaction.flagColor,
      })
  );

export const convertPlaidTransactions = async (
  userRef: DocumentReference,
  transactions: PlaidTransaction[]
): Promise<BudgetTransaction[]> =>
  Promise.all(
    transactions.map(async (transaction) => {
      const account = await BudgetAccountController.getAccount(userRef, {
        plaidAccountId: transaction.account_id,
      });

      const existingPayee = await BudgetPayeeController.getPayee(userRef, {
        plaidPayeeId: transaction.name,
      });

      const category = await BudgetCategoryController.getCategory(userRef, {
        categoryId: existingPayee && existingPayee.defaultCategoryId,
        plaidCategoryId: transaction.category_id,
      });

      const payee =
        existingPayee ||
        (await BudgetPayeeController.createAndPostPayee({
          name: transaction.name,
          originalName: transaction.name,
          userId: userRef,
          defaultCategoryId: category.id,
        }));

      return createTransaction({
        explicit: {
          accountId: account.id,
          accountName: account.name,
          amount: transaction.amount,
          cleared: !transaction.pending,
          date: new Date(transaction.date),
          payeeId: payee.id,
          payeeName: payee.name,
          userId: userRef,
          categoryId: category.id,
          categoryName: category.name,
          plaidTransactionId: transaction.transaction_id,
        },
      });
    })
  );

export const importTransactionsFromInstitution = (
  userId: DocumentReference,
  { startDate, endDate }: { startDate?: string; endDate?: string }
): Promise<BudgetTransaction[]> =>
  BudgetInstitutionController.getAllInstitutions(userId)
    .then((institutions) =>
      Promise.all(
        institutions
          .filter((institution) => institution.plaidAccessToken)
          .map((institution) =>
            BudgetInstitutionController.importPlaidTransactionsFromInstitution(
              institution,
              { startDate, endDate }
            )
          )
      )
    )
    .then((transactionList) =>
      convertPlaidTransactions(userId, [].concat(...transactionList))
    );

export const updateTransactionAndLinkedAmounts = async (
  userRef: DocumentReference,
  transactionId: documentReferenceType,
  {
    accountId,
    payeeId,
    categoryId,
    amount,
    date,
    note,
    flagColor,
    cleared,
  }: {
    accountId?: DocumentReference;
    payeeId?: DocumentReference;
    categoryId?: DocumentReference;
    amount?: number;
    date?: Date;
    note?: string;
    flagColor?: string;
    cleared?: boolean;
  }
): Promise<BudgetTransaction> => {
  const transaction = await getTransaction(userRef, transactionId);

  const {
    accountId: oldAccountId,
    categoryId: oldCategoryId,
    amount: oldAmount,
    date: oldDate,
    cleared: oldCleared,
    note: oldNote,
    flagColor: oldFlagColor,
  } = transaction;

  transaction.date = date || oldDate;
  transaction.amount = amount || oldAmount;
  transaction.note = note || oldNote;
  transaction.flagColor = flagColor || oldFlagColor;

  if (typeof cleared === "boolean") transaction.cleared = cleared;

  await updateTransaction(transaction);

  if (accountId || amount || date || cleared) {
    await updateAccountFromTransaction(
      userRef,
      {
        accountId,
        amount,
        cleared,
      },
      {
        oldAccountId,
        oldAmount,
        oldCleared,
      }
    ).then(async (accounts) => {
      transaction.accountId = accounts[accounts.length - 1].id;
      transaction.accountName = accounts[accounts.length - 1].name;

      await BudgetAccountController.updateAccountMonthBalance(
        userRef,
        accounts[accounts.length - 1],
        {
          date: (date || oldDate).toISOString().slice(0, 10),
        }
      );

      if (date) {
        await BudgetAccountController.updateAccountMonthBalance(
          userRef,
          accounts[0],
          {
            date: oldDate.toISOString().slice(0, 10),
          }
        );
      }
    });
  }

  if (categoryId || amount || date) {
    await getCategory(userRef, {
      categoryId: categoryId || oldCategoryId,
    }).then((category) => {
      transaction.categoryId = category.id;
      transaction.categoryName = category.name;
      return BudgetCategoryController.updateCategoryMonthBalance(
        userRef,
        category,
        {
          date: (date || oldDate).toISOString().slice(0, 10),
        }
      );
    });

    if (date || categoryId) {
      await getCategory(userRef, { categoryId: oldCategoryId }).then(
        (category) =>
          BudgetCategoryController.updateCategoryMonthBalance(
            userRef,
            category,
            {
              date: oldDate.toISOString().slice(0, 10),
            }
          )
      );
    }
  }

  if (payeeId) {
    await BudgetPayeeController.getPayee(this.userId, {
      payeeId: payeeId,
    }).then((payee) => {
      transaction.payeeId = payee.id;
      transaction.payeeName = payee.name;
    });
  }

  return updateTransaction(transaction);
};
