import { getCategories, getTenants } from "@/api/api";
import { useAuthStore, type Tenant } from "@/store";
import type { Category } from "@/types";
import { PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography, Upload } from "antd";
import Attributes from "./Attributes";
import Pricing from "./Pricing";

function ProductForm() {
  const user = useAuthStore((state) => state.user);
  const selectedCategory = Form.useWatch("category");
  const {
    data: tenantData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      return (await getTenants()).data;
    },
  });

  const { data: categoryData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      // page = 1 amd limit = 100
      return (await getCategories()).data;
    },
    initialData: [],
  });
  const selectedCategoryData = categoryData?.data?.find((category: Category) => category._id === selectedCategory);

  if (error) {
    return <div>Something went wrong.</div>;
  }
  return (
    <Row>
      <Col span={24}>
        <Space vertical className="w-full" size="large">
          <Card title="Product info">
            <Row gutter={18}>
              <Col span={12}>
                <Form.Item name="name" label="Name" rules={[{ required: true }, { type: "string" }]}>
                  <Input placeholder="Enter Product Name" size="medium" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="category" label="Select Category" rules={[{ required: true }, { type: "string" }]}>
                  <Select
                    placeholder="Select Category"
                    allowClear
                    className="w-full"
                    options={categoryData?.data?.map((category: Category) => {
                      return {
                        value: category._id,
                        label: category.name,
                      };
                    })}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="description" label="Description" rules={[{ required: true }, { type: "string" }]}>
                  <Input.TextArea placeholder="Enter Description" size="large" maxLength={100} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="Product image">
            <Row gutter={18}>
              <Col span={12}>
                <Form.Item
                  label=""
                  name="image"
                  valuePropName="fileList"
                  getValueFromEvent={(event) => (Array.isArray(event) ? event : event?.fileList)}
                  rules={[
                    {
                      required: true,
                      message: "Please upload a product image",
                    },
                  ]}
                >
                  <Upload maxCount={1} listType="picture-card" className="avatar-uploader">
                    <Space orientation="vertical">
                      <PlusOutlined />
                      <Typography.Text>Upload</Typography.Text>
                    </Space>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Card>
          {user?.role === "ADMIN" && (
            <Card title="Tenant info">
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item name="tenantId" label="Select Resturant" rules={[{ required: true }, { type: "string" }]}>
                    <Select
                      placeholder="Select Resturant"
                      size="large"
                      allowClear
                      onChange={() => {}}
                      loading={isLoading}
                      options={tenantData?.data?.map((tenant: Tenant) => ({ value: tenant.id, label: tenant.name }))}
                      listHeight={200}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          )}

          {selectedCategoryData && (
            <>
              <Pricing selectedCategory={selectedCategoryData} />
              <Attributes selectedCategory={selectedCategoryData} />
            </>
          )}
          <Card title="Other Properties">
            <Row gutter={24}>
              <Col span={24}>
                <Space style={{ display: "flex", alignItems: "center" }}>
                  <Form.Item name="isPublished" noStyle initialValue={true}>
                    <Switch checkedChildren="Yes" unCheckedChildren="No" />
                  </Form.Item>
                  <Typography.Text>Published</Typography.Text>
                </Space>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
}

export default ProductForm;
