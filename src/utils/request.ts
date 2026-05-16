import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
});

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error.response?.data ?? error.message);
  }
);

export default request;
