import axios from "axios";
import globalMessage from "./globalMessage";

const request = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
});

request.interceptors.response.use(
  (response) => response.data,
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
