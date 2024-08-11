import React, { useState, useContext, useEffect } from "react";
import { Input } from "@/components/ui/input";
import MainContext from "../context/MainContext";
import NewRegisterModulos from "./NewRegisterModulos";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

export default function NewRegister() {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const [isValid, setIsValid] = useState(false);
  const [showTutores, setShowTutores] = useState(false);

  const context = useContext(MainContext);
  const location = useLocation();

  // Validar formulario en tiempo real
  useEffect(() => {
    const isNombresValid = nombres.length >= 3;
    const isApellidosValid = apellidos.length >= 3;
    const isTelefonoValid = /^\d{7,}$/.test(telefono);

    setIsValid(isNombresValid && isApellidosValid && isTelefonoValid);
  }, [nombres, apellidos, telefono]);

  const handleContinue = () => {
    if (isValid) {
      context.setNombresNEW(nombres);
      context.setApellidosNEW(apellidos);
      context.setFechaNacimientoNEW(fechaNacimiento);
      context.setTelefonoNEW(telefono);
      context.setDireccionNEW(direccion);

      setShowTutores(true);
    }
  };

  // Manejar la advertencia de navegación
  const isFormDirty = nombres || apellidos || telefono || direccion || fechaNacimiento;

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isFormDirty) {
        event.preventDefault();
        event.returnValue = "¿Estás seguro de que quieres salir? Los datos no guardados se perderán.";
        return event.returnValue;
      }
    };

    const handlePopState = () => {
      if (isFormDirty && !window.confirm("¿Estás seguro de que quieres salir? Los datos no guardados se perderán.")) {
        window.history.pushState(null, "", location.pathname);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    window.history.pushState(null, "", location.pathname);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isFormDirty, location.pathname]);

  return (
    <>
      {showTutores ? (
        <NewRegisterModulos />
      ) : (
        <div className="container mx-auto p-4 max-w-3xl sm:mt-32">
          <h1 className="text-4xl font-extrabold text-center">Nuevo Registro</h1>
          <h2 className="text-lg text-center">Llena los datos requeridos para continuar con el registro</h2>
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
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
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
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium mb-1">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                id="telefono"
                name="telefono"
                placeholder="Ingresa tu teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
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
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
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
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleContinue}
              disabled={!isValid}
              className={`px-14 py-6 transition-opacity duration-300 ${isValid ? "opacity-100" : "opacity-50"}`}
            >
              Continuar
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
