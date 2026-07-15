import { users } from "@/api/users.api";
import { useAuthStore, type User } from "@/store";
import { RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Space, Table, type TableColumnsType } from "antd";
import { Link, Navigate } from "react-router-dom";
import UsersFilter from "./UsersFilter";

const columns: TableColumnsType<User> = [
  { title: "Customer name", dataIndex: "firstName", key: "fullName", render: (_text, record) => record.firstName + " " + record.lastName },
  { title: "Email", dataIndex: "email", key: "email" },
  { title: "Role", dataIndex: "role", key: "role" },
  { title: "Tenant", dataIndex: "tenant", key: "tenant", render: (text) => text?.name || "--" },
];

function Users() {
  function handleFilterChange(filterName: string, filterValue: string) {
    console.log(filterName, filterValue);
  }
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
  console.log("Filter");
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
      <UsersFilter onFilterChange={handleFilterChange} />
      {/* This is the users table */}
      {userData && <Table columns={columns} dataSource={userData.data} rowKey={(record) => record.id} />}
    </Space>
  );
}

export default Users;
