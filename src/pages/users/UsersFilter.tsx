import { Card, Col, Flex, Form, Input, Row, Select } from "antd";

type UserFilterProps = {
  children?: React.ReactNode;
};
function UsersFilter({ children }: Readonly<UserFilterProps>) {
  return (
    <Card>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={16}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={16} lg={10}>
              <Form.Item name="search" className="mb-0!">
                <Input.Search placeholder="Search for user" allowClear />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6} md={8} lg={6}>
              <Form.Item name="role" className="mb-0!">
                <Select
                  placeholder="Role"
                  allowClear
                  className="w-full"
                  options={[
                    { value: "ADMIN", label: "Admin" },
                    { value: "MANAGER", label: "Manager" },
                    { value: "CUSTOMER", label: "Customer" },
                  ]}
                />
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

export default UsersFilter;
