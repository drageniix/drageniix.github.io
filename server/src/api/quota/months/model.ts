import {
  DataBaseModel,
  DocumentReference,
  DocumentSnapshot,
  filterUndefinedProperties,
} from "../gateway/persistence";

export default class BudgetMonth extends DataBaseModel {
  date: Date;
  balance: number;
  budgeted: number;
  activity: number;
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

    const { categoryId, activity, budgeted, date, balance, userId } =
      explicit || snapshot.data();

    this.date =
      (snapshot && date && date.toDate()) ||
      (date && new Date(date)) ||
      new Date();
    this.activity = activity || 0;
    this.budgeted = budgeted || 0;
    this.balance = balance || 0;
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
      categoryId: this.categoryId && this.categoryId.id,
    });
  }

  getStorageFormat(): BudgetMonthInternalProperties {
    return {
      date: this.date,
      activity: this.activity,
      budgeted: this.budgeted,
      balance: this.balance,
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
  userId?: DocumentReference;
  categoryId?: DocumentReference;
};

type BudgetMonthDisplayProperties = {
  id?: string;
  date?: Date;
  activity?: number;
  budgeted?: number;
  balance?: number;
  categoryId?: string;
};
