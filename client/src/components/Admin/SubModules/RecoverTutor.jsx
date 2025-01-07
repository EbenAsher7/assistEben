import { useContext, useEffect, useState } from "react";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";
import MainContext from "@/context/MainContext";
import { Button } from "@/components/ui/button";
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
import { CalendarIcon, RestoreIcon, ClockIcon } from "@/components/Iconos";
import { useNavigate } from "react-router-dom";

const RecoverTutor = () => {
  const [deletedTutores, setDeletedTutores] = useState([]);
  const { user, fetchTutoresDeleted } = useContext(MainContext);

  const navigate = useNavigate();

  const [isLoadingTutores, setIsLoadingTutores] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }

    if (user || user?.tipo === "Administrador") {
      setIsLoadingTutores(true);
      fetchTutoresDeleted().then((data) => {
        setDeletedTutores(data);
        console.log("lista de tutores eliminados", data);
        setIsLoadingTutores(false);
      });
    }
  }, [user, fetchTutoresDeleted, navigate]);

  const handleDelete = async (cursoId) => {
    if (!cursoId) {
      return;
    }

    const RestoreCurso = {
      activo: "1",
    };

    try {
      const response = await fetch(`${URL_BASE}/put/updateCurso/${cursoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token,
        },
        body: JSON.stringify(RestoreCurso),
      });

      if (response.ok) {
        toast({
          variant: "success",
          title: "Éxito",
          description: "Se restauró el curso.",
          duration: 2500,
        });

        // Actualiza el estado de cursos eliminando el curso
        setDeletedTutores((prevCursos) => prevCursos.filter((curso) => curso.id !== cursoId));
      } else {
        throw new Error("Failed to restore");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al restaurar el tutor." + error,
        duration: 2500,
      });
    }
  };

  if (isLoadingTutores) {
    return <LoaderAE texto="Cargando tutores eliminados" />;
  }

  if (!deletedTutores || deletedTutores.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">No hay Tutores eliminados</h1>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {deletedTutores &&
          deletedTutores.map((curso) => (
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="bg-green-500 dark:bg-green-700 text-white dark:text-white px-4">
                          <RestoreIcon />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Recuperación</AlertDialogTitle>
                          <AlertDialogDescription>¿Estás seguro de que deseas recuperar este Tutor?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="text-black dark:text-white">Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(curso.id)} className="bg-green-500 dark:bg-green-500 text-white dark:text-white">
                            Recuperar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 w-1/2">
                <div
                  className="absolute inset-0 bg-cover bg-center repeat-0 scale-x-95"
                  style={{
                    backgroundImage: `url(${curso.foto_url})`,
                    backgroundSize: "100%",
                    objectFit: "cover",
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-white from-0% via-white via-10% dark:from-gray-800 scale-105"></div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default RecoverTutor;
