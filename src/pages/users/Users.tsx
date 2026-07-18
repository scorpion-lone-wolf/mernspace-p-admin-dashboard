import { createUser, users } from "@/api/users.api";
import { useAuthStore } from "@/store";
import type { User } from "@/types";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [form] = Form.useForm();
  const { colorBgLayout } = theme.useToken().token;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, isAuthLoading } = useAuthStore();
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", page, limit],
    queryFn: async () => {
      return (await users(page, limit)).data;
    },
  });

  const { mutate: createUserMutation } = useMutation({
    mutationKey: ["users"],
    mutationFn: async (user: User) => {
      return await createUser(user);
    },
    onSuccess: () => {
      // this will refetch the users data
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDrawerOpen(false);
      form.resetFields();
    },
  });
  if (isAuthLoading) {
    return <div>Loading...</div>;
  }
  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace={true} />;
  }

  const onHandleSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();

    const { firstName, lastName, email, role, password, tenantId } = values;
    createUserMutation({ firstName, lastName, email, role, password, tenantId });
    form.resetFields();
  };

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
      {userData && (
        <Table
          columns={columns}
          dataSource={userData.data}
          rowKey={"id"}
          pagination={{
            current: page,
            pageSize: limit,
            total: userData?.total ?? 0,
            showSizeChanger: false,
            onChange: (newPage) => {
              setPage(newPage);
            },
          }}
        />
      )}
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
          form.resetFields();
          setIsDrawerOpen(false);
        }}
        extra={
          <Space>
            <Button
              onClick={() => {
                form.resetFields();
                setIsDrawerOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={onHandleSubmit} type="primary">
              Submit
            </Button>
          </Space>
        }
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={() => {
            console.log("Heere");
          }}
        >
          <UserForm />
        </Form>
      </Drawer>
    </Space>
  );
}

export default Users;
