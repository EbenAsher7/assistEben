import { useContext, useEffect, useState } from "react";
import MainContext from "@/context/MainContext";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "@/components/Admin/AdminNavBar";

const Administration = () => {
  const { user } = useContext(MainContext);
  const navigate = useNavigate();
  const [accessDenied, setAccessDenied] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (user) {
      if (!user.tipo || user.tipo !== "Administrador") {
        setAccessDenied(true);
        const intervalId = setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown === 1) {
              clearInterval(intervalId);
              navigate("/");
            }
            return prevCountdown - 1;
          });
        }, 1000);
      }
    }
  }, [user, navigate]);

  if (accessDenied) {
    return (
      <div className="w-full h-screen -mt-[60px] justify-center items-center flex flex-col text-center px-8">
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
