import { useAuthStore } from "@/store";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function NonAuth() {
  const location = useLocation();
  const { user } = useAuthStore();

  if (user) {
    // user is already logged in
    // redirect to / page
    const params = new URLSearchParams(location.search);
    const returnTo = params.get("returnTo") || "/";
    return <Navigate to={returnTo} replace={true} />;
  }
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default NonAuth;
