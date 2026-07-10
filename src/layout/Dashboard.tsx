import { useAuthStore } from "@/store";
import { Navigate, Outlet } from "react-router-dom";

function Dashboard() {
  // This will decide if the below protected route should be rendered or not
  // We will check the store, if we have user data , then user is authenticated and allowed to see this page else not (we will redirect them to login page)
  const { user } = useAuthStore();

  if (!user) {
    // user is not logged in
    // redirect to login page
    return <Navigate to="/auth/login" replace={true} />;
  }
  return (
    <div>
      <h2>This is Dashboard</h2>
      <Outlet />
    </div>
  );
}

export default Dashboard;
