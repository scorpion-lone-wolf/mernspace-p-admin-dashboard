import { me } from "@/api/auth.api";
import { useAuthStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const getMe = async () => {
  const response = await me();
  return response.data;
};
function Root() {
  const { setUser } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getMe,
  });
  useEffect(() => {
    if (data?.data?.length > 0) {
      setUser(data.data.at(0));
    }
  }, [data, setUser]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <Outlet />;
}

export default Root;
