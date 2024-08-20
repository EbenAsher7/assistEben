import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DropdownAE from "../../DropdownAE"; // Asegúrate de que la ruta sea correcta
import ImagenCloud from "@/components/ImagenCloud";

function generateUsername(nombres, apellidos) {
  return `${nombres.slice(0, 3)}${apellidos.slice(0, 3)}`.toLowerCase();
}

function generatePassword() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 6; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

const AddTutores = () => {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(generatePassword());
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [tipo, setTipo] = useState("Normal");
  const [moduloId, setModuloId] = useState(null);
  const [observaciones, setObservaciones] = useState("");
  const [activo] = useState(true);

  const modulosData = [
    { value: 1, label: "Modulo 1" },
    { value: 2, label: "Modulo 2" },
  ];

  const tipoData = [
    { value: "Tutor", label: "Tutor" },
    { value: "Administrador", label: "Administrador" },
    { value: "Normal", label: "Normal" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSubmit = {
      nombres,
      apellidos,
      username,
      password,
      fecha_nacimiento: fechaNacimiento,
      foto_url: fotoUrl,
      telefono,
      direccion,
      tipo,
      observaciones,
      modulo_id: moduloId,
      activo,
    };

    // Aquí iría la lógica para enviar el formulario (POST, PUT, etc.)
    console.log("Formulario enviado:", dataToSubmit);
  };

  //si nombre o apellido cambian y son mas de 3 set username
  useEffect(() => {
    if (nombres.length >= 3 && apellidos.length >= 3) {
      setUsername(generateUsername(nombres, apellidos));
    }

    if (nombres.length < 3 || apellidos.length < 3) {
      setUsername("");
    }
  }, [nombres, apellidos]);

  return (
    <div className="px-8 border-[1px] rounded-md mt-2 pt-2 pb-8 mb-4">
      <h1 className="text-2xl text-center font-extrabold my-4">Añadir nuevo tutor</h1>
      <h2 className="text-red-500 text-sm italic font-normal text-center mb-8">*Solo los campos con asterisco son OBLIGATORIOS</h2>
      <div className="mb-8">
        <ImagenCloud setURLUpload={setFotoUrl} upload size="200" />
      </div>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>
            Nombres<span className="text-red-500">*</span>
          </label>
          <Input type="text" name="nombres" value={nombres} onChange={(e) => setNombres(e.target.value)} required placeholder="Nombres" />
        </div>
        <div>
          <label>
            Apellidos<span className="text-red-500">*</span>
          </label>
          <Input type="text" name="apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required placeholder="Apellidos" />
        </div>
        <div>
          <label>
            Nombre de usuario<span className="text-red-500">*</span>
          </label>
          <Input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        </div>
        <div>
          <label>
            Contraseña<span className="text-red-500">*</span>
          </label>
          <Input type="text" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label>Fecha de Nacimiento</label>
          <Input type="date" name="fecha_nacimiento" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />
        </div>
        <div>
          <label>
            Teléfono<span className="text-red-500">*</span>
          </label>
          <Input type="text" name="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" />
        </div>
        <div>
          <label>Dirección</label>
          <Input type="text" name="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección" />
        </div>
        <div>
          <label>Observaciones</label>
          <Input type="text" name="observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Observaciones" />
        </div>
        <div>
          <label>
            Tipo de Usuario<span className="text-red-500">*</span>
          </label>
          <DropdownAE data={tipoData} title="Seleccionar tipo" setValueAE={setTipo} />
        </div>
        <div>
          <label>
            Seleccione Módulo<span className="text-red-500">*</span>
          </label>
          <DropdownAE data={modulosData} title="Seleccionar módulo" setValueAE={setModuloId} />
        </div>
        <div className="md:col-span-2">
          <Button type="submit" className="w-full mt-4">
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTutores;
