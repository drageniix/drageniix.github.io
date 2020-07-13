import { firestore } from "firebase-admin";
import {
  DataBaseModel,
  filterUndefinedProperties,
} from "../middleware/persistence";

export default class BudgetTransaction extends DataBaseModel {
  id: firestore.DocumentReference;
  date: Date;
  amount: number;
  memo?: string;
  cleared: boolean;
  flagColor?: string;
  accountId: string | firestore.DocumentReference;
  accountName?: string;
  payeeId: string | firestore.DocumentReference;
  payeeName?: string;
  categoryId?: string | firestore.DocumentReference;
  categoryName?: string;
  userId?: firestore.DocumentReference;
  institutionId?: firestore.DocumentReference;
  plaidTransactionId?: string;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetTransactionInternalProperties;
    snapshot?: firestore.DocumentSnapshot;
  }) {
    super({
      explicit,
      snapshot,
    });

    const {
      date,
      amount,
      memo,
      cleared,
      flagColor,
      accountId,
      accountName,
      payeeId,
      payeeName,
      categoryId,
      categoryName,
      userId,
      institutionId,
      plaidTransactionId,
    } = explicit || snapshot.data();

    this.date =
      (snapshot && date && date.toDate()) ||
      (date && new Date(date)) ||
      new Date();
    this.amount = amount || 0;
    this.memo = memo;
    this.cleared = cleared || false;
    this.flagColor = flagColor;
    this.accountId = accountId;
    this.accountName = accountName;
    this.payeeId = payeeId;
    this.payeeName = payeeName;
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.userId = userId;
    this.institutionId = institutionId;
    this.plaidTransactionId = plaidTransactionId;
  }

  getDisplayFormat(): BudgetTransactionDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      date: this.date.toDateString(),
      amount: this.amount,
      memo: this.memo,
      cleared: this.cleared,
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
      userId: this.userId && this.userId.id,
      institutionId: this.institutionId && this.institutionId.id,
      plaidTransactionId: this.plaidTransactionId,
    });
  }

  getStorageFormat(): BudgetTransactionInternalProperties {
    return filterUndefinedProperties({
      date: this.date,
      amount: this.amount,
      memo: this.memo,
      cleared: this.cleared,
      flagColor: this.flagColor,
      accountId: this.accountId,
      accountName: this.accountName,
      payeeId: this.payeeId,
      payeeName: this.payeeName,
      categoryId: this.categoryId,
      categoryName: this.categoryName,
      userId: this.userId,
      institutionId: this.institutionId,
      plaidTransactionId: this.plaidTransactionId,
    });
  }
}

export type BudgetTransactionInternalProperties = {
  id?: firestore.DocumentReference;
  date?: Date;
  amount?: number;
  memo?: string;
  cleared?: boolean;
  flagColor?: string;
  accountId?: firestore.DocumentReference;
  accountName?: string;
  payeeId?: firestore.DocumentReference;
  payeeName?: string;
  categoryId?: firestore.DocumentReference;
  categoryName?: string;
  userId?: firestore.DocumentReference;
};

type BudgetTransactionDisplayProperties = {
  id?: string;
  date?: Date;
  amount?: number;
  memo?: string;
  cleared?: boolean;
  flagColor?: string;
  accountId?: string;
  accountName?: string;
  payeeId?: string;
  payeeName?: string;
  categoryId?: string;
  categoryName?: string;
  userId?: string;
};
