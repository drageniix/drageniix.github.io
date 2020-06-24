import { firestore } from "firebase-admin";
import db, { CollectionTypes, FireBaseModel } from "../middleware/firebase";
import { filterUndefinedProperties } from "../res/util";
import BudgetTransactionPayee from "./BudgetTransactionPayee";

export default class BudgetAccount extends FireBaseModel {
  name: string;
  balance: number;
  note?: string;
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
    super({ explicit, snapshot });

    const {
      name,
      balance,
      note,
      onBudget,
      type,
      transferPayeeId,
      transferPayeeName,
    } = explicit || (snapshot && snapshot.data());

    this.name = name;
    this.balance = balance || 0;
    this.note = note;
    this.onBudget = onBudget || false;
    this.type = type;
    this.transferPayeeId = transferPayeeId;
    this.transferPayeeName = transferPayeeName;
  }

  getFormattedResponse(): BudgetAccountDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      name: this.name,
      balance: this.balance,
      note: this.note,
      onBudget: this.onBudget,
      type: this.type,
      transferPayeeId: this.transferPayeeId && this.transferPayeeId.id,
      transferPayeeName: this.transferPayeeName,
    });
  }

  toFireStore(): BudgetAccountInternalProperties {
    return filterUndefinedProperties({
      name: this.name,
      balance: this.balance,
      note: this.note,
      onBudget: this.onBudget,
      type: this.type,
      transferPayeeId: this.transferPayeeId,
      transferPayeeName: this.transferPayeeName,
    });
  }

  setLinkedValues({ transferPayeeName }: { transferPayeeName: string }): void {
    this.transferPayeeName = transferPayeeName || this.transferPayeeName;
  }

  // Override
  async post(): Promise<BudgetAccount> {
    // Create equivalent payee for transfers
    const payeeName = `TRANSFER: ${this.name}`;
    const payee = await new BudgetTransactionPayee({
      explicit: {
        name: payeeName,
      },
    }).post();

    this.transferPayeeId = payee.id;
    this.transferPayeeName = payeeName;

    // Create account in database to generate an id
    await super.post(db.getDB().collection(CollectionTypes.ACCOUNTS));

    // Add account id and name to payee
    payee.setLinkedValues({
      transferAccountId: this.id,
      transferAccountName: this.name,
    });

    await payee.update();

    return this;
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
  name?: string;
  balance?: number;
  note?: string;
  onBudget?: boolean;
  type?: string;
  transferPayeeId?: firestore.DocumentReference;
  transferPayeeName?: string;
};

type BudgetAccountDisplayProperties = {
  id?: string;
  name?: string;
  balance?: number;
  note?: string;
  onBudget?: boolean;
  type?: string;
  transferPayeeId?: string;
  transferPayeeName?: string;
};
