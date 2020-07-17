import { firestore } from "firebase-admin";
import {
  CollectionReference,
  DataBaseModel,
  DocumentReference,
  filterUndefinedProperties,
} from "../../gateway/persistence";

export default class BudgetCategory extends DataBaseModel {
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
  months?: CollectionReference;

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
      months,
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
    this.months = months;
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
    });
  }

  getStorageFormat(): BudgetCategoryInternalProperties {
    return {
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
      months: this.months,
    };
  }
}

export type BudgetCategoryInternalProperties = {
  id?: DocumentReference;
  goalCreationMonth?: Date;
  goalTarget?: number;
  goalTargetMonth?: Date;
  goalType?: string;
  goalPriority?: number;
  active?: boolean;
  name?: string;
  note?: string;
  plaidCategoryIds?: string[];
  userId?: DocumentReference;
  months?: CollectionReference;
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
};
