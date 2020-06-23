import { firestore } from "firebase-admin";

export default class BudgetAccount {
  id: firestore.DocumentReference;
  name: string;
  balance: number;
  note: string;
  onBudget: boolean;
  type: string;
  transferPayeeId: string;

  constructor({
    id,
    name,
    balance,
    note,
    onBudget,
    type,
    transferPayeeId,
  }: {
    id: firestore.DocumentReference;
    name: string;
    balance: number;
    note: string;
    onBudget: boolean;
    type: string;
    transferPayeeId: string;
  }) {
    this.id = id;
    this.name = name;
    this.balance = balance;
    this.note = note;
    this.onBudget = onBudget;
    this.type = type;
    this.transferPayeeId = transferPayeeId;
  }

  toString(): string {
    return `${this.name}: $${this.balance.toFixed(2)}`;
  }
}

module.exports.accountConverter = {
  toFirestore: (account: BudgetAccount): object => ({
    name: account.name,
    balance: account.balance,
    note: account.note,
    onBudget: account.onBudget,
    type: account.type,
    transferPayeeId: account.transferPayeeId,
  }),
  fromFirestore: (snapshot: firestore.DocumentSnapshot): BudgetAccount => {
    const data: any = snapshot.data();
    return new BudgetAccount({
      ...data,
      id: snapshot.ref,
    });
  },
};
