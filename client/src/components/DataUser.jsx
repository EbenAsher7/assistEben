import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainContext from "../context/MainContext";
import PropTypes from "prop-types";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export function DataUser({ user }) {
  // Estados para los campos del formulario
  const [nombres, setNombres] = useState(user?.nombres || "");
  const [apellidos, setApellidos] = useState(user?.apellidos || "");
  const [telefono, setTelefono] = useState(user?.telefono || "");
  const [direccion, setDireccion] = useState(user?.direccion || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false); // Estado para controlar el guardado de datos
  const { toast } = useToast();

  //CONTEXTO
  const { setIsLogin, setUser } = useContext(MainContext);

  // Función para manejar el envío del formulario
  const handleGuardarCambios = () => {
    // Validación simple: verificar que todos los campos requeridos no estén vacíos
    if (!nombres || !apellidos || !telefono) {
      alert("Por favor complete todos los campos.");
      return;
    }
    // Enviar los datos al servidor con post usando async/await
    const sendData = async () => {
      setIsSaving(true); // Iniciar estado de guardado
      try {
        const response = await fetch(`${URL_BASE}/post/changeTutorData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: user.token,
          },
          body: JSON.stringify({
            id: user.id,
            nombres,
            apellidos,
            telefono,
            direccion,
            tipo: user.tipo, //estos datos no cambian
            observaciones: user.observaciones, //estos datos no cambian
          }),
        });

        if (response.ok) {
          toast({
            title: "Cambios guardados",
            description: "Los cambios se guardaron correctamente",
            duration: 2500,
          });
          setTimeout(() => {
            setIsLogin(false);
            setUser({});
          }, 2500);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Ocurrió un error al guardar los cambios.",
            duration: 2500,
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
          duration: 2500,
        });
      } finally {
        setIsSaving(false); // Finalizar estado de guardado
      }
    };

    sendData();
  };

  // Función para manejar el cambio de contraseña
  const handleCambiarPass = () => {
    // Validación simple: verificar que todos los campos requeridos no estén vacíos
    if (!password || !newPassword || !repeatPassword) {
      toast({
        variant: "destructive",
        title: "Campos incompletos",
        description: "Todos los campos son necesarios",
        duration: 2500,
      });
      return;
    }
    // Validación simple: verificar que las contraseñas coincidan
    if (newPassword !== repeatPassword) {
      toast({
        variant: "destructive",
        title: "Contraseñas no coinciden",
        description: "Las contraseñas no coinciden, por favor verifique",
        duration: 2500,
      });
      return;
    }
    // Enviar los datos al servidor con post usando async/await
    const sendData = async () => {
      setIsSaving(true); // Iniciar estado de guardado
      try {
        const response = await fetch(`${URL_BASE}/post/changePassword`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: user.token,
          },
          body: JSON.stringify({
            username: user.username,
            oldPassword: password,
            newPassword,
          }),
        });

        if (response.ok) {
          toast({
            title: "Contraseña cambiada",
            description: "La contraseña se cambió correctamente",
            duration: 2500,
          });
          setTimeout(() => {
            setIsLogin(false);
            setUser({});
          }, 2500);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Ocurrió un error al cambiar la contraseña.",
            duration: 2500,
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
          duration: 2500,
        });
      } finally {
        setIsSaving(false);
      }
    };

    sendData();
  };

  return (
    <div className="w-full flex justify-center px-8 mt-5">
      <Tabs defaultValue="Cuenta" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Cuenta">Cuenta</TabsTrigger>
          <TabsTrigger value="password">Contraseña</TabsTrigger>
        </TabsList>
        <TabsContent value="Cuenta">
          <Card>
            <CardHeader>
              <CardTitle>Cuenta</CardTitle>
              <CardDescription>
                Haz cambios a tu cuenta aquí, luego haz click en &quot;Guardar cambios&quot; para finalizar <br />
                <br />{" "}
                <span className="text-red-500 font-semibold">
                  NOTA: Al cambiar los datos, se cerrará tu sesión actual.
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Nombres</Label>
                <Input placeholder="Ingrese sus nombres" value={nombres} onChange={(e) => setNombres(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="name">Apellidos</Label>
                <Input
                  placeholder="Ingrese sus apellidos"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="name">Teléfono</Label>
                <Input
                  placeholder="Ingrese su teléfono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="name">Dirección</Label>
                <Input
                  placeholder="Ingrese su dirección"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGuardarCambios} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Contraseña</CardTitle>
              <CardDescription>
                Haz cambios a tu contraseña aquí.
                <br />
                <br />
                <span className="text-red-500 font-semibold">
                  NOTA: Al cambiar la contraseña, se cerrará tu sesión actual.
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Contraseña actual</Label>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">Nueva contraseña</Label>
                <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">Repetir la Nueva contraseña</Label>
                <Input value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCambiarPass} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cambiando contraseña...
                  </>
                ) : (
                  "Cambiar Contraseña"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

DataUser.propTypes = {
  user: PropTypes.object,
};
