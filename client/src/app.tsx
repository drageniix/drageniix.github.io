import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import Router from "./routes/Router";
import store from "./redux/store";

export const App = (): React.ReactElement => (
  <Provider store={store}>
    <Router />
  </Provider>
);

if (!process.env.NODE_ENV) {
  throw "No Environmentt Set!";
}

render(<App />, document.getElementById("content"));
