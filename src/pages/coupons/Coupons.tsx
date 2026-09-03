import { createCoupon, getCoupons, getTenants, updateCoupon } from "@/api/api";
import { useAuthStore } from "@/store";
import type { Coupon, CreateCouponPayload, UpdateCouponPayload } from "@/types";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Breadcrumb, Button, Drawer, Flex, Form, Space, Table, Tag, theme, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import CouponForm from "./CouponForm";

function Coupons() {
  const { user } = useAuthStore();
  const [form] = Form.useForm();
  const [editableCoupon, setEditableCoupon] = useState<Coupon | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const queryClient = useQueryClient();
  const { colorBgLayout } = theme.useToken().token;
  const isAdmin = user?.role === "ADMIN";

  const { data: couponData, isFetching, error } = useQuery({
    queryKey: ["coupons", page, limit, isAdmin ? undefined : user?.tenant?.id],
    queryFn: async () => (await getCoupons(page, limit, isAdmin ? undefined : user?.tenant?.id)).data,
    placeholderData: keepPreviousData,
  });
  const { data: tenantData } = useQuery({
    queryKey: ["tenants", "coupon-table"],
    queryFn: async () => (await getTenants(1, 100)).data,
    enabled: isAdmin,
  });

  useEffect(() => {
    if (editableCoupon) {
      form.setFieldsValue({ ...editableCoupon, validUpto: dayjs(editableCoupon.validUpto) });
    }
  }, [editableCoupon, form]);

  const closeDrawer = () => {
    form.resetFields();
    setEditableCoupon(null);
    setIsDrawerOpen(false);
  };

  const refreshCoupons = async () => {
    await queryClient.invalidateQueries({ queryKey: ["coupons"], refetchType: "active" });
    closeDrawer();
  };

  const { mutate: createCouponMutation, isPending: isCreating } = useMutation({
    mutationFn: createCoupon,
    onSuccess: refreshCoupons,
  });
  const { mutate: updateCouponMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, coupon }: { id: string; coupon: UpdateCouponPayload }) => updateCoupon(id, coupon),
    onSuccess: refreshCoupons,
  });

  const onSubmit = async () => {
    const values = await form.validateFields();
    const coupon = {
      ...values,
      code: values.code.trim().toUpperCase(),
      validUpto: values.validUpto.toISOString(),
      tenant: isAdmin ? values.tenant : user?.tenant?.id,
    } as CreateCouponPayload;

    if (editableCoupon) {
      updateCouponMutation({ id: editableCoupon._id, coupon });
      return;
    }
    createCouponMutation(coupon);
  };

  if (user?.role !== "ADMIN" && user?.role !== "MANAGER") {
    return <Navigate to="/" replace />;
  }

  return (
    <Space vertical className="w-full" size="large">
      <Flex justify="space-between">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[{ title: <Link to="/">Dashboard</Link> }, { title: <strong>Coupons</strong> }]}
        />
        {error && <Typography.Text type="danger">{error.message}</Typography.Text>}
      </Flex>

      <Button
        type="primary"
        size="large"
        onClick={() => {
          form.resetFields();
          setEditableCoupon(null);
          setIsDrawerOpen(true);
        }}
      >
        <Space>
          <PlusOutlined />
          Create Coupon
        </Space>
      </Button>

      <Table<Coupon>
        columns={[
          { title: "Title", dataIndex: "title", key: "title" },
          { title: "Code", dataIndex: "code", key: "code", render: (code: string) => <Tag color="blue">{code}</Tag> },
          { title: "Discount", dataIndex: "discount", key: "discount", render: (discount: number) => `${discount}%` },
          { title: "Valid until", dataIndex: "validUpto", key: "validUpto", render: (date: string) => dayjs(date).format("DD MMM YYYY") },
          ...(isAdmin
            ? [
                {
                  title: "Restaurant",
                  dataIndex: "tenant",
                  key: "tenant",
                  render: (tenantId: string) =>
                    tenantData?.data.find((tenant: { id: string; name: string }) => tenant.id === tenantId)?.name ?? tenantId,
                },
              ]
            : []),
          {
            title: "Action",
            key: "action",
            render: (_value: unknown, record: Coupon) => (
              <Button type="link" onClick={() => { setEditableCoupon(record); setIsDrawerOpen(true); }}>
                Edit
              </Button>
            ),
          },
        ]}
        dataSource={couponData?.data}
        loading={isFetching}
        rowKey="_id"
        pagination={{
          current: page,
          pageSize: limit,
          total: couponData?.total ?? 0,
          showSizeChanger: false,
          onChange: setPage,
        }}
      />

      <Drawer
        title={editableCoupon ? "Edit Coupon" : "Create Coupon"}
        open={isDrawerOpen}
        size={720}
        destroyOnHidden
        onClose={closeDrawer}
        styles={{ body: { background: colorBgLayout } }}
        extra={
          <Space>
            <Button onClick={closeDrawer}>Cancel</Button>
            <Button type="primary" onClick={onSubmit} loading={isCreating || isUpdating}>
              {editableCoupon ? "Update" : "Create"}
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <CouponForm isAdmin={isAdmin} />
        </Form>
      </Drawer>
    </Space>
  );
}

export default Coupons;
