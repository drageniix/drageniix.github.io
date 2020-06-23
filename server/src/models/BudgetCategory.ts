import { firestore } from "firebase-admin";
import db, { CollectionTypes, FirebaseModel } from "../middleware/firebase";

export default class BudgetCategory implements FirebaseModel {
  id?: firestore.DocumentReference;
  goalCreationMonth?: Date;
  goalTarget?: number;
  goalTargetMonth?: Date;
  goalType?: string;
  groupId: firestore.DocumentReference;
  groupName?: string;
  hidden: boolean;
  name: string;
  note: string;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetCategoryInternalProperties;
    snapshot?: firestore.DocumentSnapshot;
  }) {
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

    this.id = explicit.id || snapshot.ref;
    this.goalCreationMonth = goalCreationMonth;
    this.goalTarget = goalTarget;
    this.goalTargetMonth = goalTargetMonth;
    this.goalType = goalType;
    this.groupId = groupId;
    this.groupName = groupName;
    this.hidden = hidden;
    this.name = name;
    this.note = note;
  }

  getFormattedResponse(): BudgetCategoryDisplayProperties {
    return {
      id: this.id.id,
      goalCreationMonth: this.goalCreationMonth,
      goalTarget: this.goalTarget,
      goalTargetMonth: this.goalTargetMonth,
      goalType: this.goalType,
      groupId: this.groupId.id,
      groupName: this.groupName,
      hidden: this.hidden,
      name: this.name,
      note: this.note,
    };
  }

  toFireStore(): BudgetCategoryInternalProperties {
    return {
      goalCreationMonth: this.goalCreationMonth,
      goalTarget: this.goalTarget,
      goalTargetMonth: this.goalTargetMonth,
      goalType: this.goalType,
      groupId: this.groupId,
      hidden: this.hidden,
      name: this.name,
      note: this.note,
    };
  }

  setLinkedValues({ groupName }: { groupName: string }): void {
    this.groupName = groupName || this.groupName;
  }

  async delete(): Promise<firestore.WriteResult> {
    return this.id.delete();
  }

  async update(): Promise<firestore.WriteResult> {
    return this.id.update(this.toFireStore());
  }

  async post(): Promise<firestore.DocumentReference> {
    return (this.id = await db
      .getDB()
      .collection(CollectionTypes.CATEGORIES)
      .add(this.toFireStore()));
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
  groupId: firestore.DocumentReference;
  groupName?: string;
  hidden: boolean;
  name: string;
  note: string;
};

type BudgetCategoryDisplayProperties = {
  id?: string;
  goalCreationMonth?: Date;
  goalTarget?: number;
  goalTargetMonth?: Date;
  goalType?: string;
  groupId: string;
  groupName?: string;
  hidden: boolean;
  name: string;
  note: string;
};
