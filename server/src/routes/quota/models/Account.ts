import { firestore } from "firebase-admin";
import BudgetTransactionPayee from "../../budget/models/BudgetTransactionPayee";
import db, {
  CollectionTypes,
  documentReferenceType,
  filterUndefinedProperties,
  FireBaseModel,
  getDocumentReference,
} from "../middleware/firebase";

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
    } = explicit || (snapshot && snapshot.data());

    this.name = name;
    this.originalName = originalName || name;
    this.availableBalance = availableBalance || currentBalance || 0;
    this.currentBalance = currentBalance || 0;
    this.startingBalance = startingBalance || currentBalance || 0;
    this.note = note;
    this.onBudget = onBudget || false;
    this.type = type;
    this.subtype = subtype;
    this.transferPayeeId = transferPayeeId;
    this.transferPayeeName = transferPayeeName;
    this.plaidAccountId = plaidAccountId;
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
    });
  }

  setLinkedValues({ transferPayeeName }: { transferPayeeName: string }): void {
    this.transferPayeeName = transferPayeeName || this.transferPayeeName;
  }

  async updateName(name: string): Promise<BudgetAccount> {
    this.name = name;

    // TODO: transaction integration
    // await BudgetTransaction.getAllTransactions({
    //   account: this,
    // }).then((transactions) =>
    //   Promise.all(
    //     transactions.map((transaction) => {
    //       transaction.setLinkedValues({
    //         accountName: this.name,
    //       });
    //       return transaction.update();
    //     })
    //   )
    // );

    await BudgetTransactionPayee.getPayee(this.transferPayeeId).then(
      (payee) => {
        payee.setLinkedValues({ transferAccountName: this.name });
        this.transferPayeeName = payee.name;
        return payee.update();
      }
    );
    // .then((payee) =>
    //   BudgetTransaction.getAllTransactions({
    //     payee,
    //   }).then((transactions) =>
    //     Promise.all(
    //       transactions.map((transaction) => {
    //         transaction.setLinkedValues({
    //           payeeName: this.name,
    //         });
    //         return transaction.update();
    //       })
    //     )
    //   )
    // );

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
  async post(
    institutionAccountsRef: firestore.CollectionReference
  ): Promise<BudgetAccount> {
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
    await super.post(institutionAccountsRef);

    // Add account id and name to payee
    payee.setLinkedValues({
      transferAccountId: this.id,
      transferAccountName: this.name,
    });

    await payee.update();

    return this;
  }

  static async getAccount(ref: documentReferenceType): Promise<BudgetAccount> {
    return getDocumentReference(db.getDB(), ref, CollectionTypes.ACCOUNTS)
      .get()
      .then((account) => new BudgetAccount({ snapshot: account }));
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
};
