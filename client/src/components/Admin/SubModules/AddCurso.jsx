import { useState, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImagenCloud from "@/components/ImagenCloud";
import MainContext from "@/context/MainContext";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import LoaderAE from "@/components/LoaderAE";

const AddCurso = () => {
  const [nombre, setNombre] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFin, setHorarioFin] = useState("");
  const [encargadoId, setEncargadoId] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [activo, setActivo] = useState(true);

  const [loading, setLoading] = useState(false);

  const [resetForm, setResetForm] = useState(false);

  const { user } = useContext(MainContext);

  const navigate = useNavigate();

  const { toast } = useToast();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const dataToSubmit = {
      nombre,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      horario_inicio: horarioInicio,
      horario_fin: horarioFin,
      encargado_id: encargadoId,
      descripcion,
      foto_url: fotoUrl,
      activo,
    };

    try {
      const response = await fetch(`${URL_BASE}/post/addModulo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token,
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "El Módulo ha sido registrado correctamente.",
          duration: 2500,
        });

        // reset formulario
        setNombre("");
        setFechaInicio("");
        setFechaFin("");
        setHorarioInicio("");
        setHorarioFin("");
        setEncargadoId(null);
        setDescripcion("");
        setFotoUrl("");
        setActivo(true);
        setResetForm(!resetForm);
        setLoading(false);
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al guardar los datos." + error,
        duration: 2500,
      });
    }
  };

  if (!user) {
    navigate("/");
    return;
  }

  return (
    <div className="px-8 border-[1px] rounded-md mt-2 pt-2 pb-8 mb-4">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <LoaderAE texto="Guardando módulo..." />
        </div>
      )}
      <h1 className="text-2xl text-center font-extrabold my-4">Añadir nuevo módulo</h1>
      <h2 className="text-red-500 text-sm italic font-normal text-center mb-8">*Solo los campos con asterisco son OBLIGATORIOS</h2>
      <div className="mb-8">
        <ImagenCloud setURLUpload={setFotoUrl} upload size="200" reset={resetForm} />
      </div>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>
            Nombre del módulo<span className="text-red-500">*</span>
          </label>
          <Input type="text" name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Nombre del módulo" />
        </div>
        <div>
          <label>
            Descripción<span className="text-red-500">*</span>
          </label>
          <Input type="text" name="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" required />
        </div>
        <div>
          <label>
            Fecha de inicio<span className="text-red-500">*</span>
          </label>
          <Input type="date" name="fecha_inicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} required />
        </div>
        <div>
          <label>
            Fecha de fin<span className="text-red-500">*</span>
          </label>
          <Input type="date" name="fecha_fin" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} required />
        </div>
        <div>
          <label>
            Horario de inicio<span className="text-red-500">*</span>
          </label>
          <Input type="time" name="horario_inicio" value={horarioInicio} onChange={(e) => setHorarioInicio(e.target.value)} required />
        </div>
        <div>
          <label>
            Horario de fin<span className="text-red-500">*</span>
          </label>
          <Input type="time" name="horario_fin" value={horarioFin} onChange={(e) => setHorarioFin(e.target.value)} required />
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

export default AddCurso;
