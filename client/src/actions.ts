import { WithDefaultActionHandling } from "redux-loop";
import { ActionType } from "typesafe-actions";

import * as authActions from "./actions/auth";
import * as userActions from "./actions/user";
import * as restaurantsActions from "./actions/restaurants";
import * as mapDataActions from "./actions/mapdata";

export type AuthAction = ActionType<typeof authActions>;
export type UserAction = ActionType<typeof userActions>;
export type RestaurantsAction = ActionType<typeof restaurantsActions>;
export type mapDataAction = ActionType<typeof mapDataActions>;

export type Action =
    | AuthAction
    | WithDefaultActionHandling<AuthAction>
    | UserAction
    | WithDefaultActionHandling<UserAction>
    | RestaurantsAction
    | WithDefaultActionHandling<RestaurantsAction>
    | mapDataAction
