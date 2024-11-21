import { useContext, useEffect, useState } from "react";
import MainContext from "../context/MainContext";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LoaderAE from "@/components/LoaderAE";

const NewRegisterTutores = () => {
  const { cursoSeleccionadoNEW, nombresNEW, apellidosNEW, fechaNacimientoNEW, telefonoNEW, direccionNEW, navegarPaso } = useContext(MainContext);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const { toast } = useToast();

  const navigate = useNavigate();

  // importar los set para reiniciar formulario
  const { setNombresNEW, setApellidosNEW, setFechaNacimientoNEW, setTelefonoNEW, setDireccionNEW, setCursoSeleccionadoNEW } = useContext(MainContext);

  useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${URL_BASE}/api/user/tutors/${cursoSeleccionadoNEW.id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTutors(data);
      } catch (error) {
        setError("Failed to fetch tutors.", error);
        toast({ title: "Error", description: "Failed to fetch tutors.", duration: 2500 });
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [toast]);

  const handleSelectTutor = (tutor) => {
    setSelectedTutor(tutor);
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${URL_BASE}/api/user/registerAlumno`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombres: nombresNEW,
          apellidos: apellidosNEW,
          fechaNacimiento: fechaNacimientoNEW,
          telefono: telefonoNEW,
          direccion: direccionNEW,
          tutor: selectedTutor.id,
          modulo: cursoSeleccionadoNEW.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Falló al registrarse");
      }

      toast({
        duration: 2500,
        title: "Success",
        variant: "success",
        description: "Se ha registrado correctamente.",
      });

      navigate("/");
      setSelectedTutor(null);
      navegarPaso(-100);

      // Reiniciar formulario
      setNombresNEW("");
      setApellidosNEW("");
      setFechaNacimientoNEW("");
      setTelefonoNEW("");
      setDireccionNEW("");
      setCursoSeleccionadoNEW(null);
    } catch (error) {
      toast({ title: "Error", description: error.message, duration: 2500 });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPage = () => {
    window.location.reload();
  };

  const handleCancel = () => {
    setSelectedTutor(null);
  };

  const handlePrevious = () => {
    navegarPaso(-1);
  };

  return (
    <div className="px-2">
      {cursoSeleccionadoNEW ? (
        <div>
          <h3 className="text-xl font-extrabold text-center pb-2 px-4">Seleccione el tutor que le asignaron.</h3>
          <h2 className="text-sm italic font-semibold text-center pb-6 px-4 text-red-500">
            *** Si aún no tiene un tutor, solicite uno y luego regrese aquí para seleccionarlo. ***
          </h2>
          {loading ? (
            <p className="text-center text-lg">
              <LoaderAE texto="Cargando tutores..." />
            </p>
          ) : error ? (
            <p className="text-center text-lg text-red-500">
              <div className="flex justify-center my-4 gap-2">
                <Button onClick={handlePrevious} className="px-8 py-6 transition-opacity duration-300 bg-blue-500 text-white hover:bg-blue-600">
                  Anterior
                </Button>
              </div>
            </p>
          ) : tutors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {tutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="border border-gray-300 rounded-lg overflow-hidden cursor-pointer shadow-lg p-4 hover:scale-[1.01] transition-transform ease-in"
                  onClick={() => handleSelectTutor(tutor)}
                >
                  <img src={tutor.foto_url} alt={`${tutor.nombres} ${tutor.apellidos}`} className="size-44 object-cover mx-auto mb-4" />
                  <div className="space-y-2">
                    <h4 className="text-2xl font-extrabold text-center">{`${tutor.nombres} ${tutor.apellidos}`}</h4>
                    <p className="text-center">Tipo: {tutor.tipo === "Tutor" ? "Tutor(a)" : "Tutor(a)"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay tutores disponibles.</p>
          )}
          <div className="flex justify-center my-4 gap-2">
            <Button onClick={handlePrevious} className="px-8 py-6 transition-opacity duration-300 bg-blue-500 text-white hover:bg-blue-600">
              Anterior
            </Button>
          </div>
        </div>
      ) : (
        <h1 className="text-center text-2xl font-bold">Por favor, seleccione un módulo primero.</h1>
      )}

      {selectedTutor && (
        <Dialog open={selectedTutor !== null} onOpenChange={handleCancel} className="text-black dark:text-white">
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-black dark:text-white text-2xl font-extrabold">Confirme los Datos</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-black dark:text-white">
              <hr />
              <table className="table-auto w-full text-left">
                <thead>
                  <tr>
                    <th className="text-xl font-bold text-yellow-500" colSpan={2}>
                      Sus datos:
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-medium">Nombres:</td>
                    <td>
                      {nombresNEW} {apellidosNEW}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium">Teléfono:</td>
                    <td>{telefonoNEW}</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Fecha de Nac:</td>
                    <td>{fechaNacimientoNEW.length > 0 ? fechaNacimientoNEW : "---"}</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Dirección:</td>
                    <td>{direccionNEW.length > 0 ? direccionNEW : "---"}</td>
                  </tr>
                </tbody>
              </table>

              <hr />
              <div className="text-center mt-4">
                <h4 className="text-xl font-bold text-yellow-500 mb-4">Datos del Tutor:</h4>
                <img
                  src={selectedTutor.foto_url}
                  alt={`${selectedTutor.nombres} ${selectedTutor.apellidos}`}
                  className="size-24 object-cover rounded-full mx-auto mb-4"
                />
                <p className="text-2xl">
                  {selectedTutor.nombres} {selectedTutor.apellidos}
                </p>
              </div>
              <hr />
            </div>
            <DialogFooter className="gap-3 relative">
              {loading && <div className="absolute inset-0 bg-black/30 pointer-events-auto transition-opacity duration-300 z-50" />}
              <Button variant="outline" className="text-black dark:text-white inline-flex sm:hidden" onClick={handleCancel} disabled={loading}>
                Cancelar
              </Button>
              <Button className="inline-flex sm:hidden" onClick={handleAccept} disabled={loading}>
                {loading ? <LoaderAE texto="Cargando..." /> : "Aceptar"}
              </Button>
              <Button variant="destructive" className="text-black dark:text-white" onClick={handleResetPage} disabled={loading}>
                Reiniciar formulario
              </Button>
              <Button variant="outline" className="text-black dark:text-white sm:inline-flex hidden" onClick={handleCancel} disabled={loading}>
                Cancelar
              </Button>
              <div className="relative w-full h-full">
                {loading && <div className="absolute w-full h-full inset-0 bg-yellow-500 pointer-events-auto z-50" />}
                <Button className="sm:inline-flex hidden" onClick={handleAccept} disabled={loading}>
                  {loading ? <LoaderAE texto="Cargando..." /> : "Aceptar"}
                </Button>
              </div>
              {loading && <div className="absolute inset-0 bg-transparent pointer-events-auto z-50" />}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default NewRegisterTutores;
