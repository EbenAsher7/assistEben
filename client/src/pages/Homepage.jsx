import { useContext } from "react";
import InputDebounce from "@/components/UserAttendance/InputDebounce";
import "./Homepage.css";
import FloattingBubble from "@/components/FloatingBubble";
import { Link } from "react-router-dom";
import MainContext from "@/context/MainContext";
import LoaderAE from "@/components/LoaderAE";

const Homepage = () => {
  const { appSettings } = useContext(MainContext);

  if (appSettings === null) {
    return (
      <div className="flex w-full h-[80vh] justify-center items-center">
        <LoaderAE texto="Cargando..." />
      </div>
    );
  }

  return (
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
            {appSettings.asistencia_activa && (
              <div className="sm:min-w-[300px] sm:max-w-[700px] w-full flex-1 flex-grow-0">
                <div className="sm:mb-5 px-5 sm:px-0">
                  <h1 className="text-center font-serif font-extrabold text-4xl sm:text-6xl mb-2">Registrar asistencia</h1>
                  <h2 className="text-center text-sm sm:text-xl font-bold mb-1">Escribe tu nombre y asegúrate que sea el correcto</h2>
                  <h3 className="text-center text-xs sm:text-md opacity-40 italic mb-3">
                    *Si hay varios nombres iguales, puedes basarte en el tutor.
                  </h3>
                </div>
                <InputDebounce />
              </div>
            )}
            {appSettings.registro_activo && (
              <div className="text-center mt-12">
                <p className="mb-2">¿No estás en la lista?</p>
                <Link
                  to="/newRegister"
                  className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Inscríbete Aquí
                </Link>
              </div>
            )}
            {!appSettings.asistencia_activa && !appSettings.registro_activo && (
              <div className="text-center p-4">
                <h1 className="text-2xl font-bold">Módulo no disponible</h1>
                <p>Las funciones de asistencia y registro están desactivadas por el momento.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
