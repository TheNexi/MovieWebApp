import API from "../../api/axios";

export const login = (data: { username: string; password: string }) =>
  API.post("/auth/login", data);

export const register = (data: { username: string; password: string }) =>
  API.post("/auth/register", data);

export const logout = () =>
  API.post("/auth/logout");

export const refresh = () =>
  API.post("/auth/refresh");

export const isAuthorized = () =>
  API.get("/auth/is-authorized");