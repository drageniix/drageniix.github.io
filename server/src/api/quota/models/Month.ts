import { firestore } from "firebase-admin";
import {
  DataBaseModel,
  filterUndefinedProperties,
} from "../middleware/persistence";

export default class BudgetMonth extends DataBaseModel {
  id: firestore.DocumentReference;
  activity: number;
  budgeted: number;
  balance: number;
  date: Date;
  available: number; //todo
  overBudget: number; //todo
  userId?: firestore.DocumentReference;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetMonthInternalProperties;
    snapshot?: firestore.DocumentSnapshot;
  }) {
    super({
      explicit,
      snapshot,
    });

    const { activity, available, budgeted, date, balance, overBudget, userId } =
      explicit || snapshot.data();

    this.date =
      (snapshot && date && date.toDate()) ||
      (date && new Date(date)) ||
      new Date();
    this.activity = activity || 0;
    this.available = available || 0;
    this.budgeted = budgeted || 0;
    this.balance = balance || 0;
    this.overBudget = overBudget || 0;
    this.userId = userId;
  }

  getDisplayFormat(): BudgetMonthDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      userId: this.userId && this.userId.id,
      date: this.date.toDateString(),
      activity: this.activity,
      available: this.available,
      budgeted: this.budgeted,
      balance: this.balance,
      overBudget: this.overBudget,
    });
  }

  getStorageFormat(): BudgetMonthInternalProperties {
    return filterUndefinedProperties({
      date: this.date,
      activity: this.activity,
      available: this.available,
      budgeted: this.budgeted,
      balance: this.balance,
      overBudget: this.overBudget,
      userId: this.userId,
    });
  }
}

export type BudgetMonthInternalProperties = {
  id?: firestore.DocumentReference;
  activity?: number;
  available?: number;
  budgeted?: number;
  date?: Date;
  balance?: number;
  overBudget?: number;
  categories?: firestore.CollectionReference;
  userId?: firestore.DocumentReference;
};

type BudgetMonthDisplayProperties = {
  id?: string;
  activity?: number;
  available?: number;
  budgeted?: number;
  date?: Date;
  balance?: number;
  overBudget?: number;
  categories?: string;
  userId?: string;
};
