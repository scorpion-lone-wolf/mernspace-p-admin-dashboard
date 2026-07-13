import { useAuthStore } from "@/store";
import { Navigate, Outlet } from "react-router-dom";

function NonAuth() {
  const { user, isAuthLoading } = useAuthStore();

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    // user is already logged in
    // redirect to / page
    return <Navigate to="/" replace={true} />;
  }
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default NonAuth;
