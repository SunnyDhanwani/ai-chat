import { useOutletContext, Outlet, Navigate } from "react-router-dom";
import Layout from "../components/common/Layout";

const ProtectedRoute = ({ role }) => {
  const context = useOutletContext();

  if (!context || !context.token) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <Outlet context={context} />
    </Layout>
  );
};

export default ProtectedRoute;
