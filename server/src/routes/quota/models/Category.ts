import { firestore } from "firebase-admin";
import {
  CollectionTypes,
  documentReferenceType,
  filterUndefinedProperties,
  FireBaseModel,
  getDocumentReference,
} from "../middleware/firebase";
import BudgetMonth from "./Month";
import BudgetMonthCategory from "./MonthCategory";
import BudgetTransaction from "./Transaction";

export default class BudgetCategory extends FireBaseModel {
  id?: firestore.DocumentReference;
  goalCreationMonth?: Date;
  goalTarget?: number;
  goalTargetMonth?: Date;
  goalPriority?: number;
  goalType?: string;
  active: boolean;
  name: string;
  originalName: string;
  note?: string;
  userId?: firestore.DocumentReference;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetCategoryInternalProperties;
    snapshot?: firestore.DocumentSnapshot;
  }) {
    super({
      explicit,
      snapshot,
    });

    const {
      goalCreationMonth,
      goalTarget,
      goalTargetMonth,
      goalType,
      goalPriority,
      active,
      name,
      originalName,
      note,
      userId,
    } = explicit || snapshot.data();

    this.goalCreationMonth =
      (snapshot && goalTargetMonth && goalCreationMonth.toDate()) ||
      (goalCreationMonth && new Date(goalTargetMonth));
    this.goalTarget = goalTarget || 0;
    this.goalTargetMonth =
      (snapshot && goalTargetMonth && goalTargetMonth.toDate()) ||
      (goalTargetMonth && new Date(goalTargetMonth));
    this.goalType = goalType;
    this.goalPriority = goalPriority;
    this.active = active || true;
    this.name = name;
    this.originalName = originalName;
    this.note = note;
    this.userId = userId;
  }

  getFormattedResponse(): BudgetCategoryDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      goalCreationMonth: this.goalCreationMonth,
      goalTarget: this.goalTarget,
      goalTargetMonth: this.goalTargetMonth,
      goalType: this.goalType,
      goalPriority: this.goalPriority,
      active: this.active,
      name: this.name,
      originalName: this.originalName,
      note: this.note,
      userId: this.userId && this.userId.id,
    });
  }

  toFireStore(): BudgetCategoryInternalProperties {
    return filterUndefinedProperties({
      goalCreationMonth: this.goalCreationMonth,
      goalTarget: this.goalTarget,
      goalTargetMonth: this.goalTargetMonth,
      goalType: this.goalType,
      goalPriority: this.goalPriority,
      active: this.active,
      name: this.name,
      originalName: this.originalName,
      note: this.note,
      userId: this.userId,
    });
  }

  async update(): Promise<BudgetCategory> {
    await super.update();
    return this;
  }

  async post(): Promise<BudgetCategory> {
    await super.postInternal(
      this.userId.collection(CollectionTypes.CATEGORIES)
    );
    return this;
  }

  async updateCategory({ name }: { name: string }): Promise<BudgetCategory> {
    name && (await this.updateName(name));
    return this;
  }

  async updateName(name: string): Promise<BudgetCategory> {
    this.name = name;

    await BudgetTransaction.getAllTransactions(this.userId, {
      category: this,
    }).then((transactions) =>
      Promise.all(
        transactions.map((transaction) => {
          transaction.setLinkedValues({
            categoryName: this.name,
          });
          return transaction.update();
        })
      )
    );

    await BudgetMonth.getAllMonths(this.userId)
      .then((months) =>
        Promise.all(
          months.map((month) =>
            BudgetMonthCategory.getMonthCategory(this.userId, {
              month,
              category: this,
            })
          )
        )
      )
      .then((budgetMonthCategories) =>
        Promise.all(
          budgetMonthCategories.map((budgetCategory) => {
            budgetCategory.setLinkedValues({ categoryName: this.name });
            return budgetCategory.update();
          })
        )
      );

    return this.update();
  }

  static async getAllCategories(
    userRef: firestore.DocumentReference,
    { description }: { description?: string[] } = {}
  ): Promise<BudgetCategory[]> {
    let query = userRef
      .collection(CollectionTypes.CATEGORIES)
      .where("active", "==", true);

    if (description) {
      query = query.where("originalName", "in", description);
    }

    return query
      .get()
      .then((categories) =>
        categories.docs.map((snapshot) => new BudgetCategory({ snapshot }))
      );
  }

  static async getCategory(
    userRef: firestore.DocumentReference,
    {
      categoryRef,
      description,
    }: { categoryRef?: documentReferenceType; description?: string[] }
  ): Promise<BudgetCategory> {
    if (description) {
      return userRef
        .collection(CollectionTypes.CATEGORIES)
        .where("originalName", "in", description)
        .get()
        .then(
          (categories) =>
            categories.docs.length === 1 &&
            new BudgetCategory({ snapshot: categories.docs[0] })
        );
    } else if (categoryRef) {
      return getDocumentReference(
        userRef,
        categoryRef,
        CollectionTypes.CATEGORIES
      )
        .get()
        .then(
          (category) => category && new BudgetCategory({ snapshot: category })
        );
    } else return null;
  }
}

type BudgetCategoryInternalProperties = {
  id?: firestore.DocumentReference;
  goalCreationMonth?: Date;
  goalTarget?: number;
  goalTargetMonth?: Date;
  goalType?: string;
  goalPriority?: string;
  active?: boolean;
  name?: string;
  originalName?: string;
  note?: string;
  userId?: firestore.DocumentReference;
};

type BudgetCategoryDisplayProperties = {
  id?: string;
  goalCreationMonth?: Date;
  goalTarget?: number;
  goalTargetMonth?: Date;
  goalType?: string;
  goalPriority?: string;
  active?: boolean;
  name?: string;
  originalName?: string;
  note?: string;
  userId?: string;
};
