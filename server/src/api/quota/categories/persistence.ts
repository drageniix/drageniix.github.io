import { BudgetCategory, BudgetCategoryInternalProperties } from ".";
import {
  CollectionTypes,
  DocumentReference,
  documentReferenceType,
  DocumentSnapshot,
  getDocumentReference,
  postModelToCollection,
  updateModel,
} from "../../gateway/persistence";

export const createCategory = (parameters: {
  explicit?: BudgetCategoryInternalProperties;
  snapshot?: DocumentSnapshot;
}): BudgetCategory => new BudgetCategory(parameters);

export const postCategory = async (
  category: BudgetCategory
): Promise<BudgetCategory> => {
  await postModelToCollection(
    category,
    category.userId.collection(CollectionTypes.CATEGORIES)
  );
  return category;
};

export const postCategories = async (
  categories: BudgetCategory[]
): Promise<BudgetCategory[]> =>
  Promise.all(categories.map((category) => postCategory(category)));

export const createAndPostCategory = async (
  explicit: BudgetCategoryInternalProperties
): Promise<BudgetCategory> => postCategory(createCategory({ explicit }));

export const getAllCategories = async (
  userRef: DocumentReference,
  { description }: { description?: string[] } = {}
): Promise<BudgetCategory[]> => {
  let query = userRef
    .collection(CollectionTypes.CATEGORIES)
    .where("active", "==", true);

  if (description) {
    query = query.where("name", "in", description);
  }

  return query
    .get()
    .then((categories) =>
      categories.docs.map((snapshot) => createCategory({ snapshot }))
    );
};

export const getCategory = async (
  userRef: DocumentReference,
  {
    categoryRef,
    plaidCategoryId,
  }: { categoryRef?: documentReferenceType; plaidCategoryId?: string }
): Promise<BudgetCategory> => {
  if (categoryRef) {
    return getCategoryReferenceById(userRef, categoryRef)
      .get()
      .then((category) => category && createCategory({ snapshot: category }));
  } else if (plaidCategoryId) {
    return userRef
      .collection(CollectionTypes.CATEGORIES)
      .where("plaidCategoryIds", "array-contains", plaidCategoryId)
      .get()
      .then(
        (categories) =>
          categories.docs.length === 1 &&
          createCategory({ snapshot: categories.docs[0] })
      );
  } else return null;
};

export const updateCategory = async (
  category: BudgetCategory,
  {
    name,
  }: {
    name: string;
  }
): Promise<BudgetCategory> => {
  category.name = name || category.name;
  await updateModel(category);
  return category;
};

export const getCategoryReferenceById = (
  userRef: DocumentReference,
  category: documentReferenceType
): DocumentReference =>
  getDocumentReference(userRef, category, CollectionTypes.CATEGORIES);

export const deleteCategories = async (
  userId: DocumentReference
): Promise<Date> =>
  userId
    .collection(CollectionTypes.CATEGORIES)
    .get()
    .then((categories) =>
      Promise.all(categories.docs.map((category) => category.ref.delete()))
    )
    .then((results) => results[0] && results[0].writeTime.toDate());
