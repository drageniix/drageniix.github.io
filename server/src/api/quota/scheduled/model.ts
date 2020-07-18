import {
  DataBaseModel,
  DocumentReference,
  DocumentSnapshot,
  filterUndefinedProperties,
} from "../gateway/persistence";

export class BudgetScheduled extends DataBaseModel {
  date: Date;
  amount: number;
  note?: string;
  flagColor?: string;
  accountId: DocumentReference;
  accountName?: string;
  payeeId: DocumentReference;
  payeeName?: string;
  categoryId?: DocumentReference;
  categoryName?: string;
  userId?: DocumentReference;
  frequency?: string;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetScheduledInternalProperties;
    snapshot?: DocumentSnapshot;
  }) {
    super({
      explicit,
      snapshot,
    });

    const {
      date,
      amount,
      note,
      flagColor,
      accountId,
      accountName,
      payeeId,
      payeeName,
      categoryId,
      categoryName,
      userId,
      frequency,
    } = explicit || snapshot.data();

    this.date =
      (snapshot && date && date.toDate()) ||
      (date && new Date(date)) ||
      new Date();
    this.amount = amount || 0;
    this.note = note;
    this.flagColor = flagColor;
    this.accountId = accountId;
    this.accountName = accountName;
    this.payeeId = payeeId;
    this.payeeName = payeeName;
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.userId = userId;
    this.frequency = frequency;
  }

  getDisplayFormat(): BudgetScheduledDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      date: this.date.toDateString(),
      amount: this.amount,
      note: this.note,
      flagColor: this.flagColor,
      accountId:
        (typeof this.accountId === "object" && this.accountId.id) ||
        this.accountId,
      accountName: this.accountName,
      payeeId:
        (typeof this.payeeId === "object" && this.payeeId.id) || this.payeeId,
      payeeName: this.payeeName,
      categoryId:
        (typeof this.categoryId === "object" && this.categoryId.id) ||
        this.categoryId,
      categoryName: this.categoryName,
      frequency: this.frequency,
    });
  }

  getStorageFormat(): BudgetScheduledInternalProperties {
    return {
      date: this.date,
      amount: this.amount,
      note: this.note,
      flagColor: this.flagColor,
      accountId: this.accountId,
      accountName: this.accountName,
      payeeId: this.payeeId,
      payeeName: this.payeeName,
      categoryId: this.categoryId,
      categoryName: this.categoryName,
      userId: this.userId,
      frequency: this.frequency,
    };
  }
}

export type BudgetScheduledInternalProperties = {
  id?: DocumentReference;
  date?: Date;
  amount?: number;
  note?: string;
  flagColor?: string;
  accountId?: DocumentReference;
  accountName?: string;
  payeeId?: DocumentReference;
  payeeName?: string;
  categoryId?: DocumentReference;
  categoryName?: string;
  userId?: DocumentReference;
  institutionId?: DocumentReference;
  frequency?: string;
};

type BudgetScheduledDisplayProperties = {
  id?: string;
  date?: Date;
  amount?: number;
  note?: string;
  flagColor?: string;
  accountId?: string;
  accountName?: string;
  payeeId?: string;
  payeeName?: string;
  categoryId?: string;
  categoryName?: string;
};
