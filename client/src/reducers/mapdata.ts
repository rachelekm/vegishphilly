import { LoopReducer } from "redux-loop";
import { getType } from "typesafe-actions";

import { Action } from "../actions";
import {
    setMapData
} from "../actions/mapdata";

import { mapData } from "../models";
import mapboxgl from "mapbox-gl";

export interface mapDataState {
    readonly data: mapData;
}

//default bounds for Philadelphia
const sw = new mapboxgl.LngLat(-73.2371, 41.7289);
const ne = new mapboxgl.LngLat(-77.0933, 38.1288);
const deafult_bounds = new mapboxgl.LngLatBounds(sw, ne);

export const initialState: mapDataState = {
    data: {
        center: null,
        zoom: null,
        bounds: deafult_bounds
    }
};

const mapDataReducer: LoopReducer<mapDataState, Action> = (
    state: mapDataState = initialState,
    action: Action
): mapDataState => {
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
