import {
  DataBaseModel,
  DocumentReference,
  DocumentSnapshot,
  filterUndefinedProperties,
} from "../../gateway/persistence";

export class BudgetMonth extends DataBaseModel {
  date: Date;
  balance: number;

  accountId?: DocumentReference;
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

    const { accountId, date, balance, userId } = explicit || snapshot.data();

    this.date =
      (snapshot && date && date.toDate()) ||
      (date && new Date(date)) ||
      new Date();
    this.balance = balance || 0;
    this.userId = userId;
    this.accountId = accountId;
  }

  getDisplayFormat(): BudgetMonthDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      date: this.date.toDateString(),
      balance: this.balance,
      accountId: this.accountId && this.accountId.id,
    });
  }

  getStorageFormat(): BudgetMonthInternalProperties {
    return {
      date: this.date,
      balance: this.balance,
      userId: this.userId,
      accountId: this.accountId,
    };
  }
}

export type BudgetMonthInternalProperties = {
  id?: DocumentReference;
  date?: Date;
  balance?: number;
  userId?: DocumentReference;
  accountId?: DocumentReference;
};

type BudgetMonthDisplayProperties = {
  id?: string;
  date?: Date;
  balance?: number;
  accountId?: string;
};
