import type { ApiResponse } from "@/common/types";
import request from "@/common/utils/request";
import type { BookingListParams, BookingListVo, CreateBookingDto, Booking } from "./types";

export function getBookingList(params: BookingListParams) {
  return request.get<never, ApiResponse<BookingListVo>>("/booking/list", { params });
}

export function approveBooking(id: number) {
  return request.get<never, ApiResponse<number>>(`/booking/approve/${id}`);
}

export function rejectBooking(id: number) {
  return request.get<never, ApiResponse<number>>(`/booking/reject/${id}`);
}

export function releaseBooking(id: number) {
  return request.get<never, ApiResponse<number>>(`/booking/release/${id}`);
}

export function addBooking(data: CreateBookingDto) {
  return request.post<never, ApiResponse<Booking>>("/booking/add", data);
}
