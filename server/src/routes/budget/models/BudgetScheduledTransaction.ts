import { firestore } from "firebase-admin";
import db, {
  CollectionTypes,
  documentReferenceType,
  filterUndefinedProperties,
  FireBaseModel,
  getDocumentReference,
} from "../middleware/firebase";

export default class BudgetScheduledTransaction extends FireBaseModel {
  id: firestore.DocumentReference;
  date: Date;
  frequency: string;
  amount: number;
  memo?: string;
  flagColor: string;
  accountId: firestore.DocumentReference;
  accountName?: string;
  payeeId: firestore.DocumentReference;
  payeeName?: string;
  categoryId?: firestore.DocumentReference;
  categoryName?: string;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetScheduledTransactionInternalProperties;
    snapshot?: firestore.DocumentSnapshot;
  }) {
    super({
      explicit,
      snapshot,
    });

    const {
      date,
      frequency,
      amount,
      memo,
      flagColor,
      accountId,
      accountName,
      payeeId,
      payeeName,
      categoryId,
      categoryName,
    } = explicit || snapshot.data();

    this.date = (snapshot && date && date.toDate()) || new Date(date);
    this.amount = amount || 0;
    this.memo = memo;
    this.frequency = frequency || "never";
    this.flagColor = flagColor;
    this.accountId = accountId;
    this.accountName = accountName;
    this.payeeId = payeeId;
    this.payeeName = payeeName;
    this.categoryId = categoryId;
    this.categoryName = categoryName;
  }

  getFormattedResponse(): BudgetScheduledTransactionDisplayProperties {
    return filterUndefinedProperties({
      date: this.date.toDateString(),
      amount: this.amount,
      memo: this.memo,
      frequency: this.frequency,
      flagColor: this.flagColor,
      accountId: this.accountId.id,
      accountName: this.accountName,
      payeeId: this.payeeId.id,
      payeeName: this.payeeName,
      categoryId: this.categoryId.id,
      categoryName: this.categoryName,
    });
  }

  toFireStore(): BudgetScheduledTransactionInternalProperties {
    return filterUndefinedProperties({
      date: this.date,
      amount: this.amount,
      memo: this.memo,
      frequency: this.frequency,
      flagColor: this.flagColor,
      accountId: this.accountId,
      accountName: this.accountName,
      payeeId: this.payeeId,
      payeeName: this.payeeName,
      categoryId: this.categoryId,
      categoryName: this.categoryName,
    });
  }

  setLinkedValues(): void {
    return;
  }

  async post(): Promise<BudgetScheduledTransaction> {
    await super.post(
      db.getDB().collection(CollectionTypes.SCHEDULED_TRANSACTIONS)
    );
    return this;
  }

  static async getAllTransactions(): Promise<BudgetScheduledTransaction[]> {
    return db
      .getDB()
      .collection(CollectionTypes.SCHEDULED_TRANSACTIONS)
      .get()
      .then((scheduledTransactions) =>
        scheduledTransactions.docs.map(
          (snapshot) => new BudgetScheduledTransaction({ snapshot })
        )
      );
  }

  static async getScheduledTransaction(
    ref: documentReferenceType
  ): Promise<BudgetScheduledTransaction> {
    return getDocumentReference(
      db.getDB(),
      ref,
      CollectionTypes.SCHEDULED_TRANSACTIONS
    )
      .get()
      .then(
        (scheduledTransaction) =>
          new BudgetScheduledTransaction({ snapshot: scheduledTransaction })
      );
  }
}

export type BudgetScheduledTransactionInternalProperties = {
  id?: firestore.DocumentReference;
  date?: Date;
  frequency?: string;
  amount?: number;
  memo?: string;
  flagColor?: string;
  accountId?: firestore.DocumentReference;
  payeeId?: firestore.DocumentReference;
  categoryId?: firestore.DocumentReference;
  accountName?: string;
  payeeName?: string;
  categoryName?: string;
};

export type BudgetScheduledTransactionDisplayProperties = {
  id?: string;
  date?: Date;
  frequency?: string;
  amount?: number;
  memo?: string;
  flagColor?: string;
  accountId?: string;
  payeeId?: string;
  categoryId?: string;
  accountName?: string;
  payeeName?: string;
  categoryName?: string;
};
