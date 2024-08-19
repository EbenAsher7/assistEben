import { useContext, useEffect, useState } from "react";
import MainContext from "@/context/MainContext";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "@/components/Admin/AdminNavBar";

const Administration = () => {
  const { user } = useContext(MainContext);
  const navigate = useNavigate();
  const [accessDenied, setAccessDenied] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (user) {
      const timeoutId = setTimeout(() => {
        if (!user.tipo) {
          setAccessDenied(true);
          const intervalId = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
          }, 1000);

          setTimeout(() => {
            clearInterval(intervalId);
            navigate("/");
          }, 5000);
        }
      }, 1000); // Espera 1 segundo

      setTimeoutId(timeoutId);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.tipo) {
      clearTimeout(timeoutId);
      if (user.tipo !== "Administrador") {
        setAccessDenied(true);
        const intervalId = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        setTimeout(() => {
          clearInterval(intervalId);
          navigate("/");
        }, 5000);
      }
    }
  }, [user, navigate, timeoutId]);

  if (accessDenied) {
    return (
      <div className="w-full h-screen -mt-[60px] justify-center items-center flex flex-col">
        <h1 className="text-3xl font-extrabold text-red-500">No tienes acceso a este módulo.</h1>
        <p className="text-lg italic opacity-60">Serás redirigido a la página de inicio en {countdown} segundos...</p>
      </div>
    );
  }

  return (
    <>
      <AdminNavBar />
    </>
  );
};

export default Administration;
