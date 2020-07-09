import { firestore } from "firebase-admin";
import { Transaction } from "plaid";
import {
  CollectionTypes,
  documentReferenceType,
  filterUndefinedProperties,
  FireBaseModel,
  getDocumentReference,
} from "../middleware/firebase";
import BudgetAccount from "./Account";
import BudgetCategory from "./Category";
import BudgetMonth from "./Month";
import BudgetMonthCategory from "./MonthCategory";
import BudgetTransactionPayee from "./Payee";

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
  userId?: firestore.DocumentReference;
  institutionId?: firestore.DocumentReference;
  plaidTransactionId?: string;

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
      userId,
      institutionId,
      plaidTransactionId,
    } = explicit || snapshot.data();

    this.date =
      (snapshot && date && date.toDate()) ||
      (date && new Date(date)) ||
      new Date();
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
    this.userId = userId;
    this.institutionId = institutionId;
    this.plaidTransactionId = plaidTransactionId;
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
      userId: this.userId && this.userId.id,
      institutionId: this.institutionId && this.institutionId.id,
      plaidTransactionId: this.plaidTransactionId,
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
      userId: this.userId,
      institutionId: this.institutionId,
      plaidTransactionId: this.plaidTransactionId,
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

  async updateCategoryAmount(amount: number): Promise<BudgetTransaction> {
    const month = await BudgetMonth.getMonth(this.userId, { date: this.date });
    const category = await BudgetCategory.getCategory(this.userId, {
      categoryRef: this.categoryId,
    });
    const monthCategory = await BudgetMonthCategory.getMonthCategory(
      this.userId,
      {
        month,
        category,
      }
    );

    await monthCategory.updateActivity(this.amount > 0, amount);
    this.categoryId = monthCategory.categoryId;
    this.categoryName = monthCategory.categoryName;
    return this.update();
  }

  async updateAccountAmount(amount: number): Promise<BudgetTransaction> {
    const account = await BudgetAccount.getAccount(this.userId, {
      accountRef: this.accountId,
    });
    account.currentBalance += amount;
    account.availableBalance += amount;
    await account.update();
    this.accountId = account.id;
    this.accountName = account.name;
    return this.update();
  }

  async updateAmount(amount: number): Promise<BudgetTransaction> {
    await this.updateAccountAmount(-this.amount + amount);
    await this.updateCategoryAmount(-this.amount + amount);
    this.amount = amount;
    return this.update();
  }

  async updateDate(newDate: Date): Promise<BudgetTransaction> {
    await this.updateCategoryAmount(-this.amount);
    this.date = newDate;
    await this.updateCategoryAmount(this.amount);
    return this.update();
  }

  async updatePayee(
    payeeId: documentReferenceType
  ): Promise<BudgetTransaction> {
    const payee = await BudgetTransactionPayee.getPayee(this.userId, {
      payeeRef: payeeId,
    });
    this.payeeId = payee.id;
    this.payeeName = payee.name;
    return this.update();
  }

  async updateTransaction({
    amount,
    date,
    payee,
  }: {
    amount?: number;
    date?: Date;
    payee?: documentReferenceType;
  }): Promise<BudgetTransaction> {
    amount && (await this.updateAmount(amount));
    date && (await this.updateDate(date));
    payee && (await this.updatePayee(payee));
    return this;
  }

  async update(): Promise<BudgetTransaction> {
    await super.update();
    return this;
  }

  async post(): Promise<BudgetTransaction> {
    await super.postInternal(
      this.userId.collection(CollectionTypes.TRANSACTIONS)
    );

    if (this.accountId) {
      await this.updateAccountAmount(this.amount);
    }

    if (this.payeeId) {
      await this.updatePayee(this.payeeId);
    }

    if (this.categoryId) {
      await this.updateCategoryAmount(this.amount);
    }

    return this;
  }

  static async getAllTransactions(
    userRef: firestore.DocumentReference,
    {
      account,
      payee,
      category,
      limit,
    }: {
      account?: BudgetAccount;
      payee?: BudgetTransactionPayee;
      category?: BudgetCategory;
      limit?: number;
    } = {}
  ): Promise<BudgetTransaction[]> {
    let query: firestore.Query = userRef
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

  static async getTransaction(
    userRef: firestore.DocumentReference,
    ref: documentReferenceType
  ): Promise<BudgetTransaction> {
    return getDocumentReference(userRef, ref, CollectionTypes.TRANSACTIONS)
      .get()
      .then((transaction) => new BudgetTransaction({ snapshot: transaction }));
  }

  static async importTransactions(
    userRef: firestore.DocumentReference,
    transactions: Transaction[]
  ) {
    return Promise.all(
      transactions.map(async (transaction) => {
        const account = await BudgetAccount.getAccount(userRef, {
          plaidAccountId: transaction.account_id,
        });

        console.log(account.name);

        const category = await BudgetCategory.getCategory(userRef, {
          plaidCategoryName: transaction.category,
        });

        console.log(category.name);

        const existingPayee = await BudgetTransactionPayee.getPayee(userRef, {
          plaidPayeeName: transaction.name,
        });
        const payee =
          existingPayee ||
          (await new BudgetTransactionPayee({
            explicit: {
              name: transaction.name,
              originalName: transaction.name,
              userId: userRef,
              defaultCategoryId: category.id,
            },
          }).post());

        console.log(existingPayee === payee, payee.name);

        return new BudgetTransaction({
          explicit: {
            accountId: account.id,
            accountName: account.name,
            amount: transaction.amount,
            cleared: !transaction.pending,
            date: new Date(transaction.date),
            payeeId: payee.id,
            payeeName: payee.name,
            userId: userRef,
            categoryId: category.id,
            categoryName: category.name,
          },
        }).post();
      })
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
  userId?: firestore.DocumentReference;
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
  userId?: string;
};
