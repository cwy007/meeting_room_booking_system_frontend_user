import { useState, useEffect, useCallback } from "react";
import { Form, Input, InputNumber, Button, Table, Tag, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import type { MeetingRoom, MeetingRoomListParams } from "./types";
import { getMeetingRoomList } from "./services";
import MeetingRoomModal from "./MeetingRoomModal";
import BookingModal from "@/pages/BookingList/BookingModal";

function MeetingRoomList() {
  const [form] = Form.useForm<Pick<MeetingRoomListParams, "name" | "capacity" | "equipment">>();
  const [data, setData] = useState<MeetingRoom[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  // 弹窗状态
  const [modalOpen, setModalOpen] = useState(false);
  const [editing] = useState<MeetingRoom | null>(null);

  // 预订弹窗
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingRoomId, setBookingRoomId] = useState<number | undefined>();

  const openBooking = (record: MeetingRoom) => {
    setBookingRoomId(record.id);
    setBookingModalOpen(true);
  };

  const fetchData = useCallback(
    async (
      currentPage: number,
      currentPageSize: number,
      filters?: Pick<MeetingRoomListParams, "name" | "capacity" | "equipment">,
    ) => {
      setLoading(true);
      try {
        const params: MeetingRoomListParams = {
          page: currentPage,
          pageSize: currentPageSize,
          name: filters?.name ?? "",
          capacity: filters?.capacity ?? 0,
          equipment: filters?.equipment ?? "",
        };
        const res = await getMeetingRoomList(params);
        setData(res.data.list);
        setTotal(res.data.totalAccount);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchData(1, pageSize);
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

  const columns: TableProps<MeetingRoom>["columns"] = [
    { title: "名称", dataIndex: "name" },
    { title: "容量", dataIndex: "capacity", width: 80 },
    { title: "位置", dataIndex: "location" },
    { title: "设备", dataIndex: "equipment" },
    { title: "描述", dataIndex: "description", ellipsis: true },
    {
      title: "状态",
      dataIndex: "isBooked",
      width: 100,
      render: (isBooked: boolean) =>
        isBooked ? <Tag color="warning">已预订</Tag> : <Tag color="success">空闲</Tag>,
    },
    {
      title: "添加时间",
      dataIndex: "createTime",
      render: (val: string) => new Date(val).toLocaleDateString("zh-CN"),
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      render: (val: string) => new Date(val).toLocaleDateString("zh-CN"),
    },
    // {
    //   title: "操作",
    //   key: "action",
    //   render: (_: unknown, record: MeetingRoom) => (
    //     <Space>
    //       <Button size="small" type="link" onClick={() => openEdit(record)}>
    //         编辑
    //       </Button>
    //       <Button size="small" type="link" danger onClick={() => handleDelete(record)}>
    //         删除
    //       </Button>
    //     </Space>
    //   ),
    // },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: MeetingRoom) => (
        <Space>
          <Button size="small" type="link" onClick={() => openBooking(record)}>
            预订
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Form
        form={form}
        layout="inline"
        style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 16 }}
      >
        <Form.Item name="name" label="名称">
          <Input placeholder="请输入会议室名称" allowClear />
        </Form.Item>
        <Form.Item name="capacity" label="容量">
          <InputNumber placeholder="最小容量" min={0} style={{ width: 120 }} />
        </Form.Item>
        <Form.Item name="equipment" label="设备">
          <Input placeholder="请输入设备名称" allowClear />
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

      {/* <div style={{ marginBottom: 16, display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建会议室
        </Button>
      </div> */}

      <Table<MeetingRoom>
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

      <MeetingRoomModal
        open={modalOpen}
        editing={editing}
        onSuccess={() => {
          setModalOpen(false);
          fetchData(page, pageSize, form.getFieldsValue());
        }}
        onCancel={() => setModalOpen(false)}
      />

      <BookingModal
        open={bookingModalOpen}
        defaultRoomId={bookingRoomId}
        onSuccess={() => setBookingModalOpen(false)}
        onCancel={() => setBookingModalOpen(false)}
      />
    </div>
  );
}

export default MeetingRoomList;
