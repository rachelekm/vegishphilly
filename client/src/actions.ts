import { WithDefaultActionHandling } from "redux-loop";
import { ActionType } from "typesafe-actions";

import * as authActions from "./actions/auth";
import * as userActions from "./actions/user";

export type AuthAction = ActionType<typeof authActions>;
export type UserAction = ActionType<typeof userActions>;

export type Action =
    | AuthAction
    | WithDefaultActionHandling<AuthAction>
    | UserAction
    | WithDefaultActionHandling<UserAction>
