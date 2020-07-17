import {
  DataBaseModel,
  DocumentReference,
  DocumentSnapshot,
  filterUndefinedProperties,
} from "../gateway/persistence";

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
  institutionName?: string;
  userId?: DocumentReference;
  active?: boolean;

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
      institutionName,
      userId,
      active,
    } = explicit || (snapshot && snapshot.data());

    this.name = name;
    this.originalName = originalName || name;
    this.availableBalance = availableBalance || currentBalance || 0;
    this.currentBalance = currentBalance || 0;
    this.startingBalance = startingBalance || currentBalance || 0;
    this.note = note;
    this.active = active || false;
    this.onBudget = onBudget || false;
    this.type = type;
    this.subtype = subtype;
    this.transferPayeeId = transferPayeeId;
    this.transferPayeeName = transferPayeeName;
    this.plaidAccountId = plaidAccountId;
    this.institutionId = institutionId;
    this.institutionName = institutionName;
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
      active: this.active,
      type: this.type,
      subtype: this.subtype,
      transferPayeeId: this.transferPayeeId && this.transferPayeeId.id,
      transferPayeeName: this.transferPayeeName,
      institutionId: this.institutionId && this.institutionId.id,
      institutionName: this.institutionName,
    });
  }

  getStorageFormat(): BudgetAccountInternalProperties {
    return {
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
      institutionName: this.institutionName,
      userId: this.userId,
      active: this.active,
    };
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
  institutionName?: string;
  userId?: DocumentReference;
  active?: boolean;
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
  institutionName?: string;
  userId?: string;
  active?: boolean;
};
