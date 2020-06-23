import admin from "firebase-admin";

let db: FirebaseFirestore.Firestore;

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
