import { firestore } from "firebase-admin";
import {
  DataBaseModel,
  filterUndefinedProperties,
} from "../middleware/persistence";

export default class BudgetTransactionPayee extends DataBaseModel {
  id: firestore.DocumentReference;
  name: string;
  orginalName: string;
  note?: string;
  originalName: string;
  defaultCategoryId?: firestore.DocumentReference;
  transferAccountId?: firestore.DocumentReference;
  transferAccountName?: string;
  userId?: firestore.DocumentReference;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetPayeeInternalProperties;
    snapshot?: firestore.DocumentSnapshot;
  }) {
    super({
      explicit,
      snapshot,
    });

    const {
      name,
      originalName,
      note,
      transferAccountId,
      transferAccountName,
      defaultCategoryId,
      userId,
    } = explicit || (snapshot && snapshot.data());

    this.name = name;
    this.note = note;
    this.originalName = originalName || name;
    this.transferAccountId = transferAccountId;
    this.transferAccountName = transferAccountName;
    this.defaultCategoryId = defaultCategoryId;
    this.userId = userId;
  }

  getDisplayFormat(): BudgetPayeeDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      name: this.name,
      originalName: this.originalName,
      note: this.note,
      defaultCategoryId: this.defaultCategoryId && this.defaultCategoryId.id,
      transferAccountId: this.transferAccountId && this.transferAccountId.id,
      transferAccountName: this.transferAccountName,
      userId: this.userId && this.userId.id,
    });
  }

  getStorageFormat(): BudgetPayeeInternalProperties {
    return filterUndefinedProperties({
      name: this.name,
      originalName: this.originalName,
      note: this.note,
      defaultCategoryId: this.defaultCategoryId,
      transferAccountId: this.transferAccountId,
      transferAccountName: this.transferAccountName,
      userId: this.userId,
    });
  }
}

export type BudgetPayeeInternalProperties = {
  id?: firestore.DocumentReference;
  name?: string;
  note?: string;
  transferAccountId?: firestore.DocumentReference<firestore.DocumentData>;
  transferAccountName?: string;
  defaultCategoryId?: firestore.DocumentReference;
  userId?: firestore.DocumentReference;
  originalName?: string;
};

type BudgetPayeeDisplayProperties = {
  id?: string;
  name?: string;
  note?: string;
  transferAccountId?: string;
  transferAccountName?: string;
  defaultCategoryId?: string;
  userId?: string;
  originalName?: string;
};
