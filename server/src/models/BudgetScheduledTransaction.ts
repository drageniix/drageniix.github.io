import { firestore } from "firebase-admin";

export default class BudgetScheduledTransaction {
  id: firestore.DocumentReference;
  dateFirst: Date;
  dateNext: Date;
  frequency: string;
  amount: number;
  memo: string;
  flagColor: string;
  accountId: firestore.DocumentReference;
  payeeId: firestore.DocumentReference;
  categoryId: firestore.DocumentReference;
  transferAccountId: firestore.DocumentReference;

  constructor({
    id,
    dateFirst,
    dateNext,
    frequency,
    amount,
    memo,
    flagColor,
    accountId,
    payeeId,
    categoryId,
    transferAccountId,
  }: {
    id: firestore.DocumentReference;
    dateFirst: Date;
    dateNext: Date;
    frequency: string;
    amount: number;
    memo: string;
    flagColor: string;
    accountId: firestore.DocumentReference;
    payeeId: firestore.DocumentReference;
    categoryId: firestore.DocumentReference;
    transferAccountId: firestore.DocumentReference;
  }) {
    this.id = id;
    this.dateFirst = dateFirst;
    this.dateNext = dateNext;
    this.amount = amount;
    this.memo = memo;
    this.frequency = frequency;
    this.flagColor = flagColor;
    this.accountId = accountId;
    this.payeeId = payeeId;
    this.categoryId = categoryId;
    this.transferAccountId = transferAccountId;
  }
}

export const transactionConverter = {
  toFirestore: (transaction: BudgetScheduledTransaction): object => ({
    dateFirst: transaction.dateFirst,
    dateNext: transaction.dateNext,
    amount: transaction.amount,
    memo: transaction.memo,
    frequency: transaction.frequency,
    flagColor: transaction.flagColor,
    accountId: transaction.accountId,
    payeeId: transaction.payeeId,
    categoryId: transaction.categoryId,
    transferAccountId: transaction.transferAccountId,
  }),
  fromFirestore: (
    snapshot: firestore.DocumentSnapshot
  ): BudgetScheduledTransaction => {
    const data: any = snapshot.data();
    return new BudgetScheduledTransaction({
      ...data,
      id: snapshot.ref.id,
      dateFirst: data.dateFirst.toDate(),
      dateNext: data.dateNext.toDate(),
    });
  },
};
