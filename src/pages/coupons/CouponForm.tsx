import { getTenants } from "@/api/api";
import { Col, DatePicker, Form, Input, InputNumber, Row, Select } from "antd";
import { useQuery } from "@tanstack/react-query";

function CouponForm({ isAdmin }: { isAdmin: boolean }) {
  const { data: tenantData } = useQuery({
    queryKey: ["tenants", "coupon-form"],
    queryFn: async () => (await getTenants(1, 100)).data,
    enabled: isAdmin,
  });

  return (
    <Row gutter={20}>
      <Col span={12}>
        <Form.Item label="Title" name="title" rules={[{ required: true, message: "Title is required" }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Code" name="code" rules={[{ required: true, message: "Coupon code is required" }]}>
          <Input className="uppercase" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Discount (%)" name="discount" rules={[{ required: true, message: "Discount is required" }]}>
          <InputNumber min={1} max={100} className="w-full" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Valid until" name="validUpto" rules={[{ required: true, message: "Expiry date is required" }]}>
          <DatePicker className="w-full" />
        </Form.Item>
      </Col>
      {isAdmin && (
        <Col span={24}>
          <Form.Item label="Restaurant" name="tenant" rules={[{ required: true, message: "Restaurant is required" }]}>
            <Select
              placeholder="Select a restaurant"
              options={tenantData?.data.map((tenant: { id: string; name: string }) => ({
                value: tenant.id,
                label: tenant.name,
              }))}
            />
          </Form.Item>
        </Col>
      )}
    </Row>
  );
}

export default CouponForm;
