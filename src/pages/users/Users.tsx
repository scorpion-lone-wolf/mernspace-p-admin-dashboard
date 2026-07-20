import { createUser, updateUser, users } from "@/api/users.api";
import { useAuthStore } from "@/store";
import type { CreateUserPayload, UpdateUserPayload, User } from "@/types";
import { LoadingOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Breadcrumb, Button, Drawer, Flex, Form, Space, Spin, Table, theme, Typography, type TableColumnsType } from "antd";
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import UserForm from "./UserForm";
import UsersFilter from "./UsersFilter";

const columns: TableColumnsType<User> = [
  { title: "Customer name", dataIndex: "firstName", key: "fullName", render: (_text, record) => record.firstName + " " + record.lastName },
  { title: "Email", dataIndex: "email", key: "email" },
  { title: "Role", dataIndex: "role", key: "role" },
  { title: "Tenant", dataIndex: "tenant", key: "tenant", render: (text) => text?.name || "--" },
];

function Users() {
  const queryClient = useQueryClient();
  const [editableUser, setEditableUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const { user } = useAuthStore();
  const [filters, setFilters] = useState({
    search: "",
    role: "",
  });
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const { colorBgLayout } = theme.useToken().token;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const closeDrawer = () => {
    form.resetFields();
    setEditableUser(null);
    setIsDrawerOpen(false);
  };

  React.useEffect(() => {
    if (editableUser) {
      form.setFieldsValue({
        firstName: editableUser.firstName,
        lastName: editableUser.lastName,
        email: editableUser.email,
        role: editableUser.role,
        tenantId: editableUser.tenant?.id,
      });
    }
  }, [editableUser, form]);

  const {
    data: userData,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["users", page, limit, filters],
    queryFn: async () => {
      return (await users(page, limit, filters)).data;
    },
    placeholderData: keepPreviousData,
  });

  const { mutate: createUserMutation, isPending: isCreateUserPending } = useMutation({
    mutationKey: ["users"],
    mutationFn: async (user: CreateUserPayload) => {
      return await createUser(user);
    },
    onSuccess: () => {
      // this will refetch the users data
      queryClient.invalidateQueries({ queryKey: ["users"] });
      closeDrawer();
    },
  });
  const { mutate: updateUserMutation, isPending: isUpdateUserPending } = useMutation({
    mutationKey: ["users", editableUser?.id],
    mutationFn: async ({ id, user }: { id: string; user: UpdateUserPayload }) => {
      return await updateUser(id, user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      closeDrawer();
    },
  });
  const onFilterChange = useDebouncedCallback(() => {
    const values = filterForm.getFieldsValue();
    // set page back to 1 before applying filters
    setPage(1);
    setFilters({
      search: values.search,
      role: values.role,
    });
  }, 500);

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace={true} />;
  }

  const onHandleSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();

    const { firstName, lastName, email, role, password, tenantId } = values;
    if (editableUser) {
      const updatePayload: UpdateUserPayload = { firstName, lastName, email, role, tenantId };

      if (password) {
        updatePayload.password = password;
      }

      updateUserMutation({ id: editableUser.id, user: updatePayload });
      return;
    }

    createUserMutation({ firstName, lastName, email, role, password, tenantId });
  };

  return (
    <Space vertical className="w-full" size="large">
      <Flex justify="space-between">
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
        {isFetching && <Spin indicator={<LoadingOutlined spin />} />}
        {error && <Typography.Text type="danger">{error.message}</Typography.Text>}
      </Flex>

      {/*  Add FIlters  */}
      <Form form={filterForm} onFieldsChange={onFilterChange}>
        <UsersFilter>
          <Button
            type="primary"
            size="large"
            onClick={() => {
              form.resetFields();
              setEditableUser(null);
              setIsDrawerOpen(true);
            }}
          >
            <Space>
              <PlusOutlined />
              Create Users
            </Space>
          </Button>
        </UsersFilter>
      </Form>
      {/* This is the users table */}
      {userData && (
        <Table
          columns={[
            ...columns,
            {
              title: "Action",
              key: "actions",
              render: (_text: string, record: User) => {
                return (
                  <Space>
                    <Button
                      type="link"
                      onClick={() => {
                        setEditableUser(record);
                        setIsDrawerOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    {/* <Button
                      type="link"
                      onClick={() => {
                        console.log("Delete");
                        console.log(record);
                      }}
                    >
                      Delete
                    </Button> */}
                  </Space>
                );
              },
            },
          ]}
          dataSource={userData.data}
          loading={isFetching}
          rowKey={"id"}
          pagination={{
            current: page,
            pageSize: limit,
            total: userData?.total ?? 0,
            showSizeChanger: false,
            showTotal(total, range) {
              return `${range[0]}-${range[1]} of ${total} items`;
            },
            onChange: (newPage) => {
              setPage(newPage);
            },
          }}
        />
      )}
      {/* Drawer component for adding new users */}
      <Drawer
        title={editableUser ? "Edit user" : "Create a new user"}
        open={isDrawerOpen}
        styles={{
          body: {
            background: colorBgLayout,
          },
        }}
        size={720}
        destroyOnHidden={true}
        onClose={closeDrawer}
        extra={
          <Space>
            <Button onClick={closeDrawer}>Cancel</Button>
            <Button onClick={onHandleSubmit} type="primary" loading={isCreateUserPending || isUpdateUserPending}>
              {editableUser ? "Update" : "Submit"}
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <UserForm isEditMode={Boolean(editableUser)} />
        </Form>
      </Drawer>
    </Space>
  );
}

export default Users;
// Steps to edit a user
// 1. get the user data from the table actiom
// 2. save on state inside the container
// 3. open the drawer
// 4. prefill the form with the user data
