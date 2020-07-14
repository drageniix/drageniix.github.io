import { firestore } from "firebase-admin";
import {
  DataBaseModel,
  DocumentReference,
  filterUndefinedProperties,
} from "../gateway/persistence";

export default class BudgetCategory extends DataBaseModel {
  id?: DocumentReference;
  goalCreationMonth?: Date;
  goalTarget?: number;
  goalTargetMonth?: Date;
  goalPriority?: number;
  goalType?: string;
  active: boolean;
  name: string;
  plaidCategoryIds: string[];
  note?: string;
  userId?: DocumentReference;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetCategoryInternalProperties;
    snapshot?: firestore.DocumentSnapshot;
  }) {
    super({
      explicit,
      snapshot,
    });

    const {
      goalCreationMonth,
      goalTarget,
      goalTargetMonth,
      goalType,
      goalPriority,
      active,
      name,
      note,
      userId,

      plaidCategoryIds,
    } = explicit || snapshot.data();

    this.goalCreationMonth =
      (snapshot && goalTargetMonth && goalCreationMonth.toDate()) ||
      (goalCreationMonth && new Date(goalTargetMonth));
    this.goalTarget = goalTarget || 0;
    this.goalTargetMonth =
      (snapshot && goalTargetMonth && goalTargetMonth.toDate()) ||
      (goalTargetMonth && new Date(goalTargetMonth));
    this.goalType = goalType;
    this.goalPriority = goalPriority;
    this.active = active || true;
    this.name = name;
    this.note = note;
    this.userId = userId;
    this.plaidCategoryIds = plaidCategoryIds;
  }

  getDisplayFormat(): BudgetCategoryDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      goalCreationMonth: this.goalCreationMonth,
      goalTarget: this.goalTarget,
      goalTargetMonth: this.goalTargetMonth,
      goalType: this.goalType,
      goalPriority: this.goalPriority,
      active: this.active,
      name: this.name,
      note: this.note,
      plaidCategoryIds: this.plaidCategoryIds,
      userId: this.userId && this.userId.id,
    });
  }

  getStorageFormat(): BudgetCategoryInternalProperties {
    return filterUndefinedProperties({
      goalCreationMonth: this.goalCreationMonth,
      goalTarget: this.goalTarget,
      goalTargetMonth: this.goalTargetMonth,
      goalType: this.goalType,
      goalPriority: this.goalPriority,
      active: this.active,
      name: this.name,
      note: this.note,
      plaidCategoryIds: this.plaidCategoryIds,
      userId: this.userId,
    });
  }
}

export type BudgetCategoryInternalProperties = {
  id?: DocumentReference;
  goalCreationMonth?: Date;
  goalTarget?: number;
  goalTargetMonth?: Date;
  goalType?: string;
  goalPriority?: string;
  active?: boolean;
  name?: string;
  note?: string;
  plaidCategoryIds?: string[];
  userId?: DocumentReference;
};

type BudgetCategoryDisplayProperties = {
  id?: string;
  goalCreationMonth?: Date;
  goalTarget?: number;
  goalTargetMonth?: Date;
  goalType?: string;
  goalPriority?: string;
  active?: boolean;
  name?: string;
  note?: string;
  plaidCategoryIds?: string[];
  userId?: string;
};
