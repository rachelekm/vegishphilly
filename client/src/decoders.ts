import { JsonDecoder } from "ts.data.json";
import {
    ApiError,
    JWT,
    RefreshedJWT,
    LoginCredentialsError,
    User
} from "./models";

// For "expected" API errors (e.g. failed login, validation errors)
export const apiErrorDecoder = JsonDecoder.object<ApiError>(
    { detail: JsonDecoder.string },
    "ResourceFailure"
);

export const errorArrayDecoder = JsonDecoder.optional(
    JsonDecoder.array(JsonDecoder.string, "Errors")
);

export const authErrorDecoder = JsonDecoder.object<LoginCredentialsError>(
    {
        username: errorArrayDecoder,
        password: errorArrayDecoder,
        non_field_errors: errorArrayDecoder,
        detail: JsonDecoder.optional(JsonDecoder.string),
    },
    "ResourceFailure"
);

export const loginResponseDecoder = JsonDecoder.object<JWT>(
    {
        access: JsonDecoder.string,
        refresh: JsonDecoder.string,
    },
    "JWT"
);

export const jwtRefreshDecoder = JsonDecoder.object<RefreshedJWT>(
    {
        access: JsonDecoder.string,
    },
    "RefreshedJWT"
);

export const userDecoder = JsonDecoder.object<User>(
    {
        id: JsonDecoder.number,
        username: JsonDecoder.string
    },
    "User"
)
