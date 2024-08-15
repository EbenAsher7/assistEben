import { useContext, useEffect, useState } from "react";
import MainContext from "@/context/MainContext";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "@/components/Admin/AdminNavBar";

const Administration = () => {
  const { user } = useContext(MainContext);
  const navigate = useNavigate();
  const [accessDenied, setAccessDenied] = useState(false);
  const [countdown, setCountdown] = useState(5); // Inicializa el contador en 5 segundos

  // Verificar si el usuario es administrador
  useEffect(() => {
    const CheckPermision = async () => {
      if (user.tipo !== "Administrador") {
        setAccessDenied(true); // Mostrar el mensaje de acceso denegado
        const intervalId = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        setTimeout(() => {
          clearInterval(intervalId); // Limpia el intervalo
          navigate("/"); // Redirige a la página de inicio
        }, 5000);
      }
    };
    CheckPermision();
  }, [user, navigate]);

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
