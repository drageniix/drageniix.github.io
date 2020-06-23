import { firestore } from "firebase-admin";
import db, { CollectionTypes, FirebaseModel } from "../middleware/firebase";

export default class BudgetAccount implements FirebaseModel {
  id: firestore.DocumentReference;
  name: string;
  balance: number;
  note: string;
  onBudget: boolean;
  type: string;
  transferPayeeId?: firestore.DocumentReference;
  transferPayeeName?: string;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetAccountInternalProperties;
    snapshot?: firestore.DocumentSnapshot;
  }) {
    const {
      name,
      balance,
      note,
      onBudget,
      type,
      transferPayeeId,
      transferPayeeName,
    } = explicit || snapshot.data();

    this.id = explicit.id || snapshot.ref;
    this.name = name;
    this.balance = balance;
    this.note = note;
    this.onBudget = onBudget;
    this.type = type;
    this.transferPayeeId = transferPayeeId;
    this.transferPayeeName = transferPayeeName;
  }

  getFormattedResponse(): BudgetAccountDisplayProperties {
    return {
      id: this.id.id,
      name: this.name,
      balance: this.balance,
      note: this.note,
      onBudget: this.onBudget,
      type: this.type,
      transferPayeeId: this.transferPayeeId.id,
      transferPayeeName: this.transferPayeeName,
    };
  }

  toFireStore(): BudgetAccountInternalProperties {
    return {
      name: this.name,
      balance: this.balance,
      note: this.note,
      onBudget: this.onBudget,
      type: this.type,
      transferPayeeId: this.transferPayeeId,
      transferPayeeName: this.transferPayeeName,
    };
  }

  setLinkedValues({ transferPayeeName }: { transferPayeeName: string }): void {
    this.transferPayeeName = transferPayeeName || this.transferPayeeName;
  }

  async delete(): Promise<firestore.WriteResult> {
    return this.id.delete();
  }

  async update(): Promise<firestore.WriteResult> {
    return this.id.update(this.toFireStore());
  }

  async post(): Promise<firestore.DocumentReference> {
    //needs to create a payee first
    return (this.id = await db
      .getDB()
      .collection(CollectionTypes.ACCOUNTS)
      .add(this.toFireStore()));
  }

  static async getAllAccounts(): Promise<BudgetAccount[]> {
    return db
      .getDB()
      .collection(CollectionTypes.ACCOUNTS)
      .get()
      .then((accounts) =>
        accounts.docs.map((snapshot) => new BudgetAccount({ snapshot }))
      );
  }
}

type BudgetAccountInternalProperties = {
  id?: firestore.DocumentReference;
  name: string;
  balance: number;
  note: string;
  onBudget: boolean;
  type: string;
  transferPayeeId?: firestore.DocumentReference;
  transferPayeeName?: string;
};

type BudgetAccountDisplayProperties = {
  id: string;
  name: string;
  balance: number;
  note: string;
  onBudget: boolean;
  type: string;
  transferPayeeId?: string;
  transferPayeeName?: string;
};
