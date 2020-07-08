import { firestore } from "firebase-admin";
import db from "../../../middleware/firebase";

export * from "../../../middleware/firebase";

export enum CollectionTypes {
  USERS = "users",
  QUOTA = "quota",
  INSTITUTION = "institution",
  PAYEES = "payees",
  ACCOUNTS = "accounts",
}

export default {
  getDB: (): firestore.DocumentReference => {
    return db
      .getFirestoreDB()
      .collection(CollectionTypes.QUOTA)
      .doc(process.env.NODE_ENV);
  },
};
