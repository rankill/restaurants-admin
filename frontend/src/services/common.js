import axios from "axios";
import moment from "moment-timezone";
import { REFRESH_TOKEN_URL } from "../config/constants";

export const authHeader = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const { accessToken } = auth.token;
  const requestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  return requestConfig;
};

export const refreshToken = async () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const { expiresIn, refreshToken } = auth.token;
  const { email } = auth.user;
  if (moment().add(20, "minutes") > moment(expiresIn)) {
    try {
      const response = await axios.post(REFRESH_TOKEN_URL, {
        email,
        refreshToken,
      });
      auth.token = response.data;
      localStorage.setItem("auth", JSON.stringify(auth));
    } catch (e) {
      console.log(e);
    }
  }
};

export const logout = () => {
  localStorage.removeItem("auth");
};
