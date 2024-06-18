import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainContext from "../context/MainContext";
import { PersonStanding, Monitor } from "lucide-react";
import ConfettiExplosion from "react-confetti-explosion";

const RegisterAttendance = () => {
  const navigate = useNavigate();
  const { alumnoSeleccionado, setAlumnoSeleccionado } = useContext(MainContext);

  const [presencialSelected, setPresencialSelected] = useState(false);
  const [virtualSelected, setVirtualSelected] = useState(false);
  const [confirmClicked, setConfirmClicked] = useState(false);

  useEffect(() => {
    if (alumnoSeleccionado === null) {
      navigate("/");
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
      setAlumnoSeleccionado({ ...alumnoSeleccionado, tipo: "Presencial" });
    } else if (virtualSelected) {
      setAlumnoSeleccionado({ ...alumnoSeleccionado, tipo: "Virtual" });
    }
    setConfirmClicked(true);
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
      }, 3000);
    }
  }, [confirmClicked, navigate, setAlumnoSeleccionado]);

  return (
    <div className="flex justify-center items-center pt-24">
      {!confirmClicked ? (
        <div className="w-full p-4 flex flex-col justify-center items-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-pretty text-center py-9">
            Seleccione su tipo de asistencia
          </h2>
          <div className="flex flex-row gap-4 w-full px-8 sm:w-[900px]">
            {/* Botón Presencial */}
            <button
              className={`flex flex-col w-full items-center justify-center p-4 rounded-md border border-gray-300 ${
                presencialSelected ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
              }`}
              onClick={handlePresencialClick}
            >
              <PersonStanding size="48" />
              <span>Presencial</span>
            </button>

            {/* Botón Virtual */}
            <button
              className={`flex flex-col w-full items-center justify-center p-4 rounded-md border border-gray-300 ${
                virtualSelected ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-600"
              }`}
              onClick={handleVirtualClick}
            >
              <Monitor size="48" />
              <span>Virtual</span>
            </button>
          </div>

          {/* Botón de Confirmar */}
          {(presencialSelected || virtualSelected) && (
            <div className="w-full flex flex-row justify-center gap-4 mt-8">
              <button
                className="mt-4 p-2 px-4 text-black dark:text-white border-2 rounded-md"
                onClick={handleBackClick}
              >
                Regresar
              </button>
              <button className="mt-4 p-2 px-4 bg-blue-500 text-white rounded-md" onClick={handleConfirmClick}>
                Confirmar
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center h-screen -mt-52">
          <p className="text-3xl font-bold text-center text-gray-800 dark:text-white">
            ¡Asistencia registrada correctamente!
          </p>
          <ConfettiExplosion />
        </div>
      )}
    </div>
  );
};

export default RegisterAttendance;
