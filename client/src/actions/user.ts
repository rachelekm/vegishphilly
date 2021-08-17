import { createAction } from "typesafe-actions";
import { User } from "../models";

export const userFetch = createAction("Fetch logged in user")();
export const userFetchSuccess = createAction("Fetch logged in user success")<User>();
export const userFetchFailure = createAction("Fetch logged in user failure")<string>();
