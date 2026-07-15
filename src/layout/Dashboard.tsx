import { logout } from "@/api/auth.api";
import BasketIcon from "@/components/icons/BasketIcon";
import { foodIcon } from "@/components/icons/FoodIcon";
import GiftIcon from "@/components/icons/GiftIcon";
import HomeIcon from "@/components/icons/HomeIcon";
import Logo from "@/components/icons/LogoIcon";
import UserIcon from "@/components/icons/UserIcon";
import { useAuthStore } from "@/store";
import Icon, { BellFilled, DownOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Avatar, Badge, Dropdown, Flex, Layout, Menu, Space, Tag, theme } from "antd";
import { useState } from "react";
import { Link, Navigate, NavLink, Outlet, useLocation } from "react-router-dom";

const { Sider, Header, Content, Footer } = Layout;

const getMenuItems = (role: string) => {
  const baseItems = [
    {
      key: "/",
      label: <NavLink to="/">Home</NavLink>,
      icon: <Icon component={HomeIcon} />,
    },

    {
      key: "/resturants",
      label: <NavLink to="/resturants">Resturants</NavLink>,
      icon: <Icon component={foodIcon} />,
    },
    {
      key: "/products",
      label: <NavLink to="/products">Products</NavLink>,
      icon: <Icon component={BasketIcon} />,
    },
    {
      key: "/promo",
      label: <NavLink to="/promo">Promo</NavLink>,
      icon: <Icon component={GiftIcon} />,
    },
  ];
  if (role === "ADMIN") {
    baseItems.splice(1, 0, {
      key: "/users",
      label: <NavLink to="/users">Users</NavLink>,
      icon: <Icon component={UserIcon} />,
    });
  }
  return baseItems;
};

function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();
  // This will decide if the below protected route should be rendered or not
  // We will check the store, if we have user data , then user is authenticated and allowed to see this page else not (we will redirect them to login page)
  const { user, isAuthLoading, logout: logoutFromState } = useAuthStore();
  const { mutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: () => {
      logoutFromState();
    },
  });

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // user is not logged in
    // redirect to login page
    return <Navigate to="/auth/login" replace={true} />;
  }
  return (
    <div>
      {/* All this here will be common to all routes */}
      <Layout style={{ minHeight: "100vh" }}>
        <Sider theme="light" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div style={{ color: "white", height: "64px" }} className="logo">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <Menu theme="light" selectedKeys={[location.pathname]} mode="inline" items={getMenuItems(user?.role)} />
        </Sider>
        <Layout>
          <Header style={{ paddingLeft: "1rem", paddingRight: "1rem", background: colorBgContainer }}>
            <Flex align="center" gap="middle" justify="space-between">
              <Tag color={colorPrimary}>{user.role === "ADMIN" ? "You are an Admin" : user?.tenant?.name}</Tag>
              <Space size="medium">
                <Badge dot>
                  <BellFilled color={colorPrimary} size={100} />
                </Badge>
                <Avatar style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}>U</Avatar>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "/logout",
                        label: "logout",
                        onClick: () => mutate(),
                      },
                    ],
                  }}
                >
                  <DownOutlined />
                </Dropdown>
              </Space>
            </Flex>
          </Header>
          <Content style={{ margin: "0 16px" }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
              }}
            >
              <Outlet />
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}> MernSpace Pizza Shop</Footer>
        </Layout>
      </Layout>
    </div>
  );
}

export default Dashboard;
