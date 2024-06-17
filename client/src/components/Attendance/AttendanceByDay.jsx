import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import PropTypes from "prop-types";
import { CalendarAE } from "../CalendarAE";
import { useContext, useEffect, useState } from "react";
import MainContext from "../../context/MainContext";
import { URL_BASE } from "@/config/config";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";

export function AttendanceByDay({ value }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [onlyTuesday, setOnlyTuesday] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // CONTEXTO
  const { user } = useContext(MainContext);

  const loadData = async () => {
    console.log(selectedDate);
    try {
      setLoading(true);
      if (!selectedDate) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "La fecha es obligatoria",
          duration: 2500,
        });
        return;
      }

      const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
      const dataFinal = {
        date: formattedDate,
        tutorID: user.id,
      };

      console.log(dataFinal);
      const response = await fetch(`${URL_BASE}/get/getAttendanceByDateAndTutor/${formattedDate}/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al consultar las asistencias.",
        duration: 2500,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = () => {
    setOnlyTuesday(!onlyTuesday);
  };

  return (
    <TabsContent value={value}>
      <Card>
        <CardHeader>
          <CardTitle>Asistencia por día</CardTitle>
          <CardDescription>Lista de alumnos y su asistencia por día</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1 flex flex-col pt-4 sm:justify-center sm:items-center">
            <CalendarAE title="Fecha de asistencia" setDate={setSelectedDate} onlyTuesday={onlyTuesday} />
            <label className="flex items-center space-x-2 w-full justify-end sm:justify-center">
              <input
                type="checkbox"
                checked={onlyTuesday}
                onChange={handleCheckboxChange}
                className="form-checkbox h-5 w-5 text-dark-600 dark:text-white-400"
              />
              <span className="text-gray-700 dark:text-gray-300">Mostrar solo los Martes</span>
            </label>
          </div>
          <div className="py-8">
            <Button disabled={loading} onClick={loadData} className="w-full sm:w-[300px] m-auto justify-center flex">
              {loading ? "Cargando..." : "Mostrar asistencias registradas"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

AttendanceByDay.propTypes = {
  value: PropTypes.string.isRequired,
};
