import {
  DataBaseModel,
  DocumentReference,
  DocumentSnapshot,
  filterUndefinedProperties,
} from "../../gateway/persistence";

export default class BudgetAccount extends DataBaseModel {
  name: string;
  originalName: string;
  availableBalance: number;
  currentBalance: number;
  startingBalance: number;
  note?: string;
  onBudget: boolean;
  type: string;
  subtype: string;
  transferPayeeId?: DocumentReference;
  transferPayeeName?: string;
  plaidAccountId?: string;
  institutionId?: DocumentReference;
  userId?: DocumentReference;
  hidden?: boolean;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetAccountInternalProperties;
    snapshot?: DocumentSnapshot;
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

  getDisplayFormat(): BudgetAccountDisplayProperties {
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
      hidden: this.hidden,
    });
  }

  getStorageFormat(): BudgetAccountInternalProperties {
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
}

export type BudgetAccountInternalProperties = {
  id?: DocumentReference;
  name?: string;
  originalName?: string;
  availableBalance?: number;
  currentBalance?: number;
  startingBalance?: number;
  note?: string;
  onBudget?: boolean;
  type?: string;
  subtype?: string;
  transferPayeeId?: DocumentReference;
  transferPayeeName?: string;
  plaidAccountId?: string;
  institutionId?: DocumentReference;
  userId?: DocumentReference;
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
