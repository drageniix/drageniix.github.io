import { Account } from "plaid";
import { BudgetAccount, BudgetInstitution, BudgetPayee } from "../models";
import {
  BudgetAccountPersistence,
  BudgetPayeePersistence,
  BudgetTransactionPersistence,
} from "../persistence";

const {
  createAccount,
  createAndPostAccount,
  getAccount,
  getAccountReferenceById,
  getAllAccounts,
  postAccount,
  postAccounts,
  updateAccount,
} = BudgetAccountPersistence;

export const updateLinkedAccountName = async (
  account: BudgetAccount
): Promise<BudgetAccount> => {
  //Update transactions connected to the account
  await BudgetTransactionPersistence.getAllTransactions(account.userId, {
    accountRef: account.id,
  }).then((transactions) =>
    Promise.all(
      transactions.map((transaction) =>
        BudgetTransactionPersistence.updateTransaction(transaction, {
          accountName: account.name,
        })
      )
    )
  );

  // Update payee connected to the account, and all transactions with that payee
  await BudgetPayeePersistence.getPayee(account.userId, {
    payeeRef: account.transferPayeeId,
  })
    .then((payee) => {
      payee.name = `TRANSFER: ${account.name}`;
      return BudgetPayeePersistence.updatePayee(payee, {
        transferAccountName: account.name,
      });
    })
    .then((payee) =>
      BudgetTransactionPersistence.getAllTransactions(account.userId, {
        payeeRef: payee.id,
      }).then((transactions) =>
        Promise.all(
          transactions.map((transaction) =>
            BudgetTransactionPersistence.updateTransaction(transaction, {
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
): Promise<{ payee: BudgetPayee; account: BudgetAccount }> => {
  const payee = await BudgetPayeePersistence.createAndPostPayee({
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
  institution: BudgetInstitution,
  accounts: Account[]
): Promise<BudgetAccount[]> => {
  return Promise.all(
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
};

export {
  BudgetAccount,
  createAccount,
  createAndPostAccount,
  getAccount,
  getAccountReferenceById,
  getAllAccounts,
  postAccount,
  postAccounts,
  updateAccount,
};
