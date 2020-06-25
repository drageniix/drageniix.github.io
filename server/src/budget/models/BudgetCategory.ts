import { firestore } from "firebase-admin";
import db, { CollectionTypes, FireBaseModel } from "../middleware/firebase";
import { filterUndefinedProperties } from "../res/util";
import BudgetCategoryGroup from "./BudgetCategoryGroup";
import BudgetMonth from "./BudgetMonth";
import BudgetMonthCategory from "./BudgetMonthCategory";
import BudgetTransaction from "./BudgetTransaction";

export default class BudgetCategory extends FireBaseModel {
  id?: firestore.DocumentReference;
  goalCreationMonth?: Date;
  goalTarget?: number;
  goalTargetMonth?: Date;
  goalType?: string;
  groupId: firestore.DocumentReference | string;
  groupName?: string;
  active: boolean;
  name: string;
  note?: string;

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
      groupId,
      groupName,
      active,
      name,
      note,
    } = explicit || snapshot.data();

    this.goalCreationMonth =
      (snapshot && goalTargetMonth && goalCreationMonth.toDate()) ||
      (goalCreationMonth && new Date(goalTargetMonth));
    this.goalTarget = goalTarget || 0;
    this.goalTargetMonth =
      (snapshot && goalTargetMonth && goalTargetMonth.toDate()) ||
      (goalTargetMonth && new Date(goalTargetMonth));
    this.goalType = goalType;
    this.groupId = groupId;
    this.groupName = groupName;
    this.active = active || true;
    this.name = name;
    this.note = note;
  }

  getFormattedResponse(): BudgetCategoryDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      goalCreationMonth: this.goalCreationMonth,
      goalTarget: this.goalTarget,
      goalTargetMonth: this.goalTargetMonth,
      goalType: this.goalType,
      groupId:
        (typeof this.groupId === "object" && this.groupId.id) || this.groupId,
      groupName: this.groupName,
      active: this.active,
      name: this.name,
      note: this.note,
    });
  }

  toFireStore(): BudgetCategoryInternalProperties {
    return filterUndefinedProperties({
      goalCreationMonth: this.goalCreationMonth,
      goalTarget: this.goalTarget,
      goalTargetMonth: this.goalTargetMonth,
      goalType: this.goalType,
      groupId: this.groupId,
      groupName: this.groupName,
      active: this.active,
      name: this.name,
      note: this.note,
    });
  }

  setLinkedValues({ groupName }: { groupName: string }): void {
    this.groupName = groupName || this.groupName;
  }

  async update(): Promise<BudgetCategory> {
    await super.update();
    return this;
  }

  async post(): Promise<BudgetCategory> {
    const categoryGroup = await BudgetCategoryGroup.getCategoryGroup(
      this.groupId
    );

    this.groupId = categoryGroup.id;
    this.groupName = categoryGroup.name;

    await super.post(db.getDB().collection(CollectionTypes.CATEGORIES));
    return this;
  }

  async updateName(newName: string): Promise<void> {
    this.name = newName;
    await this.update();

    await BudgetTransaction.getAllTransactions({
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

    await BudgetMonth.getAllMonths()
      .then((months) =>
        Promise.all(
          months.map((month) =>
            BudgetMonthCategory.getAllMonthCategories({ month, category: this })
          )
        )
      )
      .then((budgetCateogryArrays) =>
        Promise.all(
          budgetCateogryArrays.flat().map((budgetCategory) => {
            budgetCategory.setLinkedValues({ categoryName: this.name });
            return budgetCategory.update();
          })
        )
      );
  }

  static async getAllCategories(): Promise<BudgetCategory[]> {
    return db
      .getDB()
      .collection(CollectionTypes.CATEGORIES)
      .where("active", "==", true)
      .get()
      .then((categories) =>
        categories.docs.map((snapshot) => new BudgetCategory({ snapshot }))
      );
  }

  static async getCategory(
    ref: firestore.DocumentReference | string
  ): Promise<BudgetCategory> {
    const reference: firestore.DocumentReference =
      (typeof ref === "object" && ref) ||
      (typeof ref === "string" &&
        db.getDB().collection(CollectionTypes.CATEGORIES).doc(ref));

    return reference
      .get()
      .then((category) => new BudgetCategory({ snapshot: category }));
  }
}

type BudgetCategoryInternalProperties = {
  id?: firestore.DocumentReference;
  goalCreationMonth?: Date;
  goalTarget?: number;
  goalTargetMonth?: Date;
  goalType?: string;
  groupId?: firestore.DocumentReference;
  groupName?: string;
  active?: boolean;
  name?: string;
  note?: string;
};

type BudgetCategoryDisplayProperties = {
  id?: string;
  goalCreationMonth?: Date;
  goalTarget?: number;
  goalTargetMonth?: Date;
  goalType?: string;
  groupId?: string;
  groupName?: string;
  active?: boolean;
  name?: string;
  note?: string;
};
