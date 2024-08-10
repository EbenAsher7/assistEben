import { useState, useContext, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
import MainContext from "../../context/MainContext";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";

const InputDebounce = () => {
  const [nombre, setNombre] = useState("");
  const [valueDebounce] = useDebounce(nombre, 700);
  const { toast } = useToast();
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastSearched, setLastSearched] = useState(""); // Nuevo estado para controlar la última búsqueda
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { setAlumnoSeleccionado } = useContext(MainContext);

  useEffect(() => {
    const fetchNombre = async () => {
      if (valueDebounce === lastSearched) return; // Evita búsquedas duplicadas
      setLoading(true);
      try {
        const response = await fetch(`${URL_BASE}/api/user/searchStudent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            search: valueDebounce,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setResults(data);
          setShowRegister(data.length === 0);
          if (data.length === 0) {
            setShowConfirm(false);
          }
        } else {
          toast({
            title: "Error",
            description: "No se ha podido obtener la lista de estudiantes, comprueba tu conexión a internet.",
            duration: 2500,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          duration: 2500,
        });
      } finally {
        setLoading(false);
        setLastSearched(valueDebounce); // Actualiza la última búsqueda realizada
      }
    };

    if (valueDebounce.length >= 3) {
      fetchNombre();
    } else {
      setResults([]);
      setShowConfirm(false);
      setShowRegister(false);
      setSelectedResult(null);
      setLastSearched(""); // Reinicia la última búsqueda
    }
  }, [valueDebounce, toast]);

  useEffect(() => {
    if (results.length === 0 && valueDebounce.length === 0) {
      setShowConfirm(false);
      setSelectedResult(null);
    }
  }, [results, valueDebounce]);

  const handleSelect = (result) => {
    setSelectedResult(result);
    setShowConfirm(true);
    setResults([]);
    setShowRegister(false);
    setNombre(`${result.nombres} ${result.apellidos}`); // Actualiza el input con el nombre seleccionado
    setLastSearched(`${result.nombres} ${result.apellidos}`); // Actualiza la última búsqueda para evitar una nueva búsqueda
  };

  const handleConfirm = (isConfirmed) => {
    if (isConfirmed) {
      setAlumnoSeleccionado(selectedResult);
      navigate("/registerAttendance");
    } else {
      setAlumnoSeleccionado(null);
      setNombre(""); // Limpia el input si no se confirma
      setLastSearched(""); // Reinicia la última búsqueda
      inputRef.current.focus();
    }
    setShowConfirm(false);
    setSelectedResult(null);
    setResults([]);
  };

  const handleRegister = () => {
    setShowRegister(false);
    toast({
      title: "Empieza el registro",
      duration: 2500,
    });
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setNombre(newValue);
    if (newValue !== lastSearched) {
      setShowConfirm(false);
      setSelectedResult(null);
    }
  };

  return (
    <div className="relative w-full px-8 sm:px-4">
      <input
        value={nombre}
        onChange={handleInputChange}
        ref={inputRef}
        placeholder="Ingrese su nombre"
        className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 dark:bg-neutral-700 dark:text-white dark:placeholder:text-white/60 placeholder:text-black/60 dark:border-neutral-500"
      />
      {loading && valueDebounce.length >= 3 && (
        <div className="absolute top-full left-0 right-0 flex items-center justify-center bg-white dark:bg-neutral-700 py-2 px-4 border border-gray-300 rounded-b-md z-10 mx-8 sm:mx-0">
          <p>Buscando nombre...</p>
        </div>
      )}
      {results.length > 0 && (
        <ul className="absolute top-12 left-0 right-0 max-h-72 overflow-y-auto border border-gray-300 bg-white dark:bg-neutral-700 dark:border-gray-600 z-10 list-none m-0 mx-8 sm:mx-0">
          {results.map((result) => (
            <li
              key={result.id}
              onClick={() => handleSelect(result)}
              className="p-2 cursor-pointer border-b border-gray-300 hover:bg-gray-100 text-black dark:text-white dark:hover:bg-neutral-600"
            >
              <div className="flex flex-row gap-4 text-black dark:text-white">
                <span>
                  {result.nombres} {result.apellidos}
                </span>
                <span className="font-bold">-</span>
                <span className="text-black/20 dark:text-white/20">
                  <span className="hidden sm:inline-flex">Tutor(a):&nbsp;&nbsp;&nbsp;</span>
                  <span className="inline-flex sm:hidden">T:&nbsp;&nbsp;&nbsp;</span>
                  {result.tutor_nombres} {result.tutor_apellidos}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      {showConfirm && selectedResult && valueDebounce?.length >= 3 && (
        <div className="w-full p-4 flex flex-col items-center justify-center max-h-72 mt-6 -mb-40 dark:bg-white/10 bg-white dark:border-white border-2 shadow-md dark:shadow-white/50 shadow-black/20 rounded-xl">
          <p className="text-xl font-semibold text-center">¿Eres, {selectedResult.nombres + " " + selectedResult.apellidos}?</p>
          <p className="text-black/40 dark:text-white/30 mb-3 mt-1">Tutor: {selectedResult.tutor_nombres + " " + selectedResult.tutor_apellidos}</p>
          <div className="flex flex-row w-1/2 gap-4 items-center justify-center mt-4">
            <button
              className="bg-green-500 hover:bg-green-700 font-bold uppercase px-6 py-4 rounded-md text-white w-20"
              onClick={() => handleConfirm(true)}
            >
              Sí
            </button>
            <button className="bg-red-600 hover:bg-red-800 font-bold uppercase px-6 py-4 rounded-md text-white w-20" onClick={() => handleConfirm(false)}>
              No
            </button>
          </div>
        </div>
      )}
      {showRegister && (
        <div className="w-full flex flex-col gap-2 justify-center items-center max-h-72 mt-16 -mb-40">
          <p className="font-bold text-lg">¿No apareces en la lista?</p>
          <button className="bg-green-500 text-white px-4 py-4 rounded-md w-1/2" onClick={handleRegister}>
            ¡Regístrate aquí!
          </button>
        </div>
      )}
    </div>
  );
};

export default InputDebounce;
