import { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import MainContext from "@/context/MainContext";
import { URL_BASE } from "@/config/config";
import LoaderAE from "../LoaderAE";

const translations = {
  es: {
    languageSelect: "¿En qué idioma quiere hacer su pregunta?",
    languageSelectSubtitle: "In which language do you want to ask your question?",
    spanish: "Español",
    english: "English",
    questionsTitle: "Preguntas del tema del:",
    anonymous: "Las preguntas serán anónimas",
    oneQuestionPerDay: "** Solo puedes mandar una pregunta por día **",
    placeholder: "Escribe tu pregunta aquí...",
    placeholderDisabled: "Ya has mandado una pregunta hoy, tendrás disponible otra pegunta el día de mañana.",
    sending: "Enviando...",
    sendQuestion: "Mandar pregunta",
    tryTomorrow: "Ya has mandado una hoy, intenta mañana",
    sendingQuestion: "Enviando pregunta...",
    error: "Hubo un error. Intenta de nuevo.",
    successTitle: "Pregunta enviada",
    successDescription: "Tu pregunta ha sido enviada con éxito.",
    errorTitle: "Error",
    errorDescription: "Falló al registrar la pregunta.",
    limitTitle: "Límite de preguntas alcanzado",
    limitDescription: "Solo puedes hacer una pregunta por día.",
    shortQuestionTitle: "Error",
    shortQuestionDescription: "Su pregunta es demasiado corta para ser enviada.",
    weekDays: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
  },
  en: {
    languageSelect: "In which language do you want to ask your question?",
    languageSelectSubtitle: "¿En qué idioma quiere hacer su pregunta?",
    spanish: "Spanish",
    english: "English",
    questionsTitle: "Questions for:",
    anonymous: "Questions will be anonymous",
    oneQuestionPerDay: "** You can only send one question per day **",
    placeholder: "Write your question here...",
    placeholderDisabled: "You've already sent a question today, you can ask another one tomorrow.",
    sending: "Sending...",
    sendQuestion: "Send question",
    tryTomorrow: "You've already sent one today, try tomorrow",
    sendingQuestion: "Sending question...",
    error: "There was an error. Please try again.",
    successTitle: "Question sent",
    successDescription: "Your question has been sent successfully.",
    errorTitle: "Error",
    errorDescription: "Failed to register the question.",
    limitTitle: "Question limit reached",
    limitDescription: "You can only ask one question per day.",
    shortQuestionTitle: "Error",
    shortQuestionDescription: "Your question is too short to be sent.",
    weekDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },
};

export default function QuestionUser() {
  const [pregunta, setPregunta] = useState("");
  const [idioma, setIdioma] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(true);
  const { toast } = useToast();
  const { user } = useContext(MainContext);
  const [puedePreguntar, setPuedePreguntar] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isCounterAnimated, setIsCounterAnimated] = useState(false);

  const MAX_LENGTH = 250;
  const t = translations[idioma || "es"]; // Default to Spanish if no language selected

  useEffect(() => {
    if (user) {
      setPuedePreguntar(true);
      return;
    }

    const ultimaPregunta = localStorage.getItem("ultimaPregunta");
    if (ultimaPregunta) {
      const ultimaFecha = new Date(ultimaPregunta);
      const hoy = new Date();
      const esMismoDia =
        ultimaFecha.getDate() === hoy.getDate() && ultimaFecha.getMonth() === hoy.getMonth() && ultimaFecha.getFullYear() === hoy.getFullYear();

      setPuedePreguntar(!esMismoDia);
    } else {
      setPuedePreguntar(true);
    }
  }, [user]);

  useEffect(() => {
    if (pregunta.length === MAX_LENGTH) {
      setIsCounterAnimated(true);
      setTimeout(() => setIsCounterAnimated(false), 1000);
    }
  }, [pregunta]);

  const obtenerFechaFormateada = () => {
    const hoy = new Date();
    const nombreDia = t.weekDays[hoy.getDay()];
    const dia = hoy.getDate().toString().padStart(2, "0");
    const mes = (hoy.getMonth() + 1).toString().padStart(2, "0");
    const anio = hoy.getFullYear();
    return `${nombreDia} ${dia}/${mes}/${anio}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pregunta.trim() && pregunta.length >= 10) {
      if (puedePreguntar) {
        setIsLoading(true);
        setHasError(false);
        try {
          const campo = idioma === "es" ? "pregunta" : "preguntaeng";

          const response = await fetch(`${URL_BASE}/api/user/preguntas/nueva`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              [campo]: pregunta,
            }),
          });

          if (!response.ok) {
            throw new Error(t.errorDescription);
          }

          toast({
            variant: "success",
            title: t.successTitle,
            description: t.successDescription,
            duration: 2500,
          });

          setPregunta("");
          if (!user) {
            const hoy = new Date();
            localStorage.setItem("ultimaPregunta", hoy.toISOString());
            setPuedePreguntar(false);
          }
        } catch (error) {
          toast({
            title: t.errorTitle,
            description: t.errorDescription,
            variant: "destructive",
            duration: 2500,
          });
          setHasError(true);
        } finally {
          setIsLoading(false);
        }
      } else {
        toast({
          title: t.limitTitle,
          description: t.limitDescription,
          variant: "destructive",
          duration: 2500,
        });
      }
    } else {
      toast({
        title: t.shortQuestionTitle,
        description: t.shortQuestionDescription,
        variant: "destructive",
        duration: 2500,
      });
    }
  };

  const handleSeleccionIdioma = (idiomaSeleccionado) => {
    setIdioma(idiomaSeleccionado);
    setMostrarModal(false);
  };

  return (
    <>
      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg text-center space-y-4">
            <h2 className="text-xl font-semibold">{t.languageSelect}</h2>
            <p className="text-gray-600">{t.languageSelectSubtitle}</p>
            <div className="flex justify-around space-x-4">
              <button className="flex flex-col items-center" onClick={() => handleSeleccionIdioma("es")}>
                <img src="/es.png" alt="España" className="w-12 h-12" />
                <span>{t.spanish}</span>
              </button>
              <button className="flex flex-col items-center" onClick={() => handleSeleccionIdioma("en")}>
                <img src="/us.png" alt="USA" className="w-12 h-12" />
                <span>{t.english}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {!mostrarModal && (
        <div className="w-full h-screen -mt-24 flex flex-col items-center justify-center">
          <div className="max-w-2xl mx-auto py-4 px-8">
            <img src="/questions.webp" alt="logo Ebenezer" className="size-56 object-contain mx-auto -mb-14" />
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground text-center">
                {t.questionsTitle} {obtenerFechaFormateada()}
              </h1>
              <p className="text-muted-foreground text-center italic opacity-50">{t.anonymous}</p>
              <p className="text-center dark:text-purple-400 text-purple-700">{t.oneQuestionPerDay}</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder={puedePreguntar ? t.placeholder : t.placeholderDisabled}
                    value={pregunta}
                    onChange={(e) => setPregunta(e.target.value)}
                    className="min-h-[200px] bg-background text-foreground border-input pr-16"
                    disabled={!puedePreguntar || isLoading}
                    style={{ resize: "none" }}
                    maxLength={MAX_LENGTH}
                  />
                  <div
                    className={`absolute bottom-2 right-2 text-sm ${
                      pregunta.length === MAX_LENGTH ? "text-red-500" : "text-gray-500"
                    } transition-all duration-300 ${isCounterAnimated ? "scale-120" : "scale-100"}`}
                  >
                    {pregunta.length}/{MAX_LENGTH}
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={!puedePreguntar || isLoading}>
                  {isLoading ? t.sending : puedePreguntar ? t.sendQuestion : t.tryTomorrow}
                </Button>
                {isLoading && (
                  <p className="text-center mt-2">
                    <LoaderAE texto={t.sendingQuestion} />
                  </p>
                )}
                {hasError && !isLoading && <p className="text-center mt-2 text-red-500">{t.error}</p>}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
