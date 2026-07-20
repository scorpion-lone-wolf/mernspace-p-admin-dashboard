import { me } from "@/api/auth.api";
import { useAuthStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const getMe = async () => {
  const response = await me();
  return response.data;
};
function Root() {
  // const location = useLocation();
  // const isAuthPage = location.pathname.startsWith("/auth");
  const { setUser } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    // enabled: !isAuthPage,
    retry: (failureCount, error) => {
      if (error instanceof AxiosError && error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
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
