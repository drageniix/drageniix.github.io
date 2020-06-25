import { firestore } from "firebase-admin";
import {
  CollectionTypes,
  FireBaseModel,
  firebaseStorageTypes,
  getDocumentReference,
} from "../middleware/firebase";
import { filterUndefinedProperties } from "../res/util";
import BudgetCategory from "./BudgetCategory";
import BudgetMonth from "./BudgetMonth";

export default class BudgetMonthCategory extends FireBaseModel {
  id: firestore.DocumentReference;
  activity: number;
  budgeted: number;
  balance: number;
  categoryId: firestore.DocumentReference;
  categoryName?: string;
  monthId?: firestore.DocumentReference;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetMonthCategoryInternalProperties;
    snapshot?: firestore.DocumentSnapshot;
  }) {
    super({
      explicit,
      snapshot,
    });

    const { activity, budgeted, balance, monthId, categoryId, categoryName } =
      explicit || snapshot.data();

    this.activity = activity || 0;
    this.balance = balance || 0;
    this.budgeted = budgeted || 0;
    this.monthId = monthId;
    this.categoryId = categoryId;
    this.categoryName = categoryName;
  }

  getFormattedResponse(): BudgetMonthCategoryDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      activity: this.activity,
      budgeted: this.budgeted,
      balance: this.balance,
      categoryId: this.categoryId && this.categoryId.id,
      monthId: this.monthId && this.monthId.id,
      categoryName: this.categoryName,
    });
  }

  toFireStore(): BudgetMonthCategoryInternalProperties {
    return filterUndefinedProperties({
      activity: this.activity,
      budgeted: this.budgeted,
      balance: this.balance,
      monthId: this.monthId,
      categoryId: this.categoryId,
      categoryName: this.categoryName,
    });
  }

  setLinkedValues({ categoryName }: { categoryName: string }): void {
    this.categoryName = categoryName || this.categoryName;
  }

  async updateMonthCategory({
    budget,
  }: {
    budget: number;
  }): Promise<BudgetMonthCategory> {
    return this.updateBudget(budget);
  }

  async updateBudget(budget: number): Promise<BudgetMonthCategory> {
    const month = await BudgetMonth.getMonth({ ref: this.monthId });
    await month.updateBudget(this.budgeted, budget);
    this.budgeted = budget;
    return this.update();
  }

  async updateActivity(
    isIncome: boolean,
    amount: number
  ): Promise<BudgetMonthCategory> {
    const month = await BudgetMonth.getMonth({ ref: this.monthId });
    await month.updateActivity(isIncome, amount);

    this.activity += amount;
    this.balance = this.balance + this.activity;

    return this.update();
  }

  async getFullyPopulatedMonthCategory(): Promise<firebaseStorageTypes> {
    const category = await BudgetCategory.getCategory(this.categoryId);
    return filterUndefinedProperties({
      ...this.toFireStore(),
      ...category.toFireStore(),
      id: this.id,
      name: undefined,
    });
  }

  async update(): Promise<BudgetMonthCategory> {
    await super.update();
    return this;
  }

  static async getAllMonthCategories({
    month,
  }: {
    month: string | BudgetMonth;
  }): Promise<BudgetMonthCategory[]> {
    const monthCategoryCollectionReference = getDocumentReference(
      month,
      CollectionTypes.MONTHS
    ).collection(CollectionTypes.MONTH_CATEGORIES);

    return monthCategoryCollectionReference
      .get()
      .then((monthCategories) =>
        monthCategories.docs.map(
          (category) => new BudgetMonthCategory({ snapshot: category })
        )
      );
  }

  static async getMonthCategory({
    month,
    category,
  }: {
    month: string | BudgetMonth;
    category: string | BudgetCategory;
  }): Promise<BudgetMonthCategory> {
    const monthCategoryCollectionReference = getDocumentReference(
      month,
      CollectionTypes.MONTHS
    );

    const categoryReference = getDocumentReference(
      category,
      CollectionTypes.CATEGORIES
    );

    const monthCategories = await monthCategoryCollectionReference
      .collection(CollectionTypes.MONTH_CATEGORIES)
      .where("categoryId", "==", categoryReference)
      .get();

    if (monthCategories.docs.length == 1) {
      return new BudgetMonthCategory({ snapshot: monthCategories.docs[0] });
    }
  }
}

type BudgetMonthCategoryInternalProperties = {
  id?: firestore.DocumentReference;
  activity?: number;
  budgeted?: number;
  balance?: number;
  monthId?: firestore.DocumentReference;
  categoryId?: firestore.DocumentReference;
  categoryName?: string;
};

type BudgetMonthCategoryDisplayProperties = {
  id?: string;
  activity?: number;
  budgeted?: number;
  balance?: number;
  monthId?: string;
  categoryId?: string;
  categoryName?: string;
};
