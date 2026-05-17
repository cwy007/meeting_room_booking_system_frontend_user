export interface MeetingRoom {
  id: number;
  name: string;
  capacity: number;
  location: string;
  equipment: string;
  description: string;
  isBooked: boolean;
  createTime: string;
  updateTime: string;
}

export interface MeetingRoomListVo {
  list: MeetingRoom[];
  totalAccount: number;
}

export interface MeetingRoomListParams {
  page: number;
  pageSize: number;
  name?: string;
  capacity?: number;
  equipment?: string;
}

export interface CreateMeetingRoomDto {
  name: string;
  capacity: number;
  location: string;
  equipment: string;
  description: string;
}

export interface UpdateMeetingRoomDto extends Partial<CreateMeetingRoomDto> {
  id: number;
}
name ?: string;
capacity ?: number;
equipment ?: string;
}
