import { Col, Form, Input, Row } from "antd";

function TenantForm() {
  return (
    <Row gutter={20}>
      <Col span={12}>
        <Form.Item label="Name" name="name" rules={[{ required: true, min: 6 }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Adress" name="address" rules={[{ required: true, min: 6 }]}>
          <Input />
        </Form.Item>
      </Col>
    </Row>
  );
}

export default TenantForm;
