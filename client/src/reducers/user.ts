import { Cmd, Loop, loop, LoopReducer } from "redux-loop";
import { getType } from "typesafe-actions";

import { Action } from "../actions";
import {
    userFetch,
    userFetchFailure,
    userFetchSuccess,
} from "../actions/user";

import { fetchCurrentUser } from "../api";
import { User } from "../models";
import { Resource } from "../resource";

export type UserState = Resource<User>;

export const initialState: UserState = {
    isPending: false,
};

const usersReducer: LoopReducer<UserState, Action> = (
    state: UserState = initialState,
    action: Action
): UserState | Loop<UserState> => {
    switch (action.type) {
        case getType(userFetch): {
            return loop(
                {
                    isPending: true,
                },
                Cmd.run(fetchCurrentUser, {
                    successActionCreator: userFetchSuccess,
                    failActionCreator: userFetchFailure,
                    args: [] as Parameters<typeof fetchCurrentUser>,
                })
            );
        }
        case getType(userFetchSuccess):
            return {
                resource: action.payload,
            };
        case getType(userFetchFailure):
            return {
                errorMessage: action.payload,
            };
        default:
            return state;
    }
};

export default usersReducer;
