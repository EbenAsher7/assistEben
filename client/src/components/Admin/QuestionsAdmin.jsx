import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Menu } from "lucide-react";

export default function QuestionsAdmin() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    // Cargar preguntas iniciales (puedes reemplazar esto con tu lógica real)
    const initialQuestions = [
      { id: 1, text: "¿Cuál es tu color favorito?" },
      { id: 2, text: "¿Cuál es tu comida favorita?" },
      { id: 3, text: "¿Cuál es tu película favorita?" },
    ];
    setQuestions(initialQuestions);
    setCurrentQuestion(initialQuestions[0]);
  }, []);

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

      const remainingQuestions = questions.filter((q) => !newAnsweredQuestions.includes(q.id));
      if (remainingQuestions.length > 0) {
        setCurrentQuestion(remainingQuestions[0]);
      } else {
        setCurrentQuestion(null);
      }
    }
  };

  const handleLoadQuestions = async () => {
    if (selectedDate) {
      // Aquí iría tu lógica real para cargar preguntas basadas en la fecha
      try {
        const response = await fetch(`/api/questions?date=${selectedDate.toISOString()}`);
        const newQuestions = await response.json();
        setQuestions(newQuestions);
        setCurrentQuestion(newQuestions[0] || null);
        setAnsweredQuestions([]);
      } catch (error) {
        console.error("Error al cargar las preguntas:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center">
        <Checkbox id="datePicker" checked={showDatePicker} onCheckedChange={(checked) => setShowDatePicker(checked)} />
        <label htmlFor="datePicker" className="ml-2">
          Seleccionar Fecha
        </label>
      </div>

      {showDatePicker && (
        <div className="mb-4">
          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
          <Button onClick={handleLoadQuestions} className="mt-2">
            Cargar preguntas
          </Button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
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
              <ul className="space-y-2">
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

        <div className="md:hidden">
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline">
                <Menu className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Preguntas disponibles</h2>
                <ul className="space-y-2">
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
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
}
