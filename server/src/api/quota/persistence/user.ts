import db, {
  CollectionTypes,
  DocumentReference,
  documentReferenceType,
  DocumentSnapshot,
  getDocumentReference,
  postModelToCollection,
  updateModel,
} from "../middleware/persistence";
import BudgetUser, { BudgetUserInternalProperties } from "../models/User";

export const createUser = (parameters: {
  explicit?: BudgetUserInternalProperties;
  snapshot?: DocumentSnapshot;
}): BudgetUser => new BudgetUser(parameters);

export const updateUser = async (
  user: BudgetUser,
  { name, email, privilege }: BudgetUserInternalProperties
): Promise<BudgetUser> => {
  name && (user.name = name);
  email && (user.email = email);
  privilege && (user.privilege = privilege);
  await updateModel(user);
  return user;
};

export const postUser = async (user: BudgetUser): Promise<BudgetUser> => {
  await postModelToCollection(
    user,
    db.getDB().collection(CollectionTypes.USERS)
  );
  return user;
};

export const createAndPostUser = (
  explicit: BudgetUserInternalProperties
): Promise<BudgetUser> => postUser(createUser({ explicit }));

export const getUserReferenceById = (
  userId: documentReferenceType
): DocumentReference => {
  return getDocumentReference(db.getDB(), userId, CollectionTypes.USERS);
};

export const getUserById = async (
  userId: documentReferenceType
): Promise<BudgetUser> => {
  return getUserReferenceById(userId)
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
