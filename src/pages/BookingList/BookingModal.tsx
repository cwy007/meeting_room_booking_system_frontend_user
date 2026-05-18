import { useEffect, useState } from "react";
import { Form, Input, Modal, Select, DatePicker, App } from "antd";
import dayjs from "dayjs";
import type { CreateBookingDto } from "./types";
import { addBooking } from "./services";
import { getMeetingRoomList } from "@/pages/MeetingRoom/services";
import type { MeetingRoom } from "@/pages/MeetingRoom/types";

const { RangePicker } = DatePicker;

interface BookingFormValues {
  meetingRoomId: number;
  timeRange: [dayjs.Dayjs, dayjs.Dayjs];
  note: string;
}

interface Props {
  open: boolean;
  defaultRoomId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

function BookingModal({ open, defaultRoomId, onSuccess, onCancel }: Props) {
  const { message } = App.useApp();
  const [form] = Form.useForm<BookingFormValues>();
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<MeetingRoom[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      form.resetFields();
      setRoomsLoading(true);
      getMeetingRoomList({ page: 1, pageSize: 100 })
        .then((res) => {
          setRooms(res.data.list);
          if (defaultRoomId) {
            form.setFieldValue("meetingRoomId", defaultRoomId);
          }
        })
        .finally(() => setRoomsLoading(false));
    }
  }, [open, form, defaultRoomId]);

  const handleOk = async () => {
    const values = await form.validateFields();
    const dto: CreateBookingDto = {
      meetingRoomId: values.meetingRoomId,
      startTime: values.timeRange[0].valueOf(),
      endTime: values.timeRange[1].valueOf(),
      note: values.note,
    };
    setLoading(true);
    try {
      await addBooking(dto);
      message.success("预订成功");
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="新增预订"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="预订"
      cancelText="取消"
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="meetingRoomId"
          label="会议室"
          rules={[{ required: true, message: "请选择会议室" }]}
        >
          <Select
            placeholder="请选择会议室"
            loading={roomsLoading}
            showSearch
            optionFilterProp="label"
            options={rooms.map((r) => ({
              value: r.id,
              label: `${r.name}（${r.location}，容量 ${r.capacity}）`,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="timeRange"
          label="预订时间段"
          rules={[{ required: true, message: "请选择预订时间段" }]}
        >
          <RangePicker
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            placeholder={["开始时间", "结束时间"]}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item name="note" label="备注" rules={[{ required: true, message: "请输入备注" }]}>
          <Input.TextArea rows={3} placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default BookingModal;
