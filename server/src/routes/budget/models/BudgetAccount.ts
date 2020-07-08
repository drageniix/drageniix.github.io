import { firestore } from "firebase-admin";
import db, {
  CollectionTypes,
  documentReferenceType,
  filterUndefinedProperties,
  FireBaseModel,
  getDocumentReference,
} from "../../budget/middleware/firebase";
import BudgetTransaction from "../../budget/models/BudgetTransaction";
import BudgetTransactionPayee from "../../budget/models/BudgetTransactionPayee";

export default class BudgetAccount extends FireBaseModel {
  name: string;
  originalName: string;
  availableBalance: number;
  currentBalance: number;
  note?: string;
  onBudget: boolean;
  type: string;
  subtype: string;
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
      originalName,
      availableBalance,
      currentBalance,
      note,
      onBudget,
      type,
      subtype,
      transferPayeeId,
      transferPayeeName,
    } = explicit || (snapshot && snapshot.data());

    this.name = name;
    this.originalName = originalName;
    this.availableBalance = availableBalance || 0;
    this.currentBalance = currentBalance || 0;
    this.note = note;
    this.onBudget = onBudget || false;
    this.type = type;
    this.subtype = subtype;
    this.transferPayeeId = transferPayeeId;
    this.transferPayeeName = transferPayeeName;
  }

  getFormattedResponse(): BudgetAccountDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      name: this.name,
      originalName: this.originalName,
      availableBalance: this.availableBalance,
      currentBalance: this.currentBalance,
      note: this.note,
      onBudget: this.onBudget,
      type: this.type,
      subtype: this.subtype,
      transferPayeeId: this.transferPayeeId && this.transferPayeeId.id,
      transferPayeeName: this.transferPayeeName,
    });
  }

  toFireStore(): BudgetAccountInternalProperties {
    return filterUndefinedProperties({
      name: this.name,
      originalName: this.originalName,
      availableBalance: this.availableBalance,
      currentBalance: this.currentBalance,
      note: this.note,
      onBudget: this.onBudget,
      type: this.type,
      subtype: this.subtype,
      transferPayeeId: this.transferPayeeId,
      transferPayeeName: this.transferPayeeName,
    });
  }

  setLinkedValues({ transferPayeeName }: { transferPayeeName: string }): void {
    this.transferPayeeName = transferPayeeName || this.transferPayeeName;
  }

  async updateName(name: string): Promise<BudgetAccount> {
    this.name = name;

    await BudgetTransaction.getAllTransactions({
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

    await BudgetTransactionPayee.getPayee(this.transferPayeeId)
      .then((payee) => {
        payee.setLinkedValues({ transferAccountName: this.name });
        this.transferPayeeName = payee.name;
        return payee.update();
      })
      .then((payee) =>
        BudgetTransaction.getAllTransactions({
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
  note?: string;
  onBudget?: boolean;
  type?: string;
  subtype?: string;
  transferPayeeId?: firestore.DocumentReference;
  transferPayeeName?: string;
};

type BudgetAccountDisplayProperties = {
  id?: string;
  name?: string;
  originalName?: string;
  availableBalance?: number;
  currentBalance?: number;
  note?: string;
  onBudget?: boolean;
  type?: string;
  subtype?: string;
  transferPayeeId?: string;
  transferPayeeName?: string;
};
