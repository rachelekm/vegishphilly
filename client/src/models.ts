import { History } from "history";
import { Feature, FeatureCollection, Point as GeojsonPoint } from "geojson";

export interface LoginCredentials {
    readonly username?: string;
    readonly password?: string
};

export interface JWT {
    readonly access: string;
    readonly refresh: string;
};

export type RefreshedJWT = Pick<JWT, "access">;

export interface ApiError {
    readonly detail: string;
};

export type ErrorMap<D> = { readonly [P in keyof D]?: readonly string[] } & {
    readonly non_field_errors?: readonly string[];
};

export interface LoginCredentialsError extends ErrorMap<LoginCredentials> {
    readonly detail?: string;
};

export interface PathTransition {
    readonly nextPath: string;
    readonly history: History;
};

export type UserId = number;

export interface User {
    readonly id: UserId;
    readonly username: string;

};

export interface RestaurantProperties {
    readonly name: string;
    readonly address: string;
    readonly is_approved: boolean
}

type NoBbox<T> = Omit<T, "bbox" | "id">;

export type Point = NoBbox<GeojsonPoint>;

export type RestaurantFeature = NoBbox<Feature<Point, RestaurantProperties>>;

export type Restaurants = NoBbox<FeatureCollection<GeojsonPoint, RestaurantProperties>>;
