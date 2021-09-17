import React from 'react';
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';

import Error from "./components/Error";
import HomePage from "./pages/HomePage";

import { State } from "./reducers";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" component={HomePage} />
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

