import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import MainContext from "@/context/MainContext";
import { URL_BASE } from "@/config/config";
import { DialogTitle } from "@radix-ui/react-dialog";

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

  const obtenerFechaFormateada = (fecha) => {
    const hoy = fecha ?? new Date();
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const nombreDia = diasSemana[hoy.getDay()];
    const dia = hoy.getDate().toString().padStart(2, "0");
    const mes = (hoy.getMonth() + 1).toString().padStart(2, "0");
    const anio = hoy.getFullYear();
    return `${nombreDia} ${dia}/${mes}/${anio}`;
  };

  const cargarPreguntas = async (fecha = new Date()) => {
    setIsLoading(true); // Inicia el loader
    try {
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

  const handleCheckboxChange = (checked) => {
    if (!checked && showDatePicker) {
      const confirmReplace = window.confirm("¿Quieres reemplazar las preguntas con la lista normal?");
      if (confirmReplace) {
        cargarPreguntas();
      }
    }
    setShowDatePicker(checked);
    setIsDateDrawerOpen(checked);
  };

  const handleLoadQuestions = () => {
    if (selectedDate) {
      cargarPreguntas(selectedDate);
      setIsDateDrawerOpen(false);
    }
  };

  return (
    <div className="container -mt-16 sm:mt-32 mx-auto p-4 flex flex-col items-center justify-center sm:justify-start">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <p>Cargando preguntas...</p>
        </div>
      ) : (
        <div className="flex flex-row">
          {/* ################### PARTE PRINCIPAL ################### */}
          <div className="flex flex-col mt-32 sm:mt-0">
            {/* ################### DRAWER MOBILE DE PREGUNTAS ################### */}
            <div className="sm:hidden w-full justify-start my-4">
              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button variant="outline">
                    <Menu className="h-4 w-4" /> Ver lista de preguntas
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-h-[500px]">
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
            {/* ################### SELECCIONAR LA FECHA ################### */}
            <div className="mb-4 flex items-center">
              <Checkbox id="datePicker" checked={showDatePicker} onCheckedChange={handleCheckboxChange} />
              <label htmlFor="datePicker" className="ml-2">
                Seleccionar Fecha
              </label>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-center mb-6">Preguntas del día: {obtenerFechaFormateada(selectedDate)} </h1>
            {/* ################### PREGUNTAS PRINCIPAL ################### */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Card className="w-full sm:min-w-[800px] sm:max-w-[950px]">
                <CardHeader>
                  <CardTitle className="text-4xl font-extrabold">La pregunta dice:</CardTitle>
                </CardHeader>
                <CardContent className="w-full">
                  {currentQuestion ? (
                    <p className="text-lg text-left p-2 sm:text-4xl mb-12">{currentQuestion.pregunta}</p>
                  ) : (
                    <p className="text-muted-foreground">No hay preguntas para mostrar</p>
                  )}
                  <div className="flex mt-4 gap-4 items-center justify-center mb-6">
                    <Button
                      className="gap-2 bg-pink-500 text-white dark:bg-pink-800 dark:text-white hover:bg-pink-600 dark:hover:bg-pink-700"
                      onClick={handleRandomQuestion}
                      disabled={answeredQuestions.length === questions.length}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005 .195v12.666c0 1.96 -1.537 3.56 -3.472 3.662l-.195 .005h-12.666a3.667 3.667 0 0 1 -3.662 -3.472l-.005 -.195v-12.666c0 -1.96 1.537 -3.56 3.472 -3.662l.195 -.005h12.666zm-2.833 12a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0 -3zm-7 0a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0 -3zm3.5 -3.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0 -3zm-3.5 -3.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0 -3zm7 0a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0 -3z" />
                      </svg>
                      Aleatorio
                    </Button>
                    <Button
                      className="gap-1 bg-pink-500 text-white dark:bg-pink-800 dark:text-white hover:bg-pink-600 dark:hover:bg-pink-700"
                      onClick={handleAnsweredQuestion}
                      disabled={!currentQuestion}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005 .195v12.666c0 1.96 -1.537 3.56 -3.472 3.662l-.195 .005h-12.666a3.667 3.667 0 0 1 -3.662 -3.472l-.005 -.195v-12.666c0 -1.96 1.537 -3.56 3.472 -3.662l.195 -.005h12.666zm-2.626 7.293a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
                      </svg>
                      Marcar como<span className="hidden sm:inline-flex">pregunta</span> respondida
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* ################### PREGUNTAS DESKTOP LADO DERECHO ################### */}
          <div className="hidden sm:block ">
            <Card className="sm:min-w-[200px] sm:max-w-[350px]">
              <CardHeader>
                <CardTitle>Preguntas disponibles</CardTitle>
              </CardHeader>
              <CardContent className="w-full text-left justify-start max-h-[450px] overflow-y-scroll">
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
          <DrawerTitle className="text-xl text-center font-extrabold text-black dark:text-white my-10">Seleccionar Fecha</DrawerTitle>
          <input
            type="date"
            value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="border p-2 w-full"
          />
          <div className="flex justify-end mt-4">
            <Button onClick={handleLoadQuestions}>Cargar preguntas</Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
