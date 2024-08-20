import { useContext, useEffect, useState } from "react";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";
import MainContext from "@/context/MainContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import { DropdownAE } from "../../DropdownAE";
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
          const response = await fetch(`${URL_BASE}/admin/allTutorsByModule`, {
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
  }, [user?.token, user?.tipo, toast]);

  const handleEdit = (tutor) => {
    setSelectedTutor(tutor);
    setCurrentTutorId(tutor.id);
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

    if (selectedTipoTutorEdit === null || selectedTipoTutorEdit === "" || selectedTipoTutorEdit === undefined) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Seleccione un tipo de tutor.",
        duration: 2500,
      });

      return;
    }

    const updatedTutor = {
      id: selectedTutor.id,
      nombres: document.getElementById("name").value,
      apellidos: document.getElementById("surname").value,
      telefono: document.getElementById("phone").value,
      direccion: document.getElementById("address").value,
      tipo: selectedTipoTutorEdit,
      foto_url: newImageProfile === "" ? selectedTutor.foto_url : newImageProfile,
    };

    if (
      updatedTutor.nombres === selectedTutor.nombres &&
      updatedTutor.apellidos === selectedTutor.apellidos &&
      updatedTutor.telefono === selectedTutor.telefono &&
      updatedTutor.direccion === selectedTutor.direccion &&
      updatedTutor.tipo === selectedTutor.tipo &&
      updatedTutor.foto_url === selectedTutor.foto_url
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

        // Actualiza el estado de tutorsByModule con el tutor actualizado
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
    handleCloseModal();
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

        // Actualiza el estado de tutorsByModule eliminando el tutor
        setTutorsByModule((prevTutorsByModule) =>
          prevTutorsByModule.map((module) => ({
            ...module,
            Tutores: module.Tutores.filter((tutor) => tutor.id !== tutorId),
          }))
        );
        handleCloseModal();
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
    handleCloseModal();
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
    <Accordion type="multiple">
      {tutorsByModule.map((module) => (
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
                  <TableRow key={tutor.id} className="odd:bg-indigo-300/20 even:bg-indigo-300/50 dark:odd:bg-indigo-500/10 dark:even:bg-indigo-500/20">
                    <TableCell>{tutor.nombres}</TableCell>
                    <TableCell>{tutor.apellidos}</TableCell>
                    <TableCell>{tutor.telefono}</TableCell>
                    <TableCell>{tutor.direccion}</TableCell>
                    <TableCell>{tutor.tipo}</TableCell>
                    <TableCell>
                      <Dialog open={isModalOpen && currentTutorId === tutor.id}>
                        <DialogTrigger asChild>
                          <Button className="bg-blue-500" onClick={() => handleEdit(tutor)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="icon icon-tabler icons-tabler-outline icon-tabler-pencil"
                            >
                              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                              <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                              <path d="M13.5 6.5l4 4" />
                            </svg>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader className="text-black dark:text-white">
                            <DialogTitle>Editar tutor</DialogTitle>
                            <DialogDescription>Realiza los cambios necesarios y guarda.</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4 text-black dark:text-white">
                            <ImagenCloud url={tutor.foto_url} rounded setURLUpload={setNewImageProfile} upload />
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
                              <div className="col-span-3 sm:col-span-4">
                                <DropdownAE data={tipoDeTutor} setValueAE={setSelectedTipoTutorEdit} title="Seleccione tipo" />
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
                      <AlertDialog className="text-black dark:text-white">
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="icon icon-tabler icons-tabler-outline icon-tabler-trash"
                            >
                              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                              <path d="M4 7l16 0" />
                              <path d="M10 11l0 6" />
                              <path d="M14 11l0 6" />
                              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                              <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                            </svg>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="text-black dark:text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>Esta acción no se puede deshacer. ¿Quieres continuar?</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-500 text-white dark:bg-red-500 dark:text-white" onClick={() => handleDelete(tutor.id)}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ListaTutores;
