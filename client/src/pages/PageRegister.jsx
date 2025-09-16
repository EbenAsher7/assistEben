import LoaderAE from "@/components/LoaderAE";
import MainContext from "@/context/MainContext";
import { useEffect, lazy, Suspense, useContext } from "react";

const Step1 = lazy(() => import("@/components/Register/Step1_PersonalData"));
const Step2 = lazy(() => import("@/components/Register/Step2_Module"));
const Step3 = lazy(() => import("@/components/Register/Step3_Tutor"));

const PageRegister = () => {
  const { step, resetRegistrationForm, appSettings } = useContext(MainContext);

  useEffect(() => {
    resetRegistrationForm();
  }, [resetRegistrationForm]);

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

  const CurrentStepComponent = steps[step].component;

  return (
    <div className="container mx-auto p-4 w-full sm:max-w-[1200px]">
      <h1 className="text-4xl font-extrabold text-center">Nueva Inscripción</h1>
      <h2 className="text-lg text-center mb-4">Llena los datos requeridos para continuar con la inscripción</h2>

      {steps.length > 1 && (
        <div className="flex items-center justify-center p-4">
          {steps.map((s, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    step >= index ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700"
                  }`}
                >
                  {index + 1}
                </div>
                <p className={`mt-2 text-xs text-center ${step === index ? "font-bold" : ""}`}>{s.label.split(".")[1].trim()}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-auto border-t-2 transition-colors duration-300 mx-4 w-16 sm:w-24 border-gray-300"></div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Suspense fallback={<LoaderAE texto="Cargando paso..." />}>
          <CurrentStepComponent isLastStep={step === steps.length - 1} />
        </Suspense>
      </div>
    </div>
  );
};

export default PageRegister;
