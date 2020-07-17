import { BudgetUser, BudgetUserInternalProperties } from ".";
import db, {
  CollectionTypes,
  DocumentReference,
  documentReferenceType,
  DocumentSnapshot,
  getDocumentReference,
  postModelToCollection,
  updateModel,
} from "../gateway/persistence";

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
    db.getDB(CollectionTypes.QUOTA).collection(CollectionTypes.USERS)
  );
  return user;
};

export const createAndPostUser = (
  explicit: BudgetUserInternalProperties
): Promise<BudgetUser> => postUser(createUser({ explicit }));

export const getUserReferenceById = (
  userId: documentReferenceType
): DocumentReference =>
  getDocumentReference(
    db.getDB(CollectionTypes.QUOTA),
    userId,
    CollectionTypes.USERS
  );

export const getUser = async ({
  userId,
  email,
}: {
  userId?: documentReferenceType;
  email?: string;
}): Promise<BudgetUser> =>
  userId
    ? getUserReferenceById(userId)
        .get()
        .then((user) => createUser({ snapshot: user }))
    : db
        .getDB(CollectionTypes.QUOTA)
        .collection(CollectionTypes.USERS)
        .where("email", "==", email)
        .get()
        .then(
          (users) =>
            users.docs.length === 1 && createUser({ snapshot: users.docs[0] })
        );
