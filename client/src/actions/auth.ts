import { createAction } from "typesafe-actions";
import { LoginCredentials, PathTransition, ErrorMap } from "../models";

export const setCredentials = createAction("Set login")<LoginCredentials>();
export const loginAttempt = createAction("Login attempt")<{
    readonly successNav: PathTransition;
}>();
export const loginSuccess = createAction("Login success")();
export const loginFailure = createAction("Login failure")<ErrorMap<LoginCredentials>>();
export const logout = createAction("Logout")<PathTransition>();
