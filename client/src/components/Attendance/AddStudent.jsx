import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import LoaderAE from "../LoaderAE";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import MainContext from "../../context/MainContext";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import CRSelect from "../Preguntas/CRSelect";
import { prefijos } from "@/context/prefijos";

export function AddStudent({ value }) {
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [cursoSelected, setCursoSelected] = useState(null);
  const [tutorSelected, setTutorSelected] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [prefijo, setPrefijo] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [observations, setObservations] = useState("");
  const [activo, setActivo] = useState("Activo");
  const [tutores, setTutores] = useState([]);
  const [reset, setReset] = useState(false);

  const { user, fetchModulos, fetchAllModulos, fetchTutores } = useContext(MainContext);

  const validateForm = () => {
    const requiredFieldsAdmin = [name, lastName, phone, cursoSelected, tutorSelected, prefijo];
    const requiredFieldsTutor = [name, lastName, phone, cursoSelected, prefijo];
    const fieldsToCheck = user.tipo === "Administrador" ? requiredFieldsAdmin : requiredFieldsTutor;

    if (fieldsToCheck.some((field) => !field || field === "")) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, complete todos los campos obligatorios (*).",
        duration: 2500,
      });
      return false;
    }
    setActivo("Activo");
    return true;
  };

  const handleGuardarDatos = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const dataFinal = {
          nombres: name,
          apellidos: lastName,
          fecha_nacimiento: selectedDate,
          prefijo: prefijo,
          telefono: phone,
          direccion: address,
          email: email,
          tutor_id: user.tipo === "Administrador" ? parseInt(tutorSelected) : parseInt(user?.id),
          modulo_id: parseInt(cursoSelected),
          activo: activo,
          observaciones: observations,
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

          setName("");
          setLastName("");
          setPhone("");
          setEmail("");
          setPrefijo("");
          setAddress("");
          setObservations("");
          setTutorSelected(null);
          setCursoSelected(null);
          setSelectedDate("");
          setReset((prev) => !prev);
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
    const loadData = async () => {
      setLoadingData(true);
      if (user.tipo === "Administrador") {
        const modulesData = await fetchAllModulos();
        const tutorsData = await fetchTutores();
        setCursos(modulesData || []);
        setTutores(tutorsData || []);
      } else if (user.tipo === "Tutor") {
        const modulesData = await fetchModulos(user.id);
        setCursos(modulesData || []);
      }
      setLoadingData(false);
    };
    loadData();
  }, [user.id, user.tipo, fetchModulos, fetchAllModulos, fetchTutores]);

  const prefijosFormateados = prefijos[0]
    ? Object.entries(prefijos[0]).map(([label, value]) => ({
        value: value,
        label: `${label} (${value})`,
      }))
    : [];

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
          <CardDescription>Añadir un nuevo alumno</CardDescription>
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
            <Input value={name} placeholder="Ingrese sus nombres" onChange={(e) => setName(e.target.value)} autoComplete="off" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="lastName">
              Apellidos<span className="text-red-500">*</span>
            </Label>
            <Input value={lastName} placeholder="Ingrese sus apellidos" onChange={(e) => setLastName(e.target.value)} autoComplete="off" />
          </div>

          <div className="space-y-1 flex flex-col">
            <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
            <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </div>
          <div className="space-y-1">
            <CRSelect title="Prefijo telefónico" data={prefijosFormateados} setValue={setPrefijo} reset={reset} require />
            <Label htmlFor="phone">
              Teléfono<span className="text-red-500">*</span>
            </Label>
            <Input value={phone} placeholder="Ingrese el teléfono" onChange={(e) => setPhone(e.target.value)} type="number" autoComplete="off" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input type="email" value={email} placeholder="Ingrese el correo electronico" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="address">Dirección</Label>
            <Input value={address} placeholder="Ingrese la dirección" onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="space-y-1 flex flex-col">
            {user.tipo === "Tutor" ? (
              <div>
                <Label>Tutor</Label>
                <Input value={`${user?.nombres} ${user?.apellidos}`} disabled />
              </div>
            ) : (
              <CRSelect title="Tutor" data={tutores} setValue={setTutorSelected} reset={reset} require />
            )}
          </div>
          <div className="space-y-1 flex flex-col">
            <CRSelect title="Curso" data={cursos} setValue={setCursoSelected} reset={reset} require />
          </div>
          <div className="space-y-1">
            <Label htmlFor="observations">Observaciones</Label>
            <Input value={observations} placeholder="Ingrese una observacion" onChange={(e) => setObservations(e.target.value)} autoComplete="off" />
          </div>
        </CardContent>
        <Button className="w-11/12 sm:w-[680px] m-auto mt-4 mb-12 px-24 flex" onClick={handleGuardarDatos} disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </Card>
    </TabsContent>
  );
}

AddStudent.propTypes = {
  value: PropTypes.string.isRequired,
};
