const ACCESS_TOKEN_KEY = "accessToken";

export const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const clearAuth = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};
