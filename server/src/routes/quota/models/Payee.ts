import { firestore } from "firebase-admin";
import db, {
  CollectionTypes,
  documentReferenceType,
  filterUndefinedProperties,
  FireBaseModel,
  getDocumentReference,
} from "../middleware/firebase";
import BudgetAccount from "./Account";
// import BudgetTransaction from "./BudgetTransaction";

export default class BudgetTransactionPayee extends FireBaseModel {
  id: firestore.DocumentReference;
  name: string;
  note?: string;
  transferAccountId: firestore.DocumentReference;
  transferAccountName: string;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetPayeeInternalProperties;
    snapshot?: firestore.DocumentSnapshot;
  }) {
    super({
      explicit,
      snapshot,
    });

    const { name, note, transferAccountId, transferAccountName } =
      explicit || (snapshot && snapshot.data());

    this.name = name;
    this.note = note;
    this.transferAccountId = transferAccountId;
    this.transferAccountName = transferAccountName;
  }

  getFormattedResponse(): BudgetPayeeDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      name: this.name,
      note: this.note,
      transferAccountId: this.transferAccountId && this.transferAccountId.id,
      transferAccountName: this.transferAccountName,
    });
  }

  toFireStore(): BudgetPayeeInternalProperties {
    return filterUndefinedProperties({
      name: this.name,
      note: this.note,
      transferAccountId: this.transferAccountId,
      transferAccountName: this.transferAccountName,
    });
  }

  setLinkedValues({
    transferAccountName,
    transferAccountId,
  }: {
    transferAccountName?: string;
    transferAccountId?: firestore.DocumentReference;
  }): void {
    this.transferAccountName = transferAccountName || this.transferAccountName;
    this.transferAccountId = transferAccountId || this.transferAccountId;
    this.name =
      (transferAccountName && "TRANSFER: " + this.transferAccountName) ||
      this.name;
  }

  async update(): Promise<BudgetTransactionPayee> {
    await super.update();
    return this;
  }

  async post(): Promise<BudgetTransactionPayee> {
    await super.post(db.getDB().collection(CollectionTypes.PAYEES));
    return this;
  }

  async updateName(name: string): Promise<BudgetTransactionPayee> {
    this.name = name;

    if (this.transferAccountId) {
      await BudgetAccount.getAccount(this.transferAccountId).then((account) => {
        account.setLinkedValues({ transferPayeeName: this.name });
        return account.update();
      });
    }

    // TODO: transactions
    // await BudgetTransaction.getAllTransactions({
    //   payee: this,
    // }).then((transactions) =>
    //   Promise.all(
    //     transactions.map((transaction) => {
    //       transaction.setLinkedValues({
    //         payeeName: this.name,
    //       });
    //       return transaction.update();
    //     })
    //   )
    // );

    return this.update();
  }

  async updatePayee({
    name,
  }: {
    name: string;
  }): Promise<BudgetTransactionPayee> {
    name && (await this.updateName(name));
    return this;
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

  static async getPayee(
    ref: documentReferenceType
  ): Promise<BudgetTransactionPayee> {
    return getDocumentReference(db.getDB(), ref, CollectionTypes.PAYEES)
      .get()
      .then((payee) => new BudgetTransactionPayee({ snapshot: payee }));
  }
}

type BudgetPayeeInternalProperties = {
  id?: firestore.DocumentReference;
  name?: string;
  note?: string;
  transferAccountId?: firestore.DocumentReference<firestore.DocumentData>;
  transferAccountName?: string;
};

type BudgetPayeeDisplayProperties = {
  id?: string;
  name?: string;
  note?: string;
  transferAccountId?: string;
  transferAccountName?: string;
};
