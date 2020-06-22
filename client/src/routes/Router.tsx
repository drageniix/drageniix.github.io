import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Loading from "../components/Loading";

const HomePage = lazy(() => import("../pages/HomePage"));
const Budget = lazy(() => import("../pages/Budget"));

export const Router = (): React.ReactElement => (
  <BrowserRouter>
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route path="/budget" component={Budget} />
        <Route component={HomePage} />
      </Switch>
    </Suspense>
  </BrowserRouter>
);

export default Router;
