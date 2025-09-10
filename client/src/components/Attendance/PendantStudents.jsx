import { TabsContent } from "@/components/ui/tabs";
import { useContext, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import LoaderAE from "../LoaderAE";
import MainContext from "../../context/MainContext";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import CRSelect from "../Preguntas/CRSelect";
import PropTypes from "prop-types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const PendantStudents = ({ value }) => {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [isLoadingCursos, setIsLoadingCursos] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [observations, setObservations] = useState("");
  const { user, fetchModulos } = useContext(MainContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchModulos(user.id).then((data) => {
      setCursos(data || []);
      setIsLoadingCursos(false);
    });
  }, [fetchModulos, user.id]);

  useEffect(() => {
    const fetchPendingStudents = async () => {
      if (!cursoSeleccionado) return;
      setIsLoadingStudents(true);
      try {
        const response = await fetch(`${URL_BASE}/get/getStudentsByModuleAndTutorPendants/${cursoSeleccionado}/${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPendingStudents(data);
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al consultar los estudiantes pendientes.",
          duration: 2500,
        });
      } finally {
        setIsLoadingStudents(false);
      }
    };
    fetchPendingStudents();
  }, [cursoSeleccionado, user.id, user.token, toast]);

  const handleAcceptRequest = async () => {
    if (!selectedStudent) return;

    try {
      const response = await fetch(`${URL_BASE}/put/updateStudentPendant/${selectedStudent.AlumnoID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token,
        },
        body: JSON.stringify({
          observaciones: observations,
          activo: "Activo",
        }),
      });

      if (response.ok) {
        toast({
          variant: "success",
          title: "Éxito",
          description: "Solicitud aceptada correctamente.",
          duration: 2500,
        });
        setPendingStudents((prev) => prev.filter((student) => student.AlumnoID !== selectedStudent.AlumnoID));
        setObservations("");
        setSelectedStudent(null);
        setIsDialogOpen(false);
      } else {
        throw new Error("Failed to accept request");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al aceptar la solicitud.",
        duration: 2500,
      });
    }
  };

  if (isLoadingCursos) {
    return (
      <TabsContent value={value}>
        <Card>
          <LoaderAE />
        </Card>
      </TabsContent>
    );
  }

  return (
    <TabsContent value={value}>
      <Card>
        <CardHeader>
          <CardTitle>Listado de estudiantes pendientes</CardTitle>
          <CardDescription>Mostrar todos los estudiantes pendientes.</CardDescription>
        </CardHeader>
        <div className="sm:w-[96%] m-auto h-4 mb-2">
          <hr />
        </div>
        <h2 className="text-xl font-extrabold text-center mb-2">Seleccione un curso para filtrar</h2>
        <div className="w-8/12 m-auto flex justify-center mb-4">
          <CRSelect
            data={cursos}
            placeholder="Seleccione un curso"
            value={cursoSeleccionado}
            onChange={setCursoSeleccionado}
            disabled={isLoadingCursos}
          />
        </div>
        {isLoadingStudents ? (
          <LoaderAE />
        ) : (
          cursoSeleccionado &&
          (pendingStudents.length > 0 ? (
            <div className="sm:w-[90%] w-11/12 m-auto justify-center border-[1px] mb-14 rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Fecha de Nacimiento</TableHead>
                    <TableHead>Observaciones</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingStudents.map((student) => (
                    <TableRow key={student.AlumnoID}>
                      <TableCell className="capitalize">{`${student.AlumnoNombres} ${student.AlumnoApellidos}`}</TableCell>
                      <TableCell>{student.AlumnoTelefono}</TableCell>
                      <TableCell>{student.AlumnoFechaNacimiento ? format(new Date(student.AlumnoFechaNacimiento), "yyyy-MM-dd") : "---"}</TableCell>
                      <TableCell>{student.AlumnoObservaciones}</TableCell>
                      <TableCell>
                        <Dialog
                          open={isDialogOpen && selectedStudent?.AlumnoID === student.AlumnoID}
                          onOpenChange={(isOpen) => {
                            if (!isOpen) {
                              setSelectedStudent(null);
                            }
                            setIsDialogOpen(isOpen);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button onClick={() => setSelectedStudent(student)}>Aceptar Registro</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] text-black dark:text-white">
                            <DialogHeader>
                              <DialogTitle>
                                Aceptar solicitud de: {student.AlumnoNombres} {student.AlumnoApellidos}
                              </DialogTitle>
                              <DialogDescription>Agregue observaciones si es necesario.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <Textarea
                                placeholder="Escriba sus observaciones aquí."
                                value={observations}
                                onChange={(e) => setObservations(e.target.value)}
                              />
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancelar
                              </Button>
                              <Button type="button" onClick={handleAcceptRequest}>
                                Aceptar registro
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center font-bold py-4">&quot;En este curso no hay estudiantes pendientes.&quot;</p>
          ))
        )}
      </Card>
    </TabsContent>
  );
};

PendantStudents.propTypes = {
  value: PropTypes.string.isRequired,
};

export default PendantStudents;
