import { login } from "@/api/auth.api";
import logo from "@/assets/logo.svg";
import type { Credentails } from "@/types";
import { LockFilled, LockOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Flex,
  Form,
  Input,
  Layout,
  Space,
} from "antd";

const loginUser = async (credentails: Credentails) => {
  // here we make the request to the server to mutate the data
  const response = await login(credentails);
  return response.data;
};

function LoginPage() {
  const {
    mutate,
    isPending: isLoading,
    isError: hasError,
    error,
  } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: async () => {
      console.log("Login Successful");
    },
  });

  return (
    <Layout
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={logo}
        alt="Logo"
        style={{
          width: 100,
          height: 100,
        }}
      />
      <Card
        title={
          <Space
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            <LockFilled />
            Sign in
          </Space>
        }
        variant="borderless"
        style={{ width: 300 }}
      >
        <Form
          name="login"
          style={{ maxWidth: 360 }}
          initialValues={{ remember: true }}
          onFinish={(values) => {
            console.log(values);
            mutate({
              email: values.username,
              password: values.password,
            });
          }}
        >
          {hasError && (
            <Alert
              style={{ marginBottom: 10 }}
              type="error"
              title={error?.message}
            />
          )}
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Please input your Username!" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your Password!" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="#">Forgot password</a>
            </Flex>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              style={{ width: "100%" }}
              htmlType="submit"
              loading={isLoading}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
}

export default LoginPage;
