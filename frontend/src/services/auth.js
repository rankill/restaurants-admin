import axios from "axios";

import {
  LOGIN_URL,
  REGISTER_URL,
} from "../config/constants";

export const logout = () => {
  localStorage.removeItem("auth");
};

export const login = async (data) => {
  try {
    const response = await axios.post(LOGIN_URL, data);
    return response.data;
  } catch (e) {
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const register = async (data) => {
  try {
    const response = await axios.post(REGISTER_URL, data);
    return response.data;
  } catch (e) {
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

