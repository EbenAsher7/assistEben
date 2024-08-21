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

  // Estado para guardar el historial de asistencias
  const [attendanceHistory, setAttendanceHistory] = useState({});
  // Estado para guardar el último registro de asistencia
  // const [lastAttendance, setLastAttendance] = useState(null);

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

  // Función para verificar si una fecha está dentro del último mes
  const isWithinLastMonth = (date) => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return new Date(date) >= oneMonthAgo;
  };

  const checkAttendanceStatus = (alumnoId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const isTutor = user && ["Tutor", "Administrador"].includes(user.tipo);
    const today = new Date().toISOString().slice(0, 10);
    const storedHistory = JSON.parse(localStorage.getItem("attendanceHistory")) || {};

    if (isTutor) {
      // Para tutores, verificar si el alumno específico ya está registrado hoy
      return !(storedHistory[today] && storedHistory[today].asistencias.some((a) => a.id === alumnoId));
    } else {
      // Para usuarios no registrados, verificar si ya se hizo algún registro hoy
      return !(storedHistory[today] && storedHistory[today].asistencias.length > 0);
    }
  };

  useEffect(() => {
    if (alumnoSeleccionado && alumnoSeleccionado.tipo) {
      const registerAttendance = async () => {
        const now = new Date();
        const fechaActual = now.toISOString().split("T")[0];
        try {
          const response = await fetch(`${URL_BASE}/api/user/registerAttendance`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              alumno_id: alumnoSeleccionado.id,
              fecha: fechaActual,
              pregunta: alumnoSeleccionado.pregunta || "",
              tipo: alumnoSeleccionado.tipo,
            }),
          });
          if (response.ok) {
            const attendanceData = {
              id: alumnoSeleccionado.id,
              nombres: alumnoSeleccionado.nombres,
              apellidos: alumnoSeleccionado.apellidos,
              fecha: fechaActual,
            };
            setAttendanceHistory(() => {
              const storedHistory = JSON.parse(localStorage.getItem("attendanceHistory")) || {};
              if (!isWithinLastMonth(fechaActual)) {
                localStorage.removeItem("attendanceHistory");
                localStorage.removeItem("lastAttendance");
                return { [fechaActual]: { asistencias: [attendanceData] } };
              }
              const newHistory = { ...storedHistory };
              if (!newHistory[fechaActual]) {
                newHistory[fechaActual] = { asistencias: [] };
              }
              newHistory[fechaActual].asistencias.push(attendanceData);
              localStorage.setItem("attendanceHistory", JSON.stringify(newHistory));
              localStorage.setItem("lastAttendance", JSON.stringify(attendanceData));
              return newHistory;
            });
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
  }, [alumnoSeleccionado, toast]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("attendanceHistory");
    if (storedHistory) {
      setAttendanceHistory(JSON.parse(storedHistory));
    }
  }, []);

  //Cargar lista de modulos
  const fetchModulos = async (tutorID) => {
    if (tutorID) {
      try {
        const response = await fetch(`${URL_BASE}/api/modulesByTutor/${tutorID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Transformar los datos
          const formattedData = data.map((curso) => ({
            value: curso.id.toString(),
            label: curso.nombre,
          }));
          return formattedData;
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al consultar los módulos disponibles.",
          duration: 2500,
        });
      }
    }
  };

  //Cargar lista de modulos
  const fetchAllModulos = async () => {
    if (user) {
      try {
        const response = await fetch(`${URL_BASE}/api/modules`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Transformar los datos
          const formattedData = data.map((curso) => ({
            value: curso.id.toString(),
            label: curso.nombre,
          }));
          return formattedData;
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al consultar los módulos disponibles.",
          duration: 2500,
        });
      }
    }
  };

  //Cargar lista de modulos
  const fetchAllModulosCompleteData = async () => {
    if (user) {
      try {
        const response = await fetch(`${URL_BASE}/api/modules`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          return data;
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al consultar los módulos disponibles.",
          duration: 2500,
        });
      }
    }
  };

  //DATOS PARA EL REGISTRO NUEVO
  const [nombresNEW, setNombresNEW] = useState("");
  const [apellidosNEW, setApellidosNEW] = useState("");
  const [fechaNacimientoNEW, setFechaNacimientoNEW] = useState("");
  const [telefonoNEW, setTelefonoNEW] = useState("");
  const [direccionNEW, setDireccionNEW] = useState("");
  const [cursoSeleccionadoNEW, setCursoSeleccionadoNEW] = useState(null);

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
        setAttendanceHistory,
        checkAttendanceStatus,
        fetchModulos,
        fetchAllModulos,
        fetchAllModulosCompleteData,
        //NUEVO REGISTRO
        nombresNEW,
        setNombresNEW,
        apellidosNEW,
        setApellidosNEW,
        fechaNacimientoNEW,
        setFechaNacimientoNEW,
        telefonoNEW,
        setTelefonoNEW,
        direccionNEW,
        setDireccionNEW,
        cursoSeleccionadoNEW,
        setCursoSeleccionadoNEW,
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
