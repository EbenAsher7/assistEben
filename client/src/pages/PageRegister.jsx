import MainContext from "@/context/MainContext";
import { useState, useEffect, lazy, Suspense, useContext } from "react";

const NewRegister = lazy(() => import("./NewRegister"));
const NewRegisterTutores = lazy(() => import("./NewRegisterTutores"));
const NewRegisterModulos = lazy(() => import("./NewRegisterModulos"));

const RegistroPagina = () => {
  const [esEscritorio, setEsEscritorio] = useState(window.innerWidth > 768);

  const { pasoActual } = useContext(MainContext);

  const pasos = [
    { label: "1. Datos Personales", component: <NewRegister /> },
    { label: "2. Seleccionar Módulos", component: <NewRegisterModulos /> },
    { label: "3. Seleccionar Tutores", component: <NewRegisterTutores /> },
  ];

  // CAMBIAR ESTILO SEGUN TAMAÑO DE PANTALLA
  useEffect(() => {
    const manejarCambioTamano = () => {
      setEsEscritorio(window.innerWidth > 768);
    };
    window.addEventListener("resize", manejarCambioTamano);
    return () => window.removeEventListener("resize", manejarCambioTamano);
  }, []);

  return (
    <div className="container mx-auto p-4">
      {/* BARRA DE NAVEGACION */}
      <nav className={`mb-4 ${esEscritorio ? "flex items-center justify-center" : "space-y-4"}`}>
        {pasos.map((paso, index) => (
          <div key={index} className={esEscritorio ? "flex items-center" : "mb-4"}>
            <div
              className={`
              ${esEscritorio ? "flex items-center" : "p-4 border rounded shadow-md"}
              transition-all duration-300 ease-in-out
            `}
            >
              <h3
                className={`
                ${esEscritorio ? "text-sm" : "text-lg font-medium"}
                ${index === pasoActual ? "text-blue-600" : "text-gray-600"}
              `}
              >
                {paso.label}
              </h3>
              {!esEscritorio && index === pasoActual && (
                <div className="mt-4">
                  <Suspense fallback={<div>Cargando...</div>}>{paso.component}</Suspense>
                  {/* <BotonesNavegacion /> */}
                </div>
              )}
            </div>
            {esEscritorio && index < pasos.length - 1 && <span className="mx-2 text-gray-400">&gt;</span>}
          </div>
        ))}
      </nav>

      {esEscritorio && (
        <div>
          <Suspense fallback={<div className="text-center">Cargando...</div>}>{pasos[pasoActual].component}</Suspense>
          {/* <BotonesNavegacion /> */}
        </div>
      )}
    </div>
  );
};

export default RegistroPagina;
