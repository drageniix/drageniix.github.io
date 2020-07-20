import { BudgetAccount, createAccount, getAccount, updateAccount } from ".";
import { DocumentReference } from "../gateway/persistence";
import { PlaidAccount } from "../gateway/plaid";
import * as BudgetInstitutionController from "../institution";
import * as BudgetPayeeController from "../payees";
import * as BudgetScheduledController from "../scheduled";
import * as BudgetTransactionController from "../transactions";
import * as BudgetMonthController from "./months";

export const addManualAccount = async (
  userRef: DocumentReference,
  {
    name,
    type,
    subtype,
    institutionId,
    note,
    onBudget,
  }: {
    name: string;
    type: string;
    subtype: string;
    institutionId: string;
    note: string;
    onBudget: boolean;
  }
): Promise<BudgetAccount> => {
  const institution = BudgetInstitutionController.getInstitutionReferenceById(
    userRef,
    institutionId
  );

  return createAccount({
    explicit: {
      userId: userRef,
      institutionId: institution,
      name,
      type,
      subtype,
      note,
      onBudget,
    },
  });
};

export const updateLinkedAccountName = async (
  account: BudgetAccount
): Promise<BudgetAccount> => {
  //Update transactions connected to the account
  await BudgetTransactionController.getAllTransactions(account.userId, {
    accountId: account.id,
  }).then((transactions) =>
    Promise.all(
      transactions.map((transaction) =>
        BudgetTransactionController.updateTransaction(transaction, {
          accountName: account.name,
        })
      )
    )
  );

  //Update scheduled transactions connected to the account
  await BudgetScheduledController.getAllScheduleds(account.userId, {
    accountId: account.id,
  }).then((scheduleds) =>
    Promise.all(
      scheduleds.map((scheduled) =>
        BudgetScheduledController.updateScheduled(scheduled, {
          accountName: account.name,
        })
      )
    )
  );

  // Update payee connected to the account, and all transactions with that payee
  await BudgetPayeeController.getPayee(account.userId, {
    payeeId: account.transferPayeeId,
  })
    .then((payee) => {
      payee.name = `TRANSFER: ${account.name}`;
      return BudgetPayeeController.updatePayee(payee, {
        transferAccountName: account.name,
      });
    })
    .then((payee) =>
      BudgetTransactionController.getAllTransactions(account.userId, {
        payeeId: payee.id,
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

export const createAndPostMatchingPayee = async (
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
  accounts: PlaidAccount[]
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
          openingBalance: account.balances.current,
          type: account.type,
          subtype: account.subtype,
          plaidAccountId: account.account_id,
        },
      })
    )
  );

export const updateAccountMonthBalance = async (
  userRef: DocumentReference,
  account: BudgetAccount,
  { date }: { date: string }
): Promise<BudgetAccount> =>
  BudgetMonthController.getAccountMonth(userRef, {
    accountId: account,
    monthId: date,
  })
    .then(async (month) => {
      const startDate = new Date(month.date);
      const endDate = new Date(month.date);
      endDate.setMonth(endDate.getMonth() + 1);

      const transactions = await BudgetTransactionController.getAllTransactions(
        userRef,
        {
          startDate: `${
            startDate.getFullYear
          }-${startDate.getMonth()}-${startDate.getDate()}`,
          endDate: `${
            endDate.getFullYear
          }-${endDate.getMonth()}-${endDate.getDate()}`,
          accountId: account,
          cleared: true,
        }
      );

      await BudgetMonthController.updateMonth(month, {
        balance: transactions.reduce((prev, curr) => prev + curr.amount, 0),
      });
    })
    .then(() => account);

// TODO: distinguish between transaction clearing, amount update, or accountId update
export const updateAccountFromTransaction = async (
  userRef: DocumentReference,
  {
    accountId,
    amount,
    cleared,
  }: {
    accountId?: DocumentReference;
    amount?: number;
    cleared?: boolean;
  },
  {
    oldAccountId,
    oldAmount,
    oldCleared,
  }: {
    oldAccountId?: DocumentReference;
    oldAmount?: number;
    oldCleared?: boolean;
  }
): Promise<BudgetAccount[]> => {
  const existingAccount = await getAccount(userRef, {
    accountId: oldAccountId,
  });

  const affectedAccounts: BudgetAccount[] = [existingAccount];

  if (!accountId) {
    if (!amount) {
      if (!cleared && typeof cleared === "boolean") {
        existingAccount.currentBalance -= oldAmount;
      } else if (cleared) {
        existingAccount.currentBalance += oldAmount;
      }
    } else if (amount) {
      existingAccount.availableBalance +=
        existingAccount.availableBalance - oldAmount + amount;
      existingAccount.currentBalance +=
        existingAccount.currentBalance +
        (oldCleared && !cleared
          ? -oldAmount + amount
          : !oldCleared && cleared
          ? amount || oldAmount
          : 0);
    }

    await updateAccount(existingAccount);
  } else if (accountId) {
    // TODO: New Account Id for transaction
    const newAccount = await getAccount(userRef, {
      accountId,
    });

    newAccount.availableBalance += amount || oldAmount;
    newAccount.currentBalance +=
      oldCleared || cleared ? amount || oldAmount : 0;

    await updateAccount(newAccount);
    affectedAccounts.push(newAccount);
  }
  return affectedAccounts;
};
