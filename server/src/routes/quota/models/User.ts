import { firestore } from "firebase-admin";
import db, {
  CollectionTypes,
  documentReferenceType,
  filterUndefinedProperties,
  FireBaseModel,
  getDocumentReference,
} from "../middleware/firebase";

export enum Privilege {
  ADMIN,
  USER,
}

export default class User extends FireBaseModel {
  name: string;
  password: string;
  email: string;
  privilege: number;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: UserInternalProperties;
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

  getFormattedResponse(): UserDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      name: this.name,
      email: this.email,
      privilege: Privilege[this.privilege],
    });
  }

  toFireStore(): UserInternalProperties {
    return filterUndefinedProperties({
      name: this.name,
      email: this.email,
      password: this.password,
      privilege: this.privilege,
    });
  }

  setLinkedValues(): void {
    return null;
  }

  async updateUser({
    name,
    email,
    privilege,
  }: UserInternalProperties): Promise<User> {
    name && (this.name = name);
    email && (this.email = email);
    privilege && (this.privilege = privilege);
    return this.update();
  }

  async post(): Promise<User> {
    await super.postInternal(db.getDB().collection(CollectionTypes.USERS));
    return this;
  }

  async update(): Promise<User> {
    await super.update();
    return this;
  }

  static getUserReferenceById(
    ref: documentReferenceType
  ): firestore.DocumentReference {
    return getDocumentReference(db.getDB(), ref, CollectionTypes.USERS);
  }

  // userId
  static async getUserById(ref: documentReferenceType): Promise<User> {
    return this.getUserReferenceById(ref)
      .get()
      .then((user) => new User({ snapshot: user }));
  }

  // userId
  static async getUserByEmail(email: string): Promise<User> {
    return db
      .getDB()
      .collection(CollectionTypes.USERS)
      .where("email", "==", email)
      .get()
      .then(
        (users) =>
          users.docs.length === 1 && new User({ snapshot: users.docs[0] })
      );
  }
}

type UserInternalProperties = {
  id?: firestore.DocumentReference;
  name?: string;
  email?: string;
  password?: string;
  privilege?: Privilege;
};

type UserDisplayProperties = {
  id?: string;
  name?: string;
  email?: string;
  privilege?: string;
};
