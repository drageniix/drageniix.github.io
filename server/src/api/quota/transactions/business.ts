import { Transaction } from "plaid";
import { BudgetTransaction, createTransaction } from ".";
import { DocumentReference } from "../../gateway/persistence";
import * as BudgetAccountController from "../account";
import * as BudgetCategoryController from "../categories";
import * as BudgetPayeeController from "../payees";

export const importTransactions = async (
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
        categoryRef: existingPayee && existingPayee.defaultCategoryId,
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
