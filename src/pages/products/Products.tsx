import { createProduct, getProducts, updateProduct } from "@/api/api";
import { useAuthStore } from "@/store";
import type { Product, ProductPriceConfiguration, ProductQueryFilter } from "@/types";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Breadcrumb, Button, Drawer, Flex, Form, Image, Space, Table, Tag, theme, Typography, type TableColumnsType } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import ProductsFilter from "./ProductFilter";
import ProductForm from "./ProductForm";
import { makeFormData, makePriceConfigurationFormValues } from "./helper";

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
  const [editableProduct, setEditableProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();
  const isAdmin = user?.role === "ADMIN";
  const [filterForm] = Form.useForm();
  const [form] = Form.useForm();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { colorBgLayout } = theme.useToken().token;
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const isEditing = !!editableProduct;
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

  const closeDrawer = () => {
    form.resetFields();
    setEditableProduct(null);
    setIsDrawerOpen(false);
  };

  const refreshProductsAndClose = async () => {
    await queryClient.invalidateQueries({ queryKey: ["products"], refetchType: "active" });
    closeDrawer();
  };

  const { mutate: createProductMutation, isPending: isCreating } = useMutation({
    mutationKey: ["products"],
    mutationFn: async (product: FormData) => {
      // Return the request so React Query waits for the product to be created
      // before running onSuccess (and refetching the list).
      return await createProduct(product);
    },
    onSuccess: refreshProductsAndClose,
  });

  const { mutate: updateProductMutation, isPending: isUpdating } = useMutation({
    mutationKey: ["products", editableProduct?._id],
    mutationFn: async ({ id, product }: { id: string; product: FormData }) => {
      return await updateProduct(id, product);
    },
    onSuccess: refreshProductsAndClose,
  });

  const isSubmitting = isCreating || isUpdating;

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
  React.useEffect(() => {
    if (editableProduct) {
      const attribute = Object.fromEntries(editableProduct.attribute.map(({ name, value }) => [name, value]));

      const imageName = editableProduct.image.split("/").pop()?.split("?")[0] || "product-image";

      // Remove registered values from the previously edited product before
      // hydrating the form with the newly selected product.
      form.resetFields();
      form.setFieldsValue({
        name: editableProduct.name,
        description: editableProduct.description,
        category: typeof editableProduct.categoryId === "string" ? editableProduct.categoryId : editableProduct.categoryId._id,
        isPublished: editableProduct.isPublished,
        image: [
          {
            uid: editableProduct._id,
            name: imageName,
            status: "done",
            url: editableProduct.image,
          },
        ],
        attribute,
        tenantId: editableProduct.tenantId,
        priceConfiguration: makePriceConfigurationFormValues(editableProduct.priceConfiguration),
      });
    }
  }, [editableProduct, form]);
  const onHandleSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    const priceConfig = values.priceConfiguration;

    const pricing = Object.entries(priceConfig).reduce((acc, [key, value]) => {
      const keyObject = JSON.parse(key) as {
        configurationKey: string;
        priceType: "base" | "additional";
      };

      acc[keyObject.configurationKey] = {
        priceType: keyObject.priceType,
        availableOptions: Object.fromEntries(Object.entries(value as Record<string, string>).map(([option, price]) => [option, Number(price)])),
      };

      return acc;
    }, {} as ProductPriceConfiguration);

    const attribute = Object.entries(values.attribute).map(([key, value]) => ({
      name: key,
      value,
    }));

    const postData = {
      name: values.name,
      description: values.description,
      tenantId: user?.role === "MANAGER" ? user?.tenant?.id : values.tenantId,
      categoryId: values.category,
      isPublished: values.isPublished,
      image: values.image,
      attribute: attribute,
      priceConfiguration: pricing,
    };

    // converting the object to form data as we need multipart form data for file upload in backend
    const formData = makeFormData(postData);

    if (editableProduct) {
      updateProductMutation({ id: editableProduct._id, product: formData });
      return;
    }

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
              setEditableProduct(null);
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
            render: (_, record: Product) => {
              return (
                <Space>
                  <Button
                    type="link"
                    onClick={() => {
                      setIsDrawerOpen(true);
                      setEditableProduct(record);
                    }}
                  >
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
        title={isEditing ? "Edit Product" : "Create a New Product"}
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
            <Button onClick={onHandleSubmit} type="primary" loading={isSubmitting}>
              Submit
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
