import { Card, Col, Flex, Form, Input, Row, Select, Space, Switch, Typography } from "antd";

type ProductFilterProps = {
  children?: React.ReactNode;
};
function ProductsFilter({ children }: Readonly<ProductFilterProps>) {
  return (
    <Card>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={16}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={16} lg={6}>
              <Form.Item name="search" className="mb-0!">
                <Input.Search placeholder="Search for products" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6} md={8} lg={6}>
              <Form.Item name="category" className="mb-0!">
                <Select
                  placeholder="Category"
                  allowClear
                  className="w-full"
                  options={[
                    { value: "PIZZA", label: "Pizza" },
                    { value: "BREVERAGES", label: "Breverages" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6} md={8} lg={6}>
              <Form.Item name="tenant" className="mb-0!">
                <Select
                  placeholder="Select Resturants"
                  allowClear
                  className="w-full"
                  options={[
                    { value: "pizza hub", label: "Pizza Hub" },
                    { value: "softy corner", label: "Softy Corner" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6} md={8} lg={6}>
              <Form.Item name="role" className="mb-0!">
                <Space>
                  <Switch id="published-toggle" defaultChecked onChange={() => {}} />
                  <Typography.Text>Show Only Published</Typography.Text>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Col>

        <Col xs={24} md={8} lg={8}>
          <Flex justify="end">{children}</Flex>
        </Col>
      </Row>
    </Card>
  );
}

export default ProductsFilter;
