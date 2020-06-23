import { firestore } from "firebase-admin";
import db, { CollectionTypes, FirebaseModel } from "../middleware/firebase";

export default class BudgetMonth implements FirebaseModel {
  id: firestore.DocumentReference;
  activity: number;
  available: number;
  budgeted: number;
  date: Date;
  income: number;
  overBudget: number;
  categories: firestore.CollectionReference;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetMonthInternalProperties;
    snapshot?: firestore.DocumentSnapshot;
  }) {
    const {
      activity,
      available,
      budgeted,
      date,
      income,
      overBudget,
      categories,
    } = explicit || snapshot.data();

    this.id = explicit.id || snapshot.ref;
    this.activity = activity;
    this.available = available;
    this.budgeted = budgeted;
    this.date = date;
    this.income = income;
    this.overBudget = overBudget;
    this.categories = categories;
  }

  getFormattedResponse(): BudgetMonthDisplayProperties {
    return {
      id: this.id.id,
      activity: this.activity,
      available: this.available,
      budgeted: this.budgeted,
      date: this.date,
      income: this.income,
      overBudget: this.overBudget,
      categories: this.categories.id,
    };
  }

  toFireStore(): BudgetMonthInternalProperties {
    return {
      activity: this.activity,
      available: this.available,
      budgeted: this.budgeted,
      date: this.date,
      income: this.income,
      overBudget: this.overBudget,
      categories: this.categories,
    };
  }

  setLinkedValues(): void {
    return null;
  }

  async delete(): Promise<firestore.WriteResult> {
    return this.id.delete();
  }

  async update(): Promise<firestore.WriteResult> {
    return this.id.update(this.toFireStore());
  }

  async post(): Promise<firestore.DocumentReference> {
    //needs to create a payee first
    return (this.id = await db
      .getDB()
      .collection(CollectionTypes.MONTHS)
      .add(this.toFireStore()));
  }

  static async getAllAccounts(): Promise<BudgetMonth[]> {
    return db
      .getDB()
      .collection(CollectionTypes.MONTHS)
      .get()
      .then((months) =>
        months.docs.map((snapshot) => new BudgetMonth({ snapshot }))
      );
  }
}

type BudgetMonthInternalProperties = {
  id?: firestore.DocumentReference;
  activity: number;
  available: number;
  budgeted: number;
  date: Date;
  income: number;
  overBudget: number;
  categories: firestore.CollectionReference;
};

type BudgetMonthDisplayProperties = {
  id?: string;
  activity: number;
  available: number;
  budgeted: number;
  date: Date;
  income: number;
  overBudget: number;
  categories: string;
};
