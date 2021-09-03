import { LoopReducer } from "redux-loop";
import { getType } from "typesafe-actions";

import { Action } from "../actions";
import {
    setMapData
} from "../actions/mapdata";

import { mapData } from "../models";

export interface mapDataState {
    readonly data: mapData;
}
export const initialState: mapDataState = {
    data: {
        center: { lng: -75.165222, lat: 39.952583 },
        zoom: 7,
        bounds: null
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
