import { firestore } from "firebase-admin";
import db, { CollectionTypes, FireBaseModel } from "../middleware/firebase";
import { filterUndefinedProperties } from "../res/util";

export default class BudgetCategoryGroup extends FireBaseModel {
  id?: firestore.DocumentReference;
  name: string;
  note?: string;
  active: boolean;

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

    const { name, note, active } = explicit || snapshot.data();

    this.name = name;
    this.note = note;
    this.active = active || true;
  }

  toFireStore(): BudgetCategoryGroupInternalProperties {
    return filterUndefinedProperties({
      name: this.name,
      note: this.note,
      active: this.active,
    });
  }

  getFormattedResponse(): BudgetCategoryGroupDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      name: this.name,
      note: this.note,
      active: this.active,
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
      .where("active", "==", true)
      .get()
      .then((categoryGroups) =>
        categoryGroups.docs.map(
          (snapshot) => new BudgetCategoryGroup({ snapshot })
        )
      );
  }

  static async getCategoryGroup(
    ref: firestore.DocumentReference | string
  ): Promise<BudgetCategoryGroup> {
    const reference: firestore.DocumentReference =
      (typeof ref === "object" && ref) ||
      (typeof ref === "string" &&
        db.getDB().collection(CollectionTypes.CATEGORY_GROUPS).doc(ref));

    return reference
      .get()
      .then(
        (categoryGroup) => new BudgetCategoryGroup({ snapshot: categoryGroup })
      );
  }
}

type BudgetCategoryGroupInternalProperties = {
  id?: firestore.DocumentReference;
  name?: string;
  note?: string;
  active?: boolean;
};

type BudgetCategoryGroupDisplayProperties = {
  id?: string;
  name?: string;
  note?: string;
  active?: boolean;
};
