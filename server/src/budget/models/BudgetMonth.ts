import { firestore } from "firebase-admin";
import db, { CollectionTypes, FireBaseModel } from "../middleware/firebase";
import { filterUndefinedProperties } from "../res/util";
import BudgetCategory from "./BudgetCategory";

export default class BudgetMonth extends FireBaseModel {
  id: firestore.DocumentReference;
  activity: number;
  available: number;
  budgeted: number;
  income: number;
  date: Date;
  overBudget: number;
  categories: firestore.CollectionReference;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetMonthInternalProperties;
    snapshot?: firestore.DocumentSnapshot;
  }) {
    super({
      explicit,
      snapshot,
    });

    const {
      activity,
      available,
      budgeted,
      date,
      income,
      overBudget,
      categories,
    } = explicit || snapshot.data();

    this.date = (snapshot && date.toDate()) || date;
    this.activity = activity || 0;
    this.available = available || 0;
    this.budgeted = budgeted || 0;
    this.income = income || 0;
    this.overBudget = overBudget || 0;
    this.categories = categories;
  }

  getFormattedResponse(): BudgetMonthDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      date: this.date,
      activity: this.activity,
      available: this.available,
      budgeted: this.budgeted,
      income: this.income,
      overBudget: this.overBudget,
      categories: this.categories && this.categories.id,
    });
  }

  toFireStore(): BudgetMonthInternalProperties {
    return filterUndefinedProperties({
      date: this.date,
      activity: this.activity,
      available: this.available,
      budgeted: this.budgeted,
      income: this.income,
      overBudget: this.overBudget,
      categories: this.categories,
    });
  }

  setLinkedValues(): void {
    return null;
  }

  async post(): Promise<BudgetMonth> {
    // TODO: generate all month categories
    await super.post(db.getDB().collection(CollectionTypes.MONTHS));

    const allCategories = await BudgetCategory.getAllCategories();
    allCategories.forEach((category) => {});

    return this;
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
  activity?: number;
  available?: number;
  budgeted?: number;
  date?: Date;
  income?: number;
  overBudget?: number;
  categories?: firestore.CollectionReference;
};

type BudgetMonthDisplayProperties = {
  id?: string;
  activity?: number;
  available?: number;
  budgeted?: number;
  date?: Date;
  income?: number;
  overBudget?: number;
  categories?: string;
};
