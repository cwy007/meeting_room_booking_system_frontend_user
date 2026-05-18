export type BookingStatus = 'APPLYING' | 'APPROVED' | 'REJECTED' | 'RELEASED';

export interface BookingUser {
  id: number;
  username: string;
  nickName: string;
  email: string;
  headPic: string;
  phoneNumber: string;
  isFrozen: boolean;
  isAdmin: boolean;
}

export interface BookingRoom {
  id: number;
  name: string;
  capacity: number;
  location: string;
  equipment: string;
  description: string;
  isBooked: boolean;
}

export interface Booking {
  id: number;
  status: BookingStatus;
  user: BookingUser;
  room: BookingRoom;
  startTime: string;
  endTime: string;
  note: string;
  createTime: string;
  updateTime: string;
}

export interface BookingListVo {
  list: Booking[];
  totalCount: number;
}

export interface BookingListParams {
  page: number;
  pageSize: number;
  username: string;
  roomName: string;
  roomLocation: string;
  bookingTimeRangeStart: number;
  bookingTimeRangeEnd: number;
}

export interface CreateBookingDto {
  meetingRoomId: number;
  startTime: number;
  endTime: number;
  note: string;
}
