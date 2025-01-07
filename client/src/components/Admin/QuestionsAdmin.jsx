/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect, useContext, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dices, ChevronUp, SquareCheckBig, Calendar, MessageSquareMore, MessageSquareReply, MailQuestion } from "lucide-react";
import MainContext from "@/context/MainContext";
import { URL_BASE } from "@/config/config";
import { DialogTitle } from "@radix-ui/react-dialog";
import LoaderAE from "../LoaderAE";
import { useToast } from "../ui/use-toast";
import CRDate from "../ui/CRDate";

const translations = {
  es: {
    pageTitle: "Preguntas del día",
    from: "al",
    totalQuestions: "Total de preguntas",
    totalAnswered: "Total Respondidas",
    questionSays: "La pregunta dice:",
    noQuestions: "No hay preguntas para mostrar",
    random: "Aleatorio",
    markAsAnswered: "Marcar como respondida",
    answering: "Respondiendo...",
    selectDates: "Para ver otras fechas, presiona el botón",
    selectDateButton: "Seleccionar fechas",
    availableQuestions: "Preguntas disponibles",
    searchPlaceholder: "Buscar entre las preguntas...",
    selectDate: "Seleccionar Fecha",
    enterFirstDate: "Ingrese primer fecha",
    enterSecondDate: "Ingrese segunda fecha",
    firstDate: "Primer fecha",
    secondDate: "Segunda fecha",
    loadQuestions: "Cargar preguntas",
    questionsList: "Lista de Preguntas",
    datesRequired: "Las dos fechas son requeridas",
    loadError: "Error al cargar las preguntas, intente nuevamente",
    markError: "Error al marcar la pregunta como respondida",
    noPermission: "No tienes permiso para ver esta página",
  },
  en: {
    pageTitle: "Questions of the Day",
    from: "to",
    totalQuestions: "Total questions",
    totalAnswered: "Total Answered",
    questionSays: "The question says:",
    noQuestions: "No questions to display",
    random: "Random",
    markAsAnswered: "Mark as answered",
    answering: "Answering...",
    selectDates: "To view other dates, press the button",
    selectDateButton: "Select dates",
    availableQuestions: "Available questions",
    searchPlaceholder: "Search questions...",
    selectDate: "Select Date",
    enterFirstDate: "Enter first date",
    enterSecondDate: "Enter second date",
    firstDate: "First date",
    secondDate: "Second date",
    loadQuestions: "Load questions",
    questionsList: "Questions List",
    datesRequired: "Both dates are required",
    loadError: "Error loading questions, please try again",
    markError: "Error marking question as answered",
    noPermission: "You don't have permission to view this page",
  },
};

