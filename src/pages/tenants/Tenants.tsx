import { createTenant, tenants } from "@/api/tenants.api";
import { useAuthStore } from "@/store";
import type { Tenant } from "@/types";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import TenantFilter from "./TenantFilter";
import TenantForm from "./TenantForm";

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
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, isAuthLoading } = useAuthStore();
  const { colorBgLayout } = theme.useToken().token;
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
  const { mutate: createTenantMutation } = useMutation({
    mutationKey: ["tenants"],
    mutationFn: async (tenant: Tenant) => {
      return await createTenant(tenant);
    },
    onSuccess: () => {
      // this will refetch the tenants data
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      setIsDrawerOpen(false);
      form.resetFields();
    },
  });

  const onFormSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    createTenantMutation(values);
  };

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
        styles={{ body: { background: colorBgLayout } }}
        destroyOnHidden={true}
        onClose={() => {
          setIsDrawerOpen(false);
        }}
        extra={
          <Space>
            <Button
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={onFormSubmit} type="primary">
              Submit
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <TenantForm />
        </Form>
      </Drawer>
    </Space>
  );
}

export default Tenants;
