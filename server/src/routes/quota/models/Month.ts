import { firestore } from "firebase-admin";
import {
  CollectionTypes,
  documentReferenceType,
  filterUndefinedProperties,
  FireBaseModel,
  getDocumentReference,
} from "../middleware/firebase";
import BudgetCategory from "./Category";
import BudgetMonthCategory from "./MonthCategory";

export default class BudgetMonth extends FireBaseModel {
  id: firestore.DocumentReference;
  activity: number;
  budgeted: number;
  income: number;
  date: Date;
  available: number; //todo
  overBudget: number; //todo
  categories: firestore.CollectionReference;
  userId?: firestore.DocumentReference;

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
      userId,
    } = explicit || snapshot.data();

    this.date = (snapshot && date.toDate()) || new Date(date);
    this.categories = categories;
    this.activity = activity || 0;
    this.available = available || 0;
    this.budgeted = budgeted || 0;
    this.income = income || 0;
    this.overBudget = overBudget || 0;
    this.categories = categories;
    this.userId = userId;
  }

  getFormattedResponse(): BudgetMonthDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      userId: this.userId && this.userId.id,
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
      userId: this.userId,
    });
  }

  setLinkedValues(): void {
    return null;
  }

  async updateBudget(
    oldBudget: number,
    newBudget: number
  ): Promise<BudgetMonth> {
    this.budgeted -= oldBudget;
    this.budgeted += newBudget;
    return this.update();
  }

  async updateActivity(
    isIncome: boolean,
    amount: number
  ): Promise<BudgetMonth> {
    if (isIncome) {
      this.income += amount;
    } else {
      this.activity += amount;
    }

    return this.update();
  }

  async update(): Promise<BudgetMonth> {
    await super.update();
    return this;
  }

  async post(): Promise<BudgetMonth> {
    const allCategories = await BudgetCategory.getAllCategories(this.userId);

    await super.postInternal(this.userId.collection(CollectionTypes.MONTHS));

    this.categories = this.id.collection(CollectionTypes.MONTH_CATEGORIES);

    await Promise.all(
      allCategories.map((category) =>
        new BudgetMonthCategory({
          explicit: {
            monthId: this.id,
            userId: this.userId,
            categoryId: category.id,
            categoryName: category.name,
          },
        }).post()
      )
    );

    return this;
  }

  static async getAllMonths(
    userRef: firestore.DocumentReference
  ): Promise<BudgetMonth[]> {
    return userRef
      .collection(CollectionTypes.MONTHS)
      .orderBy("date", "desc")
      .get()
      .then((months) =>
        months.docs.map((snapshot) => new BudgetMonth({ snapshot }))
      );
  }

  static async getMonth(
    userRef: firestore.DocumentReference,
    {
      ref,
      date,
    }: {
      ref?: documentReferenceType;
      date?: Date;
    }
  ): Promise<BudgetMonth> {
    if (date) {
      const startDate = new Date(date);
      startDate.setDate(1);

      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1);

      // search
      return userRef
        .collection(CollectionTypes.MONTHS)
        .orderBy("date")
        .startAt(startDate)
        .endBefore(endDate)
        .get()
        .then((month) =>
          month.docs.length === 1
            ? new BudgetMonth({ snapshot: month.docs[0] })
            : new BudgetMonth({
                explicit: { date: startDate, userId: userRef },
              }).post()
        );
    } else if (ref) {
      return getDocumentReference(userRef, ref, CollectionTypes.MONTHS)
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
  userId?: firestore.DocumentReference;
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
  userId?: string;
};