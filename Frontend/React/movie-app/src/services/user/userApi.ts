import API from "../../api/axios";
import type { User } from "./userTypes";

export const getMe = () =>
  API.get<User>("/users/me");

export const getFavourites = () =>
  API.get<User>("/users/favourites");

export const editUser = (data: Partial<User>) =>
  API.patch<User>("/users/edit", data);