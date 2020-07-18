import { Transaction } from "plaid";
import {
  BudgetTransaction,
  createTransaction,
  getTransaction,
  updateTransaction,
} from ".";
import * as BudgetAccountController from "../account";
import * as BudgetCategoryController from "../categories";
import {
  DocumentReference,
  documentReferenceType,
} from "../gateway/persistence";
import * as BudgetInstitutionController from "../institution";
import * as BudgetMonthController from "../months";
import * as BudgetPayeeController from "../payees";
import * as BudgetScheduledController from "../scheduled";

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

  await BudgetMonthController.getMonth(userRef, {
    categoryId: category,
    monthId: date,
  }).then((month) =>
    BudgetMonthController.updateMonth(month, { activity: amount })
  );

  return createTransaction({
    explicit: {
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
    },
  });
};

export const convertScheduledTransaction = async (
  userRef: DocumentReference,
  scheduledTransactionId: documentReferenceType
): Promise<BudgetTransaction> =>
  BudgetScheduledController.getScheduled(userRef, scheduledTransactionId).then(
    (scheduledTransaction) =>
      createTransaction({
        explicit: {
          accountId: scheduledTransaction.accountId,
          accountName: scheduledTransaction.accountName,
          amount: scheduledTransaction.amount,
          cleared: true,
          note: scheduledTransaction.note,
          date: scheduledTransaction.date,
          payeeId: scheduledTransaction.payeeId,
          payeeName: scheduledTransaction.payeeName,
          userId: userRef,
          categoryId: scheduledTransaction.categoryId,
          categoryName: scheduledTransaction.categoryName,
          flagColor: scheduledTransaction.flagColor,
        },
      })
  );

export const convertPlaidTransactions = async (
  userRef: DocumentReference,
  transactions: Transaction[]
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

export const updateLinkedAccounAndMonth = async (
  userRef: DocumentReference,
  transactionId: documentReferenceType,
  {
    // accountId,
    payeeId,
    // categoryId,
    amount,
    date,
    note,
    flagColor,
    cleared,
  }: {
    // accountId?: DocumentReference;
    payeeId?: DocumentReference;
    // categoryId?: DocumentReference;
    amount?: number;
    date?: Date;
    note?: string;
    flagColor?: string;
    cleared?: boolean;
  }
): Promise<BudgetTransaction> => {
  const transaction = await getTransaction(userRef, transactionId);

  // TODO: distinguish between transaction clearing, amount update, or accountId update
  // await BudgetAccountController.getAccount(userRef, {
  //   accountId: transaction.accountId,
  // }).then((account) =>
  //   BudgetAccountController.updateAccount(account, {
  //     availableBalance: account.availableBalance - amount,
  //     currentBalance: account.currentBalance + (cleared ? amount : 0),
  //   })
  // );

  // // TODO: distinguish between date update or categoryId update
  // await BudgetCategoryController.getCategory(userRef, {
  //   categoryId: transaction.categoryId,
  // }).then((category) =>
  //   BudgetMonthController.getMonth(userRef, {
  //     categoryId: category,
  //     monthId: transaction.date.toISOString().slice(0, 10),
  //   }).then((month) =>
  //     BudgetMonthController.updateMonth(month, { activity: amount })
  //   )
  // );

  if (payeeId) {
    const payee = await BudgetPayeeController.getPayee(this.userId, {
      payeeId: payeeId,
    });
    transaction.payeeId = payee.id;
    transaction.payeeName = payee.name;
  }

  return updateTransaction(transaction, {
    amount,
    date,
    note,
    cleared,
    flagColor,
  });
};
