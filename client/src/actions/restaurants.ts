import { createAction } from "typesafe-actions";
import { Restaurants } from "../models";
import { LngLatBounds } from "mapbox-gl";

export const restaurantsFetch = createAction("Restaurants Fetch")<LngLatBounds | null>();
export const restaurantsFetchSuccess = createAction("Restaurants Fetch Success")<Restaurants>();
export const restaurantsFetchFailure = createAction("Restaurants Fetch failure")<string>();
