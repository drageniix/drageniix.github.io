import { BudgetPayee } from ".";
import * as BudgetAccountController from "../account";
import * as BudgetTransactionController from "../transactions";

export const updateLinkedPayeeName = async (
  payee: BudgetPayee
): Promise<BudgetPayee> => {
  if (payee.transferAccountId) {
    await BudgetAccountController.getAccount(payee.userId, {
      accountId: payee.transferAccountId,
    }).then((account) =>
      BudgetAccountController.updateAccount(account, {
        transferPayeeName: payee.name,
      })
    );
  }

  await BudgetTransactionController.getAllTransactions(payee.userId, {
    payeeId: payee.id,
  }).then((transactions) =>
    Promise.all(
      transactions.map((transaction) =>
        BudgetTransactionController.updateTransaction(transaction, {
          payeeName: payee.name,
        })
      )
    )
  );

  return payee;
};
