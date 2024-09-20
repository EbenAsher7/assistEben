import { useState, useEffect, useContext, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Dices, ChevronUp, SquareCheckBig, Calendar, MessageSquareMore, MessageSquareReply, MailQuestion } from "lucide-react";
import MainContext from "@/context/MainContext";
import { URL_BASE } from "@/config/config";
import { DialogTitle } from "@radix-ui/react-dialog";
import LoaderAE from "../LoaderAE";
import { useToast } from "../ui/use-toast";
import { DatePicker } from "@gsebdev/react-simple-datepicker";

export default function QuestionsAdmin() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedDate2, setSelectedDate2] = useState(undefined);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDateDrawerOpen, setIsDateDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [loadingRespondida, setLoadingRespondida] = useState(false);

  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const selectedQuestionRef = useRef(null);

  const { toast } = useToast();

  const { user } = useContext(MainContext);

  const obtenerFechaFormateada2 = (fecha) => {
    if (fecha?.includes("/")) {
      const date = fecha.split("/").reverse().join("-");
      const dateFormatted = `${date.split("-")[1]}/${date.split("-")[2]}/${date.split("-")[0]}`;
      return dateFormatted;
    }
  };

  const cargarPreguntas = async (fecha = new Date(), fecha2 = new Date()) => {
    setIsLoading(true);
    try {
      if (fecha instanceof Date) fecha = fecha.toISOString().split("T")[0];
      if (fecha2 instanceof Date) fecha2 = fecha2.toISOString().split("T")[0];

      // replace / with - for the date format
      const date = fecha.split("/").reverse().join("-"); // yyyy-dd-mm
      const dateFormatted = `${date.split("-")[0]}-${date.split("-")[2]}-${date.split("-")[1]}`;

      const date2 = fecha2.split("/").reverse().join("-"); // yyyy-dd-mm
      const date2Formatted = `${date2.split("-")[0]}-${date2.split("-")[2]}-${date2.split("-")[1]}`;

      const response = await fetch(`${URL_BASE}/admin/preguntasAnonimas/${dateFormatted}/${date2Formatted}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token,
        },
      });

      const data = await response.json();
      if (data.length === 0) {
        setQuestions([]);
        setCurrentQuestion(null);
      } else {
        setQuestions(data);
        // Seleccionar una pregunta aleatoria no respondida al cargar
        const unansweredQuestions = data.filter((q) => !q.respondida);
        if (unansweredQuestions.length > 0) {
          const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
          setCurrentQuestion(unansweredQuestions[randomIndex]);
        } else {
          setCurrentQuestion(null);
        }
      }
      // Actualizar las preguntas respondidas basándose en el campo 'respondida'
      setAnsweredQuestions(data.filter((q) => q.respondida).map((q) => q.id));
    } catch (error) {
      console.error("Error al cargar las preguntas:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cargar las preguntas, intente nuevamente",
        duration: 3000,
      });
      setQuestions([]);
      setCurrentQuestion(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user?.tipo === "Administrador") {
      cargarPreguntas();
    }
  }, [user]);

  useEffect(() => {
    if (selectedQuestionRef.current) {
      selectedQuestionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedQuestionId]);

  if (!user || user.tipo !== "Administrador") {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center">No tienes permiso para ver esta página</h1>
      </div>
    );
  }

  const handleQuestionClick = (question) => {
    if (!answeredQuestions.includes(question.id)) {
      setCurrentQuestion(question);
      setSelectedQuestionId(question.id);
      setIsDrawerOpen(false);
    }
  };

  const handleRandomQuestion = () => {
    const unansweredQuestions = questions.filter((q) => !q.respondida);
    if (unansweredQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
      const randomQuestion = unansweredQuestions[randomIndex];
      setCurrentQuestion(randomQuestion);
      setSelectedQuestionId(randomQuestion.id);
    } else {
      setCurrentQuestion(null);
      setSelectedQuestionId(null);
    }
  };

  const handleAnsweredQuestion = async () => {
    if (currentQuestion && !currentQuestion.respondida) {
      setLoadingRespondida(true);
      try {
        const response = await fetch(`${URL_BASE}/admin/preguntasAnonimas/${currentQuestion.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token,
          },
        });

        if (response.ok) {
          // Actualizar el estado local
          setQuestions((prevQuestions) => prevQuestions.map((q) => (q.id === currentQuestion.id ? { ...q, respondida: true } : q)));
          setAnsweredQuestions((prev) => [...prev, currentQuestion.id]);

          // Seleccionar aleatoriamente la siguiente pregunta no respondida
          const unansweredQuestions = questions.filter((q) => !q.respondida && q.id !== currentQuestion.id);
          if (unansweredQuestions.length > 0) {
            const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
            const nextQuestion = unansweredQuestions[randomIndex];
            setCurrentQuestion(nextQuestion);
            setSelectedQuestionId(nextQuestion.id);
          } else {
            setCurrentQuestion(null);
            setSelectedQuestionId(null);
          }
        } else {
          throw new Error("Error al marcar la pregunta como respondida");
        }
      } catch (error) {
        console.error("Error al marcar la pregunta como respondida:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error al marcar la pregunta como respondida",
          duration: 2500,
        });
      } finally {
        setLoadingRespondida(false);
      }
    }
  };

  const handleDatePickerClick = () => {
    setIsDateDrawerOpen(true);
  };

  const handleLoadQuestions = () => {
    if (!selectedDate || !selectedDate2) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Las dos fechas son requeridas",
        duration: 2000,
      });
      return;
    }

    if (selectedDate && selectedDate2) {
      cargarPreguntas(selectedDate, selectedDate2);
      setIsDateDrawerOpen(false);
      setShowDatePicker(true);
    }
  };

  const renderQuestions = () => (
    <ul className="space-y-2">
      {questions.map((question) => (
        <li
          key={question.id}
          className={`odd:bg-[#f0f0f0] text-black/80 dark:odd:bg-[#1a1a1a] dark:odd:text-white text-left justify-start
                      ${question.id === selectedQuestionId ? "bg-orange-500 dark:bg-orange-700" : ""}`}
          ref={question.id === selectedQuestionId ? selectedQuestionRef : null}
        >
          <button
            className={`w-full text-left text-wrap text-black dark:text-white hover:bg-slate-300 dark:hover:bg-slate-400 rounded-md py-3 px-2 ${
              question.respondida ? "line-through" : ""
            } ${question.id === selectedQuestionId ? "text-white" : ""}`}
            onClick={() => handleQuestionClick(question)}
            disabled={question.respondida}
          >
            {question?.pregunta?.length > 40 ? `${question?.pregunta?.slice(0, 40)}...` : question.pregunta}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="container -mt-16 sm:mt-14 mx-auto py-4 px-5 flex flex-col items-center justify-center sm:justify-start">
      {isLoading ? (
        <div className="flex items-center justify-center mt-40">
          <LoaderAE texto="Cargando preguntas..." />
        </div>
      ) : (
        <div className="flex flex-row">
          {/* ################### PARTE PRINCIPAL ################### */}
          <div className="flex flex-col mt-24 sm:mt-0">
            <div className="flex flex-col sm:flex-row sm:gap-8 sm:justify-center sm:items-center">
              <MailQuestion className="sm:m-0 mx-auto -mb-2" size={70} />
              <div className="my-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">Preguntas del día</h1>
                <h1 className="sm:text-xl font-bold text-center sm:text-left">
                  {obtenerFechaFormateada2(selectedDate)} {selectedDate && " al "} {obtenerFechaFormateada2(selectedDate2)}{" "}
                </h1>
              </div>
            </div>
            <hr className="hidden sm:block sm:mb-3 sm:w-10/12 sm:mx-auto" />
            {/* Nuevo: Mostrar total de preguntas y respondidas */}
            <div className="flex flex-col space-y-0 opacity-80 italic -mt-1 mb-2 sm:flex-row sm:justify-center sm:gap-9 sm:items-center">
              <span className="mx-auto sm:m-0 italic gap-2 inline-flex">
                Total de preguntas: <span className="text-lg font-bold">{String(questions?.length).padStart(3, " ")}</span> <MessageSquareMore />
              </span>
              <span className="mx-auto sm:m-0 italic gap-2 inline-flex">
                Total Respondidas:&nbsp; <span className="text-lg font-bold">{String(answeredQuestions?.length).padStart(3, " ")}</span>{" "}
                <MessageSquareReply />
              </span>
            </div>
            {/* ################### PREGUNTAS PRINCIPAL ################### */}
            <div className="flex flex-col sm:flex-row gap-1 w-full mb-5 ">
              <Card className="w-full sm:min-w-[800px] sm:max-w-[800px]">
                <CardHeader>
                  <CardTitle className="text-4xl font-extrabold">La pregunta dice:</CardTitle>
                </CardHeader>
                <CardContent className="w-full min-h-[330px] h-[330px] relative">
                  <div className="flex flex-col justify-center items-center min-h-[230px] h-[230px]">
                    {currentQuestion ? (
                      <p className="text-lg text-left p-2 sm:text-4xl">{currentQuestion.pregunta}</p>
                    ) : (
                      <p className="text-muted-foreground">No hay preguntas para mostrar</p>
                    )}
                  </div>
                  <div className="flex gap-4 items-center justify-center absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <Button
                      className="gap-2 bg-pink-500 text-white dark:bg-pink-800 dark:text-white hover:bg-pink-600 dark:hover:bg-pink-700"
                      onClick={handleRandomQuestion}
                      disabled={answeredQuestions.length === questions.length || questions.length === 0 || questions.length === 1}
                    >
                      <Dices />
                      Aleatorio
                    </Button>
                    <Button
                      className="gap-1 bg-pink-500 text-white dark:bg-pink-800 dark:text-white hover:bg-pink-600 dark:hover:bg-pink-700"
                      onClick={handleAnsweredQuestion}
                      disabled={!currentQuestion || currentQuestion.respondida || loadingRespondida}
                    >
                      <SquareCheckBig />
                      <div className={`${loadingRespondida ? "hidden" : ""}`}>
                        Marcar <span className="hidden sm:inline-flex">como pregunta</span> respondida
                      </div>
                      <div className={`${loadingRespondida ? "" : "hidden"}`}>Respondiendo...</div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* ################### SELECCIONAR LA FECHA ################### */}
            <p className="text-sm italic text-center mb-2 opacity-50 px-2">Para ver otras fechas, presiona el botón</p>
            <div className="mb-48">
              <Button
                onClick={handleDatePickerClick}
                className={`flex items-center gap-2 w-[250px] mx-auto ${
                  showDatePicker
                    ? "bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-800 dark:text-white"
                    : "dark:bg-indigo-800 dark:text-white bg-indigo-500 hover:bg-indigo-600"
                } text-white rounded-full px-6 py-3 transition-colors duration-300`}
              >
                <Calendar className="h-5 w-5" />
                {showDatePicker
                  ? `${selectedDate ? obtenerFechaFormateada2(selectedDate, false) : ""} - ${
                      selectedDate2 ? obtenerFechaFormateada2(selectedDate2, false) : ""
                    }`
                  : "Seleccionar fechas"}
              </Button>
            </div>
          </div>

          {/* ################### PREGUNTAS DESKTOP LADO DERECHO ################### */}
          <div className="hidden sm:block ">
            <Card className="sm:min-w-[250px] sm:max-w-[350px] ">
              <CardHeader>
                <CardTitle>Preguntas disponibles</CardTitle>
              </CardHeader>
              <CardContent className="w-full text-left justify-start overflow-y-scroll min-h-[435px] max-h-[435px] no-scrollbar">
                {questions.length > 0 ? renderQuestions() : <p className="text-muted-foreground">No hay preguntas para mostrar</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ################### SELECCIONAR FECHA ################### */}
      <Drawer open={isDateDrawerOpen} onOpenChange={setIsDateDrawerOpen}>
        <DrawerContent className="w-full sm:w-[300px] sm:h-screen px-4 ">
          <DrawerTitle className="text-xl text-center font-extrabold text-black dark:text-white my-5">Seleccionar Fecha</DrawerTitle>
          <div className="w-10/12 m-auto sm:m-0 flex justify-center items-center flex-col pb-72">
            <label className="text-black dark:text-white font-[18px]">Ingrese primer fecha</label>
            <DatePicker
              id="datepicker-id1"
              name="date1"
              onChange={(e) => {
                setSelectedDate(e.target.value);
              }}
              placeholder="Primer fecha"
              value={selectedDate ?? new Date()}
            />
            <label className="text-black dark:text-white font-[18px]">Ingrese primer fecha</label>
            <DatePicker
              id="datepicker-id2"
              name="date2"
              onChange={(e) => {
                setSelectedDate2(e.target.value);
              }}
              placeholder="Segunda fecha"
              value={selectedDate2 ?? new Date()}
            />
            <div className="flex justify-end mt-6">
              <Button className="w-[300px] sm:w-[200px]" onClick={handleLoadQuestions}>
                Cargar preguntas
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* ################### DRAWER MOBILE DE PREGUNTAS ################### */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="fixed bottom-0 left-1/2 transform -translate-x-1/2 py-8 px-8 rounded-md flex items-center justify-center bg-pink-500 text-white dark:bg-pink-600 dark:text-white sm:hidden"
          >
            <ChevronUp className="h-6 w-6" /> &nbsp; Lista de Preguntas
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh]">
          <DialogTitle className="text-xl text-center font-extrabold text-black dark:text-white">Preguntas disponibles</DialogTitle>
          <div className="py-4 overflow-y-scroll text-left">
            {questions.length > 0 ? (
              <ul className="space-y-2">
                {questions.map((question) => (
                  <li key={question.id} className="odd:bg-[#f0f0f0] text-black/80 dark:text-white dark:odd:bg-[#202020]">
                    <Button
                      variant="ghost"
                      className={`w-full text-wrap text-left py-6 text-[1rem] ${answeredQuestions.includes(question.id) ? "line-through" : ""}`}
                      onClick={() => handleQuestionClick(question)}
                      disabled={answeredQuestions.includes(question.id)}
                    >
                      {question?.pregunta?.length > 40 ? `${question?.pregunta?.slice(0, 40)}...` : question.pregunta}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center">No hay preguntas para mostrar</p>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
