import { Cmd, Loop, loop, LoopReducer } from "redux-loop";
import { getType } from "typesafe-actions";

import { Action } from "../actions";
import { setCredentials, loginAttempt, loginSuccess, loginFailure, logout } from "../actions/auth";

import { submitLogin, logoutApi } from "../api";
import { WriteResource } from "../resource";
import { LoginCredentials } from "../models";

export type AuthState = WriteResource<LoginCredentials, void>;

export const initialState: AuthState = {
    data: { username: "", password: "" },
};

// In Redux, your reducer listens for actions which may optionally have a
// payload. Each type of action is handled separately within the reducer to
// return a new state object based on some logic. `redux-loop` handles effects
// within the reducer, so now instead of just returning a new state object (eg.
// `TodoState`) we may also return a `Loop` which wraps the new state plus some
// effect (very often a `Cmd.run`).

const authReducer: LoopReducer<AuthState, Action> = (
    state: AuthState = initialState,
    action: Action
): AuthState | Loop<AuthState> => {
    switch (action.type) {
        case getType(setCredentials):
            return {
                data: action.payload,
            };
        case getType(loginAttempt): {
            return loop(
                {
                    data: state.data,
                    isPending: true,
                },
                Cmd.run(submitLogin, {
                    successActionCreator: loginSuccess,
                    failActionCreator: loginFailure,
                    args: [state.data, action.payload.successNav] as Parameters<typeof submitLogin>,
                })
            );
        }
        case getType(loginSuccess):
            return {
                data: state.data,
                resource: void 0,
            };
        case getType(loginFailure):
            return {
                data: state.data,
                errorMessage: action.payload,
            };
        case getType(logout):
            return loop(
                {
                    data: { username: "", password: "" },
                },
                Cmd.run(() => {
                    action.payload.history.push(action.payload.nextPath);
                    logoutApi();
                })
            );
        default:
            return state;
    }
};

export default authReducer;
