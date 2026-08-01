import { getCategories, getTenants } from "@/api/api";
import Spinner from "@/components/Spinner";
import type { Category, Tenant } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Card, Col, Flex, Form, Input, Row, Select, Space, Switch, Typography } from "antd";

type ProductFilterProps = {
  children?: React.ReactNode;
};
function ProductsFilter({ children }: Readonly<ProductFilterProps>) {
  // fetching tenant info from auth service
  const { data: resturantData, isLoading: isResturantDataLoading } = useQuery({
    queryKey: ["resturants"],
    queryFn: async () => {
      // page = 1 amd limit = 100
      return (await getTenants(1, 100)).data;
    },
    initialData: [],
  });

  // fetching category info from catalog service
  const { data: categoryData, isLoading: isCategoryDataLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      // page = 1 amd limit = 100
      return (await getCategories()).data;
    },
    initialData: [],
  });
  console.log("categoryData", categoryData);
  if (isResturantDataLoading || isCategoryDataLoading) {
    return <Spinner fullPage />;
  }
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
                  options={categoryData?.data?.map((category: Category) => {
                    return {
                      value: category._id,
                      label: category.name,
                    };
                  })}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6} md={8} lg={6}>
              <Form.Item name="resturants" className="mb-0!">
                <Select
                  placeholder="Select Resturants"
                  allowClear
                  className="w-full"
                  options={resturantData?.data?.map((resturant: Tenant) => {
                    return {
                      value: resturant.id,
                      label: resturant.name,
                    };
                  })}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6} md={8} lg={6}>
              <Form.Item name="isPublished" className="mb-0!">
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
