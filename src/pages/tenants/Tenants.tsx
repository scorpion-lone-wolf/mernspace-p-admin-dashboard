import { createTenant, tenants, updateTenant } from "@/api/tenants.api";
import { useAuthStore } from "@/store";
import type { Tenant, UpdateTenantPayload } from "@/types";
import { LoadingOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Breadcrumb, Button, Drawer, Flex, Form, Space, Spin, Table, theme, Typography } from "antd";
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
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
function Tenants() {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [editableTenant, setEditableTenant] = useState<UpdateTenantPayload | null>(null);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [filters, setFilters] = useState({
    search: "",
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useAuthStore();
  const { colorBgLayout } = theme.useToken().token;

  React.useEffect(() => {
    if (editableTenant) {
      form.setFieldsValue({
        name: editableTenant.name,
        address: editableTenant.address,
      });
    }
  }, [editableTenant, form]);

  const clearDrawer = () => {
    form.resetFields();
    setEditableTenant(null);
    setIsDrawerOpen(false);
  };

  const {
    data: tenantData,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["tenants", page, limit, filters],
    queryFn: async () => {
      return (await tenants(page, limit, filters)).data;
    },
    placeholderData: keepPreviousData,
  });

  const { mutate: updateTenantMutation } = useMutation({
    mutationKey: ["tenants"],
    mutationFn: async (tenant: Tenant) => {
      const id = tenant.id;
      return await updateTenant({ ...tenant }, id);
    },
    onSuccess: () => {
      // this will refetch the tenants data
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      setIsDrawerOpen(false);
      form.resetFields();
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
    // check if we are editing or adding new Resturant/Tenant
    if (editableTenant) {
      updateTenantMutation({ ...editableTenant, ...values });
      return;
    }
    // creating a new resturant
    createTenantMutation(values);
  };

  const onFilterChange = useDebouncedCallback(() => {
    const values = filterForm.getFieldsValue();
    setPage(1);
    setFilters({
      search: values.search,
    });
  }, 500);

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace={true} />;
  }

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
                  <Link to="/resturants">Resturants</Link>
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
        <TenantFilter>
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
      </Form>
      {/* This is the users table */}
      {tenantData && (
        <Table
          columns={[
            ...columns,
            {
              title: "Action",
              key: "action",
              render: (_, record: UpdateTenantPayload) => {
                return (
                  <Space>
                    <Button
                      type="link"
                      onClick={() => {
                        setEditableTenant(record);
                        setIsDrawerOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </Space>
                );
              },
            },
          ]}
          dataSource={tenantData.data}
          loading={isFetching}
          rowKey={"id"}
          pagination={{
            current: page,
            pageSize: limit,
            total: tenantData?.total ?? 0,
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
        title={editableTenant ? "Edit Resturant" : "Add a new Resturants"}
        open={isDrawerOpen}
        size={720}
        styles={{ body: { background: colorBgLayout } }}
        destroyOnHidden={true}
        onClose={() => {
          clearDrawer();
        }}
        extra={
          <Space>
            <Button
              onClick={() => {
                clearDrawer();
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
