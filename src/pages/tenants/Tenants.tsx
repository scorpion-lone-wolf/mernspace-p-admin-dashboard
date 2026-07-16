import { tenants } from "@/api/tenants.api";
import { useAuthStore } from "@/store";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Button, Drawer, Space, Table } from "antd";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import TenantFilter from "./TenantFilter";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];
function handleFilterChange(filterName: string, filterValue: string) {
  console.log(filterName, filterValue);
}
function Tenants() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, isAuthLoading } = useAuthStore();
  const {
    data: tenantData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      return (await tenants()).data;
    },
  });
  if (isAuthLoading) {
    return <div>Loading...</div>;
  }
  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace={true} />;
  }
  console.log("tenantdata", tenantData);

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
                <Link to="/resturants">Resturants</Link>
              </strong>
            ),
          },
        ]}
      />

      {isLoading && <div>Loading...</div>}
      {error && <div>{error.message}</div>}
      {/*  Add FIlters  */}
      <TenantFilter onFilterChange={handleFilterChange}>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            setIsDrawerOpen(true);
          }}
        >
          <Space>
            <PlusOutlined />
            Create Resturant
          </Space>
        </Button>
      </TenantFilter>
      {/* This is the users table */}
      {tenantData && <Table columns={columns} dataSource={tenantData.data} rowKey={"id"} />}
      {/* Drawer component for adding new users */}
      <Drawer
        title="Add a new Resturants"
        open={isDrawerOpen}
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
      ></Drawer>
    </Space>
  );
}

export default Tenants;
