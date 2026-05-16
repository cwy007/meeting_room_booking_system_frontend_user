import { Form, Input, Button } from "antd";
import "./index.scss";

interface LoginUser {
  username: string;
  password: string;
}

function Login() {
  const [form] = Form.useForm<LoginUser>();

  const onFinish = (values: LoginUser) => {
    console.log("Received values of form: ", values);
    // Here you can handle the login logic, e.g., send a request to your backend
  };

  return (
    <div id="login-container">
      <h1>会议室预订系统登录</h1>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入密码" }]}>
          <Input.Password placeholder="请输入密码" />
        </Form.Item>

        <Form.Item>
          <div className="links">
            <a href="/signup">创建账号</a>
            <a href="/update-password">忘记密码</a>
          </div>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form.Item>
      </Form>
      {/* Add your login form here */}
    </div>
  );
}

export default Login;
