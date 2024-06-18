import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainContext from "../context/MainContext";
import { PersonStanding, Monitor } from "lucide-react";
import ConfettiExplosion from "react-confetti-explosion";
import { Input } from "@/components/ui/input";

const RegisterAttendance = () => {
  const navigate = useNavigate();
  const { alumnoSeleccionado, setAlumnoSeleccionado } = useContext(MainContext);

  const [presencialSelected, setPresencialSelected] = useState(false);
  const [virtualSelected, setVirtualSelected] = useState(false);
  const [confirmClicked, setConfirmClicked] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [pregunta, setPregunta] = useState(false);

  useEffect(() => {
    if (alumnoSeleccionado === null) {
      navigate("/");
    } else {
      try {
        // Verificar en localStorage el historial de asistencias
        const attendanceHistoryStr = localStorage.getItem("attendanceHistory");
        if (!attendanceHistoryStr) {
          throw new Error("attendanceHistory no existe en localStorage");
        }

        const attendanceHistory = JSON.parse(attendanceHistoryStr);
        const today = new Date().toISOString().slice(0, 10); // Fecha actual en formato "YYYY-MM-DD"
        if (!attendanceHistory[today] || !attendanceHistory[today].asistencias) {
          throw new Error("attendanceHistory no tiene la estructura esperada para hoy");
        }

        const alreadyRegistered = attendanceHistory[today].asistencias.some(
          (asistencia) => asistencia.id === alumnoSeleccionado.id
        );
        setAlreadyRegistered(alreadyRegistered);
      } catch (error) {
        console.error("Error al leer o parsear attendanceHistory:", error);
        // Manejar el error o establecer un comportamiento predeterminado
      }
    }
  }, [alumnoSeleccionado, navigate]);

  const handlePresencialClick = () => {
    if (!presencialSelected) {
      setPresencialSelected(true);
      setVirtualSelected(false);
    }
    setConfirmClicked(false);
  };

  const handleVirtualClick = () => {
    if (!virtualSelected) {
      setVirtualSelected(true);
      setPresencialSelected(false);
    }
    setConfirmClicked(false);
  };

  const handleConfirmClick = () => {
    if (presencialSelected) {
      setAlumnoSeleccionado({ ...alumnoSeleccionado, tipo: "Presencial", pregunta });
    } else if (virtualSelected) {
      setAlumnoSeleccionado({ ...alumnoSeleccionado, tipo: "Virtual", pregunta });
    }
    setConfirmClicked(true);

    if (!alreadyRegistered) {
      const newAttendance = {
        id: alumnoSeleccionado.id,
        nombres: alumnoSeleccionado.nombres,
        apellidos: alumnoSeleccionado.apellidos,
        fecha: new Date().toISOString().slice(0, 10), // Fecha actual en formato "YYYY-MM-DD"
      };
      const attendanceHistoryStr = localStorage.getItem("attendanceHistory") || "{}";
      const attendanceHistory = JSON.parse(attendanceHistoryStr);
      const today = new Date().toISOString().slice(0, 10);
      if (!attendanceHistory[today]) {
        attendanceHistory[today] = { asistencias: [] };
      }
      attendanceHistory[today].asistencias.push(newAttendance);
      localStorage.setItem("attendanceHistory", JSON.stringify(attendanceHistory));
    }
  };

  const handleBackClick = () => {
    setAlumnoSeleccionado(null);
    navigate("/");
  };

  useEffect(() => {
    if (confirmClicked) {
      setTimeout(() => {
        setConfirmClicked(false);
        setPresencialSelected(false);
        setVirtualSelected(false);
        setAlumnoSeleccionado(null);
        navigate("/");
      }, 4500);
    }
  }, [confirmClicked, navigate, setAlumnoSeleccionado]);

  return (
    <div className="flex justify-center items-center sm:pt-8 pt-24">
      {!alreadyRegistered && !confirmClicked ? (
        <div className="w-full p-4 flex flex-col justify-center items-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-pretty text-center py-9">
            Seleccione su tipo de asistencia
          </h2>
          <div className="flex flex-row gap-4 w-full px-8 sm:w-[900px]">
            {/* Botón Presencial */}
            <button
              className={`flex flex-col w-full items-center justify-center p-4 rounded-md border border-gray-300 ${
                presencialSelected ? "bg-green-500 text-white " : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
              onClick={handlePresencialClick}
            >
              <PersonStanding size="48" />
              <span>Presencial</span>
            </button>

            {/* Botón Virtual */}
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

          {/* Botón de Confirmar */}
          {(presencialSelected || virtualSelected) && (
            <div className="w-full sm:w-[800px] flex flex-col justify-center gap-4 mt-8">
              <div className="w-full border-2 border-neutral-500/30 rounded-lg ">
                <h3 className="text-bold text-lg mb-3 p-3 text-center">
                  <span className="font-extrabold text-red-500">OPCIONAL: </span>
                  <br />
                  ¿Tienes alguna pregunta sobre el tema de hoy?
                </h3>
                <Input
                  className="w-11/12 m-auto mb-4"
                  resizable
                  placeholder="Ingresa tu pregunta aquí..."
                  onChange={(e) => setPregunta(e.target.value)}
                />
              </div>
              <div className="flex flex-row w-full gap-4 justify-center">
                <button
                  className="mt-4 p-2 px-4 text-black dark:text-white border-2 rounded-md"
                  onClick={handleBackClick}
                >
                  Regresar
                </button>
                <button className="mt-4 p-2 px-4 bg-blue-500 text-white rounded-md" onClick={handleConfirmClick}>
                  Confirmar asistencia
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center h-screen -mt-52">
          {alreadyRegistered && (
            <p className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
              ¡Ya se ha registrado la asistencia de {alumnoSeleccionado.nombres} {alumnoSeleccionado.apellidos}!
            </p>
          )}
          {confirmClicked && (
            <>
              <p className="text-3xl font-bold text-center text-gray-800 dark:text-white">
                ¡Asistencia registrada correctamente!
              </p>
              <ConfettiExplosion />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RegisterAttendance;
