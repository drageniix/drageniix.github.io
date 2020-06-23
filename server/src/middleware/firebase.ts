import admin, { firestore } from "firebase-admin";

let db: FirebaseFirestore.Firestore;

export enum CollectionTypes {
  PAYEES = "payees",
  ACCOUNTS = "accounts",
  CATEGORIES = "categories",
  CATEGORY_GROUPS = "category_groups",
  MONTHS = "months",
  MONTH_CATEGORIES = "categories",
}

export interface FirebaseModel {
  id?: firestore.DocumentReference;

  getFormattedResponse: () => {
    [key: string]: string | boolean | number | Date;
  };
  toFireStore: () => {
    [key: string]:
      | string
      | boolean
      | number
      | Date
      | firestore.CollectionReference
      | firestore.DocumentReference;
  };

  setLinkedValues: (linkedValues: { [key: string]: string }) => void;

  delete: () => Promise<firestore.WriteResult>;

  update: () => Promise<firestore.WriteResult>;

  post: (parentId: string) => Promise<firestore.DocumentReference>;
}

export default {
  init: (): void => {
    const config = JSON.parse(process.env.FIREBASE_CONFIG);

    admin.initializeApp({
      credential: admin.credential.cert(config),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

    db = admin.firestore();
  },
  getDB: (): FirebaseFirestore.Firestore => {
    if (!db) throw new Error("Database not found.");
    return db;
  },
};
