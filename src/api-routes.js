import { accountApi } from "./api/account-api.js";

export const apiRoutes = [
  {
    method: "POST",
    path: "/api/users",
    config: accountApi.create
  },
  {
    method: "GET",
    path: "/api/users",
    config: accountApi.find
  },
];
