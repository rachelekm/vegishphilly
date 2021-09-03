import { Cmd, Loop, loop, LoopReducer } from "redux-loop";
import { getType } from "typesafe-actions";

import { Action } from "../actions";
import {
    restaurantsFetch,
    restaurantsFetchSuccess,
    restaurantsFetchFailure
} from "../actions/restaurants";

import { fetchRestaurants } from "../api";
import { PaginatedRestaurants } from "../models";
import { Resource } from "../resource";

interface RestaurantsResource {
    readonly restaurants: PaginatedRestaurants;
}

export type RestaurantsState = Resource<RestaurantsResource>;

export const initialState: RestaurantsState = {
    isPending: false,
};

const restaurantsReducer: LoopReducer<RestaurantsState, Action> = (
    state: RestaurantsState = initialState,
    action: Action
): RestaurantsState | Loop<RestaurantsState> => {
    switch (action.type) {
        case getType(restaurantsFetch):
            return loop(
                {
                    isPending: true,
                },
                Cmd.run(fetchRestaurants, {
                    successActionCreator: restaurantsFetchSuccess,
                    failActionCreator: restaurantsFetchFailure,
                    args: action.payload as Parameters<typeof fetchRestaurants>,
                })
            );
        case getType(restaurantsFetchSuccess):
            return {
                resource: {
                    restaurants: action.payload,
                },
            };
        case getType(restaurantsFetchFailure):
            return {
                errorMessage: action.payload,
            };
        default:
            return state;
    }
};

export default restaurantsReducer;
