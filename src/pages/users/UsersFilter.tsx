import { Card, Col, Flex, Input, Row, Select } from "antd";

type UserFilterProps = {
  children?: React.ReactNode;
  onFilterChange: (filterName: string, filterValue: string) => void;
};
function UsersFilter({ onFilterChange, children }: Readonly<UserFilterProps>) {
  return (
    <Card>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={24} md={12} lg={8}>
          <Input.Search
            placeholder="Search for user"
            allowClear
            onChange={(event) => {
              onFilterChange("UserSearchFilter", event.target.value);
            }}
          />
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
            onChange={(selectedValue) => {
              onFilterChange("UserRoleFilter", selectedValue);
            }}
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
            onChange={(selectedValue) => {
              onFilterChange("UserStatusFilter", selectedValue);
            }}
          />
        </Col>

        <Col xs={24} lg={10}>
          <Flex justify="end">{children}</Flex>
        </Col>
      </Row>
    </Card>
  );
}

export default UsersFilter;
