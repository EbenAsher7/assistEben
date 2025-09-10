import { useContext, useEffect, useState } from "react";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";
import MainContext from "@/context/MainContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import CRSelect from "@/components/Preguntas/CRSelect";
import ImagenCloud from "@/components/ImagenCloud";

const ListaTutores = () => {
  const [isLoadingTutors, setIsLoadingTutors] = useState(false);
  const [tutorsByModule, setTutorsByModule] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedTipoTutorEdit, setSelectedTipoTutorEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTutorId, setCurrentTutorId] = useState(null);
  const [newImageProfile, setNewImageProfile] = useState("");

  const { toast } = useToast();
  const { user } = useContext(MainContext);

  useEffect(() => {
    if (user && user.tipo) {
      const fetchData = async () => {
        setIsLoadingTutors(true);
        try {
          const response = await fetch(`${URL_BASE}/admin/allTutorsByModule/${user.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: user?.token,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setTutorsByModule(data.length ? data : []);
          } else {
            throw new Error("Failed to fetch");
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Ocurrió un error al consultar los tutores.",
            duration: 2500,
          });
        } finally {
          setIsLoadingTutors(false);
        }
      };

      fetchData();
    }
  }, [user, toast]);

  const handleEdit = (tutor) => {
    setSelectedTutor(tutor);
    setCurrentTutorId(tutor.id);
    setSelectedTipoTutorEdit(tutor.tipo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTutor(null);
    setCurrentTutorId(null);
    setSelectedTipoTutorEdit(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedTutor) {
      return;
    }

    if (!selectedTipoTutorEdit) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Seleccione un tipo de tutor.",
        duration: 2500,
      });
      return;
    }

    const updatedTutor = {
      nombres: document.getElementById("name").value,
      apellidos: document.getElementById("surname").value,
      telefono: document.getElementById("phone").value,
      direccion: document.getElementById("address").value,
      tipo: selectedTipoTutorEdit,
      foto_url: newImageProfile === "" ? selectedTutor.foto_url : newImageProfile,
    };

    try {
      const response = await fetch(`${URL_BASE}/put/updateTutor/${selectedTutor.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token,
        },
        body: JSON.stringify(updatedTutor),
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Se actualizaron los datos del tutor.",
          duration: 2500,
        });

        setTutorsByModule((prevTutorsByModule) =>
          prevTutorsByModule.map((module) => ({
            ...module,
            Tutores: module.Tutores.map((tutor) => (tutor.id === selectedTutor.id ? { ...tutor, ...updatedTutor } : tutor)),
          }))
        );

        handleCloseModal();
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al actualizar los datos del tutor.",
        duration: 2500,
      });
    }
  };

  const handleDelete = async (tutorId) => {
    if (!tutorId) {
      return;
    }

    const deleteTutor = {
      activo: "0",
    };

    try {
      const response = await fetch(`${URL_BASE}/put/updateTutor/${tutorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token,
        },
        body: JSON.stringify(deleteTutor),
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Se eliminó el tutor.",
          duration: 2500,
        });

        setTutorsByModule((prevTutorsByModule) =>
          prevTutorsByModule.map((module) => ({
            ...module,
            Tutores: module.Tutores.filter((tutor) => tutor.id !== tutorId),
          }))
        );
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al eliminar el tutor." + error,
        duration: 2500,
      });
    }
  };

  if (isLoadingTutors) {
    return <LoaderAE />;
  }

  const tipoDeTutor = [
    { value: "Tutor", label: "Tutor" },
    { value: "Administrador", label: "Administrador" },
    { value: "Normal", label: "Normal" },
  ];

  return (
    <>
      <Accordion type="multiple" className="w-full sm:w-[80%] m-auto">
        {tutorsByModule.length > 0 ? (
          tutorsByModule.map((module) => (
            <AccordionItem key={module.idModulo} value={`item-${module.idModulo}`}>
              <AccordionTrigger className="bg-purple-300 dark:bg-indigo-700 px-4">{module.nombreModulo}</AccordionTrigger>
              <AccordionContent>
                <Table className="text-black dark:text-white border-[1px] rounded-xl mt-2">
                  <TableCaption className="italic mb-3">Lista de tutores para {module.nombreModulo}</TableCaption>
                  <TableHeader>
                    <TableRow className="bg-cyan-200 dark:bg-cyan-900">
                      <TableHead>Nombre</TableHead>
                      <TableHead>Apellidos</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Dirección</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-black dark:text-white">
                    {module.Tutores.map((tutor) => (
                      <TableRow
                        key={tutor.id}
                        className="odd:bg-indigo-300/20 even:bg-indigo-300/50 dark:odd:bg-indigo-500/10 dark:even:bg-indigo-500/20"
                      >
                        <TableCell>{tutor.nombres}</TableCell>
                        <TableCell>{tutor.apellidos}</TableCell>
                        <TableCell>{tutor.telefono}</TableCell>
                        <TableCell>{tutor.direccion}</TableCell>
                        <TableCell>{tutor.tipo}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button className="bg-blue-500" onClick={() => handleEdit(tutor)}>
                              Editar
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive">Eliminar</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>Esta acción no se puede deshacer. ¿Quieres continuar?</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(tutor.id)}>Eliminar</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          ))
        ) : (
          <div>
            <h1 className="text-center font-extrabold text-xl mt-4">No hay tutores asignados para mostrar.</h1>
          </div>
        )}
      </Accordion>

      {selectedTutor && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="text-black dark:text-white">
              <DialogTitle>Editar tutor</DialogTitle>
              <DialogDescription>Realiza los cambios necesarios y guarda.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-black dark:text-white">
              <ImagenCloud url={selectedTutor.foto_url} rounded setURLUpload={setNewImageProfile} upload />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input id="name" defaultValue={selectedTutor?.nombres} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="surname" className="text-right">
                  Apellidos
                </Label>
                <Input id="surname" defaultValue={selectedTutor?.apellidos} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Teléfono
                </Label>
                <Input id="phone" defaultValue={selectedTutor?.telefono} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Dirección
                </Label>
                <Input id="address" defaultValue={selectedTutor?.direccion} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Tipo
                </Label>
                <div className="col-span-3">
                  <CRSelect data={tipoDeTutor} setValue={setSelectedTipoTutorEdit} defaultValue={selectedTutor?.tipo} />
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" className="bg-red-500 text-white dark:bg-red-500" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-500 text-white dark:bg-green-500" onClick={handleSaveChanges}>
                Guardar cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ListaTutores;
