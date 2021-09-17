import axios, { AxiosRequestConfig } from "axios";
import { LngLatBounds } from "mapbox-gl";
import { JsonDecoder } from "ts.data.json";
import {
    apiErrorDecoder,
    authErrorDecoder,
    jwtRefreshDecoder,
    loginResponseDecoder,
    userDecoder,
    paginatedRestaurantsDecoder,
} from "./decoders";
import { clearJWT, getJWT, jwtIsExpired, setJWT } from "./jwt";
import {
    LoginCredentials,
    PaginatedRestaurants,
    PathTransition,
    User
} from "./models";

async function decodeResponse<T>(
    decoder: JsonDecoder.Decoder<T>,
    responseData: unknown
): Promise<T> {
    return decoder.decodeToPromise(responseData);
}

// API for anonymous requests, which will not send the JWT header
const anonApi = axios.create();

const api = axios.create();

function setAxiosAuthHeaders(config: AxiosRequestConfig): void {
    const jwt = getJWT();
    if (jwt) {
        // Disabling 'functional/immutable-data' without naming it.
        // See https://github.com/jonaskello/eslint-plugin-functional/issues/105
        // eslint-disable-next-line
        config.headers.common["Authorization"] = `Bearer ${jwt.access}`;
    } else {
        logoutApi();
        clearJWT();
    }
}

async function refreshTokenIfNeeded(): Promise<void> {
    const jwt = getJWT();
    if (!jwt || !jwtIsExpired()) {
        return;
    }

    return new Promise((resolve, reject) => {
        anonApi
            .post("/api/token/refresh/", { refresh: jwt.refresh })
            .then((response) =>
                decodeResponse(jwtRefreshDecoder, response.data)
                    .then(({ access }) => {
                        const newJwt = { ...jwt, access };
                        setJWT(newJwt);
                        resolve();
                    })
                    .catch(reject)
            )
            .catch((error) => {
                logoutApi();
                return error.response
                    ? decodeResponse(apiErrorDecoder, error.response.data)
                        .then((failure) => reject(failure.detail))
                        .catch(reject)
                    : reject(`JWT refresh failed: ${error}`);
            });
    });
}

// Set axios headers for each request, refeshing the token beforehand if needed
api.interceptors.request.use(async (config) => {
    await refreshTokenIfNeeded();
    setAxiosAuthHeaders(config);
    return config;
});

export async function submitLogin(
    credentials: LoginCredentials,
    successNav: PathTransition
): Promise<void> {
    return new Promise((resolve, reject) => {
        anonApi
            .post("/api/token/", { ...credentials })
            .then((response) =>
                decodeResponse(loginResponseDecoder, response.data)
                    .then((jwt) => {
                        setJWT(jwt);
                        successNav.history.push(successNav.nextPath);
                        resolve();
                    })
                    .catch(reject)
            )
            .catch((error) => {
                return error.response
                    ? decodeResponse(authErrorDecoder, error.response.data)
                        .then((failure) => reject(failure))
                        .catch(reject)
                    : reject(`Login failed: ${error}`);
            });
    });
}

export function logoutApi() {
    // Disabling 'functional/immutable-data' without naming it.
    // See https://github.com/jonaskello/eslint-plugin-functional/issues/105
    // eslint-disable-next-line
    delete api.defaults.headers.common.Authorization;
    clearJWT();
}

export async function fetchCurrentUser(): Promise<User> {
    return new Promise((resolve, reject) => {
        api
            .get(`/api/user/current`)
            .then((response) => decodeResponse(userDecoder, response.data).then(resolve).catch(reject))
            .catch((error) => {
                return error.response
                    ? decodeResponse(apiErrorDecoder, error.response.data)
                        .then((failure) => reject(failure.detail))
                        .catch(reject)
                    : reject(`Unable to fetch logged in user: ${error}`);
            });
    });
}

export async function fetchRestaurants(bounds: LngLatBounds, pag_count: number): Promise<PaginatedRestaurants> {
    return new Promise((resolve, reject) => {
        let bounds_string = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`
        api
            .get(`/api/restaurants/?in_bbox=${bounds_string}&page=${pag_count}`)
            .then((response) => decodeResponse(paginatedRestaurantsDecoder, response.data).then(resolve).catch(reject))
            .catch((error) => {
                return error.response
                    ? decodeResponse(apiErrorDecoder, error.response.data)
                        .then((failure) => reject(failure.detail))
                        .catch(reject)
                    : reject(`Unable to fetch logged in user: ${error}`);
            });
    });
}
