import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainContext from "../context/MainContext";
import PropTypes from "prop-types";
import { memo } from "react";

const ProtectedRoute = memo(({ children }) => {
  const { isLogin } = useContext(MainContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  const checkLocalStorage = useCallback(() => {
    const storedIsLogin = localStorage.getItem("isLogin");
    if (storedIsLogin !== null) {
      setDataLoaded(true);
    }
  }, []);

  const handleNavigation = useCallback(() => {
    if (!isLogin && dataLoaded) {
      navigate("/login");
    }
  }, [isLogin, dataLoaded, navigate]);

  useEffect(() => {
    checkLocalStorage();

    const delay = setTimeout(() => {
      setLoading(false);
      handleNavigation();
    }, 100);

    return () => clearTimeout(delay);
  }, [checkLocalStorage, handleNavigation]);

  const loadingComponent = useMemo(() => <div className="flex w-full h-dvh justify-center items-center">Cargando...</div>, []);

  if (loading) {
    return loadingComponent;
  }

  if (!dataLoaded) {
    return null;
  }

  if (!isLogin && dataLoaded) {
    return null;
  }

  return <>{children}</>;
});

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

ProtectedRoute.displayName = "ProtectedRoute";

export default ProtectedRoute;
