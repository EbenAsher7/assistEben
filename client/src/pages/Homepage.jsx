import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import InputDebounce from "@/components/UserAttendance/InputDebounce";
import PageRegister from "./PageRegister";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "./Homepage.css";
import FloattingBubble from "@/components/FloatingBubble";
import MainContext from "@/context/MainContext";
import LoaderAE from "@/components/LoaderAE";

const Homepage = () => {
  const { appSettings } = useContext(MainContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.pathname === "/newRegister" ? "registro" : "asistencia");

  useEffect(() => {
    setActiveTab(location.pathname === "/newRegister" ? "registro" : "asistencia");
  }, [location.pathname]);

  const handleTabChange = (value) => {
    const path = value === "registro" ? "/newRegister" : "/";
    navigate(path);
  };

  if (appSettings === null) {
    return (
      <div className="flex w-full h-[80vh] justify-center items-center">
        <LoaderAE texto="Cargando..." />
      </div>
    );
  }

  const { asistencia_activa, registro_activo } = appSettings;

  // Mostrar vista de registro solo cuando estamos en la ruta /newRegister
  if (location.pathname === "/newRegister") {
    if (!registro_activo) {
      return <Navigate to="/" replace />;
    }
    return <RegistroView />;
  }

  // Por defecto, mostrar asistencia en la ruta "/"
  if (location.pathname === "/") {
    // Si ambos están activos, mostrar tabs para elegir
    if (asistencia_activa && registro_activo) {
      return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex justify-center border-b sticky top-[55px] sm:top-[63px] bg-neutral-100 dark:bg-neutral-900 z-40">
            <TabsList>
              <TabsTrigger value="asistencia">Asistencia</TabsTrigger>
              <TabsTrigger value="registro">Registro</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="asistencia">
            <AsistenciaView />
          </TabsContent>
          <TabsContent value="registro">
            <RegistroView />
          </TabsContent>
        </Tabs>
      );
    }

    // Si ninguno está activo, mostrar mensaje
    if (!asistencia_activa && !registro_activo) {
      return (
        <div className="flex w-full h-dvh -mt-20 justify-center items-center text-center p-4">
          <div>
            <h1 className="text-2xl font-bold">Por el momento no tienes acceso a esto.</h1>
            <p className="mt-2">Se habilitará más adelante o consulta con algún tutor asignado.</p>
          </div>
        </div>
      );
    }

    // Siempre mostrar asistencia en "/" por defecto
    return <AsistenciaView />;
  }

  // Fallback para cualquier otra ruta
  return <AsistenciaView />;
};

const AsistenciaView = () => (
  <>
    <FloattingBubble />
    <div className="flex flex-col min-h-dvh -mb-[100px] -mt-[100px]">
      <ul className="circles">
        {[...Array(10)].map((_, i) => (
          <li key={i} className="dark:invert-0 invert"></li>
        ))}
      </ul>
      <div className="flex-grow flex justify-center items-center flex-col sm:flex-row background-pattern">
        <div className="flex flex-col gap-3 justify-center max-w-[400px] items-center sm:mr-24">
          <img src="/cropped-favicon.png" alt="logo Ebenezer" className="hidden sm:inline-flex size-32 sm:size-64 invert dark:invert-0" />
          <img src="/LOGODOCTRINA.webp" alt="logo Ebenezer" className="inline-flex sm:hidden h-16 mb-4 invert-0 dark:invert" />
        </div>
        <div className="flex flex-col gap-3 sm:-mt-12">
          <div className="sm:min-w-[300px] sm:max-w-[700px] w-full flex-1 flex-grow-0">
            <div className="sm:mb-5 px-5 sm:px-0">
              <h1 className="text-center font-serif font-extrabold text-4xl sm:text-6xl mb-2">Registrar asistencia</h1>
              <h2 className="text-center text-sm sm:text-xl font-bold mb-1">Escribe tu nombre y asegúrate que sea el correcto</h2>
              <h3 className="text-center text-xs sm:text-md opacity-40 italic mb-3">*Si hay varios nombres iguales, puedes basarte en el tutor.</h3>
            </div>
            <InputDebounce />
          </div>
        </div>
      </div>
    </div>
  </>
);

const RegistroView = () => (
  <div className="pt-8">
    <PageRegister />
  </div>
);

export default Homepage;
