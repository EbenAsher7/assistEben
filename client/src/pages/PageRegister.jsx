import LoaderAE from "@/components/LoaderAE";
import MainContext from "@/context/MainContext";
import { useState, useEffect, lazy, Suspense, useContext } from "react";

const Step1 = lazy(() => import("@/components/Register/Step1_PersonalData"));
const Step2 = lazy(() => import("@/components/Register/Step2_Module"));
const Step3 = lazy(() => import("@/components/Register/Step3_Tutor"));

const PageRegister = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const { step, resetRegistrationForm, appSettings } = useContext(MainContext);

  // Espera a que appSettings se cargue antes de definir los pasos
  if (appSettings === null) {
    return (
      <div className="flex w-full h-[50vh] justify-center items-center">
        <LoaderAE texto="Cargando configuración del registro..." />
      </div>
    );
  }

  const steps = appSettings.registro_completo_activo
    ? [
        { label: "1. Datos Personales", component: Step1 },
        { label: "2. Módulos", component: Step2 },
        { label: "3. Tutores", component: Step3 },
      ]
    : [{ label: "1. Datos Personales", component: Step1 }];

  useEffect(() => {
    resetRegistrationForm();
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resetRegistrationForm]);

  const CurrentStepComponent = steps[step].component;

  return (
    <div className="container mx-auto p-4 w-full sm:max-w-[1200px] min-w-[400px] sm:w-[600px]">
      <h1 className="text-4xl font-extrabold mt-8 text-center sm:mt-0">Nuevo Registro</h1>
      <h2 className="text-lg text-center mb-4">Llena los datos requeridos para continuar con el registro</h2>

      <nav className={`mb-4 ${isDesktop ? "flex items-center justify-center" : "space-y-4"}`}>
        {steps.map((s, index) => (
          <div key={index} className={isDesktop ? "flex items-center" : "mb-4"}>
            <div className={`${isDesktop ? "flex items-center" : "p-4 border rounded shadow-lg"} transition-all duration-300 ease-in-out`}>
              <h3
                className={`${isDesktop ? "text-base" : "text-2xl font-medium"} ${
                  index === step ? "text-blue-600 dark:text-blue-400 font-black" : "text-gray-600 dark:text-gray-500 text-lg font-extralight"
                }`}
              >
                {s.label}
              </h3>
            </div>
            {isDesktop && index < steps.length - 1 && <span className="mx-2 text-gray-400">&gt;</span>}
          </div>
        ))}
      </nav>

      <div>
        <Suspense fallback={<LoaderAE texto="Cargando paso..." />}>
          <CurrentStepComponent isLastStep={step === steps.length - 1} />
        </Suspense>
      </div>
    </div>
  );
};

export default PageRegister;
