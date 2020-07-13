import { firestore } from "firebase-admin";
import db from "../../../middleware/persistence";

export * from "../../../middleware/persistence";

export enum CollectionTypes {
  QUOTA = "quota",
  USERS = "users",
  INSTITUTION = "institution",
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
  [key: string]: string | string[] | number | boolean | Date;
};

export type CollectionReference = firestore.CollectionReference<
  firestore.DocumentData
>;

export type DocumentReference = firestore.DocumentReference<
  firestore.DocumentData
>;

export type DocumentSnapshot = firestore.DocumentSnapshot<
  firestore.DocumentData
>;

export type Query = firestore.Query<firestore.DocumentData>;

export type QuerySnapshot = firestore.QuerySnapshot<firestore.DocumentData>;

export type databaseStorageTypes = {
  [key: string]:
    | string
    | string[]
    | boolean
    | number
    | Date
    | CollectionReference
    | DocumentReference
    | DocumentReference[];
};

export abstract class DataBaseModel {
  id?: DocumentReference;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: any; //eslint-disable-line
    snapshot?: DocumentSnapshot;
  }) {
    this.id = (explicit && explicit.id) || (snapshot && snapshot.ref);
  }

  abstract getDisplayFormat(): displayTypes;
  abstract getStorageFormat(): databaseStorageTypes;
}

export type documentReferenceType = DataBaseModel | string | DocumentReference;

export const deleteModel = async (
  model: DataBaseModel
): Promise<DataBaseModel> => {
  await model.id.delete();
  return model;
};

export const updateModel = async (
  model: DataBaseModel
): Promise<DataBaseModel> => {
  await model.id.update(model.getStorageFormat());
  return model;
};

export const postModelToCollection = async (
  model: DataBaseModel,
  collection: CollectionReference
): Promise<DataBaseModel> => {
  model.id = await collection.add(model.getStorageFormat());
  return model;
};

export const getDocumentReference = (
  db: DocumentReference,
  ref: documentReferenceType,
  collectionType?: string
): DocumentReference => {
  return (
    (typeof ref === "string" && db.collection(collectionType).doc(ref)) ||
    (ref instanceof DataBaseModel && ref.id) ||
    (ref instanceof firestore.DocumentReference && ref)
  );
};

export const filterUndefinedProperties = (
  input: databaseStorageTypes
): databaseStorageTypes => {
  const filteredObject: databaseStorageTypes = {};
  Object.entries(input).forEach(([key, value]) => {
    if (typeof value !== "undefined") {
      filteredObject[key] = value;
    }
  });

  return filteredObject;
};

export default {
  getDB: (): DocumentReference => {
    return db
      .getFirestoreDB()
      .collection(CollectionTypes.QUOTA)
      .doc(process.env.NODE_ENV);
  },
};
