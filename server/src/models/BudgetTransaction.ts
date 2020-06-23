import { firestore } from "firebase-admin";

export default class BudgetTransaction {
  id: firestore.DocumentReference;
  date: Date;
  amount: number;
  memo: string;
  cleared: boolean;
  flagColor: string;
  accountId: firestore.DocumentReference;
  payeeId: firestore.DocumentReference;
  categoryId: firestore.DocumentReference;
  transferAccountId: firestore.DocumentReference;
  transferTransactionId: firestore.DocumentReference;

  constructor({
    id,
    date,
    amount,
    memo,
    cleared,
    flagColor,
    accountId,
    payeeId,
    categoryId,
    transferAccountId,
    transferTransactionId,
  }: {
    id: firestore.DocumentReference;
    date: Date;
    amount: number;
    memo: string;
    cleared: boolean;
    flagColor: string;
    accountId: firestore.DocumentReference;
    payeeId: firestore.DocumentReference;
    categoryId: firestore.DocumentReference;
    transferAccountId: firestore.DocumentReference;
    transferTransactionId: firestore.DocumentReference;
  }) {
    this.id = id;
    this.date = date;
    this.amount = amount;
    this.memo = memo;
    this.cleared = cleared;
    this.flagColor = flagColor;
    this.accountId = accountId;
    this.payeeId = payeeId;
    this.categoryId = categoryId;
    this.transferAccountId = transferAccountId;
    this.transferTransactionId = transferTransactionId;
  }
}

export const transactionConverter = {
  toFirestore: (transaction: BudgetTransaction): object => ({
    date: transaction.date,
    amount: transaction.amount,
    memo: transaction.memo,
    cleared: transaction.cleared,
    flagColor: transaction.flagColor,
    accountId: transaction.accountId,
    payeeId: transaction.payeeId,
    categoryId: transaction.categoryId,
    transferAccountId: transaction.transferAccountId,
    transferTransactionId: transaction.transferTransactionId,
  }),
  fromFirestore: (snapshot: firestore.DocumentSnapshot): BudgetTransaction => {
    const data: any = snapshot.data();
    return new BudgetTransaction({
      ...data,
      id: snapshot.ref.id,
      date: data.date.toDate(),
    });
  },
};
