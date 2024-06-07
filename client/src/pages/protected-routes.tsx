import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      setIsLoading(false);
      setIsAuthenticated(true);
    } else {
      setIsLoading(false);
    }
  }, []);

  if (!isAuthenticated && !isLoading) {
    navigate("/");
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
};

export default ProtectedRoute;
