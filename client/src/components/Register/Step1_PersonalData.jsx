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

const Step1_PersonalData = ({ isLastStep }) => {
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

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const paisesOptions = prefijos[0]
    ? Object.keys(prefijos[0])
        .map((pais) => ({
          value: pais,
          label: pais,
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
    : [];

  const modalidadOptions = [
    { value: "Presencial", label: "Presencial" },
    { value: "Virtual", label: "Virtual (ZOOM)" },
  ];

  const handleBlur = (e) => {
    const { id } = e.target;
    setTouched((prev) => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    const validate = () => {
      const newErrors = {};
      if (nombresNEW.trim().length < 3) newErrors.nombres = "El nombre es obligatorio (mín. 3 caracteres).";
      if (apellidosNEW.trim().length < 3) newErrors.apellidos = "El apellido es obligatorio (mín. 3 caracteres).";
      if (!/^\d{7,}$/.test(telefonoNEW)) newErrors.telefono = "El teléfono debe tener al menos 7 dígitos.";
      if (!prefijoNEW) newErrors.prefijo = "Seleccione un prefijo.";
      if (!paisNEW) newErrors.pais = "El país es obligatorio.";
      if (!/\S+@\S+\.\S+/.test(correoNEW)) newErrors.correo = "Ingrese un correo electrónico válido.";
      if (!iglesiaNEW.trim()) newErrors.iglesia = "El nombre de la iglesia es obligatorio.";
      if (!pastorNEW.trim()) newErrors.pastor = "El nombre del pastor es obligatorio.";
      if (!privilegioNEW.trim()) newErrors.privilegio = "El privilegio es obligatorio.";
      if (!modalidadNEW) newErrors.modalidad = "Seleccione una modalidad.";
      return newErrors;
    };

    const validationErrors = validate();
    setErrors(validationErrors);
    setIsValid(Object.keys(validationErrors).length === 0);
  }, [nombresNEW, apellidosNEW, telefonoNEW, prefijoNEW, paisNEW, correoNEW, iglesiaNEW, pastorNEW, privilegioNEW, modalidadNEW]);

  const handleFinalSubmit = async () => {
    if (!isValid) {
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
      return;
    }
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
      if (!response.ok) throw new Error("Falló el registro.");

      toast({
        variant: "success",
        title: "Registro Exitoso",
        description: "Tu solicitud ha sido enviada. Un tutor la revisará pronto.",
        duration: 4000,
      });
      resetRegistrationForm();
      navigate("/");
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <LoaderAE texto="Finalizando registro..." />
        </div>
      )}
      <fieldset disabled={loading} className="w-full justify-center flex items-center">
        <div className="container mx-auto px-4 mb-6 rounded-md">
          <h3 className="text-xl font-extrabold text-center pb-6 px-4">Ingresa tus datos personales</h3>
          <h1 className="text-red-500 text-sm italic font-normal text-center mb-8">* Todos los campos son obligatorios</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div className="mb-2">
              <Label htmlFor="nombres">
                Nombres <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombres"
                placeholder="Tus nombres"
                value={nombresNEW}
                onChange={(e) => setNombresNEW(e.target.value)}
                onBlur={handleBlur}
                className={cn(touched.nombres && errors.nombres && "border-red-500")}
              />
              {touched.nombres && errors.nombres && <p className="text-red-500 text-xs mt-1">{errors.nombres}</p>}
            </div>
            <div className="mb-2">
              <Label htmlFor="apellidos">
                Apellidos <span className="text-red-500">*</span>
              </Label>
              <Input
                id="apellidos"
                placeholder="Tus apellidos"
                value={apellidosNEW}
                onChange={(e) => setApellidosNEW(e.target.value)}
                onBlur={handleBlur}
                className={cn(touched.apellidos && errors.apellidos && "border-red-500")}
              />
              {touched.apellidos && errors.apellidos && <p className="text-red-500 text-xs mt-1">{errors.apellidos}</p>}
            </div>
            <div className="mb-2">
              <Label htmlFor="phone">
                Teléfono <span className="text-red-500">*</span>
              </Label>
              <div onBlur={() => setTouched((prev) => ({ ...prev, telefono: true, prefijo: true }))}>
                <PhoneInput onPrefixChange={setPrefijoNEW} onPhoneChange={setTelefonoNEW} defaultPrefix={prefijoNEW} defaultPhone={telefonoNEW} />
              </div>
              {touched.telefono && errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
              {touched.prefijo && errors.prefijo && !errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.prefijo}</p>}
            </div>
            <div className="mb-2">
              <Label htmlFor="correo">
                Correo Electrónico <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                id="correo"
                placeholder="tu@correo.com"
                value={correoNEW}
                onChange={(e) => setCorreoNEW(e.target.value)}
                onBlur={handleBlur}
                className={cn(touched.correo && errors.correo && "border-red-500")}
              />
              {touched.correo && errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo}</p>}
            </div>
            <div className="mb-2">
              <div onBlur={() => setTouched((prev) => ({ ...prev, pais: true }))}>
                <CRSelect
                  title="País"
                  require={true}
                  data={paisesOptions}
                  value={paisNEW}
                  onChange={setPaisNEW}
                  placeholder="Selecciona tu país"
                  searchPlaceholder="Buscar país..."
                />
              </div>
              {touched.pais && errors.pais && <p className="text-red-500 text-xs mt-1">{errors.pais}</p>}
            </div>
            <div className="mb-2">
              <Label htmlFor="iglesia">
                Iglesia donde te congregas <span className="text-red-500">*</span>
              </Label>
              <Input
                id="iglesia"
                placeholder="Nombre de tu iglesia"
                value={iglesiaNEW}
                onChange={(e) => setIglesiaNEW(e.target.value)}
                onBlur={handleBlur}
                className={cn(touched.iglesia && errors.iglesia && "border-red-500")}
              />
              {touched.iglesia && errors.iglesia && <p className="text-red-500 text-xs mt-1">{errors.iglesia}</p>}
            </div>
            <div className="mb-2">
              <Label htmlFor="pastor">
                Nombre de tu Pastor <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pastor"
                placeholder="Nombre de tu pastor"
                value={pastorNEW}
                onChange={(e) => setPastorNEW(e.target.value)}
                onBlur={handleBlur}
                className={cn(touched.pastor && errors.pastor && "border-red-500")}
              />
              {touched.pastor && errors.pastor && <p className="text-red-500 text-xs mt-1">{errors.pastor}</p>}
            </div>
            <div className="mb-2">
              <Label htmlFor="privilegio">
                Privilegio actual <span className="text-red-500">*</span>
              </Label>
              <Input
                id="privilegio"
                placeholder="Ej: Músico, Diácono, etc."
                value={privilegioNEW}
                onChange={(e) => setPrivilegioNEW(e.target.value)}
                onBlur={handleBlur}
                className={cn(touched.privilegio && errors.privilegio && "border-red-500")}
              />
              {touched.privilegio && errors.privilegio && <p className="text-red-500 text-xs mt-1">{errors.privilegio}</p>}
            </div>
            <div className="mb-2 md:col-span-2">
              <div onBlur={() => setTouched((prev) => ({ ...prev, modalidad: true }))}>
                <CRSelect
                  title="Modalidad"
                  require={true}
                  data={modalidadOptions}
                  value={modalidadNEW}
                  onChange={setModalidadNEW}
                  placeholder="Selecciona tu modalidad"
                />
              </div>
              {touched.modalidad && errors.modalidad && <p className="text-red-500 text-xs mt-1">{errors.modalidad}</p>}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            {isLastStep ? (
              <Button onClick={handleFinalSubmit} disabled={!isValid || loading} className="px-8 py-6">
                Finalizar Registro
              </Button>
            ) : (
              <Button onClick={() => navigateStep(1)} disabled={!isValid} className="px-8 py-6">
                Siguiente
              </Button>
            )}
          </div>
        </div>
      </fieldset>
    </>
  );
};

Step1_PersonalData.propTypes = {
  isLastStep: PropTypes.bool.isRequired,
};

export default Step1_PersonalData;
