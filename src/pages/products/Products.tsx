import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Flex, Form, Space } from "antd";
import { Link } from "react-router-dom";
import ProductsFilter from "./ProductFilter";

function Products() {
  const [filterForm] = Form.useForm();
  return (
    <Space vertical className="w-full" size="large">
      <Flex justify="space-between">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            {
              title: <Link to="/">Dashboard</Link>,
            },
            {
              title: (
                <strong>
                  <Link to="/products">products</Link>
                </strong>
              ),
            },
          ]}
        />
        {/* {isFetching && <Spin indicator={<LoadingOutlined spin />} />} */}
        {/* {error && <Typography.Text type="danger">{error.message}</Typography.Text>} */}
      </Flex>
      <Form form={filterForm} onFieldsChange={() => {}}>
        <ProductsFilter>
          <Button type="primary" size="large" onClick={() => {}}>
            <Space>
              <PlusOutlined />
              Create Product
            </Space>
          </Button>
        </ProductsFilter>
      </Form>
    </Space>
  );
}

export default Products;
