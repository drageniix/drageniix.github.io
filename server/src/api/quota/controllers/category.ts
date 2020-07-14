import { BudgetCategory } from "../models";
import { BudgetCategoryPersistence } from "../persistence";

const {
  createCategory,
  createAndPostCategory,
  getCategory,
  getCategoryReferenceById,
  getAllCategories,
  postCategory,
  updateCategory,
} = BudgetCategoryPersistence;

export {
  BudgetCategory,
  createCategory,
  createAndPostCategory,
  getCategory,
  getCategoryReferenceById,
  getAllCategories,
  postCategory,
  updateCategory,
};

// export const updateCategoryName = async (
//   category: BudgetCategory,
//   name: string
// ): Promise<void> => {
//   category.name = name;
// await BudgetTransaction.getAllTransactions(category.userId, {
//   category: category,
// }).then((transactions) =>
//   Promise.all(
//     transactions.map((transaction) => {
//       transaction.setLinkedValues({
//         categoryName: category.name,
//       });
//       return transaction.update();
//     })
//   )
// );

//   await getAllMonths(category.userId)
//     .then((months) =>
//       Promise.all(
//         months.map((month) =>
//           BudgetMonthCategory.getMonthCategory(category.userId, {
//             month,
//             category: category,
//           })
//         )
//       )
//     )
//     .then((budgetMonthCategories) =>
//       Promise.all(
//         budgetMonthCategories.map((budgetCategory) => {
//           budgetCategory.setLinkedValues({ categoryName: category.name });
//           return budgetCategory.update();
//         })
//       )
//     );
// };

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
