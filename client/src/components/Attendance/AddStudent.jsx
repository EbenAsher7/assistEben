import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import LoaderAE from "../LoaderAE";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import MainContext from "../../context/MainContext";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";
import { DropdownAE } from "../DropdownAE";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarAE } from "../CalendarAE";
import { Button } from "../ui/button";
import { format } from "date-fns";

export function AddStudent({ value }) {
  const [loadingData, setLoadingData] = useState(true);
  const [tutors, setTutors] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [cursoSelected, setCursoSelected] = useState(null);
  const [tutorSelected, setTutorSelected] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { toast } = useToast();

  // UseState para todos los inputs
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [observations, setObservations] = useState("");
  const [activo, setActivo] = useState("Activo");

  // CONTEXTO
  const { user } = useContext(MainContext);

  // Verficar que nombre, apellidos y telefono no esten vacios
  const validateForm = () => {
    if (name === "" || lastName === "" || phone === "" || cursoSelected === null || tutorSelected === null) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Los campos de nombres, apellidos, teléfono, curso y tutor son obligatorios.",
        duration: 2500,
      });
      return false;
    } else {
      setActivo("Activo");
      return true;
    }
  };

  // Funcion para guardar los datos
  const handleGuardarDatos = async () => {
    if (validateForm()) {
      try {
        console.log(selectedDate);
        const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
        console.log(formattedDate);
        const dataFinal = {
          nombres: name,
          apellidos: lastName,
          fecha_nacimiento: formattedDate ?? "",
          telefono: phone,
          direccion: address ?? "",
          tutor_id: parseInt(tutorSelected),
          modulo_id: parseInt(cursoSelected),
          activo: activo,
          observaciones: observations ?? "",
        };

        console.log(dataFinal);
        const response = await fetch(`${URL_BASE}/post/addStudent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: user.token,
          },
          body: JSON.stringify({
            nombres: name,
            apellidos: lastName,
            fecha_nacimiento: formattedDate ?? "",
            telefono: phone,
            direccion: address ?? "",
            tutor_id: parseInt(tutorSelected),
            modulo_id: parseInt(cursoSelected),
            activo: activo,
            observaciones: observations ?? "",
          }),
        });

        if (response.ok) {
          toast({
            title: "Éxito",
            description: "El alumno ha sido registrado correctamente.",
            duration: 2500,
          });
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al guardar los datos.",
          duration: 2500,
        });
      }
    }
  };

  // useEffect para cagar ambos datos
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        // cargar cursos
        const response = await fetch(`${URL_BASE}/api/modules`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: user.token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const formattedData = data.map((curso) => ({
            value: curso.id.toString(),
            label: curso.nombre,
          }));
          setCursos(formattedData);
        } else {
          throw new Error("Failed to fetch");
        }

        // cargar tutores
        const responseTutors = await fetch(`${URL_BASE}/api/tutors`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: user.token,
          },
        });

        if (responseTutors.ok) {
          const dataTutors = await responseTutors.json();
          const formattedDataTutors = dataTutors.map((tutor) => ({
            value: tutor.id.toString(),
            label: tutor.nombres + " " + tutor.apellidos,
          }));
          setTutors(formattedDataTutors);
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al consultar los datos disponibles.",
          duration: 2500,
        });
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  if (loadingData) {
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
          <CardTitle>Añadir Alumno</CardTitle>
          <CardDescription>añadir un nuevo alumno</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 grid grid-cols-1 sm:grid-cols-2 w-full sm:w-[720px] m-auto gap-4 place-content-center justify-center items-center">
          <div className="space-y-1">
            <Label htmlFor="name">Nombres</Label>
            <Input placeholder="Ingrese sus nombres" onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="name" className="-mt-1">
              Apellidos
            </Label>
            <Input placeholder="Ingrese sus apellidos" onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="space-y-1 flex flex-col">
            <Label htmlFor="name" className="mb-2">
              Fecha de Nacimiento
            </Label>
            <CalendarAE title="Seleccione una fecha" setDate={setSelectedDate} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Teléfono</Label>
            <Input placeholder="Ingrese el teléfono" onChange={(e) => setPhone(e.target.value)} type="number" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Dirección</Label>
            <Input placeholder="Ingrese la dirección" onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="space-y-1 flex flex-col">
            <Label htmlFor="name">Tutor</Label>
            <DropdownAE data={tutors} title="Seleccione un tutor" setValueAE={setTutorSelected} />
          </div>
          <div className="space-y-1 flex flex-col">
            <Label htmlFor="name">Curso</Label>
            <DropdownAE data={cursos} title="Seleccione un curso" setValueAE={setCursoSelected} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Observaciones</Label>
            <Input placeholder="Ingrese una observacion" onChange={(e) => setObservations(e.target.value)} />
          </div>
        </CardContent>
        <Button className="w-11/12 sm:w-[680px] m-auto mt-4 mb-12 px-24 flex" onClick={handleGuardarDatos}>
          Guardar
        </Button>
      </Card>
    </TabsContent>
  );
}

AddStudent.propTypes = {
  value: PropTypes.string.isRequired,
};
