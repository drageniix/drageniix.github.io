import { firestore } from "firebase-admin";
import db from "../../middleware/persistence";

export * from "../../middleware/persistence";

export enum CollectionTypes {
  QUOTA = "quota",
  BUDGET = "budget",
  USERS = "users",
  INSTITUTION = "institution",
  PAYEES = "payees",
  ACCOUNTS = "accounts",
  CATEGORIES = "categories",
  MONTHS = "months",
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

export type Timestamp = firestore.Timestamp;

export type databaseStorageTypes = {
  [key: string]:
    | string
    | string[]
    | boolean
    | number
    | Date
    | CollectionReference
    | DocumentReference
    | Timestamp;
};

export abstract class DataBaseModel {
  id: DocumentReference;

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

export const filterUndefinedProperties = (
  input: databaseStorageTypes,
  toPersistence = false
): databaseStorageTypes => {
  const filteredObject: databaseStorageTypes = {};
  Object.entries(input).forEach(([key, value]) => {
    if (typeof value !== "undefined") {
      if (toPersistence) {
        filteredObject[key] =
          value instanceof Date ? firestore.Timestamp.fromDate(value) : value;
      } else {
        filteredObject[key] = value;
      }
    }
  });

  return filteredObject;
};

export const deleteModel = async (
  model: DataBaseModel
): Promise<DataBaseModel> => {
  await model.id.delete();
  return model;
};

export const updateModel = async (
  model: DataBaseModel
): Promise<DataBaseModel> => {
  await model.id.update(
    filterUndefinedProperties(model.getStorageFormat(), true)
  );
  return model;
};

export const postModelToCollection = async (
  model: DataBaseModel,
  collection: CollectionReference
): Promise<DataBaseModel> => {
  model.id = await collection.add(
    filterUndefinedProperties(model.getStorageFormat(), true)
  );
  return model;
};

export const getDocumentReference = (
  db: DocumentReference,
  ref: documentReferenceType,
  collectionType?: string
): DocumentReference =>
  (typeof ref === "string" && db.collection(collectionType).doc(ref)) ||
  (ref instanceof DataBaseModel && ref.id) ||
  (ref instanceof firestore.DocumentReference && ref);

export default {
  getDB: (collection: CollectionTypes): DocumentReference => {
    return db.getFirestoreDB().collection(collection).doc(process.env.NODE_ENV);
  },
};
