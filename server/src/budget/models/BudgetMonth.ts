import { firestore } from "firebase-admin";
import db, { CollectionTypes, FireBaseModel } from "../middleware/firebase";
import { filterUndefinedProperties } from "../res/util";
import BudgetCategory from "./BudgetCategory";
import BudgetMonthCategory from "./BudgetMonthCategory";

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

    this.date = (snapshot && date.toDate()) || new Date(date);
    this.categories = categories;
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
      date: this.date.toDateString(),
      activity: this.activity,
      available: this.available,
      budgeted: this.budgeted,
      income: this.income,
      overBudget: this.overBudget,
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
    });
  }

  setLinkedValues(): void {
    return null;
  }

  async post(): Promise<BudgetMonth> {
    const allCategories = await BudgetCategory.getAllCategories();

    await super.post(db.getDB().collection(CollectionTypes.MONTHS));

    this.categories = this.id.collection(CollectionTypes.MONTH_CATEGORIES);

    await Promise.all(
      allCategories.map((category) =>
        new BudgetMonthCategory({
          explicit: { categoryId: category.id, categoryName: category.name },
        }).post(this.categories)
      )
    );

    return this;
  }

  static async getAllMonths(): Promise<BudgetMonth[]> {
    return db
      .getDB()
      .collection(CollectionTypes.MONTHS)
      .orderBy("date", "desc")
      .get()
      .then((months) =>
        months.docs.map((snapshot) => new BudgetMonth({ snapshot }))
      );
  }

  static async getMonth({
    ref,
    date,
  }: {
    ref?: firestore.DocumentReference | string;
    date?: Date;
  }): Promise<BudgetMonth> {
    if (date) {
      const startDate = new Date(date);
      startDate.setDate(1);

      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1);

      // search
      return db
        .getDB()
        .collection(CollectionTypes.MONTHS)
        .orderBy("date")
        .startAt(startDate)
        .endBefore(endDate)
        .get()
        .then((month) =>
          month.docs.length === 1
            ? new BudgetMonth({ snapshot: month.docs[0] })
            : new BudgetMonth({ explicit: { date: startDate } }).post()
        );
    } else if (ref) {
      const reference =
        (typeof ref === "object" && ref) || // direct ref
        (typeof ref === "string" && // id
          db.getDB().collection(CollectionTypes.MONTHS).doc(ref));

      return reference
        .get()
        .then((month) => new BudgetMonth({ snapshot: month }));
    }
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
