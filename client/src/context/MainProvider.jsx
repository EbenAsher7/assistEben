import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MainContext from "./MainContext";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";

const MainProvider = ({ children }) => {
  const { toast } = useToast();
  // Variables de estado
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
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
        setUser(null);
        // Puedes redirigir al usuario a la página de inicio de sesión aquí si es necesario
      }
    }
  }, []);

  // Actualizar localStorage cuando setUser cambie
  useEffect(() => {
    if (user === null || user === undefined) {
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
    const storedHistory = localStorage.getItem("attendanceHistory");
    if (storedHistory) {
      setAttendanceHistory(JSON.parse(storedHistory));
    }
  }, []);

  //Cargar lista de Tutores
  const fetchTutores = async () => {
    try {
      const response = await fetch(`${URL_BASE}/api/tutors`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Transformar los datos
        const formattedData = data.map((tutor) => ({
          value: tutor.id.toString(),
          label: tutor.nombres + " " + tutor.apellidos,
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
  };

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

  //Cargar lista de modulos
  const fetchAllModulosCompleteDataDeleted = async () => {
    if (user) {
      try {
        const response = await fetch(`${URL_BASE}/api/modulesDeleted`, {
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

  //STEPPER
  const [pasoActual, setPasoActual] = useState(0);

  const navegarPaso = (direccion) => {
    if (direccion === -100) {
      setPasoActual(0);
      return 0;
    }

    const LENGTHSTEPS = 3;
    setPasoActual((prevPaso) => {
      const nuevoPaso = prevPaso + direccion;
      return Math.max(0, Math.min(nuevoPaso, LENGTHSTEPS - 1));
    });
  };

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
        fetchTutores,
        fetchModulos,
        fetchAllModulos,
        fetchAllModulosCompleteData,
        fetchAllModulosCompleteDataDeleted,
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
        //STEPPER
        pasoActual,
        setPasoActual,
        navegarPaso,
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
