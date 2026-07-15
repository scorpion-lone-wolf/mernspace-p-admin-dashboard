import { BarChartIcon } from "@/components/icons/BarChartIcon";
import BasketIcon from "@/components/icons/BasketIcon";
import { useAuthStore } from "@/store";
import Icon from "@ant-design/icons";
import { Button, Card, Col, Flex, Row, Skeleton, Space, Statistic, Tag, Typography } from "antd";
import type { ComponentType } from "react";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;
const list = [
  {
    OrderSummary: "Peperoni, Margarita ...",
    address: "Bandra, Mumbai",
    amount: 1200,
    status: "preparing",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
];
interface CardTitleProps {
  title: string;
  PrefixIcon: ComponentType<unknown>;
}

const CardTitle = ({ title, PrefixIcon }: CardTitleProps) => {
  return (
    <Space>
      <Icon component={PrefixIcon} />
      {title}
    </Space>
  );
};

function HomePage() {
  const { user } = useAuthStore();

  return (
    <div>
      <Title level={4}>Welcome, {user?.firstName} 😀</Title>
      <Row className="mt-4" gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card>
                <Statistic title="Total orders" value={52} />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic title="Total sale" value={70000} precision={2} prefix="₹" />
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-4!">
            <Col span={24}>
              <Card title={<CardTitle title="Sales" PrefixIcon={BarChartIcon} />}></Card>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Card title={<CardTitle title="Recent orders" PrefixIcon={BasketIcon} />}>
            <Flex vertical gap={16}>
              {list.map((item, index) => (
                <Card key={index} size="small">
                  <Skeleton avatar title={false} loading={item.loading} active>
                    <Row align="middle" justify="space-between">
                      <Col>
                        <Flex vertical>
                          <Typography.Link href="https://ant.design">{item.OrderSummary}</Typography.Link>
                          <Text type="secondary">{item.address}</Text>
                        </Flex>
                      </Col>

                      <Col>
                        <Text strong>₹{item.amount}</Text>
                      </Col>

                      <Col>
                        <Tag color="volcano">{item.status}</Tag>
                      </Col>
                    </Row>
                  </Skeleton>
                </Card>
              ))}
            </Flex>

            <div style={{ marginTop: 20 }}>
              <Button type="link">
                <Link to="/orders">See all orders</Link>
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default HomePage;