export function QuestionsAdmin() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDateDrawerOpen, setIsDateDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState("es");
  const [loadingRespondida, setLoadingRespondida] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const selectedQuestionRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { user } = useContext(MainContext);
  const [preventNavigation, setPreventNavigation] = useState(false);
  const t = translations[language];

  const obtenerFechaFormateada = (fecha) => {
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const anio = fecha.getFullYear();
    return `${anio}-${mes}-${dia}`;
  };

  useEffect(() => {
    const handlePopState = (event) => {
      if (preventNavigation) {
        event.preventDefault();
        setIsDrawerOpen(false);
        setIsDateDrawerOpen(false);
        setPreventNavigation(false);
        window.history.pushState(null, "", window.location.pathname);
      }
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [preventNavigation]);

  const [selectedDate, setSelectedDate] = useState(obtenerFechaFormateada(new Date(new Date().setDate(new Date().getDate() - 2))));
  const [selectedDate2, setSelectedDate2] = useState(obtenerFechaFormateada(new Date(new Date().setDate(new Date().getDate() + 2))));

  const cargarPreguntas = async (fecha = selectedDate, fecha2 = selectedDate2) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${URL_BASE}/admin/preguntasAnonimas/${fecha}/${fecha2}`, {
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
        const unansweredQuestions = data.filter((q) => !q.respondida);
        if (unansweredQuestions.length > 0) {
          const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
          setCurrentQuestion(unansweredQuestions[randomIndex]);
        } else {
          setCurrentQuestion(null);
        }
      }
      setAnsweredQuestions(data.filter((q) => q.respondida).map((q) => q.id));
    } catch (error) {
      console.error("Error al cargar las preguntas:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: t.loadError,
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
      cargarPreguntas(selectedDate, selectedDate2);
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
        <h1 className="text-2xl font-bold text-center">{t.noPermission}</h1>
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
    const unansweredQuestions = filteredQuestions.filter((q) => !q.respondida);
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
          setQuestions((prevQuestions) => prevQuestions.map((q) => (q.id === currentQuestion.id ? { ...q, respondida: true } : q)));
          setAnsweredQuestions((prev) => [...prev, currentQuestion.id]);

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
          description: t.markError,
          duration: 2500,
        });
      } finally {
        setLoadingRespondida(false);
      }
    }
  };

  const handleDatePickerClick = () => {
    setIsDateDrawerOpen(true);
    setPreventNavigation(true);
  };

  const handleLoadQuestions = () => {
    if (!selectedDate || !selectedDate2) {
      toast({
        variant: "destructive",
        title: "Error",
        description: t.datesRequired,
        duration: 2000,
      });
      return;
    }

    if (selectedDate && selectedDate2) {
      cargarPreguntas(selectedDate, selectedDate2);
      setIsDateDrawerOpen(false);
      setPreventNavigation(false);
      setShowDatePicker(true);
    }
  };

  const filteredQuestions = useMemo(() => {
    return questions?.filter((question) => {
      const questionText = language === "es" ? question.pregunta : question.preguntaeng;
      return questionText
        ?.toLowerCase()
        ?.normalize("NFD")
        ?.replace(/[\u0300-\u036f]/g, "")
        ?.includes(
          searchTerm
            ?.toLowerCase()
            ?.normalize("NFD")
            ?.replace(/[\u0300-\u036f]/g, "")
        );
    });
  }, [questions, searchTerm, language]);

  const renderQuestions = (questionsToRender, align = "text-left", length = 40) => (
    <ul className="space-y-2">
      {questionsToRender.map((question) => (
        <li
          key={question.id}
          className={`odd:bg-[#f0f0f0] text-black/80 dark:odd:bg-[#1a1a1a] dark:odd:text-white text-left justify-start
                    ${question.id === selectedQuestionId ? "bg-orange-500 dark:bg-orange-700" : ""}`}
          ref={question.id === selectedQuestionId ? selectedQuestionRef : null}
        >
          <button
            className={`w-full ${align} text-wrap text-black dark:text-white hover:bg-slate-300 dark:hover:bg-slate-400 rounded-md py-3 px-2 ${
              question.respondida ? "line-through" : ""
            } ${question.id === selectedQuestionId ? "text-white" : ""}`}
            onClick={() => handleQuestionClick(question)}
            disabled={question.respondida}
          >
            {language === "es"
              ? question?.pregunta?.length > length
                ? `${question?.pregunta?.slice(0, length)}...`
                : question.pregunta
              : question?.preguntaeng?.length > length
              ? `${question?.preguntaeng?.slice(0, length)}...`
              : question.preguntaeng}
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
          <div className="flex flex-col mt-24 sm:mt-0">
            <div className="flex flex-col sm:flex-row sm:gap-8 sm:justify-center sm:items-center">
              <MailQuestion className="sm:m-0 mx-auto -mb-2" size={70} />
              <div className="my-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">{t.pageTitle}</h1>
                <h1 className="sm:text-xl font-bold text-center sm:text-left">
                  {selectedDate} {selectedDate && t.from} {selectedDate2}
                </h1>
              </div>
            </div>
            <hr className="hidden sm:block sm:mb-3 sm:w-10/12 sm:mx-auto" />

            <Tabs defaultValue="es" className="w-full" onValueChange={setLanguage}>
              <TabsList className="grid w-[200px] grid-cols-2 mx-auto mb-4">
                <TabsTrigger value="es">Español</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col space-y-0 opacity-80 italic -mt-1 mb-2 sm:flex-row sm:justify-center sm:gap-9 sm:items-center">
              <span className="mx-auto sm:m-0 italic gap-2 inline-flex">
                {t.totalQuestions}: <span className="text-lg font-bold">{String(questions?.length).padStart(3, " ")}</span> <MessageSquareMore />
              </span>
              <span className="mx-auto sm:m-0 italic gap-2 inline-flex">
                {t.totalAnswered}: <span className="text-lg font-bold">{String(answeredQuestions?.length).padStart(3, " ")}</span>{" "}
                <MessageSquareReply />
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 w-full mb-5 ">
              <Card className="w-full sm:min-w-[800px] sm:max-w-[800px]">
                <CardHeader>
                  <CardTitle className="text-4xl font-extrabold">{t.questionSays}</CardTitle>
                </CardHeader>
                <CardContent className="w-full min-h-[330px] h-[330px] relative">
                  <div className="flex flex-col justify-center items-center min-h-[230px] h-[230px]">
                    {currentQuestion ? (
                      <p className="text-lg text-left p-2 sm:text-4xl">
                        {language === "es" ? currentQuestion.pregunta : currentQuestion.preguntaeng}
                      </p>
                    ) : (
                      <p className="text-muted-foreground">{t.noQuestions}</p>
                    )}
                  </div>
                  <div className="flex gap-4 items-center justify-center absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <Button
                      className="gap-2 bg-pink-500 text-white dark:bg-pink-800 dark:text-white hover:bg-pink-600 dark:hover:bg-pink-700"
                      onClick={handleRandomQuestion}
                      disabled={answeredQuestions.length === questions.length || questions.length === 0 || questions.length === 1}
                    >
                      <Dices />
                      {t.random}
                    </Button>
                    <Button
                      className="gap-1 bg-pink-500 text-white dark:bg-pink-800 dark:text-white hover:bg-pink-600 dark:hover:bg-pink-700"
                      onClick={handleAnsweredQuestion}
                      disabled={!currentQuestion || currentQuestion.respondida || loadingRespondida}
                    >
                      <SquareCheckBig />
                      <div className={`${loadingRespondida ? "hidden" : ""}`}>{t.markAsAnswered}</div>
                      <div className={`${loadingRespondida ? "" : "hidden"}`}>{t.answering}</div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <p className="text-sm italic text-center mb-2 opacity-50 px-2">{t.selectDates}</p>
            <div className="mb-48 sm:mb-0">
              <Button
                onClick={handleDatePickerClick}
                className={`flex items-center gap-2 w-[250px] mx-auto ${
                  showDatePicker
                    ? "bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-800 dark:text-white"
                    : "dark:bg-indigo-800 dark:text-white bg-indigo-500 hover:bg-indigo-600"
                } text-white rounded-full px-6 py-3 transition-colors duration-300`}
              >
                <Calendar className="h-5 w-5" />
                {showDatePicker ? `${selectedDate ? selectedDate : ""} - ${selectedDate2 ? selectedDate2 : ""}` : t.selectDateButton}
              </Button>
            </div>
          </div>

          <div className="hidden sm:block ">
            <Card className="sm:min-w-[250px] sm:max-w-[350px] ">
              <CardHeader>
                <CardTitle>{t.availableQuestions}</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 mb-4 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="w-full text-left justify-start overflow-y-scroll min-h-[435px] max-h-[435px] no-scrollbar">
                  {filteredQuestions.length > 0 ? (
                    renderQuestions(filteredQuestions, "text-left", 80)
                  ) : (
                    <p className="text-muted-foreground">{t.noQuestions}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Drawer
        open={isDateDrawerOpen}
        onOpenChange={(open) => {
          setIsDateDrawerOpen(open);
          if (!open) setPreventNavigation(false);
        }}
      >
        <DrawerContent className="w-full sm:w-[300px] sm:h-screen px-4 ">
          <DrawerTitle className="text-xl text-center font-extrabold text-black dark:text-white my-5">{t.selectDate}</DrawerTitle>
          <div className="w-10/12 m-auto sm:m-0 flex justify-center items-center flex-col pb-72">
            <CRDate title={t.enterFirstDate} setValue={setSelectedDate} defaultValue={selectedDate} placeholder={t.firstDate} />
            <div className="my-4"></div>
            <CRDate title={t.enterSecondDate} setValue={setSelectedDate2} defaultValue={selectedDate2} placeholder={t.secondDate} />
            <div className="flex justify-end mt-6">
              <Button className="w-[300px] sm:w-[200px]" onClick={handleLoadQuestions}>
                {t.loadQuestions}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer
        open={isDrawerOpen}
        onOpenChange={(open) => {
          setIsDrawerOpen(open);
          if (!open) setPreventNavigation(false);
        }}
      >
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="fixed bottom-0 left-1/2 transform -translate-x-1/2 py-8 px-8 rounded-t-xl rounded-b-none flex items-center justify-center bg-pink-500 text-white dark:bg-pink-600 dark:text-white sm:hidden"
          >
            <ChevronUp className="h-6 w-6" /> &nbsp; {t.questionsList}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh]">
          <DialogTitle className="text-xl text-center font-extrabold text-black dark:text-white">{t.availableQuestions}</DialogTitle>
          <div className="px-4 py-2">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 mb-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="py-4 overflow-y-scroll text-left">
            {filteredQuestions.length > 0 ? (
              renderQuestions(filteredQuestions, "text-center", 40)
            ) : (
              <p className="text-muted-foreground text-center">{t.noQuestions}</p>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default QuestionsAdmin;
