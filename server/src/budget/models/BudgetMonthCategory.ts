import { firestore } from "firebase-admin";
import {
  CollectionTypes,
  FireBaseModel,
  firebaseStorageTypes,
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

    const { activity, budgeted, balance, categoryId, categoryName } =
      explicit || snapshot.data();

    this.activity = activity || 0;
    this.balance = balance || 0;
    this.budgeted = budgeted || 0;
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
      categoryName: this.categoryName,
    });
  }

  toFireStore(): BudgetMonthCategoryInternalProperties {
    return filterUndefinedProperties({
      activity: this.activity,
      budgeted: this.budgeted,
      balance: this.balance,
      categoryId: this.categoryId,
      categoryName: this.categoryName,
    });
  }

  setLinkedValues({ categoryName }: { categoryName: string }): void {
    this.categoryName = categoryName || this.categoryName;
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

  static async getAllMonthCategories({
    month,
  }: {
    month: BudgetMonth;
  }): Promise<BudgetMonthCategory[]> {
    const monthCategories = await month.id
      .collection(CollectionTypes.MONTH_CATEGORIES)
      .get();

    return monthCategories.docs.map(
      (category) => new BudgetMonthCategory({ snapshot: category })
    );
  }

  static async getMonthCategory({
    month,
    category,
  }: {
    month: BudgetMonth;
    category: BudgetCategory;
  }): Promise<BudgetMonthCategory> {
    const monthCategories = await month.id
      .collection(CollectionTypes.MONTH_CATEGORIES)
      .where("categoryId", "==", category.id)
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
  categoryId?: firestore.DocumentReference;
  categoryName?: string;
};

type BudgetMonthCategoryDisplayProperties = {
  id?: string;
  activity?: number;
  budgeted?: number;
  balance?: number;
  categoryId?: string;
  categoryName?: string;
};
