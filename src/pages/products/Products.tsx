import { getProducts } from "@/api/api";
import { useAuthStore } from "@/store";
import type { Product, ProductQueryFilter } from "@/types";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Breadcrumb, Button, Flex, Form, Image, Space, Table, Tag, Typography, type TableColumnsType } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import ProductsFilter from "./ProductFilter";

const columns: TableColumnsType<Product> = [
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
    render: (value: string, record: Product) => {
      return (
        <Space>
          <Image src={record.image} alt="" width={50} height={50} />
          <Typography.Text>{value}</Typography.Text>
        </Space>
      );
    },
  },
  { title: "Description", dataIndex: "description", key: "description" },
  {
    title: "Status",
    dataIndex: "isPublished",
    key: "isPublished",
    render: (value) => {
      return value ? <Tag color="green">Published</Tag> : <Tag color="red">Draft</Tag>;
    },
  },
  {
    title: "CreatedAt",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (value) => {
      return new Date(value).toDateString();
    },
  },
];

function Products() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN";
  const [filterForm] = Form.useForm();
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [filters, setFilters] = useState<ProductQueryFilter>({
    search: "",
    isPublished: undefined,
    categoryId: "",
    tenantId: isAdmin ? "" : user?.tenant?.id,
  });
  // get all products
  const { data: productData, isFetching } = useQuery({
    queryKey: ["products", page, limit, filters],
    queryFn: async () => {
      return (await getProducts(page, limit, filters)).data;
    },
    placeholderData: keepPreviousData,
  });

  const onFilterChange = useDebouncedCallback(() => {
    const values = filterForm.getFieldsValue();
    // set page back to 1 before applying filters
    setPage(1);
    setFilters({
      search: values.search,
      isPublished: values.isPublished ? true : undefined,
      categoryId: values.category,
      tenantId: isAdmin ? values.resturants : user?.tenant?.id,
    });
  }, 500);

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
      <Form form={filterForm} onFieldsChange={onFilterChange}>
        <ProductsFilter isAdmin={isAdmin}>
          <Button type="primary" size="large" onClick={() => {}}>
            <Space>
              <PlusOutlined />
              Create Product
            </Space>
          </Button>
        </ProductsFilter>
      </Form>
      {/* product table */}
      <Table
        columns={[
          ...columns,
          {
            title: "Action",
            key: "actions",
            render: () => {
              return (
                <Space>
                  <Button type="link" onClick={() => {}}>
                    Edit
                  </Button>
                </Space>
              );
            },
          },
        ]}
        dataSource={productData?.data}
        loading={isFetching}
        rowKey={"_id"}
        pagination={{
          current: page,
          pageSize: limit,
          total: productData?.total ?? 0,
          showSizeChanger: false,
          showTotal(total, range) {
            return `${range[0]}-${range[1]} of ${total} items`;
          },
          onChange: (newPage) => {
            setPage(newPage);
          },
        }}
      />
    </Space>
  );
}

export default Products;
