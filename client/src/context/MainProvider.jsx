import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MainContext from "./MainContext";

const MainProvider = ({ children }) => {
  // Variables de estado
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({});

  // Verificar usuario al cargar la app
  useEffect(() => {
    // Cargar isLogin desde el localStorage
    const storedIsLogin = localStorage.getItem("isLogin");
    if (storedIsLogin !== null) {
      setIsLogin(JSON.parse(storedIsLogin));
    }

    // Cargar user desde el localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Verificar si la sesión ha expirado
    const loginExpiration = localStorage.getItem("loginExpiration");
    if (loginExpiration) {
      const expirationTime = parseInt(loginExpiration, 10);
      const now = new Date().getTime();
      if (now > expirationTime) {
        // Sesión expirada, limpiar localStorage y mostrar notificación
        localStorage.removeItem("user");
        localStorage.removeItem("isLogin");
        localStorage.removeItem("loginTimestamp");
        localStorage.removeItem("loginExpiration");
        alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        setIsLogin(false);
        setUser({});
        // Puedes redirigir al usuario a la página de inicio de sesión aquí si es necesario
      }
    }
  }, []);

  // Actualizar localStorage cuando setUser cambie
  useEffect(() => {
    if (Object.keys(user).length === 0) {
      // Si user es un objeto vacío, limpiar timestamps y isLogin
      localStorage.removeItem("loginTimestamp");
      localStorage.removeItem("loginExpiration");
      localStorage.removeItem("isLogin");
      localStorage.removeItem("user");
    } else {
      // Guardar user en el localStorage
      localStorage.setItem("user", JSON.stringify(user));
      // Guardar fecha de inicio con expiración de 6 días
      const now = new Date();
      const expiration = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000); // 6 días
      localStorage.setItem("loginTimestamp", now.getTime().toString());
      localStorage.setItem("loginExpiration", expiration.getTime().toString());
    }
  }, [user]);

  // Guardar isLogin en el localStorage
  useEffect(() => {
    localStorage.setItem("isLogin", JSON.stringify(isLogin));
  }, [isLogin]);

  // RETURN
  return (
    <MainContext.Provider
      value={{
        isLogin,
        setIsLogin,
        user,
        setUser,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainProvider;
