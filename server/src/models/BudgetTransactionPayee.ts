import { firestore } from "firebase-admin";

export default class BudgetTransactionPayee {
  id: firestore.DocumentReference;
  name: string;
  note: string;
  transferAccountId: firestore.DocumentReference;

  constructor({
    id,
    name,
    note,
    transferAccountId,
  }: {
    id: firestore.DocumentReference;
    name: string;
    note: string;
    transferAccountId: firestore.DocumentReference;
  }) {
    this.id = id;
    this.name = name;
    this.note = note;
    this.transferAccountId = transferAccountId;
  }

  toString(): string {
    return `${this.name}`;
  }
}

export const payeeConverter = {
  toFirestore: (payee: BudgetTransactionPayee): object => ({
    name: payee.name,
    note: payee.note,
    transferAccountId: payee.transferAccountId,
  }),
  fromFirestore: (
    snapshot: firestore.DocumentSnapshot
  ): BudgetTransactionPayee => {
    const data: any = snapshot.data();
    return new BudgetTransactionPayee({
      ...data,
      id: snapshot.ref,
    });
  },
};
