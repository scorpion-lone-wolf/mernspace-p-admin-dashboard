import { Card, Col, Form, Input, Row } from "antd";

function UserForm() {
  return (
    <Row>
      <Col span={24}>
        <Card title="Basic info">
          <Row gutter={18}>
            <Col span={12}>
              <Form.Item name="firstName" label="First Name" rules={[{ required: true }, { type: "string", min: 6 }]}>
                <Input placeholder="Enter your First Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="lastName" label="Last Name" rules={[{ required: true }, { type: "string", min: 6 }]}>
                <Input placeholder="Enter your Last Name" />
              </Form.Item>
            </Col>
          </Row>

          {/* <Form.Item name="Email" label="Email" rules={[{ required: true }, { type: "email", min: 6 }]}>
            <Input placeholder="Enter your Email" />
          </Form.Item> */}
        </Card>
      </Col>
    </Row>
  );
}

export default UserForm;
