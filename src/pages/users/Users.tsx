import { users } from "@/api/users.api";
import { useAuthStore, type User } from "@/store";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Button, Drawer, Form, Space, Table, theme, type TableColumnsType } from "antd";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import UserForm from "./UserForm";
import UsersFilter from "./UsersFilter";

const columns: TableColumnsType<User> = [
  { title: "Customer name", dataIndex: "firstName", key: "fullName", render: (_text, record) => record.firstName + " " + record.lastName },
  { title: "Email", dataIndex: "email", key: "email" },
  { title: "Role", dataIndex: "role", key: "role" },
  { title: "Tenant", dataIndex: "tenant", key: "tenant", render: (text) => text?.name || "--" },
];
function handleFilterChange(filterName: string, filterValue: string) {
  console.log(filterName, filterValue);
}
function Users() {
  const { colorBgLayout } = theme.useToken().token;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, isAuthLoading } = useAuthStore();
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return (await users()).data;
    },
  });
  if (isAuthLoading) {
    return <div>Loading...</div>;
  }
  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <Space vertical className="w-full" size="large">
      <Breadcrumb
        separator={<RightOutlined />}
        items={[
          {
            title: <Link to="/">Dashboard</Link>,
          },
          {
            title: (
              <strong>
                <Link to="/users">users</Link>
              </strong>
            ),
          },
        ]}
      />

      {isLoading && <div>Loading...</div>}
      {error && <div>{error.message}</div>}
      {/*  Add FIlters  */}
      <UsersFilter onFilterChange={handleFilterChange}>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            setIsDrawerOpen(true);
          }}
        >
          <Space>
            <PlusOutlined />
            Create Users
          </Space>
        </Button>
      </UsersFilter>
      {/* This is the users table */}
      {userData && <Table columns={columns} dataSource={userData.data} rowKey={(record) => record.id} />}
      {/* Drawer component for adding new users */}
      <Drawer
        title="Create a new user"
        open={isDrawerOpen}
        styles={{
          body: {
            background: colorBgLayout,
          },
        }}
        size={720}
        destroyOnHidden={true}
        onClose={() => {
          setIsDrawerOpen(false);
        }}
        extra={
          <Space>
            <Button onClick={() => {}}>Cancel</Button>
            <Button onClick={() => {}} type="primary">
              Submit
            </Button>
          </Space>
        }
      >
        <Form layout="vertical">
          <UserForm />
        </Form>
      </Drawer>
    </Space>
  );
}

export default Users;
