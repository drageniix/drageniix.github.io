import { firestore } from "firebase-admin";
import db, {
  CollectionTypes,
  documentReferenceType,
  filterUndefinedProperties,
  FireBaseModel,
  getDocumentReference,
} from "../middleware/firebase";
import BudgetCategoryGroup from "./BudgetCategoryGroup";
import BudgetMonth from "./BudgetMonth";
import BudgetMonthCategory from "./BudgetMonthCategory";
import BudgetTransaction from "./BudgetTransaction";

export default class BudgetCategory extends FireBaseModel {
  id?: firestore.DocumentReference;
  goalCreationMonth?: Date;
  goalTarget?: number;
  goalTargetMonth?: Date;
  goalPriority?: number;
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
      goalPriority,
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
    this.goalPriority = goalPriority;
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
      goalPriority: this.goalPriority,
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
      goalPriority: this.goalPriority,
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

  async updateCategory({ name }: { name: string }): Promise<BudgetCategory> {
    name && (await this.updateName(name));
    return this;
  }

  async updateName(name: string): Promise<BudgetCategory> {
    this.name = name;

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
            BudgetMonthCategory.getMonthCategory({ month, category: this })
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

  static async getAllCategories({
    group,
  }: { group?: BudgetCategoryGroup } = {}): Promise<BudgetCategory[]> {
    let query = db
      .getDB()
      .collection(CollectionTypes.CATEGORIES)
      .where("active", "==", true);

    if (group) {
      query = query.where("groupId", "==", group.id);
    }

    return query
      .get()
      .then((categories) =>
        categories.docs.map((snapshot) => new BudgetCategory({ snapshot }))
      );
  }

  static async getCategory(
    ref: documentReferenceType
  ): Promise<BudgetCategory> {
    return getDocumentReference(db.getDB(), ref, CollectionTypes.CATEGORIES)
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
  goalPriority?: string;
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
  goalPriority?: string;
  groupId?: string;
  groupName?: string;
  active?: boolean;
  name?: string;
  note?: string;
};