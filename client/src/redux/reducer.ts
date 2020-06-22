import budget from "./budget/transformer";
import { ApplicationState } from "./types/application.types";

const initialState: ApplicationState = {
  message: "Hello World?",
  budget,
};

export default (
  state = initialState,
  { type, payload }: { type: string; payload?: any }
): ApplicationState => {
  switch (type) {
    default:
      return { ...state };
  }
};
