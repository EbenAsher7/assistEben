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
// import { CalendarAE } from "../CalendarAE";
import { Button } from "../ui/button";
// import { format, addDays } from "date-fns"; // Importa addDays
import CRDate from "../ui/CRDate";
import CRSelect from "../Preguntas/CRSelect";

import { prefijos } from "@/context/prefijos";

export function AddStudent({ value }) {
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [cursoSelected, setCursoSelected] = useState(null);
  const [tutorSelected, setTutorSelected] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [prefijo, setPrefijo] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  // UseState para todos los inputs
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [observations, setObservations] = useState("");
  const [activo, setActivo] = useState("Activo");

  const [tutores, setTutores] = useState([]);

  // CONTEXTO
  const { user, fetchModulos, fetchAllModulos, fetchTutores } = useContext(MainContext);

  // Verificar que nombre, apellidos y teléfono no estén vacíos
  const validateForm = () => {
    if (user.tipo === "Tutor") {
      if (name === "" || lastName === "" || phone === "" || cursoSelected === null || tutorSelected === null || prefijo === "") {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Los campos de nombres, apellidos, prefijo, teléfono, curso y tutor son obligatorios.",
          duration: 2500,
        });
        return false;
      } else {
        setActivo("Activo");
        return true;
      }
    } else if (user.tipo === "Administrador") {
      if (name === "" || lastName === "" || prefijo === "" || phone === "" || cursoSelected === null || tutorSelected === null) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Los campos de nombres, apellidos, prefijo, teléfono, curso y tutor son obligatorios.",
          duration: 2500,
        });
        return false;
      } else {
        setActivo("Activo");
        return true;
      }
    }
  };

  // Función para guardar los datos
  const handleGuardarDatos = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        // const adjustedDate = addDays(selectedDate, 1); // Ajusta la fecha sumando un día
        // const formattedDate = adjustedDate ? format(adjustedDate, "yyyy-MM-dd") : "";
        const dataFinal = {
          nombres: name,
          apellidos: lastName,
          fecha_nacimiento: selectedDate ?? "",
          prefijo: prefijo,
          telefono: phone,
          direccion: address ?? "",
          email: email ?? "",
          tutor_id: parseInt(user?.id),
          modulo_id: parseInt(cursoSelected),
          activo: activo,
          observaciones: observations ?? "",
        };

        const response = await fetch(`${URL_BASE}/post/addStudent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token,
          },
          body: JSON.stringify(dataFinal),
        });

        if (response.ok) {
          toast({
            title: "Éxito",
            description: "El alumno ha sido registrado correctamente.",
            duration: 2500,
          });

          // reset formulario
          setName("");
          setLastName("");
          setPhone("");
          setEmail("");
          setPrefijo("");
          setAddress("");
          setObservations("");
          setTutorSelected(null);
          setCursoSelected(null);
          setSelectedDate(new Date());
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
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user.tipo === "Administrador") {
      fetchAllModulos(user.id).then((data) => {
        setCursos(data);
      });

      fetchTutores().then((data) => {
        setTutores(data);
        setLoadingData(false);
      });
    } else if (user.tipo === "Tutor") {
      fetchModulos(user.id).then((data) => {
        setCursos(data);
        setLoadingData(false);
      });
    }
  }, [fetchModulos, user.id, fetchAllModulos, user.tipo]);

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
          <h1 className="text-red-500 text-sm italic font-normal text-center mb-8">*Solo los campos con asterisco son OBLIGATORIOS</h1>
        </CardHeader>
        <div className="sm:w-[96%] m-auto h-2 mb-2">
          <hr />
        </div>
        <CardContent className="space-y-2 grid grid-cols-1 sm:grid-cols-2 w-full sm:w-[720px] m-auto gap-4 place-content-center justify-center items-center">
          <div className="space-y-1">
            <Label htmlFor="name">
              Nombres<span className="text-red-500">*</span>
            </Label>
            <Input value={name} placeholder="Ingrese sus nombres" onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="name" className="-mt-1">
              Apellidos<span className="text-red-500">*</span>
            </Label>
            <Input value={lastName} placeholder="Ingrese sus apellidos" onChange={(e) => setLastName(e.target.value)} />
          </div>

          <div className="space-y-1 flex flex-col">
            <CRDate title="Fecha de Nacimiento" setValue={setSelectedDate} placeholder="Seleccione la fecha de nacimiento" />
          </div>
          <div className="space-y-1">
            <CRSelect title="Prefijo telefónico" autoClose data={prefijos} setValue={setPrefijo} />
            <br />
            <Label htmlFor="name">
              Teléfono<span className="text-red-500">*</span>
            </Label>
            <Input value={phone} placeholder="Ingrese el teléfono" onChange={(e) => setPhone(e.target.value)} type="number" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email" className="-mt-1">
              Correo Electrónico
            </Label>
            <Input type="email" value={email} placeholder="Ingrese el correo electronico" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Dirección</Label>
            <Input value={address} placeholder="Ingrese la dirección" onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="space-y-1 flex flex-col">
            <Label htmlFor="name">
              Tutor<span className="text-red-500">*</span>
            </Label>
            {user.tipo === "Tutor" ? (
              <DropdownAE
                data={[]}
                title="Seleccione un tutor"
                setValueAE={setTutorSelected}
                disable
                defaultValue={user?.nombres + " " + user?.apellidos}
              />
            ) : (
              <DropdownAE data={tutores} title="Seleccione un tutor" setValueAE={setTutorSelected} />
            )}
          </div>
          <div className="space-y-1 flex flex-col">
            <Label htmlFor="name">
              Curso<span className="text-red-500">*</span>
            </Label>
            <DropdownAE data={cursos} title="Seleccione un curso" setValueAE={setCursoSelected} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Observaciones</Label>
            <Input value={observations} placeholder="Ingrese una observacion" onChange={(e) => setObservations(e.target.value)} />
          </div>
        </CardContent>
        <Button className="w-11/12 sm:w-[680px] m-auto mt-4 mb-12 px-24 flex" onClick={handleGuardarDatos} disabled={loading}>
          {loading ? "Cargando..." : "Guardar"}
        </Button>
      </Card>
    </TabsContent>
  );
}

AddStudent.propTypes = {
  value: PropTypes.string.isRequired,
};
