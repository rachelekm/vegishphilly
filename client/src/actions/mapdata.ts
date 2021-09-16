import { createAction } from "typesafe-actions";
import { MapData } from "../models";

export const setMapData = createAction("Set map data")<MapData>();
