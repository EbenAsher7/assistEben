import { useState, useContext, useEffect } from "react";
import { Input } from "@/components/ui/input";
import MainContext from "../context/MainContext";
import { Button } from "@/components/ui/button";
import { prefijos } from "@/context/prefijos";
import CRSelect from "@/components/Preguntas/CRSelect";
import { Label } from "@/components/ui/label";

export default function OldRegister() {
  const [isValid, setIsValid] = useState(false);
  const {
    navegarPaso,
    nombresNEW,
    setNombresNEW,
    apellidosNEW,
    setApellidosNEW,
    fechaNacimientoNEW,
    setFechaNacimientoNEW,
    telefonoNEW,
    setTelefonoNEW,
    direccionNEW,
    setDireccionNEW,
    correoNEW,
    setCorreoNEW,
    prefijoNEW,
    setPrefijoNEW,
  } = useContext(MainContext);

  const prefijosFormateados = prefijos[0]
    ? Object.entries(prefijos[0]).map(([label, value]) => ({
        value: value,
        label: `${label} (${value})`,
      }))
    : [];

  useEffect(() => {
    const isNombresValid = nombresNEW.length >= 3;
    const isApellidosValid = apellidosNEW.length >= 3;
    const isTelefonoValid = /^\d{7,}$/.test(telefonoNEW);
    const isPrefijoValid = !!prefijoNEW;
    setIsValid(isNombresValid && isApellidosValid && isTelefonoValid && isPrefijoValid);
  }, [nombresNEW, apellidosNEW, telefonoNEW, prefijoNEW]);

  const handleContinue = () => {
    if (isValid) {
      navegarPaso(1);
    }
  };

  return (
    <div className="w-full justify-center flex items-center sm:-mt-24">
      <div className="container mx-auto px-4 mb-6 sm:mt-32 rounded-md">
        <h3 className="text-xl font-extrabold text-center pb-6 px-4">Llene los siguiente campos para continuar.</h3>
        <h1 className="text-red-500 text-sm italic font-normal text-center mb-8">*Solo los campos con asterisco son OBLIGATORIOS</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombres">
              Nombres <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombres"
              placeholder="Ingresa tus nombres"
              value={nombresNEW}
              onChange={(e) => setNombresNEW(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div>
            <Label htmlFor="apellidos">
              Apellidos <span className="text-red-500">*</span>
            </Label>
            <Input
              id="apellidos"
              placeholder="Ingresa tus apellidos"
              value={apellidosNEW}
              onChange={(e) => setApellidosNEW(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div>
            <CRSelect
              title="Prefijo telefónico"
              data={prefijosFormateados}
              setValue={setPrefijoNEW}
              defaultValue={prefijoNEW}
              require
              placeholder="Seleccione un prefijo"
            />
          </div>
          <div>
            <Label htmlFor="telefono">
              Teléfono <span className="text-red-500">*</span>
            </Label>
            <Input
              id="telefono"
              placeholder="Ingresa tu teléfono"
              value={telefonoNEW}
              onChange={(e) => setTelefonoNEW(e.target.value)}
              autoComplete="off"
              type="number"
            />
          </div>
          <div>
            <Label htmlFor="correo">Correo Electrónico</Label>
            <Input
              type="email"
              id="correo"
              placeholder="Ingresa tu correo electrónico"
              value={correoNEW}
              onChange={(e) => setCorreoNEW(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div>
            <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
            <Input type="date" id="fechaNacimiento" value={fechaNacimientoNEW} onChange={(e) => setFechaNacimientoNEW(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              type="text"
              id="direccion"
              placeholder="Ingresa tu dirección"
              value={direccionNEW}
              onChange={(e) => setDireccionNEW(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <Button onClick={handleContinue} disabled={!isValid} className="px-8 py-6">
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
