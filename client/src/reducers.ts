import { combineReducers } from "redux-loop";
import authReducer, { AuthState, initialState as initialAuthState } from "./reducers/auth";
import userReducer, { initialState as initialUserState, UserState } from "./reducers/user";
import restaurantsReducer, { initialState as initialRestaurantsState, RestaurantsState } from "./reducers/restaurants";

export interface State {
    readonly auth: AuthState;
    readonly loggedInUser: UserState;
    readonly restaurants: RestaurantsState;
}

export const initialState: State = {
    auth: initialAuthState,
    loggedInUser: initialUserState,
    restaurants: initialRestaurantsState,
}

export default combineReducers({
    auth: authReducer,
    loggedInUser: userReducer,
    restaurants: restaurantsReducer,
})
