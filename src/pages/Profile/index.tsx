import { useState, useEffect } from "react";
import { Form, Input, Button, Avatar, message, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./index.scss";
import { updateUser, getUpdateCaptcha, getUserInfo } from "./services";
import type { UpdateUserDto, UserDetailVo } from "./types";

function Profile() {
  const [userInfo, setUserInfo] = useState<UserDetailVo | null>(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm<UpdateUserDto>();
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    getUserInfo()
      .then((res) => {
        if (res.code === 200) {
          setUserInfo(res.data);
          form.setFieldsValue({
            nickName: res.data.nickName,
            headPic: res.data.headPic,
            email: res.data.email,
          });
        }
      })
      .catch(() => {
        // 错误已在请求拦截器中统一提示
      })
      .finally(() => setLoading(false));
  }, [form]);

  const handleSendCaptcha = async () => {
    setCaptchaLoading(true);
    try {
      const res = await getUpdateCaptcha();
      if (res.code === 200) {
        message.success("验证码已发送，请查收邮件");
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        message.error(res.message || "发送失败，请重试");
      }
    } catch {
      // 错误已在请求拦截器中统一提示
    } finally {
      setCaptchaLoading(false);
    }
  };

  const onFinish = async (values: UpdateUserDto) => {
    try {
      const res = await updateUser(values);
      if (res.code === 200) {
        message.success("个人信息更新成功");
        setUserInfo((prev) =>
          prev
            ? {
                ...prev,
                nickName: values.nickName ?? prev.nickName,
                headPic: values.headPic ?? prev.headPic,
                email: values.email,
              }
            : prev,
        );
        form.setFieldsValue({ captcha: "" });
      } else {
        message.error(res.message || "更新失败，请重试");
      }
    } catch {
      // 错误已在请求拦截器中统一提示
    }
  };

  return (
    <div id="profile-container">
      <Spin spinning={loading}>
        <div className="avatar-wrapper">
          <Avatar
            size={80}
            src={userInfo?.headPic || undefined}
            icon={!userInfo?.headPic ? <UserOutlined /> : undefined}
          />
          <span style={{ fontWeight: 600, fontSize: 16 }}>{userInfo?.username}</span>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            nickName: userInfo?.nickName,
            headPic: userInfo?.headPic,
            email: userInfo?.email,
          }}
        >
          <Form.Item label="头像地址" name="headPic">
            <Input placeholder="请输入头像 URL" />
          </Form.Item>

          <Form.Item label="昵称" name="nickName">
            <Input placeholder="请输入昵称" />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "请输入有效的邮箱地址" },
            ]}
          >
            <Input disabled placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item label="验证码" required>
            <div className="captcha-row">
              <Form.Item
                name="captcha"
                noStyle
                rules={[{ required: true, message: "请输入验证码" }]}
              >
                <Input placeholder="请输入验证码" />
              </Form.Item>
              <Button
                type="primary"
                onClick={handleSendCaptcha}
                loading={captchaLoading}
                disabled={countdown > 0}
              >
                {countdown > 0 ? `${countdown}s 后重新发送` : "发送验证码"}
              </Button>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
}

export default Profile;
