import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Flex, Input, Row, Select, Space } from "antd";

function UsersFilter() {
  return (
    <Card>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={24} md={12} lg={8}>
          <Input.Search placeholder="Search for user" />
        </Col>

        <Col xs={24} sm={12} md={6} lg={3}>
          <Select
            placeholder="Role"
            className="w-full"
            options={[
              { value: "ADMIN", label: "Admin" },
              { value: "Manager", label: "MANAGER" },
              { value: "Customer", label: "CUSTOMER" },
            ]}
            allowClear
          />
        </Col>

        <Col xs={24} sm={12} md={6} lg={3}>
          <Select
            placeholder="Status"
            className="w-full"
            options={[
              { value: "BANNED", label: "Banned" },
              { value: "ACTIVE", label: "Active" },
            ]}
            allowClear
          />
        </Col>

        <Col xs={24} lg={10}>
          <Flex justify="end">
            <Button type="primary" size="large">
              <Space>
                <PlusOutlined />
                Create Users
              </Space>
            </Button>
          </Flex>
        </Col>
      </Row>
    </Card>
  );
}

export default UsersFilter;
