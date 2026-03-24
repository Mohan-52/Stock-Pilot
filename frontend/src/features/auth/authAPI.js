import apiClient from "../../services/apiClient";

export const loginUser = (data) =>
  apiClient.post("/auth/login", data).then((res) => res.data);

export const registerUser = (data) =>
  apiClient.post("/auth/register", data).then((res) => res.data);
