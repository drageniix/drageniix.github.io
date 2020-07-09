import admin from "firebase-admin";

let db: FirebaseFirestore.Firestore;

export default {
  init: (firebaseConfigString: string): void => {
    const config = JSON.parse(firebaseConfigString);

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
