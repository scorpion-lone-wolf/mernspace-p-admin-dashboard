import { createProduct, getProducts } from "@/api/api";
import { useAuthStore } from "@/store";
import type { Product, ProductQueryFilter } from "@/types";
import { LoadingOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Breadcrumb, Button, Drawer, Flex, Form, Image, Space, Spin, Table, Tag, theme, Typography, type TableColumnsType } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import ProductsFilter from "./ProductFilter";
import ProductForm from "./ProductForm";
import { makeFormData } from "./helper";

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
  const queryClient = useQueryClient();
  const isAdmin = user?.role === "ADMIN";
  const [filterForm] = Form.useForm();
  const [form] = Form.useForm();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { colorBgLayout } = theme.useToken().token;
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
  const { mutate: createProductMutation, isPending: isSubmitting } = useMutation({
    mutationKey: ["products"],
    mutationFn: async (product: FormData) => {
      // Return the request so React Query waits for the product to be created
      // before running onSuccess (and refetching the list).
      return await createProduct(product);
    },
    onSuccess: () => {
      // Invalidate every product-list variant (page/filter combinations).
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsDrawerOpen(false);
      form.resetFields();
    },
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
  const closeDrawer = () => {
    form.resetFields();
    // setEditableUser(null);
    setIsDrawerOpen(false);
  };

  const onHandleSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    const priceConfig = values.priceConfiguration;

    const pricing = Object.entries(priceConfig).reduce(
      (acc, [key, value]) => {
        const keyObject = JSON.parse(key);

        acc[keyObject.configurationKey] = {
          priceType: keyObject.priceType,
          availableOptions: Object.fromEntries(Object.entries(value as Record<string, string>).map(([option, price]) => [option, Number(price)])),
        };

        return acc;
      },
      {} as Record<
        string,
        {
          priceType: string;
          availableOptions: Record<string, number>;
        }
      >,
    );

    const attribute = Object.entries(values.attribute).map(([key, value]) => ({
      name: key,
      value,
    }));

    const postData = {
      name: values.name,
      description: values.description,
      tenantId: values.tenantId,
      categoryId: values.category,
      isPublished: values.isPublished,
      image: values.image,
      attribute: attribute,
      priceConfiguration: pricing,
    };

    // converting the object to form data as we need multipart form data for file upload in backend
    const formData = makeFormData(postData);
    createProductMutation(formData);
  };

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
          <Button
            type="primary"
            size="large"
            onClick={() => {
              form.resetFields();
              //   setEditableUser(null);
              setIsDrawerOpen(true);
            }}
          >
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
      <Drawer
        title={"Create a New Product"}
        open={isDrawerOpen}
        styles={{
          body: {
            background: colorBgLayout,
          },
        }}
        size={720}
        destroyOnHidden={true}
        onClose={closeDrawer}
        extra={
          <Space>
            <Button onClick={closeDrawer}>Cancel</Button>
            <Button onClick={onHandleSubmit} type="primary">
              {isSubmitting ? <Spin indicator={<LoadingOutlined spin />} /> : "Submit"}
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <ProductForm />
        </Form>
      </Drawer>
    </Space>
  );
}

export default Products;
