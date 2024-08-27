import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Dices, ChevronUp, SquareCheckBig, Calendar } from "lucide-react";
import MainContext from "@/context/MainContext";
import { URL_BASE } from "@/config/config";
import { DialogTitle } from "@radix-ui/react-dialog";
import LoaderAE from "../LoaderAE";

export default function QuestionsAdmin() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDateDrawerOpen, setIsDateDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useContext(MainContext);

  const obtenerFechaFormateada = (fecha, nombre = true) => {
    let hoy = fecha ? new Date(fecha.getTime() + fecha.getTimezoneOffset() * 60000) : new Date();
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const nombreDia = diasSemana[hoy.getDay()];
    const dia = hoy.getDate().toString().padStart(2, "0");
    const mes = (hoy.getMonth() + 1).toString().padStart(2, "0");
    const anio = hoy.getFullYear();
    if (!nombre) return `${dia}/${mes}/${anio}`;
    return `${nombreDia} ${dia}/${mes}/${anio}`;
  };

  const cargarPreguntas = async (fecha = new Date()) => {
    setIsLoading(true); // Inicia el loader
    try {
      // const dateISO = fecha.toISOString().split("T")[0];
      const dateISO = fecha.toISOString().split("T")[0];
      const response = await fetch(`${URL_BASE}/admin/preguntasAnonimas/${dateISO}`, {
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
        setCurrentQuestion(data[0]);
      }
      setAnsweredQuestions([]);
    } catch (error) {
      console.error("Error al cargar las preguntas:", error);
      setQuestions([]);
      setCurrentQuestion(null);
    } finally {
      setIsLoading(false); // Termina el loader
    }
  };

  useEffect(() => {
    if (user && user?.tipo === "Administrador") {
      cargarPreguntas();
    }
  }, [user]);

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
      setIsDrawerOpen(false);
    }
  };

  const handleRandomQuestion = () => {
    const unansweredQuestions = questions.filter((q) => !answeredQuestions.includes(q.id));
    if (unansweredQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
      setCurrentQuestion(unansweredQuestions[randomIndex]);
    } else {
      setCurrentQuestion(null);
    }
  };

  const handleAnsweredQuestion = () => {
    if (currentQuestion) {
      const newAnsweredQuestions = [...answeredQuestions, currentQuestion.id];
      setAnsweredQuestions(newAnsweredQuestions);

      const unansweredQuestions = questions.filter((q) => !newAnsweredQuestions.includes(q.id));
      if (unansweredQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
        setCurrentQuestion(unansweredQuestions[randomIndex]);
      } else {
        setCurrentQuestion(null);
      }
    }
  };

  const handleDatePickerClick = () => {
    setIsDateDrawerOpen(true);
  };

  const handleLoadQuestions = () => {
    if (selectedDate) {
      cargarPreguntas(selectedDate);
      setIsDateDrawerOpen(false);
      setShowDatePicker(true);
    }
  };

  return (
    <div className="container -mt-16 sm:mt-24 mx-auto py-4 px-5 flex flex-col items-center justify-center sm:justify-start">
      {isLoading ? (
        <div className="flex items-center justify-center mt-40">
          <LoaderAE texto="Cargando preguntas..." />
        </div>
      ) : (
        <div className="flex flex-row">
          {/* ################### PARTE PRINCIPAL ################### */}
          <div className="flex flex-col mt-32 sm:mt-0">
            <h1 className="text-xl sm:text-2xl font-bold text-center mt-6">Preguntas del día: {obtenerFechaFormateada(selectedDate)} </h1>
            {/* Nuevo: Mostrar total de preguntas y respondidas */}
            <p className="text-center mb-4 italic">
              Total de preguntas: {questions.length}&nbsp;&nbsp;|&nbsp;&nbsp;Respondidas: {answeredQuestions.length}
            </p>
            {/* ################### PREGUNTAS PRINCIPAL ################### */}
            <div className="flex flex-col sm:flex-row gap-1 w-full mb-5 ">
              <Card className="w-full sm:min-w-[800px] sm:max-w-[800px]">
                <CardHeader>
                  <CardTitle className="text-4xl font-extrabold">La pregunta dice:</CardTitle>
                </CardHeader>
                <CardContent className="w-full min-h-[270px] h-[270px] relative">
                  <div className="flex flex-col justify-center items-center min-h-[190px] h-[190px]">
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
                      disabled={!currentQuestion}
                    >
                      <SquareCheckBig />
                      Marcar <span className="hidden sm:inline-flex">como pregunta</span> respondida
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* ################### SELECCIONAR LA FECHA ################### */}
            <p className="text-sm italic text-center mb-4 opacity-50 px-2">Para ver otras fechas, presiona el botón</p>
            <Button
              onClick={handleDatePickerClick}
              className={`flex items-center gap-2 w-[250px] mx-auto ${
                showDatePicker
                  ? "bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-800 dark:text-white"
                  : "dark:bg-indigo-800 dark:text-white bg-indigo-500 hover:bg-indigo-600"
              } text-white rounded-full px-6 py-3 transition-colors duration-300`}
            >
              <Calendar className="h-5 w-5" />
              {showDatePicker ? `Fecha seleccionada: ${selectedDate ? obtenerFechaFormateada(selectedDate, false) : ""}` : "Seleccionar fecha"}
            </Button>
          </div>

          {/* ################### PREGUNTAS DESKTOP LADO DERECHO ################### */}
          <div className="hidden sm:block ">
            <Card className="sm:min-w-[200px] sm:max-w-[350px] ">
              <CardHeader>
                <CardTitle>Preguntas disponibles</CardTitle>
              </CardHeader>
              <CardContent className="w-full text-left justify-start overflow-y-scroll min-h-[382px] max-h-[382px] no-scrollbar">
                {questions.length > 0 ? (
                  <ul className="space-y-2">
                    {questions.map((question) => (
                      <li key={question.id} className="odd:bg-[#f0f0f0] text-black/80 dark:odd:bg-[#1a1a1a] dark:odd:text-white text-left justify-start">
                        <button
                          className={`w-full text-left text-wrap text-black dark:text-white hover:bg-slate-300 dark:hover:bg-slate-400 rounded-md py-3 px-2 ${
                            answeredQuestions.includes(question.id) ? "line-through" : ""
                          }`}
                          onClick={() => handleQuestionClick(question)}
                          disabled={answeredQuestions.includes(question.id)}
                        >
                          {question?.pregunta?.length > 40 ? `${question?.pregunta?.slice(0, 40)}...` : question.pregunta}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No hay preguntas para mostrar</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ################### SELECCIONAR FECHA ################### */}
      <Drawer open={isDateDrawerOpen} onOpenChange={setIsDateDrawerOpen}>
        <DrawerContent className="w-full sm:w-[300px] sm:h-screen px-4 ">
          <DrawerTitle className="text-xl text-center font-extrabold text-black dark:text-white my-5">Seleccionar Fecha</DrawerTitle>
          <div className="w-10/12 m-auto sm:m-0 flex justify-center items-center flex-col pb-10">
            <input
              type="date"
              value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
              onChange={(e) => {
                const newDate = new Date(e.target.value + "T00:00:00");
                setSelectedDate(newDate);
              }}
              className="border p-2 w-full rounded-md"
              placeholder="Ingrese una fecha para filtrar"
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
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 py-8 rounded-md flex items-center justify-center bg-pink-500 text-white dark:bg-pink-600 dark:text-white sm:hidden"
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
