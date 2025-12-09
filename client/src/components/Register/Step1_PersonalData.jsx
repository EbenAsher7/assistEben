import { useState, useContext, useEffect } from "react";
import { Input } from "@/components/ui/input";
import MainContext from "@/context/MainContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import PhoneInput from "@/components/ui/PhoneInput";
import { useToast } from "@/components/ui/use-toast";
import { URL_BASE } from "@/config/config";
import { useNavigate } from "react-router-dom";
import LoaderAE from "../LoaderAE";
import PropTypes from "prop-types";
import CRSelect from "../Preguntas/CRSelect";
import { prefijos } from "@/context/prefijos";
import { cn } from "@/lib/utils";
import { translations } from "@/translations/registerTranslations";

const Step1_PersonalData = ({ isLastStep, language }) => {
  const {
    navigateStep,
    nombresNEW,
    setNombresNEW,
    apellidosNEW,
    setApellidosNEW,
    prefijoNEW,
    setPrefijoNEW,
    telefonoNEW,
    setTelefonoNEW,
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
    resetRegistrationForm,
  } = useContext(MainContext);

  console.log("===== Step1 Render =====");
  console.log("Language received as PROP:", language);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Obtener traducciones
  const t = translations[language || "es"].step1;

  const paisesOptions = prefijos[0]
    ? Object.keys(prefijos[0])
        .map((pais) => ({
          value: pais,
          label: pais,
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
    : [];

  const modalidadOptions = [
    {
      value: "Presencial",
      label: language === "en" ? "In-Person" : "Presencial",
    },
    { value: "Zoom", label: "Zoom" },
    { value: "Rhema TV", label: "Rhema TV" },
    { value: "Youtube", label: "Youtube" },
  ];

  const handleBlur = (e) => {
    const { id } = e.target;
    setTouched((prev) => ({ ...prev, [id]: true }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (nombresNEW.trim().length < 6) newErrors.nombres = t.errors.nombres;
    if (apellidosNEW.trim().length < 3)
      newErrors.apellidos = t.errors.apellidos;
    if (!/^\d{6,}$/.test(telefonoNEW)) newErrors.telefono = t.errors.telefono;
    if (!prefijoNEW) newErrors.prefijo = t.errors.prefijo;
    if (!paisNEW) newErrors.pais = t.errors.pais;
    if (!/\S+@\S+\.\S+/.test(correoNEW)) newErrors.correo = t.errors.correo;
    if (!iglesiaNEW.trim()) newErrors.iglesia = t.errors.iglesia;
    if (!pastorNEW.trim()) newErrors.pastor = t.errors.pastor;
    if (!privilegioNEW.trim()) newErrors.privilegio = t.errors.privilegio;
    if (!modalidadNEW) newErrors.modalidad = t.errors.modalidad;
    return newErrors;
  };

  useEffect(() => {
    const validationErrors = validateForm();
    setErrors(validationErrors);
  }, [
    nombresNEW,
    apellidosNEW,
    telefonoNEW,
    prefijoNEW,
    paisNEW,
    correoNEW,
    iglesiaNEW,
    pastorNEW,
    privilegioNEW,
    modalidadNEW,
    language,
  ]);

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${URL_BASE}/api/user/registerAlumno`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombres: nombresNEW,
          apellidos: apellidosNEW,
          prefijo: prefijoNEW,
          telefono: telefonoNEW,
          email: correoNEW,
          iglesia: iglesiaNEW,
          pastor: pastorNEW,
          privilegio: privilegioNEW,
          pais: paisNEW,
          modalidad: modalidadNEW,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t.toast.errorTitle);
      }

      toast({
        variant: "success",
        title: t.toast.successTitle,
        description: t.toast.successDescription,
        duration: 4000,
      });
      resetRegistrationForm();
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: t.toast.errorTitle,
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNextClick = () => {
    const currentErrors = validateForm();
    if (Object.keys(currentErrors).length === 0) {
      if (isLastStep) {
        handleFinalSubmit();
      } else {
        navigateStep(1);
      }
    } else {
      setTouched({
        nombres: true,
        apellidos: true,
        telefono: true,
        prefijo: true,
        correo: true,
        pais: true,
        iglesia: true,
        pastor: true,
        privilegio: true,
        modalidad: true,
      });
      toast({
        variant: "destructive",
        title: t.toast.incompleteTitle,
        description: t.toast.incompleteDescription,
        duration: 3000,
      });
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <LoaderAE texto={t.finalizingRegistration} />
        </div>
      )}
      <fieldset
        disabled={loading}
        className="w-full justify-center flex items-center"
      >
        <div className="container mx-auto px-4 mb-6 rounded-md">
          <h3 className="text-xl font-extrabold text-center pb-6 px-4">
            {t.title}
          </h3>
          <h1 className="text-red-500 text-sm italic font-normal text-center mb-8">
            {t.requiredFields}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            {/* NOMBRES */}
            <div className="mb-2">
              <Label htmlFor="nombres">
                {t.labels.nombres} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombres"
                placeholder={t.placeholders.nombres}
                value={nombresNEW}
                onChange={(e) => setNombresNEW(e.target.value)}
                onBlur={handleBlur}
                className={cn(
                  touched.nombres && errors.nombres && "border-red-500"
                )}
              />
              {touched.nombres && errors.nombres && (
                <p className="text-red-500 text-xs mt-1">{errors.nombres}</p>
              )}
            </div>

            {/* APELLIDOS */}
            <div className="mb-2">
              <Label htmlFor="apellidos">
                {t.labels.apellidos} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="apellidos"
                placeholder={t.placeholders.apellidos}
                value={apellidosNEW}
                onChange={(e) => setApellidosNEW(e.target.value)}
                onBlur={handleBlur}
                className={cn(
                  touched.apellidos && errors.apellidos && "border-red-500"
                )}
              />
              {touched.apellidos && errors.apellidos && (
                <p className="text-red-500 text-xs mt-1">{errors.apellidos}</p>
              )}
            </div>

            {/* TELÉFONO */}
            <div className="mb-2">
              <Label htmlFor="phone">
                {t.labels.telefono} <span className="text-red-500">*</span>
              </Label>
              <div
                onBlur={() =>
                  setTouched((prev) => ({
                    ...prev,
                    telefono: true,
                    prefijo: true,
                  }))
                }
              >
                <PhoneInput
                  onPrefixChange={setPrefijoNEW}
                  onPhoneChange={setTelefonoNEW}
                  defaultPrefix={prefijoNEW}
                  defaultPhone={telefonoNEW}
                />
              </div>
              {touched.telefono && errors.telefono && (
                <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
              )}
              {touched.prefijo && errors.prefijo && !errors.telefono && (
                <p className="text-red-500 text-xs mt-1">{errors.prefijo}</p>
              )}
            </div>

            {/* CORREO */}
            <div className="mb-2">
              <Label htmlFor="correo">
                {t.labels.correo} <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                id="correo"
                placeholder={t.placeholders.correo}
                value={correoNEW}
                onChange={(e) => setCorreoNEW(e.target.value)}
                onBlur={handleBlur}
                className={cn(
                  touched.correo && errors.correo && "border-red-500"
                )}
              />
              {touched.correo && errors.correo && (
                <p className="text-red-500 text-xs mt-1">{errors.correo}</p>
              )}
            </div>

            {/* PAÍS */}
            <div className="mb-2">
              <div
                onBlur={() => setTouched((prev) => ({ ...prev, pais: true }))}
              >
                <CRSelect
                  title={t.labels.pais}
                  require={true}
                  data={paisesOptions}
                  value={paisNEW}
                  onChange={setPaisNEW}
                  placeholder={t.placeholders.pais}
                  searchPlaceholder={t.placeholders.paisSearch}
                />
              </div>
              {touched.pais && errors.pais && (
                <p className="text-red-500 text-xs mt-1">{errors.pais}</p>
              )}
            </div>

            {/* IGLESIA */}
            <div className="mb-2">
              <Label htmlFor="iglesia">
                {t.labels.iglesia} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="iglesia"
                placeholder={t.placeholders.iglesia}
                value={iglesiaNEW}
                onChange={(e) => setIglesiaNEW(e.target.value)}
                onBlur={handleBlur}
                className={cn(
                  touched.iglesia && errors.iglesia && "border-red-500"
                )}
              />
              {touched.iglesia && errors.iglesia && (
                <p className="text-red-500 text-xs mt-1">{errors.iglesia}</p>
              )}
            </div>

            {/* PASTOR */}
            <div className="mb-2">
              <Label htmlFor="pastor">
                {t.labels.pastor} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pastor"
                placeholder={t.placeholders.pastor}
                value={pastorNEW}
                onChange={(e) => setPastorNEW(e.target.value)}
                onBlur={handleBlur}
                className={cn(
                  touched.pastor && errors.pastor && "border-red-500"
                )}
              />
              {touched.pastor && errors.pastor && (
                <p className="text-red-500 text-xs mt-1">{errors.pastor}</p>
              )}
            </div>

            {/* PRIVILEGIO */}
            <div className="mb-2">
              <Label htmlFor="privilegio">
                {t.labels.privilegio} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="privilegio"
                placeholder={t.placeholders.privilegio}
                value={privilegioNEW}
                onChange={(e) => setPrivilegioNEW(e.target.value)}
                onBlur={handleBlur}
                className={cn(
                  touched.privilegio && errors.privilegio && "border-red-500"
                )}
              />
              {touched.privilegio && errors.privilegio && (
                <p className="text-red-500 text-xs mt-1">{errors.privilegio}</p>
              )}
            </div>

            {/* MODALIDAD */}
            <div className="mb-2 md:col-span-2">
              <div
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, modalidad: true }))
                }
              >
                <CRSelect
                  title={t.labels.modalidad}
                  require={true}
                  data={modalidadOptions}
                  value={modalidadNEW}
                  onChange={setModalidadNEW}
                  placeholder={t.placeholders.modalidad}
                />
              </div>
              {touched.modalidad && errors.modalidad && (
                <p className="text-red-500 text-xs mt-1">{errors.modalidad}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button
              onClick={handleNextClick}
              disabled={loading}
              className="px-8 py-6 disabled:opacity-70"
            >
              {isLastStep ? t.buttons.finish : t.buttons.next}
            </Button>
          </div>
        </div>
      </fieldset>
    </>
  );
};

Step1_PersonalData.propTypes = {
  isLastStep: PropTypes.bool.isRequired,
  language: PropTypes.string.isRequired, // <--- AGREGA ESTO
};

export default Step1_PersonalData;
