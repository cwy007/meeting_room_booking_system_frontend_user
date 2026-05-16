import axios from "axios";
import globalMessage from "./globalMessage";

const request = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => {
    if (response.data?.code === 401) {
      globalMessage.instance?.error("登录状态已过期，请重新登录");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userInfo");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return Promise.reject("未授权");
    }

    return response.data;
  },
  (error) => {
    const errMsg: string =
      error.response?.data?.data ??
      error.response?.data?.message ??
      error.message ??
      "请求失败，请重试";
    globalMessage.instance?.error(errMsg);
    return Promise.reject(errMsg);
  }
);

export default request;
