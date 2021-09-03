import { JsonDecoder } from "ts.data.json";
import {
    ApiError,
    JWT,
    RefreshedJWT,
    LoginCredentialsError,
    User,
    RestaurantProperties,
    Point,
    RestaurantFeature,
    Restaurants,
    PaginatedRestaurants
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

const restaurantPropertiesDecoder = JsonDecoder.object<RestaurantProperties>(
    {
        name: JsonDecoder.string,
        address: JsonDecoder.string,
        is_approved: JsonDecoder.boolean,
        average_rating: JsonDecoder.nullable(JsonDecoder.number)
    },
    "Properties"
);

const restaurantPointDecoder = JsonDecoder.object<Point>(
    {
        type: JsonDecoder.isExactly("Point"),
        coordinates: JsonDecoder.tuple([JsonDecoder.number, JsonDecoder.number], "Point"),
    },
    "Geometry"
);

const featureDecoder = JsonDecoder.object<RestaurantFeature>(
    {
        type: JsonDecoder.isExactly("Feature"),
        geometry: restaurantPointDecoder,
        properties: restaurantPropertiesDecoder,
    },
    "RestaurantFeature"
);

export const restaurantsDecoder = JsonDecoder.object<Restaurants>(
    {
        type: JsonDecoder.isExactly("FeatureCollection"),
        features: JsonDecoder.array(featureDecoder, "Features"),
    },
    "Restaurants"
);

export const paginatedRestaurantsDecoder = JsonDecoder.object<PaginatedRestaurants>(
    {
        count: JsonDecoder.number,
        next: JsonDecoder.nullable(JsonDecoder.string),
        previous: JsonDecoder.nullable(JsonDecoder.string),
        results: restaurantsDecoder,
    },
    "Restaurants"
);
