import { firestore } from "firebase-admin";

export default class BudgetMonthCategory {
  id: firestore.DocumentReference;
  activity: number;
  budgeted: number;
  balance: number;
  categoryId: firestore.DocumentReference;

  constructor({
    id,
    activity,
    budgeted,
    balance,
    categoryId,
  }: {
    id: firestore.DocumentReference;
    activity: number;
    budgeted: number;
    balance: number;
    categoryId: firestore.DocumentReference;
  }) {
    this.id = id;
    this.activity = activity;
    this.balance = balance;
    this.budgeted = budgeted;
    this.categoryId = categoryId;
  }
}

export const monthCategoryConverter = {
  toFirestore: (category: BudgetMonthCategory): object => ({
    activity: category.activity,
    budgeted: category.budgeted,
    balance: category.balance,
    categoryId: category.categoryId,
  }),
  fromFirestore: (
    snapshot: firestore.DocumentSnapshot
  ): BudgetMonthCategory => {
    const data: any = snapshot.data();
    return new BudgetMonthCategory({
      ...data,
      id: snapshot.ref,
    });
  },
};
