import { Outlet, useNavigate } from "react-router-dom";
import { Layout, Dropdown, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Header, Content } = Layout;

function AppLayout() {
  const navigate = useNavigate();

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: "个人中心",
      onClick: () => navigate("/profile"),
    },
    {
      key: "update-password",
      label: "修改密码",
      onClick: () => navigate("/update-password"),
    },
    { type: "divider" },
    {
      key: "logout",
      label: "退出登录",
      danger: true,
      onClick: () => {
        localStorage.clear();
        navigate("/login");
      },
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          padding: "0 24px",
        }}
      >
        <span
          style={{ fontSize: 18, fontWeight: 600, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          会议室预订系统
        </span>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Avatar icon={<UserOutlined />} style={{ cursor: "pointer" }} />
        </Dropdown>
      </Header>

      <Content style={{ padding: 24 }}>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default AppLayout;
