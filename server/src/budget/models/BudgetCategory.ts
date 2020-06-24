import { firestore } from "firebase-admin";
import db, { CollectionTypes, FireBaseModel } from "../middleware/firebase";
import { filterUndefinedProperties } from "../res/util";

export default class BudgetCategory extends FireBaseModel {
  id?: firestore.DocumentReference;
  goalCreationMonth?: Date;
  goalTarget?: number;
  goalTargetMonth?: Date;
  goalType?: string;
  groupId: firestore.DocumentReference;
  groupName?: string;
  hidden: boolean;
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
      hidden,
      name,
      note,
    } = explicit || snapshot.data();

    this.goalCreationMonth =
      (snapshot && goalCreationMonth.toDate()) || goalCreationMonth;
    this.goalTarget = goalTarget || 0;
    this.goalTargetMonth =
      (snapshot && goalTargetMonth.toDate()) || goalTargetMonth;
    this.goalType = goalType;
    this.groupId = groupId;
    this.groupName = groupName;
    this.hidden = hidden || false;
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
      groupId: this.groupId.id,
      groupName: this.groupName,
      hidden: this.hidden,
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
      hidden: this.hidden,
      name: this.name,
      note: this.note,
    });
  }

  setLinkedValues({ groupName }: { groupName: string }): void {
    this.groupName = groupName || this.groupName;
  }

  async post(): Promise<BudgetCategory> {
    await super.post(db.getDB().collection(CollectionTypes.CATEGORIES));
    return this;
  }

  static async getAllCategories(): Promise<BudgetCategory[]> {
    return db
      .getDB()
      .collection(CollectionTypes.CATEGORIES)
      .get()
      .then((categories) =>
        categories.docs.map((snapshot) => new BudgetCategory({ snapshot }))
      );
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
  hidden?: boolean;
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
  hidden?: boolean;
  name?: string;
  note?: string;
};
