import { firestore } from "firebase-admin";
import db, { CollectionTypes, FireBaseModel } from "../middleware/firebase";
import { filterUndefinedProperties } from "../res/util";

export default class BudgetCategoryGroup extends FireBaseModel {
  id?: firestore.DocumentReference;
  name: string;
  note?: string;
  hidden: boolean;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetCategoryGroupInternalProperties;
    snapshot?: firestore.DocumentSnapshot;
  }) {
    super({
      explicit,
      snapshot,
    });

    const { name, note, hidden } = explicit || snapshot.data();

    this.name = name;
    this.note = note;
    this.hidden = hidden || false;
  }

  toFireStore(): BudgetCategoryGroupInternalProperties {
    return filterUndefinedProperties({
      name: this.name,
      note: this.note,
      hidden: this.hidden,
    });
  }

  getFormattedResponse(): BudgetCategoryGroupDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      name: this.name,
      note: this.note,
      hidden: this.hidden,
    });
  }

  setLinkedValues(): void {
    return;
  }

  async post(): Promise<BudgetCategoryGroup> {
    await super.post(db.getDB().collection(CollectionTypes.CATEGORY_GROUPS));
    return this;
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
  name?: string;
  note?: string;
  hidden?: boolean;
};

type BudgetCategoryGroupDisplayProperties = {
  id?: string;
  name?: string;
  note?: string;
  hidden?: boolean;
};
