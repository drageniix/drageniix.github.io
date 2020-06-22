import React from "react";
import { connect } from "react-redux";
import { Category } from "../../redux/types/budget.types";
import { ApplicationState } from "../../redux/types/application.types";

export const Categories = ({
  categories,
}: {
  categories: Category[];
}): React.ReactElement => {
  return (
    <ul>
      {categories.map(
        ({ id, name, category_group_name, activity, balance }) => (
          <li className="budget_line" key={id}>
            <span className="budget_line_category">{category_group_name}</span>
            <span className="budget_line_category">{name}</span>
            <span className="budget_line_amount">${activity.toFixed(2)}</span>
            <span className="budget_line_amount">${balance.toFixed(2)}</span>
          </li>
        )
      )}
    </ul>
  );
};

const mapStateToProps = (
  state: ApplicationState
): { categories: Category[] } => ({
  categories: state.budget.categories.filter(
    (category) => category.category_group_name !== "Internal Master Category"
  ),
});

export default connect(mapStateToProps)(Categories);
