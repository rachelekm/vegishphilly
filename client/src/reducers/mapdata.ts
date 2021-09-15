import { LoopReducer } from "redux-loop";
import { getType } from "typesafe-actions";

import { Action } from "../actions";
import {
    setMapData
} from "../actions/mapdata";

import { mapData } from "../models";
import mapboxgl from "mapbox-gl";

export interface MapDataState {
    readonly data: mapData;
}

//default bounds for Philadelphia
const sw = new mapboxgl.LngLat(-73.2371, 41.7289);
const ne = new mapboxgl.LngLat(-77.0933, 38.1288);
const deafult_bounds = new mapboxgl.LngLatBounds(sw, ne);

export const initialState: MapDataState = {
    data: {
        center: null,
        zoom: null,
        bounds: deafult_bounds
    }
};

const mapDataReducer: LoopReducer<MapDataState, Action> = (
    state: MapDataState = initialState,
    action: Action
): MapDataState => {
    switch (action.type) {
        case getType(setMapData):
            return {
                data: action.payload,
            };
        default:
            return state;
    }
};

export default mapDataReducer;
