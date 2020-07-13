import db, {
  CollectionTypes,
  DocumentReference,
  documentReferenceType,
  DocumentSnapshot,
  getDocumentReference,
  postModelToCollection,
  updateModel,
} from "../middleware/persistence";
import {
  BudgetUserInternalProperties,
  default as BudgetUser,
} from "../models/User";

export const createUser = (parameters: {
  explicit?: BudgetUserInternalProperties;
  snapshot?: DocumentSnapshot;
}): BudgetUser => new BudgetUser(parameters);

export const updateUser = async (
  model: BudgetUser,
  { name, email, privilege }: BudgetUserInternalProperties
): Promise<BudgetUser> => {
  name && (model.name = name);
  email && (model.email = email);
  privilege && (model.privilege = privilege);
  await updateModel(model);
  return model;
};

export const postUser = async (model: BudgetUser): Promise<BudgetUser> => {
  await postModelToCollection(
    model,
    db.getDB().collection(CollectionTypes.USERS)
  );
  return model;
};

export const createAndPostUser = (
  explicit: BudgetUserInternalProperties
): Promise<BudgetUser> => postUser(createUser({ explicit }));

export const getUserReferenceById = (
  ref: documentReferenceType
): DocumentReference => {
  return getDocumentReference(db.getDB(), ref, CollectionTypes.USERS);
};

export const getUserById = async (
  ref: documentReferenceType
): Promise<BudgetUser> => {
  return getUserReferenceById(ref)
    .get()
    .then((user) => createUser({ snapshot: user }));
};

export const getUserByEmail = async (email: string): Promise<BudgetUser> => {
  return db
    .getDB()
    .collection(CollectionTypes.USERS)
    .where("email", "==", email)
    .get()
    .then(
      (users) =>
        users.docs.length === 1 && createUser({ snapshot: users.docs[0] })
    );
};
