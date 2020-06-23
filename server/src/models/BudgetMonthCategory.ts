import { firestore } from "firebase-admin";
import db, { CollectionTypes, FirebaseModel } from "../middleware/firebase";

export default class BudgetMonthCategory implements FirebaseModel {
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
    const { activity, budgeted, balance, categoryId, categoryName } =
      explicit || snapshot.data();

    this.id = explicit.id || snapshot.ref;
    this.activity = activity;
    this.balance = balance;
    this.budgeted = budgeted;
    this.categoryId = categoryId;
    this.categoryName = categoryName;
  }

  getFormattedResponse(): BudgetMonthCategoryDisplayProperties {
    return {
      id: this.id.id,
      activity: this.activity,
      budgeted: this.budgeted,
      balance: this.balance,
      categoryId: this.categoryId.id,
      categoryName: this.categoryName,
    };
  }

  toFireStore(): BudgetMonthCategoryInternalProperties {
    return {
      activity: this.activity,
      budgeted: this.budgeted,
      balance: this.balance,
      categoryId: this.categoryId,
      categoryName: this.categoryName,
    };
  }

  setLinkedValues({ categoryName }: { categoryName: string }): void {
    this.categoryName = categoryName || this.categoryName;
  }

  async delete(): Promise<firestore.WriteResult> {
    return this.id.delete();
  }

  async update(): Promise<firestore.WriteResult> {
    return this.id.update(this.toFireStore());
  }

  async post(monthId: string): Promise<firestore.DocumentReference> {
    return (this.id = await db
      .getDB()
      .collection(CollectionTypes.MONTHS)
      .doc(monthId)
      .collection(CollectionTypes.MONTH_CATEGORIES)
      .add(this.toFireStore()));
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
  activity: number;
  budgeted: number;
  balance: number;
  categoryId: firestore.DocumentReference;
  categoryName: string;
};

type BudgetMonthCategoryDisplayProperties = {
  id?: string;
  activity: number;
  budgeted: number;
  balance: number;
  categoryId: string;
  categoryName: string;
};
