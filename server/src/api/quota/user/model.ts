import { firestore } from "firebase-admin";
import {
  DataBaseModel,
  DocumentReference,
  filterUndefinedProperties,
} from "../../gateway/persistence";

export enum Privilege {
  ADMIN,
  USER,
}

export default class BudgetUser extends DataBaseModel {
  name: string;
  password: string;
  email: string;
  privilege: number;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetUserInternalProperties;
    snapshot?: firestore.DocumentSnapshot;
  }) {
    super({ explicit, snapshot });

    const { name, email, password, privilege } =
      explicit || (snapshot && snapshot.data());

    this.name = name;
    this.password = password;
    this.email = email;
    this.privilege = privilege || Privilege.USER;
  }

  getDisplayFormat(): BudgetUserDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      name: this.name,
      email: this.email,
      privilege: Privilege[this.privilege],
    });
  }

  getStorageFormat(): BudgetUserInternalProperties {
    return filterUndefinedProperties({
      name: this.name,
      email: this.email,
      password: this.password,
      privilege: this.privilege,
    });
  }
}

export type BudgetUserInternalProperties = {
  id?: DocumentReference;
  name?: string;
  email?: string;
  password?: string;
  privilege?: Privilege;
};

type BudgetUserDisplayProperties = {
  id?: string;
  name?: string;
  email?: string;
  privilege?: string;
};
