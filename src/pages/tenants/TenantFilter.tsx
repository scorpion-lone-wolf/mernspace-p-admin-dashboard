import { Card, Col, Flex, Input, Row } from "antd";

type UserFilterProps = {
  children?: React.ReactNode;
  onFilterChange: (filterName: string, filterValue: string) => void;
};
function TenantFilter({ onFilterChange, children }: Readonly<UserFilterProps>) {
  return (
    <Card>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={24} md={12} lg={12}>
          <Input.Search
            className="w-1/2!"
            placeholder="Search for Resturants"
            allowClear
            onChange={(event) => {
              onFilterChange("TenantSearchFilter", event.target.value);
            }}
          />
        </Col>

        <Col xs={24} lg={12}>
          <Flex justify="end">{children}</Flex>
        </Col>
      </Row>
    </Card>
  );
}

export default TenantFilter;
