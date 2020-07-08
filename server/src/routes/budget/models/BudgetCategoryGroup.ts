import { firestore } from "firebase-admin";
import db, {
  CollectionTypes,
  documentReferenceType,
  filterUndefinedProperties,
  FireBaseModel,
  getDocumentReference,
} from "../middleware/firebase";
import BudgetCategory from "./BudgetCategory";

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

  async update(): Promise<BudgetCategoryGroup> {
    await super.update();
    return this;
  }

  async updateName(name: string): Promise<BudgetCategoryGroup> {
    this.name = name;

    await BudgetCategory.getAllCategories({
      group: this,
    }).then((categories) =>
      Promise.all(
        categories.map((category) => {
          category.setLinkedValues({
            groupName: this.name,
          });
          return category.update();
        })
      )
    );
    return this.update();
  }

  async updateCategoryGroup({
    name,
  }: {
    name: string;
  }): Promise<BudgetCategoryGroup> {
    name && (await this.updateName(name));
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
    ref: documentReferenceType
  ): Promise<BudgetCategoryGroup> {
    return getDocumentReference(
      db.getDB(),
      ref,
      CollectionTypes.CATEGORY_GROUPS
    )
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
