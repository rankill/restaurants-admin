export const Role = {
  Admin: "admin",
  Owner: "owner",
  Regular: "regular"
};

export const BASE_API_URL = 'http://localhost:4000/v1';
export const REFRESH_TOKEN_URL = `${BASE_API_URL}/refresh-token`;
export const LOGIN_URL = `${BASE_API_URL}/login`;
export const REGISTER_URL = `${BASE_API_URL}/register`;
export const PROFILE_URL = `${BASE_API_URL}/users/me`;
export const USERS_URL = `${BASE_API_URL}/users`;
export const RESTAURANTS_URL = `${BASE_API_URL}/restaurants`;
export const REVIEWS_URL = `${BASE_API_URL}/reviews`;
