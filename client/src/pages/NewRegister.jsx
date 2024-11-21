import { useState, useContext, useEffect } from "react";
import { Input } from "@/components/ui/input";
import MainContext from "../context/MainContext";
import { Button } from "@/components/ui/button";

import { prefijos } from "@/context/prefijos";
import CRSelect from "@/components/Preguntas/CRSelect";

export default function NewRegister() {
  const [isValid, setIsValid] = useState(false);

  const {
    navegarPaso,
    nombresNEW,
    apellidosNEW,
    fechaNacimientoNEW,
    telefonoNEW,
    direccionNEW,
    setNombresNEW,
    setApellidosNEW,
    setFechaNacimientoNEW,
    setTelefonoNEW,
    setDireccionNEW,
    correoNEW,
    setCorreoNEW,
    prefijoNEW,
    setPrefijoNEW,
  } = useContext(MainContext);

  // Validar formulario en tiempo real
  useEffect(() => {
    const isNombresValid = nombresNEW.length >= 3;
    const isApellidosValid = apellidosNEW.length >= 3;
    const isTelefonoValid = /^\d{7,}$/.test(telefonoNEW);
    const isPrefijoValid = prefijoNEW?.length > 0 ? true : false;

    setIsValid(isNombresValid && isApellidosValid && isTelefonoValid && isPrefijoValid);
  }, [nombresNEW, apellidosNEW, telefonoNEW, prefijoNEW]);

  const handleContinue = () => {
    if (isValid) {
      setNombresNEW(nombresNEW);
      setApellidosNEW(apellidosNEW);
      setFechaNacimientoNEW(fechaNacimientoNEW);
      setTelefonoNEW(telefonoNEW);
      setDireccionNEW(direccionNEW);
      setCorreoNEW(correoNEW);
      setPrefijoNEW(prefijoNEW);

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
            <label htmlFor="nombres" className="block text-sm font-medium mb-1">
              Nombres <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              id="nombres"
              name="nombres"
              placeholder="Ingresa tus nombres"
              value={nombresNEW}
              onChange={(e) => setNombresNEW(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="apellidos" className="block text-sm font-medium mb-1">
              Apellidos <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              id="apellidos"
              name="apellidos"
              placeholder="Ingresa tus apellidos"
              value={apellidosNEW}
              onChange={(e) => setApellidosNEW(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div>
            <CRSelect defaultValue={prefijoNEW} title="Prefijo telefónico" autoClose data={prefijos} setValue={setPrefijoNEW} keyValue require />
          </div>
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium mb-1">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <Input
              id="telefono"
              name="telefono"
              placeholder="Ingresa tu teléfono"
              value={telefonoNEW}
              onChange={(e) => setTelefonoNEW(e.target.value)}
              autoComplete="off"
              type="number"
            />
          </div>
          <div>
            <label htmlFor="correo" className="block text-sm font-medium mb-1">
              Correo Electrónico
            </label>
            <Input
              type="email"
              id="correo"
              name="correo"
              placeholder="Ingresa tu correo electrónico"
              value={correoNEW}
              onChange={(e) => setCorreoNEW(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="fechaNacimiento" className="block text-sm font-medium mb-1">
              Fecha de Nacimiento
            </label>
            <Input
              type="date"
              id="fechaNacimiento"
              name="fechaNacimiento"
              placeholder="Fecha de Nacimiento"
              value={fechaNacimientoNEW}
              onChange={(e) => setFechaNacimientoNEW(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="direccion" className="block text-sm font-medium mb-1">
              Dirección
            </label>
            <Input
              type="text"
              id="direccion"
              name="direccion"
              placeholder="Ingresa tu dirección"
              value={direccionNEW}
              onChange={(e) => setDireccionNEW(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleContinue}
            disabled={!isValid}
            className={`px-8 py-6 transition-opacity duration-300 ${isValid ? "opacity-100" : "opacity-50"} ${
              isValid ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-blue-300 text-white cursor-not-allowed"
            }`}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
