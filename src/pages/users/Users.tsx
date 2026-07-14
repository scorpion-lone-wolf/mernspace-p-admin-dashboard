import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
function Users() {
  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: <Link to="/">Dashboard</Link>,
          },
          {
            title: <Link to="/users">users</Link>,
          },
        ]}
      />
    </div>
  );
}

export default Users;
