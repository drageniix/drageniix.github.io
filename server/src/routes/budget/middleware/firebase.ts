import { firestore } from "firebase-admin";
import db from "../../../middleware/firebase";

export * from "../../../middleware/firebase";

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

export default {
  getDB: (): firestore.DocumentReference => {
    return db
      .getFirestoreDB()
      .collection(CollectionTypes.BUDGET)
      .doc(process.env.NODE_ENV);
  },
};
