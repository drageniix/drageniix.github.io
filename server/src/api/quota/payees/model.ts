import { firestore } from "firebase-admin";
import {
  DataBaseModel,
  DocumentReference,
  filterUndefinedProperties,
} from "../../gateway/persistence";

export default class BudgetTransactionPayee extends DataBaseModel {
  id: DocumentReference;
  name: string;
  orginalName: string;
  note?: string;
  originalName: string;
  defaultCategoryId?: DocumentReference;
  transferAccountId?: DocumentReference;
  transferAccountName?: string;
  userId?: DocumentReference;

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
  id?: DocumentReference;
  name?: string;
  note?: string;
  transferAccountId?: DocumentReference;
  transferAccountName?: string;
  defaultCategoryId?: DocumentReference;
  userId?: DocumentReference;
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