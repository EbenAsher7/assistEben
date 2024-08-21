import { useContext, useEffect, useState } from "react";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";
import MainContext from "@/context/MainContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import LoaderAE from "@/components/LoaderAE";
import { CalendarIcon, PencilIcon, TrashIcon, ClockIcon } from "@/components/Iconos";
import { useNavigate } from "react-router-dom";

const ListaCursos = () => {
  const [cursos, setCursos] = useState([]);
  const { user, fetchAllModulosCompleteData } = useContext(MainContext);

  const navigate = useNavigate();

  const [isLoadingCursos, setIsLoadingCursos] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCursoId, setCurrentCursoId] = useState(null);

  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }

    if (user || user?.tipo === "Administrador") {
      fetchAllModulosCompleteData().then((data) => {
        setCursos(data);
      });
    }
  }, [user, fetchAllModulosCompleteData, navigate]);

  const handleEdit = (curso) => {
    setCursoSeleccionado(curso);
    setCurrentCursoId(curso.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCursoSeleccionado(null);
    setCurrentCursoId(null);
  };

  const handleSaveChanges = async () => {
    if (!cursoSeleccionado) {
      return;
    }

    const updatedCurso = {
      id: cursoSeleccionado.id,
      nombre: document.getElementById("nombre").value,
      descripcion: document.getElementById("descripcion").value,
      fecha_inicio: document.getElementById("fecha_inicio").value,
      fecha_fin: document.getElementById("fecha_fin").value,
      horarioInicio: document.getElementById("horarioInicio").value,
      horarioFin: document.getElementById("horarioFin").value,
    };

    if (
      updatedCurso.nombre === cursoSeleccionado.nombre &&
      updatedCurso.descripcion === cursoSeleccionado.descripcion &&
      updatedCurso.fecha_inicio === cursoSeleccionado.fecha_inicio &&
      updatedCurso.fecha_fin === cursoSeleccionado.fecha_fin &&
      updatedCurso.horarioInicio === cursoSeleccionado.horarioInicio &&
      updatedCurso.horarioFin === cursoSeleccionado.horarioFin
    ) {
      toast({
        variant: "success",
        title: "Advertencia",
        description: "Guardado sin cambios.",
        duration: 2500,
      });
      handleCloseModal();
      return;
    }

    try {
      const response = await fetch(`${URL_BASE}/put/updateCurso/${cursoSeleccionado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token,
        },
        body: JSON.stringify(updatedCurso),
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Se actualizaron los datos del curso.",
          duration: 2500,
        });

        // Actualiza el estado de cursos con el curso actualizado
        setCursos((prevCursos) => prevCursos.map((curso) => (curso.id === cursoSeleccionado.id ? { ...curso, ...updatedCurso } : curso)));

        handleCloseModal();
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al actualizar los datos del curso.",
        duration: 2500,
      });
    }
    handleCloseModal();
  };

  const handleDelete = async (cursoId) => {
    if (!cursoId) {
      return;
    }

    const deleteCurso = {
      activo: "0",
    };

    try {
      const response = await fetch(`${URL_BASE}/put/updateCurso/${cursoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token,
        },
        body: JSON.stringify(deleteCurso),
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Se eliminó el curso.",
          duration: 2500,
        });

        // Actualiza el estado de cursos eliminando el curso
        setCursos((prevCursos) => prevCursos.filter((curso) => curso.id !== cursoId));
        handleCloseModal();
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al eliminar el curso." + error,
        duration: 2500,
      });
    }
    handleCloseModal();
  };

  if (isLoadingCursos) {
    return <LoaderAE />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 mt-2">
        {cursos &&
          cursos.map((curso) => (
            <div
              key={curso.id}
              className="border-[1px] rounded-xl p-4 bg-white dark:bg-gray-800 text-black dark:text-white relative isolate overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex justify-between">
                  <div className="flex flex-col gap-2 mr-2">
                    <h2 className="text-xl font-extrabold">{curso.nombre}</h2>
                    <p className="text-lg mb-2">{curso.descripcion}</p>
                    <p className="flex gap-2">
                      <CalendarIcon />
                      {new Date(new Date(curso.fecha_inicio).getTime() + 86400000).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}{" "}
                      al{" "}
                      {new Date(new Date(curso.fecha_fin).getTime() + 86400000).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                    <p className="flex gap-2">
                      <ClockIcon />
                      {new Date(`2000-01-01T${curso.horarioInicio}`).toLocaleTimeString("es-ES", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                      {" - "}
                      {new Date(`2000-01-01T${curso.horarioFin}`).toLocaleTimeString("es-ES", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                  <div className="items-center gap-2 flex flex-col justify-center ">
                    <Button
                      className="bg-blue-500 dark:bg-blue-700 min-w-[80px] max-w-[100px] sm:max-w-[120px] text-white dark:text-white px-2"
                      onClick={() => handleEdit(curso)}
                    >
                      <PencilIcon />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="bg-red-500 dark:bg-red-700 min-w-[80px] max-w-[100px] sm:max-w-[120px] text-white dark:text-white px-2">
                          <TrashIcon />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
                          <AlertDialogDescription>
                            ¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="text-black dark:text-white">Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(curso.id)}>Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
              <div
                className="absolute inset-y-0 right-0 w-1/2 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${curso.foto_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white dark:to-gray-800"></div>
              </div>
            </div>
          ))}
      </div>

      {cursoSeleccionado && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} className="text-black dark:text-white">
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-black dark:text-white">Editar Curso</DialogTitle>
              <DialogDescription>Modifique los campos necesarios y guarde los cambios.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-black dark:text-white">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" defaultValue={cursoSeleccionado.nombre} />
              <Label htmlFor="descripcion">Descripción</Label>
              <Input id="descripcion" defaultValue={cursoSeleccionado.descripcion} />
              <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
              <Input id="fecha_inicio" defaultValue={cursoSeleccionado.fecha_inicio} type="date" />
              <Label htmlFor="fecha_fin">Fecha Fin</Label>
              <Input id="fecha_fin" defaultValue={cursoSeleccionado.fecha_fin} type="date" />
              <Label htmlFor="horarioInicio">Horario Inicio</Label>
              <Input id="horarioInicio" defaultValue={cursoSeleccionado.horarioInicio} type="time" />
              <Label htmlFor="horarioFin">Horario Fin</Label>
              <Input id="horarioFin" defaultValue={cursoSeleccionado.horarioFin} type="time" />
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button onClick={handleSaveChanges}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ListaCursos;
