import { useState, useEffect, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImagenCloud from "@/components/ImagenCloud";
import MainContext from "@/context/MainContext";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import LoaderAE from "@/components/LoaderAE";
import CRSelect from "@/components/Preguntas/CRSelect";

function generateUsername(nombres, apellidos) {
  const userNameNew = `${nombres.slice(0, 3)}${apellidos.slice(0, 3)}`.toLowerCase();
  const userName = userNameNew.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return userName.toLowerCase().trim();
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
  const [tipo, setTipo] = useState(null);
  const [observaciones, setObservaciones] = useState("");
  const [activo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resetForm, setResetForm] = useState(false);

  const { user } = useContext(MainContext);
  const navigate = useNavigate();
  const { toast } = useToast();

  const tipoData = [
    { value: "Tutor", label: "Tutor" },
    { value: "Administrador", label: "Administrador" },
    { value: "Normal", label: "Normal" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombres || !apellidos || !username || !password || !telefono || !tipo) {
      return toast({
        variant: "destructive",
        title: "Error",
        description: "Los campos con asterisco son obligatorios.",
        duration: 2500,
      });
    }

    setLoading(true);
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
      activo,
    };

    try {
      const response = await fetch(`${URL_BASE}/post/addTutor`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: user?.token },
        body: JSON.stringify(dataToSubmit),
      });

      if (response.ok) {
        toast({ title: "Éxito", description: "El Tutor ha sido registrado correctamente.", duration: 2500 });
        setNombres("");
        setApellidos("");
        setUsername("");
        setPassword(generatePassword());
        setFechaNacimiento("");
        setFotoUrl("");
        setTelefono("");
        setDireccion("");
        setTipo(null);
        setObservaciones("");
        setResetForm((prev) => !prev);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch");
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: `Ocurrió un error: ${error.message}`, duration: 2500 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nombres.length >= 3 && apellidos.length >= 3) {
      setUsername(generateUsername(nombres, apellidos));
    } else {
      setUsername("");
    }
  }, [nombres, apellidos]);

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className="px-8 border-[1px] rounded-md mt-2 pt-2 pb-8 mb-4">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <LoaderAE texto="Guardando tutor..." />
        </div>
      )}
      <h1 className="text-2xl text-center font-extrabold my-4">Añadir nuevo tutor</h1>
      <h2 className="text-red-500 text-sm italic font-normal text-center mb-8">*Solo los campos con asterisco son OBLIGATORIOS</h2>
      <div className="mb-8">
        <ImagenCloud setURLUpload={setFotoUrl} upload size="200" reset={resetForm} />
      </div>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>
            Nombres<span className="text-red-500">*</span>
          </label>
          <Input value={nombres} onChange={(e) => setNombres(e.target.value)} required placeholder="Nombres" autoComplete="off" />
        </div>
        <div>
          <label>
            Apellidos<span className="text-red-500">*</span>
          </label>
          <Input value={apellidos} onChange={(e) => setApellidos(e.target.value)} required placeholder="Apellidos" autoComplete="off" />
        </div>
        <div>
          <label>
            Nombre de usuario<span className="text-red-500">*</span>
          </label>
          <Input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().trim())} placeholder="Username" autoComplete="off" />
        </div>
        <div>
          <label>
            Contraseña<span className="text-red-500">*</span>
          </label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="off" />
        </div>
        <div>
          <label>Fecha de Nacimiento</label>
          <Input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
        </div>
        <div>
          <label>
            Teléfono<span className="text-red-500">*</span>
          </label>
          <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" autoComplete="off" />
        </div>
        <div>
          <label>Dirección</label>
          <Input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección" autoComplete="off" />
        </div>
        <div>
          <label>Observaciones</label>
          <Input value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Observaciones" autoComplete="off" />
        </div>
        <div>
          <CRSelect title="Tipo de Usuario" data={tipoData} setValue={setTipo} reset={resetForm} require />
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
