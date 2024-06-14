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

export function AddStudent({ value }) {
  const [loadingData, setLoadingData] = useState(true);
  const [tutors, setTutors] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [cursoSelected, setCursoSelected] = useState(null);
  const [tutorSelected, setTutorSelected] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { toast } = useToast();

  // CONTEXTO
  const { user } = useContext(MainContext);

  // EseEffect para cagar ambos datos
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
          console.log(data);
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
          console.log(dataTutors);
          const formattedDataTutors = dataTutors.map((tutor) => ({
            value: tutor.id.toString(),
            label: tutor.nombres + " " + tutor.apellidos,
          }));
          setTutors(formattedDataTutors);
          console.log(formattedDataTutors);
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
        <DropdownAE data={cursos} title="Seleccione un curso" setValueAE={setCursoSelected} />
        <DropdownAE data={tutors} title="Seleccione un tutor" setValueAE={setTutorSelected} />
        <CalendarAE title="Seleccione una fecha" setDate={setSelectedDate} />

        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="name">Nombres</Label>
            <Input placeholder="Ingrese sus nombres" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Apellidos</Label>
            <Input placeholder="Ingrese sus apellidos" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Teléfono</Label>
            <Input placeholder="Ingrese su teléfono" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Dirección</Label>
            <Input placeholder="Ingrese su dirección" />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

AddStudent.propTypes = {
  value: PropTypes.string.isRequired,
};
