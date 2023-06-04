import axios from "axios";
import { omitBy, isNil } from "lodash";
import { USERS_URL, PROFILE_URL } from "../config/constants";
import { authHeader, refreshToken, logout } from "./common";

export const fetchUsers = async (params = {}) => {
  try {
    params = omitBy(params, isNil);
    const query = Object.keys(params)
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");
    const response = await axios.get(`${USERS_URL}?${query}`, authHeader());
    refreshToken();
    return response.data;
  } catch (e) {
    if (e.response && e.response.status === 401) {
      logout();
    }
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const fetchUser = async (userId) => {
  try {
    const response = await axios.get(`${USERS_URL}/${userId}`, authHeader());
    refreshToken();
    return response.data;
  } catch (e) {
    if (e.response && e.response.status === 401) {
      logout();
    }
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const createUser = async (data) => {
  try {
    const response = await axios.post(USERS_URL, data, authHeader());
    refreshToken();
    return response.data;
  } catch (e) {
    if (e.response && e.response.status === 401) {
      logout();
    }
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const updateUser = async (userId, data) => {
  try {
    const response = await axios.patch(
      `${USERS_URL}/${userId}`,
      data,
      authHeader()
    );
    refreshToken();
    return response.data;
  } catch (e) {
    if (e.response && e.response.status === 401) {
      logout();
    }
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${USERS_URL}/${userId}`, authHeader());
    refreshToken();
    return response.data;
  } catch (e) {
    if (e.response && e.response.status === 401) {
      logout();
    }
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await axios.patch(PROFILE_URL, data, authHeader());
    refreshToken();
    return response.data;
  } catch (e) {
    if (e.response && e.response.status === 401) {
      logout();
    }
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};
