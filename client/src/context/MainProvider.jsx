import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MainContext from "./MainContext";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";

const MainProvider = ({ children }) => {
  const { toast } = useToast();
  // Variables de estado
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({});
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);

  const { nombres, apellidos, id } = alumnoSeleccionado || {};

  // Estado para guardar el historial de asistencias
  const [attendanceHistory, setAttendanceHistory] = useState({});
  // Estado para guardar el último registro de asistencia
  const [lastAttendance, setLastAttendance] = useState(null);

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

  // Efecto para registrar la asistencia si hay un cambio en alumnoSeleccionado y existe tipo
  useEffect(() => {
    if (alumnoSeleccionado && alumnoSeleccionado.tipo) {
      const registerAttendance = async () => {
        try {
          const response = await fetch(`${URL_BASE}/api/user/registerAttendance`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              alumno_id: id,
              fecha: new Date().toISOString().split("T")[0],
              pregunta: alumnoSeleccionado.Pregunta || "",
              tipo: alumnoSeleccionado.tipo,
            }),
          });

          if (response.ok) {
            const now = new Date();
            const fechaActual = now.toISOString().split("T")[0];

            // Construir objeto de asistencia
            const attendanceData = {
              id,
              nombres,
              apellidos,
              fecha: fechaActual,
            };

            // Actualizar historial de asistencias
            setAttendanceHistory((prevHistory) => {
              // Clonar el historial para no mutar el estado directamente
              const newHistory = { ...prevHistory };

              // Verificar si hay un registro para la fecha actual
              if (!newHistory[fechaActual]) {
                newHistory[fechaActual] = { asistencias: [] };
              }

              // Añadir la nueva asistencia al registro correspondiente
              newHistory[fechaActual].asistencias.push(attendanceData);

              // Limpiar registros antiguos si la fecha es mayor a un mes
              const cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Restar un mes
              Object.keys(newHistory).forEach((fecha) => {
                if (new Date(fecha) < cutoffDate) {
                  delete newHistory[fecha];
                }
              });

              // Guardar en localStorage
              localStorage.setItem("attendanceHistory", JSON.stringify(newHistory));

              return newHistory;
            });

            // Guardar en localStorage solo si es un registro nuevo
            if (!lastAttendance || lastAttendance.fecha !== fechaActual) {
              setLastAttendance(attendanceData);
              localStorage.setItem("lastAttendance", JSON.stringify(attendanceData));
            }
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Ocurrió un error al registrar asistencia.",
              duration: 2500,
            });
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Ocurrió un error al registrar asistencia.",
            duration: 2500,
          });
        }
      };

      registerAttendance();
    }
  }, [alumnoSeleccionado, nombres, apellidos, id, toast, lastAttendance]);

  // Cargar historial de asistencias desde localStorage al iniciar
  useEffect(() => {
    const storedHistory = localStorage.getItem("attendanceHistory");
    if (storedHistory) {
      setAttendanceHistory(JSON.parse(storedHistory));
    }
  }, []);

  // RETURN
  return (
    <MainContext.Provider
      value={{
        isLogin,
        setIsLogin,
        user,
        setUser,
        alumnoSeleccionado,
        setAlumnoSeleccionado,
        attendanceHistory,
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
