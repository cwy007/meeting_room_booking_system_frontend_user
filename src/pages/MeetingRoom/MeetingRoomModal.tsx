import { useEffect, useState } from "react";
import { Form, Input, InputNumber, Modal, App } from "antd";
import type { MeetingRoom, CreateMeetingRoomDto } from "./types";
import { createMeetingRoom, updateMeetingRoom } from "./services";

interface Props {
  open: boolean;
  editing: MeetingRoom | null;
  onSuccess: () => void;
  onCancel: () => void;
}

function MeetingRoomModal({ open, editing, onSuccess, onCancel }: Props) {
  const { message } = App.useApp();
  const [form] = Form.useForm<CreateMeetingRoomDto>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (editing) {
        form.setFieldsValue({
          name: editing.name,
          capacity: editing.capacity,
          location: editing.location,
          equipment: editing.equipment,
          description: editing.description,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editing, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    setLoading(true);
    try {
      if (editing) {
        await updateMeetingRoom({ id: editing.id, ...values });
        message.success("更新成功");
      } else {
        await createMeetingRoom(values);
        message.success("创建成功");
      }
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={editing ? "编辑会议室" : "新建会议室"}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      okText={editing ? "保存" : "创建"}
      cancelText="取消"
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: true, message: "请输入会议室名称" }, { max: 10 }]}
        >
          <Input placeholder="最多 10 个字符" />
        </Form.Item>
        <Form.Item
          name="capacity"
          label="容量"
          rules={[{ required: true, message: "请输入会议室容量" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} placeholder="请输入容量（人数）" />
        </Form.Item>
        <Form.Item
          name="location"
          label="位置"
          rules={[{ required: true, message: "请输入会议室位置" }, { max: 50 }]}
        >
          <Input placeholder="最多 50 个字符" />
        </Form.Item>
        <Form.Item
          name="equipment"
          label="设备"
          rules={[{ required: true, message: "请输入会议室设备" }, { max: 50 }]}
        >
          <Input placeholder="最多 50 个字符" />
        </Form.Item>
        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: "请输入会议室描述" }, { max: 255 }]}
        >
          <Input.TextArea rows={3} placeholder="最多 255 个字符" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MeetingRoomModal;
