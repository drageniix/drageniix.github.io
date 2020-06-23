import { firestore } from "firebase-admin";
import db, { CollectionTypes, FirebaseModel } from "../middleware/firebase";

export default class BudgetTransactionPayee implements FirebaseModel {
  id: firestore.DocumentReference;
  name: string;
  note: string;
  transferAccountId: firestore.DocumentReference;
  transferAccountName: string;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetPayeeInternalProperties;
    snapshot?: firestore.DocumentSnapshot;
  }) {
    const { name, note, transferAccountId, transferAccountName } =
      explicit || snapshot.data();

    this.id = explicit.id || snapshot.ref;
    this.name = name;
    this.note = note;
    this.transferAccountId = transferAccountId;
    this.transferAccountName = transferAccountName;
  }

  getFormattedResponse(): BudgetPayeeDisplayProperties {
    return {
      id: this.id.id,
      name: this.name,
      note: this.note,
      transferAccountId: this.transferAccountId.id,
      transferAccountName: this.transferAccountName,
    };
  }

  toFireStore(): BudgetPayeeInternalProperties {
    return {
      name: this.name,
      note: this.note,
      transferAccountId: this.transferAccountId,
      transferAccountName: this.transferAccountName,
    };
  }

  setLinkedValues({
    transferAccountName,
  }: {
    transferAccountName: string;
  }): void {
    this.transferAccountName = transferAccountName || this.transferAccountName;
  }

  async delete(): Promise<firestore.WriteResult> {
    return this.id.delete();
  }

  async update(): Promise<firestore.WriteResult> {
    return this.id.update(this.toFireStore());
  }

  async post(): Promise<firestore.DocumentReference> {
    //needs to be connected to an account
    return (this.id = await db
      .getDB()
      .collection(CollectionTypes.PAYEES)
      .add(this.toFireStore()));
  }

  static async getAllPayees(): Promise<BudgetTransactionPayee[]> {
    return db
      .getDB()
      .collection(CollectionTypes.PAYEES)
      .get()
      .then((payees) =>
        payees.docs.map((snapshot) => new BudgetTransactionPayee({ snapshot }))
      );
  }
}

type BudgetPayeeInternalProperties = {
  id?: firestore.DocumentReference;
  name: string;
  note: string;
  transferAccountId?: firestore.DocumentReference<firestore.DocumentData>;
  transferAccountName?: string;
};

type BudgetPayeeDisplayProperties = {
  id: string;
  name: string;
  note: string;
  transferAccountId?: string;
  transferAccountName?: string;
};
