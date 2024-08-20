import { useContext, useEffect, useState } from "react";
import MainContext from "@/context/MainContext";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "@/components/Admin/AdminNavBar";

const Administration = () => {
  const { user } = useContext(MainContext);
  const navigate = useNavigate();
  const [accessDenied, setAccessDenied] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [initialCheck, setInitialCheck] = useState(true);

  useEffect(() => {
    if (initialCheck) {
      if (!user || (user && user.tipo !== "Administrador")) {
        setAccessDenied(true);
        const intervalId = setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown <= 1) {
              clearInterval(intervalId);
              navigate("/");
              return 0;
            }
            return prevCountdown - 1;
          });
        }, 1000);

        return () => clearInterval(intervalId);
      }
      setInitialCheck(false);
    } else {
      if (!user) {
        navigate("/");
      }
    }
  }, [user, navigate, initialCheck]);

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
