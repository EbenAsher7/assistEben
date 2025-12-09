import LoaderAE from "@/components/LoaderAE";
import MainContext from "@/context/MainContext";
import { useEffect, lazy, Suspense, useContext, useState } from "react";
import { translations } from "@/translations/registerTranslations";

const Step1 = lazy(() => import("@/components/Register/Step1_PersonalData"));
const Step2 = lazy(() => import("@/components/Register/Step2_Module"));
const Step3 = lazy(() => import("@/components/Register/Step3_Tutor"));

const PageRegister = () => {
  const { step, resetRegistrationForm, appSettings } = useContext(MainContext);

  const [language, setLanguage] = useState("es");
  console.log("Language in PageRegister:", language);

  const t = translations[language];

  useEffect(() => {
    resetRegistrationForm();
  }, [resetRegistrationForm]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "es" ? "en" : "es"));
  };

  if (appSettings === null) {
    return (
      <div className="flex w-full h-[50vh] justify-center items-center">
        <LoaderAE texto={t.loading} />
      </div>
    );
  }

  const steps = appSettings.registro_completo_activo
    ? [
        { label: `1. ${t.steps.personalData}`, component: Step1 },
        { label: `2. ${t.steps.modules}`, component: Step2 },
        { label: `3. ${t.steps.tutors}`, component: Step3 },
      ]
    : [{ label: `1. ${t.steps.personalData}`, component: Step1 }];

  const CurrentStepComponent = steps[step].component;

  return (
    <div className="container mx-auto p-4 w-full sm:max-w-[1200px]">
      {/* Botón de traducción */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-md"
          aria-label="Change language"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
          <span className="font-semibold">
            {language === "es" ? "EN" : "ES"}
          </span>
        </button>
      </div>

      <h1 className="text-4xl font-extrabold text-center">{t.title}</h1>
      <h2 className="text-lg text-center mb-4">{t.subtitle}</h2>

      {steps.length > 1 && (
        <div className="flex items-center justify-center p-4">
          {steps.map((s, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    step >= index
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 dark:bg-gray-700"
                  }`}
                >
                  {index + 1}
                </div>
                <p
                  className={`mt-2 text-xs text-center ${
                    step === index ? "font-bold" : ""
                  }`}
                >
                  {s.label.split(".")[1].trim()}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-auto border-t-2 transition-colors duration-300 mx-4 w-16 sm:w-24 border-gray-300"></div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Suspense fallback={<LoaderAE texto={t.loadingStep} />}>
          <CurrentStepComponent
            key={language}
            isLastStep={step === steps.length - 1}
            language={language} // <--- AGREGA ESTA LÍNEA
          />
        </Suspense>
      </div>
    </div>
  );
};

export default PageRegister;
