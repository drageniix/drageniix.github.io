import { firestore } from "firebase-admin";
import db, { CollectionTypes, FireBaseModel } from "../middleware/firebase";
import { filterUndefinedProperties } from "../res/util";
import BudgetAccount from "./BudgetAccount";
import BudgetCategory from "./BudgetCategory";
import BudgetMonth from "./BudgetMonth";
import BudgetMonthCategory from "./BudgetMonthCategory";
import BudgetTransactionPayee from "./BudgetTransactionPayee";

export default class BudgetTransaction extends FireBaseModel {
  id: firestore.DocumentReference;
  date: Date;
  amount: number;
  memo?: string;
  cleared: boolean;
  flagColor?: string;
  accountId: string | firestore.DocumentReference;
  accountName?: string;
  payeeId: string | firestore.DocumentReference;
  payeeName?: string;
  categoryId?: string | firestore.DocumentReference;
  categoryName?: string;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetTransactionInternalProperties;
    snapshot?: firestore.DocumentSnapshot;
  }) {
    super({
      explicit,
      snapshot,
    });

    const {
      date,
      amount,
      memo,
      cleared,
      flagColor,
      accountId,
      accountName,
      payeeId,
      payeeName,
      categoryId,
      categoryName,
    } = explicit || snapshot.data();

    this.date = (snapshot && date && date.toDate()) || new Date(date);
    this.amount = amount || 0;
    this.memo = memo;
    this.cleared = cleared || false;
    this.flagColor = flagColor;
    this.accountId = accountId;
    this.accountName = accountName;
    this.payeeId = payeeId;
    this.payeeName = payeeName;
    this.categoryId = categoryId;
    this.categoryName = categoryName;
  }

  getFormattedResponse(): BudgetTransactionDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      date: this.date.toDateString(),
      amount: this.amount,
      memo: this.memo,
      cleared: this.cleared,
      flagColor: this.flagColor,
      accountId:
        (typeof this.accountId === "object" && this.accountId.id) ||
        this.accountId,
      accountName: this.accountName,
      payeeId:
        (typeof this.payeeId === "object" && this.payeeId.id) || this.payeeId,
      payeeName: this.payeeName,
      categoryId:
        (typeof this.categoryId === "object" && this.categoryId.id) ||
        this.categoryId,
      categoryName: this.categoryName,
    });
  }

  toFireStore(): BudgetTransactionInternalProperties {
    return filterUndefinedProperties({
      date: this.date,
      amount: this.amount,
      memo: this.memo,
      cleared: this.cleared,
      flagColor: this.flagColor,
      accountId: this.accountId,
      accountName: this.accountName,
      payeeId: this.payeeId,
      payeeName: this.payeeName,
      categoryId: this.categoryId,
      categoryName: this.categoryName,
    });
  }

  setLinkedValues({
    accountName,
    payeeName,
    categoryName,
  }: {
    accountName?: string;
    payeeName?: string;
    categoryName?: string;
  }): void {
    this.accountName = accountName || this.accountName;
    this.payeeName = payeeName || this.payeeName;
    this.categoryName = categoryName || this.categoryName;
  }

  async updateCategoryAmount(amount: number): Promise<BudgetMonthCategory> {
    let month = await BudgetMonth.getMonth({ date: this.date });

    if (!month) {
      // Create new month
      month = await new BudgetMonth({
        explicit: {
          date: new Date(this.date.getFullYear(), this.date.getMonth(), 1),
        },
      }).post();
    }

    month.activity += amount; // todo: distinguinsh income, calculate available/over budget
    await month.update();

    const months = await BudgetMonthCategory.getAllMonthCategories({ month });
    const monthCategory = months.filter(
      (category) => category.categoryId.id === this.categoryId
    )[0];

    monthCategory.activity += amount;
    monthCategory.balance = monthCategory.balance + monthCategory.activity;

    await monthCategory.update();
    return monthCategory;
  }

  async updateAccountAmount(amount: number): Promise<BudgetAccount> {
    const account = await BudgetAccount.getAccount(this.accountId);
    account.balance += amount;
    await account.update();
    return account;
  }

  async updateAmount(amount: number): Promise<BudgetTransaction> {
    await this.updateAccountAmount(-this.amount + amount);
    await this.updateCategoryAmount(-this.amount + amount);
    this.amount = amount;
    return this.update();
  }

  async update(): Promise<BudgetTransaction> {
    await super.update();
    return this;
  }

  async post(): Promise<BudgetTransaction> {
    if (this.accountId) {
      const account = await this.updateAccountAmount(this.amount);
      this.accountId = account.id;
      this.accountName = account.name;
    }

    if (this.payeeId) {
      const payee = await BudgetTransactionPayee.getPayee(this.payeeId);
      this.payeeId = payee.id;
      this.payeeName = payee.name;
    }

    if (this.categoryId) {
      const monthCategory = await this.updateCategoryAmount(this.amount);
      this.categoryId = monthCategory.categoryId;
      this.categoryName = monthCategory.categoryName;
    }

    await super.post(db.getDB().collection(CollectionTypes.TRANSACTIONS));
    return this;
  }

  static async getAllTransactions({
    account,
    payee,
    category,
    limit,
  }: {
    account?: BudgetAccount;
    payee?: BudgetTransactionPayee;
    category?: BudgetCategory;
    limit?: number;
  } = {}): Promise<BudgetTransaction[]> {
    let query: firestore.Query = db
      .getDB()
      .collection(CollectionTypes.TRANSACTIONS)
      .orderBy("date", "asc");

    if (account || payee || category) {
      if (account) {
        query = query.where("accountId", "==", account.id);
      } else if (payee) {
        query = query.where("payeeId", "==", payee.id);
      } else if (category) {
        query = query.where("categoryId", "==", category.id);
      }
    }

    if (limit) {
      query = query.limit(limit);
    }

    const transactions: firestore.QuerySnapshot = await query.get();
    return transactions.docs.map(
      (snapshot) => new BudgetTransaction({ snapshot })
    );
  }
}

export type BudgetTransactionInternalProperties = {
  id?: firestore.DocumentReference;
  date?: Date;
  amount?: number;
  memo?: string;
  cleared?: boolean;
  flagColor?: string;
  accountId?: firestore.DocumentReference;
  accountName?: string;
  payeeId?: firestore.DocumentReference;
  payeeName?: string;
  categoryId?: firestore.DocumentReference;
  categoryName?: string;
};

export type BudgetTransactionDisplayProperties = {
  id?: string;
  date?: Date;
  amount?: number;
  memo?: string;
  cleared?: boolean;
  flagColor?: string;
  accountId?: string;
  accountName?: string;
  payeeId?: string;
  payeeName?: string;
  categoryId?: string;
  categoryName?: string;
};
