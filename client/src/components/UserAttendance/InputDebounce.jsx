import { useEffect, useState, useRef } from "react";
import { useDebounce } from "use-debounce";
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
  const [loading, setLoading] = useState(false); // Nuevo estado para el loader

  const inputRef = useRef(null);

  useEffect(() => {
    const fetchNombre = async () => {
      setLoading(true); // Mostrar el loader cuando comienza la búsqueda
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
      }
    };

    if (valueDebounce.length > 0) {
      fetchNombre();
    } else {
      setSelectedResult(null);
      setResults([]);
      setShowConfirm(false);
      setShowRegister(false);
    }
  }, [valueDebounce, toast]);

  const handleSelect = (result) => {
    setSelectedResult(result);
    setShowConfirm(true);
    setResults([]);
    setShowRegister(false);
  };

  const handleConfirm = (isConfirmed) => {
    if (!isConfirmed) {
      inputRef.current.focus();
    }
    setNombre("");
    setShowConfirm(false);
    setSelectedResult(null);
  };

  const handleRegister = () => {
    setShowRegister(false);
    toast({
      title: "Empieza el registro",
      duration: 2500,
    });
  };

  return (
    <div className="relative w-full mt-8">
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        ref={inputRef}
        placeholder="Ingrese su nombre"
        className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 dark:bg-neutral-700 dark:text-white dark:placeholder:text-white/60 placeholder:text-black/60 dark:border-neutral-500"
      />
      {loading && valueDebounce.length > 0 && (
        <div className="absolute top-full left-0 right-0 flex items-center justify-center bg-white dark:bg-neutral-700 py-2 px-4 border border-gray-300 rounded-b-md z-10">
          <p>Buscando nombre...</p>
        </div>
      )}
      {results.length > 0 && (
        <ul className="absolute top-12 left-0 right-0 max-h-72 overflow-y-auto border border-gray-300 bg-white dark:bg-neutral-700 dark:border-gray-600 z-10 list-none m-0 p-0">
          {results.map((result) => (
            <li
              key={result.id}
              onClick={() => handleSelect(result)}
              className="p-2 cursor-pointer border-b border-gray-300 hover:bg-gray-100 text-black dark:text-white"
            >
              {result.nombres} {result.apellidos}
            </li>
          ))}
        </ul>
      )}
      {showConfirm && selectedResult && valueDebounce?.length > 0 && (
        <div className="w-full p-4 mt-12 flex flex-col items-center justify-center">
          <p className="text-xl font-semibold text-center">
            ¿Eres, {selectedResult.nombres + " " + selectedResult.apellidos}?
          </p>
          <div className="flex flex-row w-1/2 gap-4 items-center justify-center mt-4">
            <button
              className="bg-green-500 px-6 py-4 rounded-md font-lg text-white"
              onClick={() => handleConfirm(true)}
            >
              Sí
            </button>
            <button className="bg-red-500 px-6 py-4 rounded-md font-lg text-white" onClick={() => handleConfirm(false)}>
              No
            </button>
          </div>
        </div>
      )}
      {showRegister && (
        <div className="mt-12 w-full flex flex-col gap-2 justify-center items-center p-6">
          <p className="font-bold text-lg">¿No apareces en la lista?</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md w-1/2" onClick={handleRegister}>
            ¡Regístrate aquí!
          </button>
        </div>
      )}
    </div>
  );
};

export default InputDebounce;
