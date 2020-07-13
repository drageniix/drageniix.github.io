import { firestore } from "firebase-admin";
import {
  DataBaseModel,
  filterUndefinedProperties,
} from "../middleware/persistence";

export default class BudgetCategory extends DataBaseModel {
  id?: firestore.DocumentReference;
  goalCreationMonth?: Date;
  goalTarget?: number;
  goalTargetMonth?: Date;
  goalPriority?: number;
  goalType?: string;
  active: boolean;
  name: string;
  originalName: string;
  subCategories: string[];
  subSubCategories: string[];
  note?: string;
  userId?: firestore.DocumentReference;

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
      originalName,
      note,
      userId,
      subCategories,
      subSubCategories,
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
    this.originalName = originalName;
    this.note = note;
    this.userId = userId;
    this.subCategories = subCategories;
    this.subSubCategories = subSubCategories;
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
      originalName: this.originalName,
      note: this.note,
      subCategories: this.subCategories,
      subSubCategories: this.subSubCategories,
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
      originalName: this.originalName,
      note: this.note,
      subCategories: this.subCategories,
      subSubCategories: this.subSubCategories,
      userId: this.userId,
    });
  }
}

export type BudgetCategoryInternalProperties = {
  id?: firestore.DocumentReference;
  goalCreationMonth?: Date;
  goalTarget?: number;
  goalTargetMonth?: Date;
  goalType?: string;
  goalPriority?: string;
  active?: boolean;
  name?: string;
  originalName?: string;
  note?: string;
  subCategories?: string[];
  subSubCategories?: string[];
  userId?: firestore.DocumentReference;
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
  originalName?: string;
  note?: string;
  subCategories?: string[];
  subSubCategories?: string[];
  userId?: string;
};
