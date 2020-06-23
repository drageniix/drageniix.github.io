import { firestore } from "firebase-admin";

export default class BudgetMonth {
  id: firestore.DocumentReference;
  activity: number;
  available: number;
  budgeted: number;
  date: Date;
  income: number;
  overBudget: number;
  categories: firestore.CollectionReference;

  constructor({
    id,
    activity,
    available,
    budgeted,
    date,
    income,
    overBudget,
    categories,
  }: {
    id: firestore.DocumentReference;
    activity: number;
    available: number;
    budgeted: number;
    date: Date;
    income: number;
    overBudget: number;
    categories: firestore.CollectionReference;
  }) {
    this.id = id;
    this.activity = activity;
    this.available = available;
    this.budgeted = budgeted;
    this.date = date;
    this.income = income;
    this.overBudget = overBudget;
    this.categories = categories;
  }
}

export const monthConverter = {
  toFirestore: (month: BudgetMonth): object => ({
    activity: month.activity,
    available: month.available,
    budgeted: month.budgeted,
    date: month.date,
    income: month.income,
    overBudget: month.overBudget,
    categories: month.categories,
  }),
  fromFirestore: (snapshot: firestore.DocumentSnapshot): BudgetMonth => {
    const data: any = snapshot.data();
    return new BudgetMonth({
      ...data,
      id: snapshot.ref,
      date: data.date.toDate(),
    });
  },
};
