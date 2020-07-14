import { firestore } from "firebase-admin";
import {
  DataBaseModel,
  DocumentReference,
  filterUndefinedProperties,
} from "../gateway/persistence";

export default class BudgetInstitution extends DataBaseModel {
  id?: DocumentReference;
  name: string;
  note?: string;
  active: boolean;
  plaidItemId: string;
  plaidAccessToken: string;
  userId?: DocumentReference;
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

  getStorageFormat(): BudgetInstitutionInternalProperties {
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

  getDisplayFormat(): BudgetInstitutionDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      name: this.name,
      note: this.note,
      userId: this.userId && this.userId.id,
      updatedAt: this.updatedAt,
    });
  }
}

export type BudgetInstitutionInternalProperties = {
  id?: DocumentReference;
  name?: string;
  note?: string;
  active?: boolean;
  plaidItemId?: string;
  plaidAccessToken?: string;
  userId?: DocumentReference;
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
