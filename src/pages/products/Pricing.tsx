import type { Category } from "@/types";
import { Button, Card, Col, Form, InputNumber, Row, Space, Typography } from "antd";

type PricingProps = {
  selectedCategory: Category;
};

function Pricing({ selectedCategory }: Readonly<PricingProps>) {
  return (
    <Card title="Product Pricing">
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        {Object.entries(selectedCategory.priceConfiguration).map(([configurationKey, configurationValue]) => (
          <div key={configurationKey}>
            <Typography.Text strong>{`${configurationKey} (${configurationValue.priceType})`}</Typography.Text>

            <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
              {configurationValue.availableOptions.map((option) => {
                const inputId = `price-${encodeURIComponent(configurationKey)}-${encodeURIComponent(option)}`;

                return (
                  <Col span={8} key={option}>
                    <Form.Item label={option} htmlFor={inputId} required>
                      <Space.Compact block>
                        <Form.Item
                          noStyle
                          rules={[{ required: true, message: "This field is required" }]}
                          name={[
                            "priceConfiguration",
                            JSON.stringify({ configurationKey: configurationKey, priceType: configurationValue.priceType }),
                            option,
                          ]}
                        >
                          <InputNumber id={inputId} style={{ width: "100%" }} />
                        </Form.Item>
                        <Button disabled>₹</Button>
                      </Space.Compact>
                    </Form.Item>
                  </Col>
                );
              })}
            </Row>
          </div>
        ))}
      </Space>
    </Card>
  );
}

export default Pricing;
