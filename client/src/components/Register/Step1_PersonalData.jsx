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
    resetRegistrationForm,
  } = useContext(MainContext);

  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const isFormValid = nombresNEW.length >= 3 && apellidosNEW.length >= 3 && /^\d{7,}$/.test(telefonoNEW) && prefijoNEW && paisNEW;
    setIsValid(isFormValid);
  }, [nombresNEW, apellidosNEW, telefonoNEW, prefijoNEW, paisNEW]);

  const handleFinalSubmit = async () => {
    if (!isValid) return;
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
    <div className="w-full justify-center flex items-center">
      <div className="container mx-auto px-4 mb-6 rounded-md">
        <h3 className="text-xl font-extrabold text-center pb-6 px-4">Ingresa tus datos personales</h3>
        <h1 className="text-red-500 text-sm italic font-normal text-center mb-8">* Los campos con asterisco son obligatorios</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombres">
              Nombres <span className="text-red-500">*</span>
            </Label>
            <Input id="nombres" placeholder="Tus nombres" value={nombresNEW} onChange={(e) => setNombresNEW(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="apellidos">
              Apellidos <span className="text-red-500">*</span>
            </Label>
            <Input id="apellidos" placeholder="Tus apellidos" value={apellidosNEW} onChange={(e) => setApellidosNEW(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="phone">
              Teléfono <span className="text-red-500">*</span>
            </Label>
            <PhoneInput onPrefixChange={setPrefijoNEW} onPhoneChange={setTelefonoNEW} defaultPrefix={prefijoNEW} defaultPhone={telefonoNEW} />
          </div>
          <div>
            <Label htmlFor="correo">Correo Electrónico</Label>
            <Input type="email" id="correo" placeholder="tu@correo.com" value={correoNEW} onChange={(e) => setCorreoNEW(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="pais">
              País <span className="text-red-500">*</span>
            </Label>
            <Input id="pais" placeholder="País de residencia" value={paisNEW} onChange={(e) => setPaisNEW(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="iglesia">Iglesia donde te congregas</Label>
            <Input id="iglesia" placeholder="Nombre de tu iglesia" value={iglesiaNEW} onChange={(e) => setIglesiaNEW(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="pastor">Nombre de tu Pastor</Label>
            <Input id="pastor" placeholder="Nombre de tu pastor" value={pastorNEW} onChange={(e) => setPastorNEW(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="privilegio">Privilegio actual</Label>
            <Input id="privilegio" placeholder="Ej: Músico, Diácono, etc." value={privilegioNEW} onChange={(e) => setPrivilegioNEW(e.target.value)} />
          </div>
        </div>

        <div className="flex justify-center mt-8">
          {isLastStep ? (
            <Button onClick={handleFinalSubmit} disabled={!isValid || loading} className="px-8 py-6">
              {loading ? <LoaderAE texto="Enviando..." /> : "Finalizar Registro"}
            </Button>
          ) : (
            <Button onClick={() => navigateStep(1)} disabled={!isValid} className="px-8 py-6">
              Siguiente
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

Step1_PersonalData.propTypes = {
  isLastStep: PropTypes.bool.isRequired,
};

export default Step1_PersonalData;
