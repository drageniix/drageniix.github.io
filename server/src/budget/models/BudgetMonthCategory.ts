import { firestore } from "firebase-admin";
import db, { CollectionTypes, FireBaseModel } from "../middleware/firebase";
import { filterUndefinedProperties } from "../res/util";

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

  static async getAllMonthCategories(
    monthId: string
  ): Promise<BudgetMonthCategory[]> {
    return db
      .getDB()
      .collection(CollectionTypes.MONTHS)
      .doc(monthId)
      .collection(CollectionTypes.MONTH_CATEGORIES)
      .get()
      .then((months) =>
        months.docs.map((snapshot) => new BudgetMonthCategory({ snapshot }))
      );
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
