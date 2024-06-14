import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainContext from "../context/MainContext";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const { isLogin } = useContext(MainContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false); // Nuevo estado para verificar si los datos están cargados

  useEffect(() => {
    // Verificar si hay datos cargados en el localStorage
    const storedIsLogin = localStorage.getItem("isLogin");
    if (storedIsLogin !== null) {
      setDataLoaded(true); // Marcar como cargados los datos del localStorage
    }

    const delay = setTimeout(() => {
      setLoading(false);
      // Verificar si está autenticado solo si los datos están cargados
      if (!isLogin && dataLoaded) {
        navigate("/login");
      }
    }, 100);

    return () => clearTimeout(delay); // Limpiamos el timeout si el componente se desmonta antes de que termine
  }, [isLogin, navigate, dataLoaded]);

  // Mostrar un indicador de carga mientras se verifica el inicio de sesión y carga de datos
  if (loading) {
    return <div className="flex w-full h-dvh justify-center items-center">Cargando...</div>;
  }

  // Si los datos no están cargados, no renderizar contenido
  if (!dataLoaded) {
    return null;
  }

  // Si no está autenticado y los datos están cargados, redirigir al login
  if (!isLogin && dataLoaded) {
    return null; // Opcionalmente podrías mostrar un mensaje o un spinner antes de redirigir
  }

  // Si está autenticado y los datos están cargados, renderizar el contenido protegido
  return <>{children}</>;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
