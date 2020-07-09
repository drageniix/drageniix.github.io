import { firestore } from "firebase-admin";
import { Account } from "plaid";
import {
  CollectionTypes,
  filterUndefinedProperties,
  FireBaseModel,
} from "../middleware/firebase";
import BudgetAccount from "./Account";

export default class BudgetInstitution extends FireBaseModel {
  id?: firestore.DocumentReference;
  name: string;
  note?: string;
  active: boolean;
  plaidItemId: string;
  plaidAccessToken: string;
  userId?: firestore.DocumentReference;
  updatedAt?: Date;

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

    const {
      name,
      note,
      active,
      plaidItemId,
      plaidAccessToken,
      userId,
      updatedAt,
    } = explicit || snapshot.data();

    this.name = name;
    this.note = note;
    this.active = active || true;
    this.plaidItemId = plaidItemId;
    this.plaidAccessToken = plaidAccessToken;
    this.userId = userId;
    this.updatedAt =
      (snapshot && updatedAt && updatedAt.toDate()) ||
      (updatedAt && new Date(updatedAt)) ||
      new Date();
  }

  toFireStore(): BudgetInstitutionInternalProperties {
    return filterUndefinedProperties({
      name: this.name,
      note: this.note,
      active: this.active,
      plaidItemId: this.plaidItemId,
      plaidAccessToken: this.plaidAccessToken,
      userId: this.userId,
      updatedAt: this.updatedAt,
    });
  }

  getFormattedResponse(): BudgetInstitutionDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      name: this.name,
      note: this.note,
      userId: this.userId && this.userId.id,
      updatedAt: this.updatedAt,
    });
  }

  setLinkedValues(): void {
    return;
  }

  async post({
    accounts,
  }: {
    accounts: Account[];
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
    return this;
  }

  static async getAllInstitutions(
    userRef: firestore.DocumentReference
  ): Promise<BudgetInstitution[]> {
    let query = userRef
      .collection(CollectionTypes.INSTITUTION)
      .where("active", "==", true);

    return query
      .get()
      .then((institutions) =>
        institutions.docs.map((snapshot) => new BudgetInstitution({ snapshot }))
      );
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
  updatedAt?: Date;
};

type BudgetInstitutionDisplayProperties = {
  id?: string;
  name?: string;
  note?: string;
  active?: boolean;
  plaidItemId?: string;
  plaidAccessToken?: string;
  updatedAt?: Date;
};
