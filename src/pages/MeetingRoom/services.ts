import type { ApiResponse } from "@/common/types";
import request from "@/common/utils/request";
import type { MeetingRoomListParams, MeetingRoomListVo, CreateMeetingRoomDto, UpdateMeetingRoomDto, MeetingRoom } from "./types";

export function getMeetingRoomList(params: MeetingRoomListParams) {
  return request.get<never, ApiResponse<MeetingRoomListVo>>("/meeting-room/list", { params });
}

export function createMeetingRoom(data: CreateMeetingRoomDto) {
  return request.post<never, ApiResponse<MeetingRoom>>("/meeting-room/create", data);
}

export function updateMeetingRoom(data: UpdateMeetingRoomDto) {
  return request.put<never, ApiResponse<MeetingRoom>>("/meeting-room/update", data);
}

export function deleteMeetingRoom(id: number) {
  return request.delete<never, ApiResponse<string>>(`/meeting-room/${id}`);
}
