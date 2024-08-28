import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainContext from "../context/MainContext";
import { PersonStanding, Monitor } from "lucide-react";
import ConfettiExplosion from "react-confetti-explosion";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { URL_BASE } from "@/config/config";

const RegisterAttendance = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { alumnoSeleccionado, setAlumnoSeleccionado, checkAttendanceStatus, setAttendanceHistory } = useContext(MainContext);

  const [presencialSelected, setPresencialSelected] = useState(false);
  const [virtualSelected, setVirtualSelected] = useState(false);
  const [confirmClicked, setConfirmClicked] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [pregunta, setPregunta] = useState("");
  const [isTutor, setIsTutor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (alumnoSeleccionado === null) {
      navigate("/");
    } else {
      checkRegistrationStatus();
    }
  }, [alumnoSeleccionado, navigate]);

  const checkRegistrationStatus = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    setIsTutor(user && ["Tutor", "Administrador"].includes(user.tipo));

    const canRegister = checkAttendanceStatus(alumnoSeleccionado.id);
    setAlreadyRegistered(!canRegister);
  };

  const handlePresencialClick = () => {
    setPresencialSelected(true);
    setVirtualSelected(false);
  };

  const handleVirtualClick = () => {
    setVirtualSelected(true);
    setPresencialSelected(false);
  };

  // Función para verificar si una fecha está dentro del último mes
  const isWithinLastMonth = (date) => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return new Date(date) >= oneMonthAgo;
  };

  const handleConfirmClick = async () => {
    if (alreadyRegistered) return;

    setIsLoading(true);
    const tipo = presencialSelected ? "Presencial" : "Virtual";

    try {
      const now = new Date();
      const fechaActual = now.toISOString().split("T")[0];
      const response = await fetch(`${URL_BASE}/api/user/registerAttendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alumno_id: alumnoSeleccionado.id,
          fecha: fechaActual,
          pregunta: pregunta,
          tipo: tipo,
        }),
      });

      if (response.ok) {
        setConfirmClicked(true);
        const attendanceData = {
          id: alumnoSeleccionado.id,
          nombres: alumnoSeleccionado.nombres,
          apellidos: alumnoSeleccionado.apellidos,
          fecha: fechaActual,
        };
        updateAttendanceHistory(fechaActual, attendanceData);

        setTimeout(() => {
          setConfirmClicked(false);
          setPresencialSelected(false);
          setVirtualSelected(false);
          setAlumnoSeleccionado(null);
          navigate("/");
        }, 4500);
      } else {
        throw new Error("Error al registrar asistencia");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al registrar asistencia. Por favor, intenta nuevamente. Si el problema persiste, intente nuevamente más tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateAttendanceHistory = (fechaActual, attendanceData) => {
    setAttendanceHistory(() => {
      const storedHistory = JSON.parse(localStorage.getItem("attendanceHistory")) || {};
      if (!isWithinLastMonth(fechaActual)) {
        localStorage.removeItem("attendanceHistory");
        localStorage.removeItem("lastAttendance");
        return { [fechaActual]: { asistencias: [attendanceData] } };
      }
      const newHistory = { ...storedHistory };
      if (!newHistory[fechaActual]) {
        newHistory[fechaActual] = { asistencias: [] };
      }
      newHistory[fechaActual].asistencias.push(attendanceData);
      localStorage.setItem("attendanceHistory", JSON.stringify(newHistory));
      localStorage.setItem("lastAttendance", JSON.stringify(attendanceData));
      return newHistory;
    });
  };

  const handleBackClick = () => {
    setAlumnoSeleccionado(null);
    navigate("/");
  };

  if (alreadyRegistered) {
    if (isTutor) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p className="text-3xl font-bold text-center text-gray-800 dark:text-white">
            Ya se ha registrado la asistencia de {alumnoSeleccionado.nombres} {alumnoSeleccionado.apellidos} para el día de hoy.
          </p>
        </div>
      );
    } else {
      return (
        <div className="flex justify-center items-center h-screen">
          <p className="text-3xl font-bold text-center text-gray-800 dark:text-white">Ya has registrado una asistencia el día de hoy.</p>
        </div>
      );
    }
  }

  return (
    <div className="flex justify-center items-center sm:pt-8 pt-24">
      {!confirmClicked ? (
        <div className="w-full p-4 flex flex-col justify-center items-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-pretty text-center py-9">Seleccione su tipo de asistencia</h2>
          <div className="flex flex-row gap-4 w-full px-8 sm:w-[900px]">
            <button
              className={`flex flex-col w-full items-center justify-center p-4 rounded-md border border-gray-300 ${
                presencialSelected ? "bg-green-500 text-white " : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
              onClick={handlePresencialClick}
            >
              <PersonStanding size="48" />
              <span>Presencial</span>
            </button>

            <button
              className={`flex flex-col w-full items-center justify-center p-4 rounded-md border border-gray-300 ${
                virtualSelected ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
              onClick={handleVirtualClick}
            >
              <Monitor size="48" />
              <span>Virtual</span>
            </button>
          </div>

          {(presencialSelected || virtualSelected) && (
            <div className="w-full sm:w-[800px] flex flex-col justify-center gap-4 mt-8">
              <div className="w-full border-2 border-neutral-500/30 rounded-lg ">
                <h3 className="text-bold text-lg mb-3 p-3 text-center">
                  <span className="font-extrabold text-red-500">OPCIONAL: </span>
                  <br />
                  ¿Tienes alguna pregunta sobre el tema de hoy?
                </h3>
                <Input className="w-11/12 m-auto mb-4" resizable placeholder="Ingresa tu pregunta aquí..." onChange={(e) => setPregunta(e.target.value)} />
              </div>
              <div className="flex flex-row w-full gap-4 justify-center">
                <button className="mt-4 p-2 px-4 text-black dark:text-white border-2 rounded-md" onClick={handleBackClick}>
                  Regresar
                </button>
                <button className="mt-4 p-2 px-4 bg-blue-500 text-white rounded-md disabled:opacity-50" onClick={handleConfirmClick} disabled={isLoading}>
                  {isLoading ? "Registrando..." : "Confirmar asistencia"}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center h-screen -mt-52">
          <p className="text-3xl font-bold text-center text-gray-800 dark:text-white">¡Asistencia registrada correctamente!</p>
          <ConfettiExplosion />
        </div>
      )}
    </div>
  );
};

export default RegisterAttendance;
