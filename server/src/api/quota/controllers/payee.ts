import { BudgetPayee } from "../models";
import {
  BudgetAccountPersistence,
  BudgetPayeePersistence,
  BudgetTransactionPersistence,
} from "../persistence";

const {
  createPayee,
  createAndPostPayee,
  getAllPayees,
  postPayee,
  getPayee,
  updatePayee,
  getPayeeReferenceById,
} = BudgetPayeePersistence;

export const updateLinkedPayeeName = async (
  payee: BudgetPayee
): Promise<BudgetPayee> => {
  if (payee.transferAccountId) {
    await BudgetAccountPersistence.getAccount(payee.userId, {
      accountRef: payee.transferAccountId,
    }).then((account) =>
      BudgetAccountPersistence.updateAccount(account, {
        transferPayeeName: payee.name,
      })
    );
  }

  await BudgetTransactionPersistence.getAllTransactions(payee.userId, {
    payeeRef: payee.id,
  }).then((transactions) =>
    Promise.all(
      transactions.map((transaction) =>
        BudgetTransactionPersistence.updateTransaction(transaction, {
          payeeName: payee.name,
        })
      )
    )
  );

  return payee;
};

export {
  BudgetPayee,
  createPayee,
  createAndPostPayee,
  getAllPayees,
  getPayee,
  updatePayee,
  postPayee,
  getPayeeReferenceById,
};
