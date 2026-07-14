import { useAuthStore } from "@/store";
import { Typography } from "antd";

const MAX_NAME_LENGTH = 10;
const truncate = (str: string, len: number) => {
  if (str.length > len) {
    return str.substring(0, len - 3) + "...";
  }
  return str;
};

function HomePage() {
  const { user } = useAuthStore();

  return (
    <div>
      <Typography.Title level={3}>Welcome, {truncate(user?.firstName || "", MAX_NAME_LENGTH)} 🙃</Typography.Title>
    </div>
  );
}

export default HomePage;
