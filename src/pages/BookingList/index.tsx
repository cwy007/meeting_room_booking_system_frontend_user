import { useState, useEffect, useCallback } from "react";
import { Form, Input, Button, Table, Tag, Space, DatePicker, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import type { Booking, BookingListParams, BookingStatus } from "./types";
import { getBookingList, releaseBooking } from "./services";
import BookingModal from "./BookingModal";

const { RangePicker } = DatePicker;

const STATUS_MAP: Record<BookingStatus, { label: string; color: string }> = {
  APPLYING: { label: "申请中", color: "processing" },
  APPROVED: { label: "审批通过", color: "success" },
  REJECTED: { label: "审批驳回", color: "error" },
  RELEASED: { label: "已解除", color: "default" },
};

interface SearchFormValues {
  roomName: string;
  roomLocation: string;
  timeRange?: [dayjs.Dayjs, dayjs.Dayjs];
}

function BookingList() {
  const [form] = Form.useForm<SearchFormValues>();
  const [data, setData] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [username] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo") ?? "{}")?.username ?? "";
    } catch {
      return "";
    }
  });

  const fetchData = useCallback(
    async (currentPage: number, currentPageSize: number, filters?: SearchFormValues) => {
      setLoading(true);
      try {
        const timeRange = filters?.timeRange;
        const params: BookingListParams = {
          page: currentPage,
          pageSize: currentPageSize,
          username: username ?? "",
          roomName: filters?.roomName ?? "",
          roomLocation: filters?.roomLocation ?? "",
          bookingTimeRangeStart: timeRange ? timeRange[0].valueOf() : 0,
          bookingTimeRangeEnd: timeRange ? timeRange[1].valueOf() : 0,
        };
        const res = await getBookingList(params);
        setData(res.data.list);
        setTotal(res.data.totalCount);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchData(1, pageSize, { roomName: "", roomLocation: "" });
  }, [fetchData, pageSize]);

  const onSearch = () => {
    setPage(1);
    fetchData(1, pageSize, form.getFieldsValue());
  };

  const onReset = () => {
    form.resetFields();
    setPage(1);
    fetchData(1, pageSize);
  };

  const onPageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
    fetchData(newPage, newPageSize, form.getFieldsValue());
  };

  const handleRelease = async (record: Booking) => {
    await releaseBooking(record.id);
    message.success("已解除");
    fetchData(page, pageSize, form.getFieldsValue());
  };

  const columns: TableProps<Booking>["columns"] = [
    { title: "ID", dataIndex: "id", width: 70 },
    {
      title: "预订人",
      dataIndex: ["user", "username"],
    },
    {
      title: "会议室",
      dataIndex: ["room", "name"],
    },
    {
      title: "会议室位置",
      dataIndex: ["room", "location"],
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      render: (val: string) => dayjs(val).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "结束时间",
      dataIndex: "endTime",
      render: (val: string) => dayjs(val).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 110,
      render: (status: BookingStatus) => {
        const { label, color } = STATUS_MAP[status] ?? { label: status, color: "default" };
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "备注",
      dataIndex: "note",
      ellipsis: true,
    },
    {
      title: "预订时间",
      dataIndex: "createTime",
      render: (val: string) => dayjs(val).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (_: unknown, record: Booking) => (
        <Space>
          {(record.status === "APPLYING" || record.status === "APPROVED") && (
            <Button size="small" type="link" danger onClick={() => handleRelease(record)}>
              解除
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const disabledDate: RangePickerProps["disabledDate"] = () => false;

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          新增预订
        </Button>
      </div>
      <Form
        form={form}
        layout="inline"
        style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 16 }}
      >
        <Form.Item label="预订人">
          <Input placeholder="请输入用户名" disabled style={{ width: 160 }} value={username} />
        </Form.Item>
        <Form.Item name="roomName" label="会议室">
          <Input placeholder="请输入会议室名称" allowClear style={{ width: 160 }} />
        </Form.Item>
        <Form.Item name="roomLocation" label="位置">
          <Input placeholder="请输入会议室位置" allowClear style={{ width: 160 }} />
        </Form.Item>
        <Form.Item name="timeRange" label="预订开始时间">
          <RangePicker
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            disabledDate={disabledDate}
            placeholder={["开始时间", "结束时间"]}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
              搜索
            </Button>
            <Button onClick={onReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>

      <Table<Booking>
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          pageSizeOptions: [5, 10, 20, 50],
          showSizeChanger: true,
          total,
          showTotal: (t) => `共 ${t} 条`,
          onChange: onPageChange,
        }}
      />
      <BookingModal
        open={modalOpen}
        onSuccess={() => {
          setModalOpen(false);
          fetchData(page, pageSize, form.getFieldsValue());
        }}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}

export default BookingList;
