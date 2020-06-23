import { firestore } from "firebase-admin";

export default class BudgetCategoryGroup {
  id: firestore.DocumentReference;
  name: string;
  note: string;
  hidden: boolean;

  constructor({
    id,
    name,
    note,
    hidden,
  }: {
    id: firestore.DocumentReference;
    name: string;
    note: string;
    hidden: boolean;
  }) {
    this.id = id;
    this.name = name;
    this.note = note;
    this.hidden = hidden;
  }

  toString(): string {
    return `${this.name}`;
  }
}

export const groupConverter = {
  toFirestore: (group: BudgetCategoryGroup): object => ({
    name: group.name,
    note: group.note,
    hidden: group.hidden,
  }),
  fromFirestore: (
    snapshot: firestore.DocumentSnapshot
  ): BudgetCategoryGroup => {
    const data: any = snapshot.data();
    return new BudgetCategoryGroup({
      ...data,
      id: snapshot.ref,
    });
  },
};
