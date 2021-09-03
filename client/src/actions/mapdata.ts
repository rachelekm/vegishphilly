import { createAction } from "typesafe-actions";
import { mapData } from "../models";

export const setMapData = createAction("Set map data")<mapData>();
