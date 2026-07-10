import { Outlet } from "react-router-dom";

function NonAuth() {
  return (
    <div>
      <h2>This is NonAuth</h2>
      <Outlet />
    </div>
  );
}

export default NonAuth;
