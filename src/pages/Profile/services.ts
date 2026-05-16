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
