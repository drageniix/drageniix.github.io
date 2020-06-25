import { firestore } from "firebase-admin";
import db from "../../middleware/firebase";

export enum CollectionTypes {
  BUDGET = "budget",
  PAYEES = "payees",
  ACCOUNTS = "accounts",
  CATEGORIES = "categories",
  CATEGORY_GROUPS = "category_groups",
  MONTHS = "months",
  MONTH_CATEGORIES = "categories",
  TRANSACTIONS = "transactions",
  SCHEDULED_TRANSACTIONS = "scheduled_transactions",
}

export type displayTypes = {
  [key: string]: string | number | boolean | Date;
};

export type firebaseStorageTypes = {
  [key: string]:
    | string
    | boolean
    | number
    | Date
    | firestore.CollectionReference
    | firestore.DocumentReference;
};

export abstract class FireBaseModel {
  id?: firestore.DocumentReference<firestore.DocumentData>;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: any; //eslint-disable-line
    snapshot?: firestore.DocumentSnapshot;
  }) {
    this.id = (explicit && explicit.id) || (snapshot && snapshot.ref);
  }

  abstract getFormattedResponse(): displayTypes;
  abstract toFireStore(): firebaseStorageTypes;
  abstract setLinkedValues(linkedValues?: firebaseStorageTypes): void;

  async delete(): Promise<FireBaseModel> {
    await this.id.delete();
    return this;
  }

  async update(): Promise<FireBaseModel> {
    await this.id.update(this.toFireStore());
    return this;
  }

  async post(
    collection: firestore.CollectionReference
  ): Promise<FireBaseModel> {
    this.id = await collection.add(this.toFireStore());
    return this;
  }
}

export default {
  getDB: (): firestore.DocumentReference => {
    return db
      .getDB()
      .collection(CollectionTypes.BUDGET)
      .doc(process.env.NODE_ENV);
  },
};
