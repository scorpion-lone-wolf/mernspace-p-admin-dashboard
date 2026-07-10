import { useAuthStore } from "@/store";
import { Navigate, Outlet } from "react-router-dom";

function NonAuth() {
  const { user } = useAuthStore();

  if (user) {
    // user is already logged in
    // redirect to /  page
    return <Navigate to="/" replace={true} />;
  }
  return (
    <div>
      <h2>This is NonAuth</h2>
      <Outlet />
    </div>
  );
}

export default NonAuth;
