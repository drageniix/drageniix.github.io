import { firestore } from "firebase-admin";
import {
  CollectionTypes,
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
  model: BudgetCategory
): Promise<BudgetCategory> => {
  await postModelToCollection(
    model,
    model.userId.collection(CollectionTypes.CATEGORIES)
  );
  return model;
};

export const createAndPostCategory = async (
  explicit: BudgetCategoryInternalProperties
): Promise<BudgetCategory> => postCategory(createCategory({ explicit }));

export const getAllCategories = async (
  userRef: firestore.DocumentReference,
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
  userRef: firestore.DocumentReference,
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

const updateCategoryName = async (
  model: BudgetCategory,
  name: string
): Promise<void> => {
  model.name = name;

  // await BudgetTransaction.getAllTransactions(model.userId, {
  //   category: model,
  // }).then((transactions) =>
  //   Promise.all(
  //     transactions.map((transaction) => {
  //       transaction.setLinkedValues({
  //         categoryName: model.name,
  //       });
  //       return transaction.update();
  //     })
  //   )
  // );

  //   await getAllMonths(model.userId)
  //     .then((months) =>
  //       Promise.all(
  //         months.map((month) =>
  //           BudgetMonthCategory.getMonthCategory(model.userId, {
  //             month,
  //             category: model,
  //           })
  //         )
  //       )
  //     )
  //     .then((budgetMonthCategories) =>
  //       Promise.all(
  //         budgetMonthCategories.map((budgetCategory) => {
  //           budgetCategory.setLinkedValues({ categoryName: model.name });
  //           return budgetCategory.update();
  //         })
  //       )
  //     );
};

export const updateCategory = async (
  model: BudgetCategory,
  {
    name,
  }: {
    name: string;
  }
): Promise<BudgetCategory> => {
  name && (await updateCategoryName(model, name));
  await updateModel(model);
  return model;
};

// const addAllCategoriesToDB = () => {
//   let categoryMap: {
//     [key: string]: { sub?: string[]; subSub?: string[] };
//   } = {};
//   await getPlaidCategories().then(({ categories }) => {
//     categories.forEach((category) => {
//       if (categoryMap[category.hierarchy[0]]) {
//         category.hierarchy.forEach((hierarchy, index) => {
//           if (index === 1)
//             hierarchy &&
//               !categoryMap[category.hierarchy[0]].sub.includes(hierarchy) &&
//               categoryMap[category.hierarchy[0]].sub.push(hierarchy);
//           if (index == 2)
//             hierarchy &&
//               !categoryMap[category.hierarchy[0]].subSub.includes(hierarchy) &&
//               categoryMap[category.hierarchy[0]].subSub.push(hierarchy);
//         });
//       } else {
//         categoryMap[category.hierarchy[0]] = {
//           sub: [],
//           subSub: [],
//         };

//         if (category.hierarchy[1]) {
//           categoryMap[category.hierarchy[0]].sub.push(category.hierarchy[1]);
//         }

//         if (category.hierarchy[2]) {
//           categoryMap[category.hierarchy[0]].subSub.push(category.hierarchy[2]);
//         }
//       }
//     });

//     return Promise.all(
//       Object.entries(categoryMap).map(([key, value]) =>
//         createCategory({
//           explicit: {
//             name: key,
//             originalName: key,
//             subCategories: value.sub,
//             subSubCategories: value.subSub,
//             userId: db.getDB(),
//           },
//         }).post()
//       )
//     );
//   });
