import { firestore } from "firebase-admin";
import { Account, Transaction } from "plaid";
import {
  CollectionTypes,
  filterUndefinedProperties,
  FireBaseModel,
} from "../middleware/firebase";
import BudgetAccount from "./Account";
import BudgetCategory from "./Category";
import BudgetTransactionPayee from "./Payee";
import BudgetTransaction from "./Transaction";

export default class BudgetInstitution extends FireBaseModel {
  id?: firestore.DocumentReference;
  name: string;
  note?: string;
  active: boolean;
  plaidItemId: string;
  plaidAccessToken: string;
  userId?: firestore.DocumentReference;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetInstitutionInternalProperties;
    snapshot?: firestore.DocumentSnapshot;
  }) {
    super({
      explicit,
      snapshot,
    });

    const { name, note, active, plaidItemId, plaidAccessToken, userId } =
      explicit || snapshot.data();

    this.name = name;
    this.note = note;
    this.active = active || true;
    this.plaidItemId = plaidItemId;
    this.plaidAccessToken = plaidAccessToken;
    this.userId = userId;
  }

  toFireStore(): BudgetInstitutionInternalProperties {
    return filterUndefinedProperties({
      name: this.name,
      note: this.note,
      active: this.active,
      plaidItemId: this.plaidItemId,
      plaidAccessToken: this.plaidAccessToken,
      userId: this.userId,
    });
  }

  getFormattedResponse(): BudgetInstitutionDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      name: this.name,
      note: this.note,
      userId: this.userId && this.userId.id,
    });
  }

  setLinkedValues(): void {
    return;
  }

  async post({
    accounts,
    transactions,
  }: {
    accounts: Account[];
    transactions: Transaction[];
  }): Promise<BudgetInstitution> {
    await super.postInternal(
      this.userId.collection(CollectionTypes.INSTITUTION)
    );

    await Promise.all(
      accounts.map((account) =>
        new BudgetAccount({
          explicit: {
            userId: this.userId,
            institutionId: this.id,
            name: account.name,
            originalName: account.official_name,
            availableBalance: account.balances.available,
            currentBalance: account.balances.current,
            startingBalance: account.balances.current,
            type: account.type,
            subtype: account.subtype,
            plaidAccountId: account.account_id,
          },
        }).post()
      )
    );

    await Promise.all(
      transactions.map(async (transaction) => {
        const account = await BudgetAccount.getAccount(this.userId, {
          plaidAccountId: transaction.account_id,
        });

        const category =
          (await BudgetCategory.getCategory(this.userId, {
            description: transaction.category,
          })) ||
          (await new BudgetCategory({
            explicit: {
              name: transaction.category[0],
              originalName: transaction.category[0],
              userId: this.userId,
            },
          }).post());

        const payee =
          (await BudgetTransactionPayee.getPayee(this.userId, {
            plaidPayeeName: transaction.name,
          })) ||
          (await new BudgetTransactionPayee({
            explicit: {
              name: transaction.name,
              originalName: transaction.name,
              userId: this.userId,
              defaultCategoryId: category.id,
            },
          }).post());

        return new BudgetTransaction({
          explicit: {
            accountId: account.id,
            accountName: account.name,
            amount: transaction.amount,
            cleared: !transaction.pending,
            date: new Date(transaction.date),
            payeeId: payee.id,
            payeeName: payee.name,
            userId: this.id,
            categoryId: category.id,
            categoryName: category.name,
          },
        }).post();
      })
    );

    return this;
  }
}

type BudgetInstitutionInternalProperties = {
  id?: firestore.DocumentReference;
  name?: string;
  note?: string;
  active?: boolean;
  plaidItemId?: string;
  plaidAccessToken?: string;
  userId?: firestore.DocumentReference;
};

type BudgetInstitutionDisplayProperties = {
  id?: string;
  name?: string;
  note?: string;
  active?: boolean;
  plaidItemId?: string;
  plaidAccessToken?: string;
  userId?: string;
};
