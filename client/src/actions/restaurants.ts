import { createAction } from "typesafe-actions";
import { PaginatedRestaurants } from "../models";
import { LngLatBounds } from "mapbox-gl";

export const restaurantsFetch = createAction("Restaurants Fetch")<[LngLatBounds, number]>();
export const restaurantsFetchSuccess = createAction("Restaurants Fetch Success")<PaginatedRestaurants>();
export const restaurantsFetchFailure = createAction("Restaurants Fetch failure")<string>();
