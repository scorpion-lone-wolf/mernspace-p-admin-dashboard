import { tenants } from "@/api/tenants.api";
import type { Tenant } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space } from "antd";

type UserFormProps = {
  isEditMode?: boolean;
};

function UserForm({ isEditMode = false }: Readonly<UserFormProps>) {
  const role = Form.useWatch("role");
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
  if (error) {
    return <div>Something went wrong.</div>;
  }
  return (
    <Row>
      <Col span={24}>
        <Space vertical className="w-full" size="large">
          <Card title="Basic info">
            <Row gutter={18}>
              <Col span={12}>
                <Form.Item name="firstName" label="First Name" rules={[{ required: true }, { type: "string" }]}>
                  <Input placeholder="Enter your First Name" size="medium" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="lastName" label="Last Name" rules={[{ required: true }, { type: "string" }]}>
                  <Input placeholder="Enter your Last Name" size="medium" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="email" label="Email" rules={[{ required: true }, { type: "email", min: 6 }]}>
                  <Input placeholder="Enter your Email" size="medium" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {!isEditMode && (
            <Card title="Security info">
              <Row gutter={18}>
                <Col span={12}>
                  <Form.Item name="password" label="Password" rules={[{ required: !isEditMode }, { type: "string", min: 6 }]}>
                    <Input placeholder="Add your Password" size="medium" type="password" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    dependencies={["password"]}
                    rules={[
                      { required: !isEditMode },
                      { type: "string", min: 6 },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const password = getFieldValue("password");
                          if (!password && isEditMode) {
                            return Promise.resolve();
                          }
                          if (password !== value) {
                            return Promise.reject(new Error("The two passwords that you entered do not match!"));
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <Input placeholder="Confirm your Password" size="medium" type="password" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          )}
          <Card title="Roles info">
            <Row gutter={18}>
              <Col span={12}>
                <Form.Item name="role" label="Role" rules={[{ required: true }, { type: "string" }]}>
                  <Select
                    placeholder="Select Role"
                    size="medium"
                    allowClear
                    options={[
                      { value: "ADMIN", label: "Admin" },
                      { value: "MANAGER", label: "Manager" },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                {role !== "ADMIN" && (
                  <Form.Item name="tenantId" label="Resturant" rules={[{ required: true }, { type: "string" }]}>
                    <Select
                      placeholder="Select Resturant"
                      size="medium"
                      allowClear
                      onChange={() => {}}
                      loading={isLoading}
                      options={tenantData?.data?.map((tenant: Tenant) => ({ value: tenant.id, label: tenant.name }))}
                      listHeight={200}
                    />
                  </Form.Item>
                )}
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
}

export default UserForm;
