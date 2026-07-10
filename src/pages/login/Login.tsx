import { login, logout, me } from "@/api/auth.api";
import logo from "@/assets/logo.svg";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuthStore } from "@/store";
import type { Credentails } from "@/types";
import { LockFilled, LockOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Alert, Button, Card, Checkbox, Flex, Form, Input, Layout, Space } from "antd";

const loginUser = async (credentails: Credentails) => {
  // here we make the request to the server to mutate the data
  const response = await login(credentails);
  return response.data;
};

const getMe = async () => {
  const response = await me();
  return response.data;
};

function LoginPage() {
  const { isAllowed } = usePermissions();
  const { setUser, logout: logoutFromStore } = useAuthStore();

  // getMe query
  const { refetch } = useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    enabled: false, // at the starting it will not run when the page loads
  });

  // logout mutation
  const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: () => {
      logoutFromStore();
    },
  });

  // login mutation
  const {
    mutate,
    isPending: isLoading,
    isError: hasError,
    error,
  } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: async () => {
      const userData = await refetch();
      // hook that checks if user is admin or manager else not allowed
      if (!isAllowed(userData.data.data.at(0))) {
        logoutMutate();
        return;
      }
      // store the user data in store
      setUser(userData.data.data.at(0));
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
          {hasError && <Alert style={{ marginBottom: 10 }} type="error" title={error?.message} />}
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
            <Button type="primary" style={{ width: "100%" }} htmlType="submit" loading={isLoading}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
}

export default LoginPage;
