import { Card, Col, Flex, Form, Input, Row } from "antd";

type UserFilterProps = {
  children?: React.ReactNode;
};
function TenantFilter({ children }: Readonly<UserFilterProps>) {
  return (
    <Card>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item name="search" className="mb-0!">
            <Input.Search className="w-1/2!" placeholder="Search for Resturants" allowClear />
          </Form.Item>
        </Col>

        <Col xs={24} lg={12}>
          <Flex justify="end">{children}</Flex>
        </Col>
      </Row>
    </Card>
  );
}

export default TenantFilter;
