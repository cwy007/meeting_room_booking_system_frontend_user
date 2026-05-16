import type { ApiResponse } from "../../common/types";
import request from "../../utils/request";
import type { UpdateUserDto, UserDetailVo } from "./types";

export function getUserInfo() {
  return request.get<never, ApiResponse<UserDetailVo>>("/user/info");
}

export function updateUser(data: UpdateUserDto) {
  return request.post<never, ApiResponse<string>>("/user/update", data);
}

export function getUpdateCaptcha() {
  return request.get<never, ApiResponse<string>>("/user/update/captcha");
}

export function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request.post<never, ApiResponse<string>>("/user/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
