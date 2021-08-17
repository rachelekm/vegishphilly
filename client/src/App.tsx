import React from 'react';
import { connect } from "react-redux";
import { BrowserRouter as Router, Redirect, Route, RouteProps, Switch } from "react-router-dom";
import './App.css';

import Error from "./components/Error";
import Loading from "./components/Loading";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

import { getJWT } from "./jwt";
import { State } from "./reducers";
import { UserState } from "./reducers/user";

const PrivateRoute = ({ component, user, ...props }: { readonly user: UserState } & RouteProps) => {
    const savedJWT = getJWT();
    return !savedJWT || "errorMessage" in user ? (
        <Redirect to="/auth" />
    ) : (
        <Route component={component} {...props} />
    );
};

function App({ loggedInUser }: { readonly loggedInUser: UserState }) {
    return "isPending" in loggedInUser && loggedInUser.isPending ? (
        <Loading />
    ) : (
        <Router>
            <Switch>
                <Route path="/auth" component={AuthPage} />
                <PrivateRoute path="/" component={HomePage} user={loggedInUser} />
                <Route component={Error} />
            </Switch>
        </Router>
    );
}

function mapStateToProps(state: State) {
    return {
        loggedInUser: state.loggedInUser,
    };
}

export default connect(mapStateToProps)(App);

