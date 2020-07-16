import {
  CollectionReference,
  DataBaseModel,
  DocumentReference,
  DocumentSnapshot,
  filterUndefinedProperties,
} from "../../gateway/persistence";

export default class BudgetMonth extends DataBaseModel {
  date: Date;
  balance: number;
  budgeted: number;
  activity: number;
  scheduled: number;
  categoryId?: DocumentReference;
  userId?: DocumentReference;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetMonthInternalProperties;
    snapshot?: DocumentSnapshot;
  }) {
    super({
      explicit,
      snapshot,
    });

    const { categoryId, activity, budgeted, date, balance, scheduled, userId } =
      explicit || snapshot.data();

    this.date =
      (snapshot && date && date.toDate()) ||
      (date && new Date(date)) ||
      new Date();
    this.activity = activity || 0;
    this.budgeted = budgeted || 0;
    this.balance = balance || 0;
    this.scheduled = scheduled || 0;
    this.userId = userId;
    this.categoryId = categoryId;
  }

  getDisplayFormat(): BudgetMonthDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      date: this.date.toDateString(),
      activity: this.activity,
      budgeted: this.budgeted,
      balance: this.balance,
      scheduled: this.scheduled,
    });
  }

  getStorageFormat(): BudgetMonthInternalProperties {
    return {
      date: this.date,
      activity: this.activity,
      budgeted: this.budgeted,
      balance: this.balance,
      scheduled: this.scheduled,
      userId: this.userId,
      categoryId: this.categoryId,
    };
  }
}

export type BudgetMonthInternalProperties = {
  id?: DocumentReference;
  activity?: number;
  budgeted?: number;
  date?: Date;
  balance?: number;
  scheduled?: number;
  categories?: CollectionReference;
  userId?: DocumentReference;
  categoryId?: DocumentReference;
};

type BudgetMonthDisplayProperties = {
  id?: string;
  activity?: number;
  budgeted?: number;
  date?: Date;
  balance?: number;
  scheduled?: number;
  categories?: string;
  userId?: string;
};
