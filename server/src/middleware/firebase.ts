import admin, { firestore } from "firebase-admin";

let db: FirebaseFirestore.Firestore;

export default {
  init: (): void => {
    const config = JSON.parse(process.env.FIREBASE_CONFIG);

    admin.initializeApp({
      credential: admin.credential.cert(config),
      databaseURL: `"https://${config.project_id}.firebaseio.com`,
    });

    db = admin.firestore();
  },
  getFirestoreDB: (): FirebaseFirestore.Firestore => {
    if (!db) throw new Error("Database not found.");
    return db;
  },
};

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

export type documentReferenceType =
  | FireBaseModel
  | string
  | firestore.DocumentReference;

export const getDocumentReference = (
  db: firestore.DocumentReference,
  ref: documentReferenceType,
  collectionType?: string
): firestore.DocumentReference => {
  return (
    (typeof ref === "string" && db.collection(collectionType).doc(ref)) ||
    (ref instanceof FireBaseModel && ref.id) ||
    (ref instanceof firestore.DocumentReference && ref)
  );
};

export const filterUndefinedProperties = (
  input: firebaseStorageTypes
): firebaseStorageTypes => {
  const filteredObject: firebaseStorageTypes = {};
  Object.entries(input).forEach(([key, value]) => {
    if (typeof value !== "undefined") {
      filteredObject[key] = value;
    }
  });

  return filteredObject;
};
