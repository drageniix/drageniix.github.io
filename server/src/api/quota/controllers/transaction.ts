import { BudgetTransaction } from "../models";
import { BudgetTransactionPersistence } from "../persistence";

const {
  createAndPostTransaction,
  createTransaction,
  getAllTransactions,
  getTransaction,
  postTransaction,
  updateTransaction,
} = BudgetTransactionPersistence;

export {
  BudgetTransaction,
  createAndPostTransaction,
  createTransaction,
  getAllTransactions,
  getTransaction,
  postTransaction,
  updateTransaction,
};

// async updateCategoryAmount(amount: number): Promise<BudgetTransaction> {
//   const month = await BudgetMonth.getMonth(this.userId, { date: this.date });
//   const category = await BudgetCategory.getCategory(this.userId, {
//     categoryRef: this.categoryId,
//   });
//   const monthCategory = await BudgetMonthCategory.getMonthCategory(
//     this.userId,
//     {
//       month,
//       category,
//     }
//   );

//   await monthCategory.updateActivity(this.amount > 0, amount);
//   this.categoryId = monthCategory.categoryId;
//   this.categoryName = monthCategory.categoryName;
//   return this.update();
// }

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

// async updateAmount(amount: number): Promise<BudgetTransaction> {
//   await this.updateAccountAmount(-this.amount + amount);
//   await this.updateCategoryAmount(-this.amount + amount);
//   this.amount = amount;
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

// async post(): Promise<BudgetTransaction> {
//   await super.postInternal(
//     this.userId.collection(CollectionTypes.TRANSACTIONS)
//   );

//   if (this.accountId) {
//     await this.updateAccountAmount(this.amount);
//   }

//   if (this.payeeId) {
//     await this.updatePayee(this.payeeId);
//   }

//   if (this.categoryId) {
//     await this.updateCategoryAmount(this.amount);
//   }

//   return this;
// }

// static async importTransactions(
//   userRef: DocumentReference,
//   transactions: Transaction[]
// ) {
//   return Promise.all(
//     transactions.map(async (transaction) => {
//       const account = await BudgetAccount.getAccount(userRef, {
//         plaidAccountId: transaction.account_id,
//       });

//       console.log(account.name);

//       const category = await BudgetCategory.getCategory(userRef, {
//         plaidCategoryName: transaction.category,
//       });

//       console.log(category.name);

//       const existingPayee = await BudgetTransactionPayee.getPayee(userRef, {
//         plaidPayeeName: transaction.name,
//       });
//       const payee =
//         existingPayee ||
//         (await new BudgetTransactionPayee({
//           explicit: {
//             name: transaction.name,
//             originalName: transaction.name,
//             userId: userRef,
//             defaultCategoryId: category.id,
//           },
//         }).post());

//       console.log(existingPayee === payee, payee.name);

//       return new BudgetTransaction({
//         explicit: {
//           accountId: account.id,
//           accountName: account.name,
//           amount: transaction.amount,
//           cleared: !transaction.pending,
//           date: new Date(transaction.date),
//           payeeId: payee.id,
//           payeeName: payee.name,
//           userId: userRef,
//           categoryId: category.id,
//           categoryName: category.name,
//         },
//       }).post();
//     })
//   );
// }

// export const importTransactions = async (
//   req: CustomRequest,
//   res: express.Response
// ): Promise<express.Response> => {
//   const transactionImportResult = await BudgetInstitutionController.getAllInstitutions(
//     req.userId
//   )
//     .then((institutions) =>
//       Promise.all(
//         institutions.map((institution) =>
//           getPlaidTransactions(
//             institution.plaidAccessToken,
//             institution.updatedAt.toISOString().slice(0, 10)
//           )
//         )
//       )
//     )
//     .then((transactions) =>
//       [].concat(
//         ...transactions.map((transactionList) => transactionList.transactions)
//       )
//     )
//     .then((transactions) =>
//       BudgetTransaction.importTransactions(req.userId, transactions)
//     );

//   return res.status(200).json({ result: transactionImportResult.length });
// };
