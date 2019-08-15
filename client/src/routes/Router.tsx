import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import HomePage from '../pages/HomePage';

export const Router = (): React.ReactElement => (
    <BrowserRouter>
        <Switch>
            <Route component={HomePage} />
        </Switch>
    </BrowserRouter>
);

export default Router;
