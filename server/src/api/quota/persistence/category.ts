import {
  CollectionTypes,
  DocumentReference,
  documentReferenceType,
  DocumentSnapshot,
  getDocumentReference,
  postModelToCollection,
  updateModel,
} from "../middleware/persistence";
import BudgetCategory, {
  BudgetCategoryInternalProperties,
} from "../models/Category";

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
    query = query.where("originalName", "in", description);
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
    plaidCategoryName,
  }: { categoryRef?: documentReferenceType; plaidCategoryName?: string[] }
): Promise<BudgetCategory> => {
  if (plaidCategoryName) {
    return userRef
      .collection(CollectionTypes.CATEGORIES)
      .where("originalName", "in", plaidCategoryName)
      .get()
      .then(
        (categories) =>
          categories.docs.length === 1 &&
          createCategory({ snapshot: categories.docs[0] })
      );
  } else if (categoryRef) {
    return getDocumentReference(
      userRef,
      categoryRef,
      CollectionTypes.CATEGORIES
    )
      .get()
      .then((category) => category && createCategory({ snapshot: category }));
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
): DocumentReference => {
  return getDocumentReference(userRef, category, CollectionTypes.CATEGORIES);
};
