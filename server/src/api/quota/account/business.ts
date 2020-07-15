import { Account } from "plaid";
import { BudgetAccount, createAccount, updateAccount } from ".";
import * as BudgetInstitutionController from "../institution";
import * as BudgetPayeeController from "../payees";
import * as BudgetTransactionController from "../transactions";

export const updateLinkedAccountName = async (
  account: BudgetAccount
): Promise<BudgetAccount> => {
  //Update transactions connected to the account
  await BudgetTransactionController.getAllTransactions(account.userId, {
    accountRef: account.id,
  }).then((transactions) =>
    Promise.all(
      transactions.map((transaction) =>
        BudgetTransactionController.updateTransaction(transaction, {
          accountName: account.name,
        })
      )
    )
  );

  // Update payee connected to the account, and all transactions with that payee
  await BudgetPayeeController.getPayee(account.userId, {
    payeeRef: account.transferPayeeId,
  })
    .then((payee) => {
      payee.name = `TRANSFER: ${account.name}`;
      return BudgetPayeeController.updatePayee(payee, {
        transferAccountName: account.name,
      });
    })
    .then((payee) =>
      BudgetTransactionController.getAllTransactions(account.userId, {
        payeeRef: payee.id,
      }).then((transactions) =>
        Promise.all(
          transactions.map((transaction) =>
            BudgetTransactionController.updateTransaction(transaction, {
              payeeName: payee.name,
            })
          )
        )
      )
    );

  return account;
};

export const createMatchingPayee = async (
  account: BudgetAccount
): Promise<{
  payee: BudgetPayeeController.BudgetPayee;
  account: BudgetAccount;
}> => {
  const payee = await BudgetPayeeController.createAndPostPayee({
    userId: account.userId,
    name: `TRANSFER: ${account.name}`,
    transferAccountId: account.id,
    transferAccountName: account.name,
  });

  await updateAccount(account, {
    transferPayeeId: payee.id,
    transferPayeeName: payee.name,
  });

  return { account: account, payee };
};

export const createAccountsFromInstitution = async (
  institution: BudgetInstitutionController.BudgetInstitution,
  accounts: Account[]
): Promise<BudgetAccount[]> =>
  Promise.all(
    accounts.map((account) =>
      createAccount({
        explicit: {
          userId: institution.userId,
          institutionId: institution.id,
          name: account.name,
          originalName: account.official_name,
          availableBalance: account.balances.available,
          currentBalance: account.balances.current,
          startingBalance: account.balances.current,
          type: account.type,
          subtype: account.subtype,
          plaidAccountId: account.account_id,
        },
      })
    )
  );