import { History } from "history";

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
