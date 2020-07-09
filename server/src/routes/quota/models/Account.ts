import { firestore } from "firebase-admin";
import {
  CollectionTypes,
  documentReferenceType,
  filterUndefinedProperties,
  FireBaseModel,
  getDocumentReference,
} from "../middleware/firebase";
import BudgetTransactionPayee from "./Payee";
import BudgetTransaction from "./Transaction";

export default class BudgetAccount extends FireBaseModel {
  name: string;
  originalName: string;
  availableBalance: number;
  currentBalance: number;
  startingBalance: number;
  note?: string;
  onBudget: boolean;
  type: string;
  subtype: string;
  transferPayeeId?: firestore.DocumentReference;
  transferPayeeName?: string;
  plaidAccountId?: string;
  institutionId?: firestore.DocumentReference;
  userId?: firestore.DocumentReference;
  hidden?: boolean;

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
      originalName,
      availableBalance,
      currentBalance,
      startingBalance,
      note,
      onBudget,
      type,
      subtype,
      transferPayeeId,
      transferPayeeName,
      plaidAccountId,
      institutionId,
      userId,
      hidden,
    } = explicit || (snapshot && snapshot.data());

    this.name = name;
    this.originalName = originalName || name;
    this.availableBalance = availableBalance || currentBalance || 0;
    this.currentBalance = currentBalance || 0;
    this.startingBalance = startingBalance || currentBalance || 0;
    this.note = note;
    this.hidden = hidden || false;
    this.onBudget = onBudget || false;
    this.type = type;
    this.subtype = subtype;
    this.transferPayeeId = transferPayeeId;
    this.transferPayeeName = transferPayeeName;
    this.plaidAccountId = plaidAccountId;
    this.institutionId = institutionId;
    this.userId = userId;
  }

  getFormattedResponse(): BudgetAccountDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      name: this.name,
      originalName: this.originalName,
      availableBalance: this.availableBalance,
      currentBalance: this.currentBalance,
      startingBalance: this.startingBalance,
      note: this.note,
      onBudget: this.onBudget,
      type: this.type,
      subtype: this.subtype,
      transferPayeeId: this.transferPayeeId && this.transferPayeeId.id,
      transferPayeeName: this.transferPayeeName,
      plaidAccountId: this.plaidAccountId,
      institutionId: this.institutionId && this.institutionId.id,
      userId: this.userId && this.userId.id,
      hidden: this.hidden,
    });
  }

  toFireStore(): BudgetAccountInternalProperties {
    return filterUndefinedProperties({
      name: this.name,
      originalName: this.originalName,
      availableBalance: this.availableBalance,
      currentBalance: this.currentBalance,
      startingBalance: this.startingBalance,
      note: this.note,
      onBudget: this.onBudget,
      type: this.type,
      subtype: this.subtype,
      transferPayeeId: this.transferPayeeId,
      transferPayeeName: this.transferPayeeName,
      plaidAccountId: this.plaidAccountId,
      institutionId: this.institutionId,
      userId: this.userId,
      hidden: this.hidden,
    });
  }

  setLinkedValues({ transferPayeeName }: { transferPayeeName: string }): void {
    this.transferPayeeName = transferPayeeName || this.transferPayeeName;
  }

  async updateName(name: string): Promise<BudgetAccount> {
    this.name = name;

    await BudgetTransaction.getAllTransactions(this.userId, {
      account: this,
    }).then((transactions) =>
      Promise.all(
        transactions.map((transaction) => {
          transaction.setLinkedValues({
            accountName: this.name,
          });
          return transaction.update();
        })
      )
    );

    await BudgetTransactionPayee.getPayee(this.userId, {
      payeeRef: this.transferPayeeId,
    })
      .then((payee) => {
        payee.setLinkedValues({ transferAccountName: this.name });
        this.transferPayeeName = payee.name;
        return payee.update();
      })
      .then((payee) =>
        BudgetTransaction.getAllTransactions(this.userId, {
          payee,
        }).then((transactions) =>
          Promise.all(
            transactions.map((transaction) => {
              transaction.setLinkedValues({
                payeeName: this.name,
              });
              return transaction.update();
            })
          )
        )
      );

    return this.update();
  }

  async updateAccount({ name }: { name: string }): Promise<BudgetAccount> {
    name && (await this.updateName(name));
    return this;
  }

  async update(): Promise<BudgetAccount> {
    await super.update();
    return this;
  }

  // Override
  async post(): Promise<BudgetAccount> {
    // Create equivalent payee for transfers
    const payeeName = `TRANSFER: ${this.name}`;
    const payee = await new BudgetTransactionPayee({
      explicit: {
        userId: this.userId,
        name: payeeName,
      },
    }).post();

    this.transferPayeeId = payee.id;
    this.transferPayeeName = payeeName;

    // Create account in database to generate an id
    await super.postInternal(this.userId.collection(CollectionTypes.ACCOUNTS));

    // Add account id and name to payee
    payee.setLinkedValues({
      transferAccountId: this.id,
      transferAccountName: this.name,
    });

    await payee.update();

    return this;
  }

  static async getAccount(
    userRef: firestore.DocumentReference,
    {
      accountRef,
      plaidAccountId,
    }: {
      accountRef?: documentReferenceType;
      plaidAccountId?: string;
    }
  ): Promise<BudgetAccount> {
    if (plaidAccountId) {
      return userRef
        .collection(CollectionTypes.ACCOUNTS)
        .where("plaidAccountId", "==", plaidAccountId)
        .get()
        .then(
          (accounts) =>
            accounts.docs.length === 1 &&
            new BudgetAccount({ snapshot: accounts.docs[0] })
        );
    } else if (accountRef) {
      return getDocumentReference(userRef, accountRef, CollectionTypes.ACCOUNTS)
        .get()
        .then((account) => account && new BudgetAccount({ snapshot: account }));
    } else return null;
  }

  static async getAllAccounts(
    userRef: firestore.DocumentReference
  ): Promise<BudgetAccount[]> {
    let query = userRef
      .collection(CollectionTypes.ACCOUNTS)
      .where("hidden", "==", false);

    return query
      .get()
      .then((categories) =>
        categories.docs.map((snapshot) => new BudgetAccount({ snapshot }))
      );
  }
}

type BudgetAccountInternalProperties = {
  id?: firestore.DocumentReference;
  name?: string;
  originalName?: string;
  availableBalance?: number;
  currentBalance?: number;
  startingBalance?: number;
  note?: string;
  onBudget?: boolean;
  type?: string;
  subtype?: string;
  transferPayeeId?: firestore.DocumentReference;
  transferPayeeName?: string;
  plaidAccountId?: string;
  institutionId?: firestore.DocumentReference;
  userId?: firestore.DocumentReference;
};

type BudgetAccountDisplayProperties = {
  id?: string;
  name?: string;
  originalName?: string;
  availableBalance?: number;
  currentBalance?: number;
  startingBalance?: number;
  note?: string;
  onBudget?: boolean;
  type?: string;
  subtype?: string;
  transferPayeeId?: string;
  transferPayeeName?: string;
  plaidAccountId?: string;
  institutionId?: string;
  userId?: string;
};
