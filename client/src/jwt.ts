import { JWT } from "./models";

const JWT_ACCESS_KEY = "jwt-access";
const JWT_REFRESH_KEY = "jwt-refresh";
const JWT_EXPIRATION_KEY = "jwt-exp";

const JWT_EXPIRATION_MS = 1000 * 60 * 5;

export const getJWT = () => {
  const access = localStorage.getItem(JWT_ACCESS_KEY);
  const refresh = localStorage.getItem(JWT_REFRESH_KEY);

  return access && refresh && { access, refresh };
};

export const setJWT = (jwt: JWT) => {
  const expiration = new Date().getTime() + JWT_EXPIRATION_MS;
  localStorage.setItem(JWT_ACCESS_KEY, jwt.access);
  localStorage.setItem(JWT_REFRESH_KEY, jwt.refresh);
  localStorage.setItem(JWT_EXPIRATION_KEY, expiration.toString());
};

export const clearJWT = () => {
  localStorage.removeItem(JWT_ACCESS_KEY);
  localStorage.removeItem(JWT_REFRESH_KEY);
  localStorage.removeItem(JWT_EXPIRATION_KEY);
};

export const jwtIsExpired = () => {
  const exp = Number(localStorage.getItem(JWT_EXPIRATION_KEY));
  return exp < Math.round(new Date().getTime());
};
