import {
  DataBaseModel,
  DocumentReference,
  DocumentSnapshot,
  filterUndefinedProperties,
} from "../gateway/persistence";

export class BudgetSuggested extends DataBaseModel {
  goalCreationMonth?: Date;
  goalTarget?: number;
  goalTargetMonth?: Date;
  goalPriority?: number;
  goalType?: string;
  name: string;
  scheduled?: number;
  underfunded?: number;
  balance?: number;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetSuggestedInternalProperties;
    snapshot?: DocumentSnapshot;
  }) {
    super({
      explicit,
      snapshot,
    });

    const {
      goalCreationMonth,
      goalTarget,
      goalTargetMonth,
      goalType,
      goalPriority,
      name,
      scheduled,
      underfunded,
      balance,
    } = explicit || snapshot.data();

    this.goalCreationMonth =
      (snapshot && goalTargetMonth && goalCreationMonth.toDate()) ||
      (goalCreationMonth && new Date(goalTargetMonth));
    this.goalTarget = goalTarget || 0;
    this.goalTargetMonth =
      (snapshot && goalTargetMonth && goalTargetMonth.toDate()) ||
      (goalTargetMonth && new Date(goalTargetMonth));
    this.goalType = goalType;
    this.goalPriority = goalPriority;
    this.name = name;
    this.scheduled = scheduled;
    this.underfunded = underfunded;
    this.balance = balance;
  }

  getDisplayFormat(): BudgetSuggestedDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      goalCreationMonth: this.goalCreationMonth,
      goalTarget: this.goalTarget,
      goalTargetMonth: this.goalTargetMonth,
      goalType: this.goalType,
      goalPriority: this.goalPriority,
      name: this.name,
      scheduled: this.scheduled,
      underfunded: this.underfunded,
      balance: this.balance,
    });
  }

  getStorageFormat(): BudgetSuggestedInternalProperties {
    return {
      goalCreationMonth: this.goalCreationMonth,
      goalTarget: this.goalTarget,
      goalTargetMonth: this.goalTargetMonth,
      goalType: this.goalType,
      goalPriority: this.goalPriority,
      name: this.name,
      scheduled: this.scheduled,
      underfunded: this.underfunded,
      balance: this.balance,
    };
  }
}

export type BudgetSuggestedInternalProperties = {
  id?: DocumentReference;
  goalCreationMonth?: Date;
  goalTarget?: number;
  goalTargetMonth?: Date;
  goalType?: string;
  goalPriority?: number;
  name?: string;
  scheduled?: number;
  underfunded?: number;
  balance?: number;
};

type BudgetSuggestedDisplayProperties = {
  id?: string;
  goalCreationMonth?: Date;
  goalTarget?: number;
  goalTargetMonth?: Date;
  goalType?: string;
  goalPriority?: string;
  name?: string;
  scheduled?: number;
  underfunded?: number;
  balance?: number;
};
