import { firestore } from "firebase-admin";
import db, { CollectionTypes, FirebaseModel } from "../middleware/firebase";

export default class BudgetCategoryGroup implements FirebaseModel {
  id?: firestore.DocumentReference;
  name: string;
  note: string;
  hidden: boolean;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetCategoryGroupInternalProperties;
    snapshot?: firestore.DocumentSnapshot;
  }) {
    const { name, note, hidden } = explicit || snapshot.data();

    this.id = explicit.id || snapshot.ref;
    this.name = name;
    this.note = note;
    this.hidden = hidden;
  }

  toFireStore(): BudgetCategoryGroupInternalProperties {
    return {
      name: this.name,
      note: this.note,
      hidden: this.hidden,
    };
  }

  getFormattedResponse(): BudgetCategoryGroupDisplayProperties {
    return {
      id: this.id.id,
      name: this.name,
      note: this.note,
      hidden: this.hidden,
    };
  }

  setLinkedValues(): void {
    return;
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
      .collection(CollectionTypes.CATEGORY_GROUPS)
      .add(this.toFireStore()));
  }

  static async getAllCategoryGroups(): Promise<BudgetCategoryGroup[]> {
    return db
      .getDB()
      .collection(CollectionTypes.CATEGORY_GROUPS)
      .get()
      .then((categoryGroups) =>
        categoryGroups.docs.map(
          (snapshot) => new BudgetCategoryGroup({ snapshot })
        )
      );
  }
}

type BudgetCategoryGroupInternalProperties = {
  id?: firestore.DocumentReference;
  name: string;
  note: string;
  hidden: boolean;
};

type BudgetCategoryGroupDisplayProperties = {
  id?: string;
  name: string;
  note: string;
  hidden: boolean;
};
