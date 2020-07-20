import {
  DataBaseModel,
  DocumentReference,
  DocumentSnapshot,
  filterUndefinedProperties,
} from "../../gateway/persistence";

export class BudgetMonth extends DataBaseModel {
  date: Date;
  balance: number;
  carryOverBalance: number;
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

    const {
      categoryId,
      activity,
      budgeted,
      date,
      balance,
      carryOverBalance,
      userId,
    } = explicit || snapshot.data();

    this.date =
      (snapshot && date && date.toDate()) ||
      (date && new Date(date)) ||
      new Date();
    this.activity = activity || 0;
    this.budgeted = budgeted || 0;
    this.balance = balance || 0;
    this.carryOverBalance = carryOverBalance || 0;
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
      carryOverBalance: this.carryOverBalance,
      categoryId: this.categoryId && this.categoryId.id,
    });
  }

  getStorageFormat(): BudgetMonthInternalProperties {
    return {
      date: this.date,
      activity: this.activity,
      budgeted: this.budgeted,
      balance: this.balance,
      carryOverBalance: this.carryOverBalance,
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
  carryOverBalance?: number;
  userId?: DocumentReference;
  categoryId?: DocumentReference;
};

type BudgetMonthDisplayProperties = {
  id?: string;
  date?: Date;
  activity?: number;
  budgeted?: number;
  balance?: number;
  carryOverBalance?: number;
  categoryId?: string;
};
