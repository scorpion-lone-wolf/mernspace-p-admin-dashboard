import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h2>This is Dashboard</h2>
      <Outlet />
    </div>
  );
}

export default Dashboard;
