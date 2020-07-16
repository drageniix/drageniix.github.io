import { Transaction } from "plaid";
import { BudgetTransaction, createTransaction } from ".";
import {
  DocumentReference,
  documentReferenceType,
} from "../../gateway/persistence";
import * as BudgetAccountController from "../account";
import * as BudgetCategoryController from "../categories";
import * as BudgetInstitutionController from "../institution";
import * as BudgetMonthController from "../months";
import * as BudgetPayeeController from "../payees";

export const addManualTransaction = async (
  userRef: DocumentReference,
  {
    accountId,
    payeeId,
    categoryId,
    amount,
    date,
    pending,
  }: {
    accountId: documentReferenceType;
    payeeId: documentReferenceType;
    categoryId: documentReferenceType;
    amount: number;
    date: string;
    pending?: boolean;
  }
): Promise<BudgetTransaction> => {
  const account = await BudgetAccountController.getAccount(userRef, {
    accountId: accountId,
  }).then((account) =>
    BudgetAccountController.updateAccount(account, {
      availableBalance: account.availableBalance + amount,
      currentBalance: account.currentBalance + (pending ? amount : 0),
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
    date: new Date(date),
  }).then((month) => BudgetMonthController.updateMonth(month, { amount }));

  return createTransaction({
    explicit: {
      accountId: account.id,
      accountName: account.name,
      amount: amount,
      cleared: !pending,
      date: new Date(date),
      payeeId: payee.id,
      payeeName: payee.name,
      userId: userRef,
      categoryId: category.id,
      categoryName: category.name,
    },
  });
};

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

// async updateAccountAmount(amount: number): Promise<BudgetTransaction> {
//   const account = await BudgetAccount.getAccount(this.userId, {
//     accountRef: this.accountId,
//   });
//   account.currentBalance += amount;
//   account.availableBalance += amount;
//   await account.update();
//   this.accountId = account.id;
//   this.accountName = account.name;
//   return this.update();
// }

// async updateDate(newDate: Date): Promise<BudgetTransaction> {
//   await this.updateCategoryAmount(-this.amount);
//   this.date = newDate;
//   await this.updateCategoryAmount(this.amount);
//   return this.update();
// }

// async updatePayee(
//   payeeId: documentReferenceType
// ): Promise<BudgetTransaction> {
//   const payee = await BudgetTransactionPayee.getPayee(this.userId, {
//     payeeRef: payeeId,
//   });
//   this.payeeId = payee.id;
//   this.payeeName = payee.name;
//   return this.update();
// }
