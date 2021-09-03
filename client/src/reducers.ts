import { combineReducers } from "redux-loop";
import authReducer, { AuthState, initialState as initialAuthState } from "./reducers/auth";
import userReducer, { initialState as initialUserState, UserState } from "./reducers/user";
import restaurantsReducer, { initialState as initialRestaurantsState, RestaurantsState } from "./reducers/restaurants";
import mapDataReducer, { initialState as initialMapDataState, mapDataState } from "./reducers/mapdata"

export interface State {
    readonly auth: AuthState;
    readonly loggedInUser: UserState;
    readonly restaurants: RestaurantsState;
    readonly mapData: mapDataState
}

export const initialState: State = {
    auth: initialAuthState,
    loggedInUser: initialUserState,
    restaurants: initialRestaurantsState,
    mapData: initialMapDataState
}

export default combineReducers({
    auth: authReducer,
    loggedInUser: userReducer,
    restaurants: restaurantsReducer,
    mapData: mapDataReducer
})
