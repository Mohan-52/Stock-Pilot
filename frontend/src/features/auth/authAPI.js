import apiClient from "../../services/apiClient";

export const loginUser = (data) =>
  apiClient.post("/auth/login", data).then((res) => res.data);

export const registerUser = (data) =>
  apiClient.post("/auth/register", data).then((res) => res.data);

export const sendOTP = (email) =>
  apiClient
    .post("/auth/registration/otp/send", null, { params: { email } })
    .then((res) => res.data);

export const verifyOTP = (email, otp) =>
  apiClient
    .post("/auth/registration/otp/verify", { email, otp })
    .then((res) => res.data);

export const completeProfile = (formData) =>
  apiClient
    .put("/auth/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);

export const getCurrentUser = () =>
  apiClient.get("/me").then((res) => res.data);
