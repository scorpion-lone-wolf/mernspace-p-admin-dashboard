import type { Category } from "@/types";
import { Card, Form, Radio, Switch } from "antd";

type PricingProps = {
  selectedCategory: Category;
};

function Attributes({ selectedCategory }: Readonly<PricingProps>) {
  return (
    <Card title="Attributes">
      {selectedCategory.attributes.map((attribute) => (
        <Form.Item
          key={attribute.name}
          label={attribute.name}
          name={[attribute.name, "value"]}
          rules={attribute.widgetType === "radio" ? [{ required: true }] : undefined}
          valuePropName={attribute.widgetType === "switch" ? "checked" : "value"}
          initialValue={attribute.widgetType === "switch" ? attribute.defaultValue === "Yes" : attribute.defaultValue}
        >
          {attribute.widgetType === "switch" ? (
            <Switch checkedChildren="Yes" unCheckedChildren="No" />
          ) : (
            <Radio.Group options={attribute.availableOptions} optionType="button" buttonStyle="solid" />
          )}
        </Form.Item>
      ))}
    </Card>
  );
}

export default Attributes;
