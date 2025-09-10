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
import { RestoreIcon } from "@/components/Iconos";
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
      return;
    }

    if (user?.tipo === "Administrador") {
      setIsLoadingTutores(true);
      fetchTutoresDeleted()
        .then((data) => {
          setDeletedTutores(data || []);
        })
        .finally(() => {
          setIsLoadingTutores(false);
        });
    }
  }, [user, fetchTutoresDeleted, navigate]);

  const handleRestore = async (tutorId) => {
    if (!tutorId) return;

    const restoreTutorData = {
      activo: "1",
    };

    try {
      const response = await fetch(`${URL_BASE}/put/updateTutor/${tutorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token,
        },
        body: JSON.stringify(restoreTutorData),
      });

      if (response.ok) {
        toast({
          variant: "success",
          title: "Éxito",
          description: "Se restauró el tutor.",
          duration: 2500,
        });
        setDeletedTutores((prev) => prev.filter((tutor) => tutor.id !== tutorId));
      } else {
        throw new Error("Failed to restore tutor");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Ocurrió un error al restaurar el tutor: ${error.message}`,
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
      {deletedTutores.map((tutor) => (
        <div
          key={tutor.id}
          className="border-[1px] rounded-xl p-4 bg-white dark:bg-gray-800 text-black dark:text-white relative isolate overflow-hidden"
        >
          <div className="relative z-10 flex justify-between">
            <div className="flex flex-col gap-2 mr-2">
              <h2 className="text-xl font-extrabold">{`${tutor.nombres} ${tutor.apellidos}`}</h2>
              <p className="text-lg mb-2">Teléfono: {tutor.telefono}</p>
              <p className="text-sm">Tipo: {tutor.tipo}</p>
            </div>
            <div className="items-center gap-2 flex flex-col justify-center">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-green-500 dark:bg-green-700 text-white dark:text-white px-4">
                    <RestoreIcon />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Recuperación</AlertDialogTitle>
                    <AlertDialogDescription>¿Estás seguro de que deseas recuperar a este Tutor?</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleRestore(tutor.id)} className="bg-green-500">
                      Recuperar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 w-1/2">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${tutor.foto_url})`,
                backgroundSize: "cover",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-gray-800 dark:via-gray-800/80"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecoverTutor;
