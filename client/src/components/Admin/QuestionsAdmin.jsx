import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import MainContext from "@/context/MainContext";

export default function QuestionsAdmin() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDateDrawerOpen, setIsDateDrawerOpen] = useState(false);

  const { user } = useContext(MainContext);

  useEffect(() => {
    if (user && user?.tipo === "Administrador") {
      listaNormal();
    }
  }, [user]);

  if (!user || user.tipo !== "Administrador") {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center">No tienes permiso para ver esta página</h1>
      </div>
    );
  }

  // Función para obtener la lista normal de preguntas
  const listaNormal = async () => {
    try {
      const response = await fetch("/api/questions/normal");
      const data = await response.json();
      setQuestions(data);
      setCurrentQuestion(data[0] || null);
      setAnsweredQuestions([]);
    } catch (error) {
      console.error("Error al cargar las preguntas normales:", error);
    }
  };

  // Función para obtener la lista de preguntas por fecha
  const listaConFecha = async (date) => {
    try {
      const response = await fetch(`/api/questions?date=${date.toISOString()}`); // Cambia la URL a tu endpoint real
      const data = await response.json();
      setQuestions(data);
      setCurrentQuestion(data[0] || null);
      setAnsweredQuestions([]);
    } catch (error) {
      console.error("Error al cargar las preguntas por fecha:", error);
    }
  };

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
      // Si se desmarca el checkbox después de una búsqueda por fecha
      const confirmReplace = window.confirm("¿Quieres reemplazar las preguntas con la lista normal?");
      if (confirmReplace) {
        listaNormal(); // Reemplazar con la lista normal
      }
    }
    setShowDatePicker(checked);
    setIsDateDrawerOpen(checked); // Abrir o cerrar el Drawer basado en el checkbox
  };

  const handleLoadQuestions = () => {
    if (selectedDate) {
      listaConFecha(selectedDate); // Llamar a listaConFecha con la fecha seleccionada
      setIsDateDrawerOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <div className="mb-4 flex items-center">
        <Checkbox id="datePicker" checked={showDatePicker} onCheckedChange={handleCheckboxChange} />
        <label htmlFor="datePicker" className="ml-2">
          Seleccionar Fecha
        </label>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full max-w-screen-lg">
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>La pregunta dice:</CardTitle>
          </CardHeader>
          <CardContent>
            {currentQuestion ? <p>{currentQuestion.text}</p> : <p className="text-muted-foreground">Esas fueron todas las preguntas del día de hoy</p>}
            <div className="mt-4 space-y-2">
              <Button onClick={handleRandomQuestion} disabled={answeredQuestions.length === questions.length}>
                Aleatorio
              </Button>
              <Button onClick={handleAnsweredQuestion} disabled={!currentQuestion}>
                Pregunta respondida
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle>Preguntas disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {questions.map((question) => (
                  <li key={question.id}>
                    <Button
                      variant="ghost"
                      className={`w-full text-left ${answeredQuestions.includes(question.id) ? "line-through" : ""}`}
                      onClick={() => handleQuestionClick(question)}
                      disabled={answeredQuestions.includes(question.id)}
                    >
                      {question.text}
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="sm:hidden">
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" className="mt-24">
                <Menu className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[500px]">
              <h2 className="text-xl text-center font-extrabold">Preguntas disponibles</h2>
              <div className="py-4 overflow-y-scroll">
                <ul className="space-y-2">
                  {questions.map((question) => (
                    <li key={question.id} className="odd:bg-[#f0f0f0] text-black/80">
                      <Button
                        variant="ghost"
                        className={`w-full text-wrap text-left py-6 text-[1rem] ${answeredQuestions.includes(question.id) ? "line-through" : ""}`}
                        onClick={() => handleQuestionClick(question)}
                        disabled={answeredQuestions.includes(question.id)}
                      >
                        {question?.text.length > 40 ? `${question.text.slice(0, 40)}...` : question.text}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <Drawer open={isDateDrawerOpen} onOpenChange={setIsDateDrawerOpen}>
        <DrawerContent className="p-4">
          <h2 className="text-xl font-bold">Seleccionar Fecha</h2>
          <div className="mt-4">
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
            <Button onClick={handleLoadQuestions} className="mt-4">
              Cargar preguntas
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
