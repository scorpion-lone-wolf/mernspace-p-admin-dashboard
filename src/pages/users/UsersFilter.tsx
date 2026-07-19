import { Card, Col, Flex, Form, Input, Row, Select } from "antd";

type UserFilterProps = {
  children?: React.ReactNode;
};
function UsersFilter({ children }: Readonly<UserFilterProps>) {
  return (
    <Card>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={24} md={12} lg={8}>
          <Form.Item name="search" className="mb-0!">
            <Input.Search placeholder="Search for user" allowClear />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={6} lg={3}>
          <Form.Item name="role" className="mb-0!">
            <Select
              placeholder="Role"
              className="w-full"
              options={[
                { value: "ADMIN", label: "Admin" },
                { value: "MANAGER", label: "Manager" },
                { value: "CUSTOMER", label: "Customer" },
              ]}
              allowClear
            />
          </Form.Item>
        </Col>

        {/* <Col xs={24} sm={12} md={6} lg={3}>
          <Select
            placeholder="Status"
            className="w-full"
            options={[
              { value: "BANNED", label: "Banned" },
              { value: "ACTIVE", label: "Active" },
            ]}
            allowClear
            onChange={(selectedValue) => {
              onFilterChange("UserStatusFilter", selectedValue);
            }}
          />
        </Col> */}

        <Col xs={24} lg={10}>
          <Flex justify="end">{children}</Flex>
        </Col>
      </Row>
    </Card>
  );
}

export default UsersFilter;
