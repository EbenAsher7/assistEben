import { useState, useContext, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainContext from "../context/MainContext";
import PropTypes from "prop-types";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { memo } from "react";

export const DataUser = memo(({ user }) => {
  const [formData, setFormData] = useState({
    nombres: user?.nombres || "",
    apellidos: user?.apellidos || "",
    telefono: user?.telefono || "",
    direccion: user?.direccion || "",
    password: "",
    newPassword: "",
    repeatPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const { setIsLogin, setUser } = useContext(MainContext);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleGuardarCambios = useCallback(async () => {
    if (!formData.nombres || !formData.apellidos || !formData.telefono) {
      toast({
        variant: "destructive",
        title: "Campos incompletos",
        description: "Por favor complete todos los campos.",
        duration: 2500,
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${URL_BASE}/post/changeTutorData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token,
        },
        body: JSON.stringify({
          id: user.id,
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          telefono: formData.telefono,
          direccion: formData.direccion,
          tipo: user.tipo,
          observaciones: user.observaciones,
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
          setUser(null);
        }, 2500);
      } else {
        throw new Error("Ocurrió un error al guardar los cambios.");
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
  }, [formData, user, toast, setIsLogin, setUser]);

  const handleCambiarPass = useCallback(async () => {
    if (!formData.password || !formData.newPassword || !formData.repeatPassword) {
      toast({
        variant: "destructive",
        title: "Campos incompletos",
        description: "Todos los campos son necesarios",
        duration: 2500,
      });
      return;
    }
    if (formData.newPassword !== formData.repeatPassword) {
      toast({
        variant: "destructive",
        title: "Contraseñas no coinciden",
        description: "Las contraseñas no coinciden, por favor verifique",
        duration: 2500,
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${URL_BASE}/post/changePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token,
        },
        body: JSON.stringify({
          username: user.username,
          oldPassword: formData.password,
          newPassword: formData.newPassword,
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
          setUser(null);
        }, 2500);
      } else {
        throw new Error("Ocurrió un error al cambiar la contraseña.");
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
  }, [formData, user, toast, setIsLogin, setUser]);

  const renderButton = useMemo(
    () => (
      <Button onClick={handleGuardarCambios} disabled={isSaving}>
        {isSaving ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Guardando...
          </>
        ) : (
          "Guardar Cambios"
        )}
      </Button>
    ),
    [handleGuardarCambios, isSaving]
  );

  const renderPasswordButton = useMemo(
    () => (
      <Button onClick={handleCambiarPass} disabled={isSaving}>
        {isSaving ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Cambiando contraseña...
          </>
        ) : (
          "Cambiar Contraseña"
        )}
      </Button>
    ),
    [handleCambiarPass, isSaving]
  );

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
                <br />
                <span className="text-red-500 font-semibold">NOTA: Al cambiar los datos, se cerrará tu sesión actual.</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {["nombres", "apellidos", "telefono", "direccion"].map((field) => (
                <div key={field} className="space-y-1">
                  <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                  <Input name={field} placeholder={`Ingrese su ${field}`} value={formData[field]} onChange={handleInputChange} />
                </div>
              ))}
            </CardContent>
            <CardFooter className="w-full justify-center">{renderButton}</CardFooter>
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
                <span className="text-red-500 font-semibold">NOTA: Al cambiar la contraseña, se cerrará tu sesión actual.</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {["password", "newPassword", "repeatPassword"].map((field) => (
                <div key={field} className="space-y-1">
                  <Label htmlFor={field}>
                    {field === "password" ? "Contraseña actual" : field === "newPassword" ? "Nueva contraseña" : "Repetir la Nueva contraseña"}
                  </Label>
                  <Input name={field} value={formData[field]} onChange={handleInputChange} />
                </div>
              ))}
            </CardContent>
            <CardFooter className="w-full justify-center">{renderPasswordButton}</CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
});

DataUser.displayName = "DataUser";

DataUser.propTypes = {
  user: PropTypes.object,
};
