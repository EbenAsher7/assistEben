import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import MainContext from "./MainContext";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";

const MainProvider = ({ children }) => {
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [appSettings, setAppSettings] = useState(null);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [maxAttendanceByDay, setMaxAttendanceByDay] = useState(5);
  const [attendanceHistory, setAttendanceHistory] = useState({});

  // ==================== NUEVO: Estado de idioma ====================
  const [language, setLanguage] = useState(() => {
    // Intenta obtener el idioma guardado en localStorage
    const savedLanguage = localStorage.getItem("appLanguage");
    return savedLanguage || "es"; // Por defecto español
  });

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLanguage = prev === "es" ? "en" : "es";
      localStorage.setItem("appLanguage", newLanguage); // Guardar en localStorage
      return newLanguage;
    });
  };
  // ================================================================

  const fetchAppSettings = useCallback(async () => {
    try {
      const response = await fetch(`${URL_BASE}/public/settings`);
      if (response.ok) {
        const data = await response.json();
        setAppSettings(data);
      } else {
        throw new Error("API failed to provide settings.");
      }
    } catch (error) {
      setAppSettings({
        asistencia_activa: false,
        registro_activo: true,
        preguntas_activas: false,
        registro_completo_activo: false,
      });
    }
  }, []);

  useEffect(() => {
    fetchAppSettings();
  }, [fetchAppSettings]);

  useEffect(() => {
    const storedIsLogin = localStorage.getItem("isLogin");
    if (storedIsLogin !== null) {
      setIsLogin(JSON.parse(storedIsLogin));
    }
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const loginExpiration = localStorage.getItem("loginExpiration");
    if (loginExpiration) {
      const expirationTime = parseInt(loginExpiration, 10);
      const now = new Date().getTime();
      if (now > expirationTime) {
        localStorage.clear();
        alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        setIsLogin(false);
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    if (user === null || user === undefined) {
      localStorage.removeItem("user");
      localStorage.removeItem("loginTimestamp");
      localStorage.removeItem("loginExpiration");
      localStorage.setItem("isLogin", "false");
    } else {
      localStorage.setItem("user", JSON.stringify(user));
      const now = new Date();
      const expiration = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);
      localStorage.setItem("loginTimestamp", now.getTime().toString());
      localStorage.setItem("loginExpiration", expiration.getTime().toString());
      localStorage.setItem("isLogin", "true");
    }
  }, [user]);

  const checkAttendanceStatus = (alumnoId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const isTutor = user && ["Tutor", "Administrador"].includes(user.tipo);
    const today = new Date().toISOString().slice(0, 10);
    const storedHistory =
      JSON.parse(localStorage.getItem("attendanceHistory")) || {};

    if (isTutor) {
      return !(
        storedHistory[today] &&
        storedHistory[today].asistencias.some((a) => a.id === alumnoId)
      );
    } else {
      const todayHistory = storedHistory[today] || { asistencias: [] };
      const attendanceCount = todayHistory.asistencias.length;
      return attendanceCount < maxAttendanceByDay;
    }
  };

  useEffect(() => {
    const storedHistory = localStorage.getItem("attendanceHistory");
    if (storedHistory) {
      setAttendanceHistory(JSON.parse(storedHistory));
    }
  }, []);

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
        return data.map((tutor) => ({
          value: tutor.id.toString(),
          label: tutor.nombres + " " + tutor.apellidos,
        }));
      } else {
        throw new Error("Failed to fetch tutors");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al consultar los tutores.",
        duration: 2500,
      });
    }
  };

  const fetchTutoresDeleted = async () => {
    try {
      const response = await fetch(`${URL_BASE}/api/tutorsDeleted`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.map((tutor) => ({
          ...tutor,
          value: tutor.id.toString(),
          label: tutor.nombres + " " + tutor.apellidos,
        }));
      } else {
        throw new Error("Failed to fetch deleted tutors");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al consultar los tutores eliminados.",
        duration: 2500,
      });
    }
  };

  const fetchModulos = async (tutorID) => {
    if (tutorID) {
      try {
        const response = await fetch(
          `${URL_BASE}/api/modulesByTutor/${tutorID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: user?.token,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          return data.map((curso) => ({
            value: curso.id.toString(),
            label: curso.nombre,
          }));
        } else {
          throw new Error("Failed to fetch modules");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al consultar los módulos.",
          duration: 2500,
        });
      }
    }
  };

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
          return data.map((curso) => ({
            value: curso.id.toString(),
            label: curso.nombre,
          }));
        } else {
          throw new Error("Failed to fetch all modules");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al consultar los módulos.",
          duration: 2500,
        });
      }
    }
  };

  const fetchModulesAndTutors = async (id_module) => {
    if (user) {
      try {
        const response = await fetch(
          `${URL_BASE}/api/modulesAndTutors/${id_module}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: user?.token,
            },
          }
        );

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
          description:
            "Ocurrió un error al consultar los tutores asignados a los módulos disponibles.",
          duration: 2500,
        });
      }
    }
  };

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

  const deleteTutoresModulos = async (id_moduleTutors) => {
    if (user) {
      try {
        const response = await fetch(
          `${URL_BASE}/api/modulesAndTutors/${id_moduleTutors}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: user?.token,
            },
          }
        );

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
          description:
            "Ocurrió un error al consultar los tutores asignados a los módulos disponibles.",
          duration: 2500,
        });
      }
    }
  };

  const addTutoresModulos = async (idModule, idTutor) => {
    if (user) {
      try {
        const response = await fetch(`${URL_BASE}/api/modulesAndTutors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token,
          },
          body: JSON.stringify({ idModule, idTutor }),
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
          description:
            "Ocurrió un error al consultar los tutores asignados a los módulos disponibles.",
          duration: 2500,
        });
      }
    }
  };

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

  const [nombresNEW, setNombresNEW] = useState("");
  const [apellidosNEW, setApellidosNEW] = useState("");
  const [fechaNacimientoNEW, setFechaNacimientoNEW] = useState("");
  const [prefijoNEW, setPrefijoNEW] = useState("");
  const [telefonoNEW, setTelefonoNEW] = useState("");
  const [direccionNEW, setDireccionNEW] = useState("");
  const [correoNEW, setCorreoNEW] = useState("");
  const [iglesiaNEW, setIglesiaNEW] = useState("");
  const [pastorNEW, setPastorNEW] = useState("");
  const [privilegioNEW, setPrivilegioNEW] = useState("");
  const [paisNEW, setPaisNEW] = useState("");
  const [modalidadNEW, setModalidadNEW] = useState("");
  const [cursoSeleccionadoNEW, setCursoSeleccionadoNEW] = useState(null);
  const [step, setStep] = useState(0);

  const navigateStep = (direction) => {
    setStep((prev) => Math.max(0, Math.min(prev + direction, 2)));
  };

  const resetRegistrationForm = useCallback(() => {
    setNombresNEW("");
    setApellidosNEW("");
    setFechaNacimientoNEW("");
    setPrefijoNEW("");
    setTelefonoNEW("");
    setDireccionNEW("");
    setCorreoNEW("");
    setIglesiaNEW("");
    setPastorNEW("");
    setPrivilegioNEW("");
    setPaisNEW("");
    setModalidadNEW("");
    setCursoSeleccionadoNEW(null);
    setStep(0);
  }, []);

  return (
    <MainContext.Provider
      value={{
        isLogin,
        setIsLogin,
        user,
        setUser,
        appSettings,
        fetchAppSettings,
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
        fetchModulesAndTutors,
        deleteTutoresModulos,
        addTutoresModulos,
        fetchTutoresDeleted,
        nombresNEW,
        setNombresNEW,
        apellidosNEW,
        setApellidosNEW,
        fechaNacimientoNEW,
        setFechaNacimientoNEW,
        prefijoNEW,
        setPrefijoNEW,
        telefonoNEW,
        setTelefonoNEW,
        direccionNEW,
        setDireccionNEW,
        correoNEW,
        setCorreoNEW,
        iglesiaNEW,
        setIglesiaNEW,
        pastorNEW,
        setPastorNEW,
        privilegioNEW,
        setPrivilegioNEW,
        paisNEW,
        setPaisNEW,
        modalidadNEW,
        setModalidadNEW,
        cursoSeleccionadoNEW,
        setCursoSeleccionadoNEW,
        maxAttendanceByDay,
        setMaxAttendanceByDay,
        step,
        navigateStep,
        resetRegistrationForm,
        // ==================== NUEVO: Agregar al value ====================
        language,
        toggleLanguage,
        // ================================================================
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
