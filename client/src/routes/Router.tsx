import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Loading from "../components/Loading";

const HomePage = lazy(() => import("../pages/HomePage"));
const Quota = lazy(() => import("../pages/Quota"));

export const Router = (): React.ReactElement => (
  <BrowserRouter>
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route path="/quota" component={Quota} />
        <Route component={HomePage} />
      </Switch>
    </Suspense>
  </BrowserRouter>
);

export default Router;
