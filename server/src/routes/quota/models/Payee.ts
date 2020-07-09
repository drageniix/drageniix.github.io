import { firestore } from "firebase-admin";
import {
  CollectionTypes,
  documentReferenceType,
  filterUndefinedProperties,
  FireBaseModel,
  getDocumentReference,
} from "../middleware/firebase";
import BudgetAccount from "./Account";
import BudgetTransaction from "./Transaction";

export default class BudgetTransactionPayee extends FireBaseModel {
  id: firestore.DocumentReference;
  name: string;
  orginalName: string;
  note?: string;
  originalName: string;
  defaultCategoryId?: firestore.DocumentReference;
  transferAccountId?: firestore.DocumentReference;
  transferAccountName?: string;
  userId?: firestore.DocumentReference;

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

    const {
      name,
      originalName,
      note,
      transferAccountId,
      transferAccountName,
      defaultCategoryId,
      userId,
    } = explicit || (snapshot && snapshot.data());

    this.name = name;
    this.note = note;
    this.originalName = originalName || name;
    this.transferAccountId = transferAccountId;
    this.transferAccountName = transferAccountName;
    this.defaultCategoryId = defaultCategoryId;
    this.userId = userId;
  }

  getFormattedResponse(): BudgetPayeeDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      name: this.name,
      originalName: this.originalName,
      note: this.note,
      defaultCategoryId: this.defaultCategoryId && this.defaultCategoryId.id,
      transferAccountId: this.transferAccountId && this.transferAccountId.id,
      transferAccountName: this.transferAccountName,
      userId: this.userId && this.userId.id,
    });
  }

  toFireStore(): BudgetPayeeInternalProperties {
    return filterUndefinedProperties({
      name: this.name,
      originalName: this.originalName,
      note: this.note,
      defaultCategoryId: this.defaultCategoryId,
      transferAccountId: this.transferAccountId,
      transferAccountName: this.transferAccountName,
      userId: this.userId,
    });
  }

  setLinkedValues({
    transferAccountName,
    transferAccountId,
    defaultCategoryId,
  }: {
    transferAccountName?: string;
    transferAccountId?: firestore.DocumentReference;
    defaultCategoryId?: firestore.DocumentReference;
  }): void {
    this.defaultCategoryId = defaultCategoryId || this.defaultCategoryId;
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
    await super.postInternal(this.userId.collection(CollectionTypes.PAYEES));
    return this;
  }

  async updateName(name: string): Promise<BudgetTransactionPayee> {
    this.name = name;

    if (this.transferAccountId) {
      await BudgetAccount.getAccount(this.userId, {
        accountRef: this.transferAccountId,
      }).then((account) => {
        account.setLinkedValues({ transferPayeeName: this.name });
        return account.update();
      });
    }

    await BudgetTransaction.getAllTransactions(this.userId, {
      payee: this,
    }).then((transactions) =>
      Promise.all(
        transactions.map((transaction) => {
          transaction.setLinkedValues({
            payeeName: this.name,
          });
          return transaction.update();
        })
      )
    );

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

  static async getAllPayees(
    userRef: firestore.DocumentReference
  ): Promise<BudgetTransactionPayee[]> {
    return userRef
      .collection(CollectionTypes.PAYEES)
      .get()
      .then((payees) =>
        payees.docs.map((snapshot) => new BudgetTransactionPayee({ snapshot }))
      );
  }

  static async getPayee(
    userRef: firestore.DocumentReference,
    {
      payeeRef,
      plaidPayeeName,
    }: {
      payeeRef?: documentReferenceType;
      plaidPayeeName?: string;
    }
  ): Promise<BudgetTransactionPayee> {
    if (plaidPayeeName) {
      return userRef
        .collection(CollectionTypes.PAYEES)
        .where("orginalName", "==", plaidPayeeName)
        .get()
        .then(
          (payees) =>
            payees.docs.length === 1 &&
            new BudgetTransactionPayee({ snapshot: payees.docs[0] })
        );
    } else if (payeeRef) {
      return getDocumentReference(userRef, payeeRef, CollectionTypes.PAYEES)
        .get()
        .then(
          (payee) => payee && new BudgetTransactionPayee({ snapshot: payee })
        );
    } else return null;
  }
}

type BudgetPayeeInternalProperties = {
  id?: firestore.DocumentReference;
  name?: string;
  note?: string;
  transferAccountId?: firestore.DocumentReference<firestore.DocumentData>;
  transferAccountName?: string;
  defaultCategoryId?: firestore.DocumentReference;
  userId?: firestore.DocumentReference;
  originalName?: string;
};

type BudgetPayeeDisplayProperties = {
  id?: string;
  name?: string;
  note?: string;
  transferAccountId?: string;
  transferAccountName?: string;
  defaultCategoryId?: string;
  userId?: string;
  originalName?: string;
};
