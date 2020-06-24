import { firestore } from "firebase-admin";
import db, { CollectionTypes, FireBaseModel } from "../middleware/firebase";
import { filterUndefinedProperties } from "../res/util";

export default class BudgetTransaction extends FireBaseModel {
  id: firestore.DocumentReference;
  date: Date;
  amount: number;
  memo?: string;
  cleared: boolean;
  flagColor?: string;
  accountId: firestore.DocumentReference;
  accountName?: string;
  payeeId: firestore.DocumentReference;
  payeeName?: string;
  categoryId?: firestore.DocumentReference;
  categoryName?: string;
  transferAccountId?: firestore.DocumentReference;
  transferAccountName?: string;
  transferTransactionId?: firestore.DocumentReference;

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
      transferAccountId,
      transferAccountName,
      transferTransactionId,
    } = explicit || snapshot.data();

    this.date = (snapshot && date.toDate()) || date;
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
    this.transferAccountId = transferAccountId;
    this.transferAccountName = transferAccountName;
    this.transferTransactionId = transferTransactionId;
  }

  getFormattedResponse(): BudgetTransactionDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      date: this.date,
      amount: this.amount,
      memo: this.memo,
      cleared: this.cleared,
      flagColor: this.flagColor,
      accountId: this.accountId && this.accountId.id,
      accountName: this.accountName,
      payeeId: this.payeeId && this.payeeId.id,
      payeeName: this.payeeName,
      categoryId: this.categoryId && this.categoryId.id,
      transferAccountId: this.transferAccountId && this.transferAccountId.id,
      transferAccountName: this.transferAccountName,
      transferTransactionId:
        this.transferTransactionId && this.transferTransactionId.id,
    });
  }

  toFireStore(): BudgetTransactionInternalProperties {
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
      transferAccountId: this.transferAccountId,
      transferAccountName: this.transferAccountName,
      transferTransactionId: this.transferTransactionId,
    });
  }

  setLinkedValues(): void {
    return;
  }

  async post(): Promise<BudgetTransaction> {
    await super.post(db.getDB().collection(CollectionTypes.TRANSACTIONS));
    return this;
  }

  static async getAllTransactions(): Promise<BudgetTransaction[]> {
    return db
      .getDB()
      .collection(CollectionTypes.TRANSACTIONS)
      .get()
      .then((transactions) =>
        transactions.docs.map((snapshot) => new BudgetTransaction({ snapshot }))
      );
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
  transferAccountId?: firestore.DocumentReference;
  transferAccountName?: string;
  transferTransactionId?: firestore.DocumentReference;
};

export type BudgetTransactionDisplayProperties = {
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
  transferAccountId?: string;
  transferAccountName?: string;
  transferTransactionId?: string;
};
