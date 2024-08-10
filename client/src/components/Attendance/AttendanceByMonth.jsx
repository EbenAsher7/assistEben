import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import PropTypes from "prop-types";
import { useState } from "react";
import { DropdownAE } from "../DropdownAE";
import { Button } from "../ui/button";

export function AttendanceByMonth({ value }) {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const handleMostrarClick = () => {
    // Lógica para manejar el clic en el botón "Mostrar"
    console.log("Mostrar datos para el mes", selectedMonth, "y el año", selectedYear);
  };

  const meses = [
    { value: "enero", label: "Enero" },
    { value: "febrero", label: "Febrero" },
    { value: "marzo", label: "Marzo" },
    { value: "abril", label: "Abril" },
    { value: "mayo", label: "Mayo" },
    { value: "junio", label: "Junio" },
    { value: "julio", label: "Julio" },
    { value: "agosto", label: "Agosto" },
    { value: "septiembre", label: "Septiembre" },
    { value: "octubre", label: "Octubre" },
    { value: "noviembre", label: "Noviembre" },
    { value: "diciembre", label: "Diciembre" },
  ];

  const years = [];
  for (let i = 2024; i <= 2050; i++) {
    years.push({ value: i.toString(), label: i.toString() });
  }

  // Verifica si ambos dropdowns están seleccionados
  const canShowButton = selectedMonth && selectedYear;

  return (
    <TabsContent value={value}>
      <Card>
        <CardHeader>
          <CardTitle>Asistencia por mes</CardTitle>
          <CardDescription>Lista de alumnos y su asistencia por mes</CardDescription>
        </CardHeader>
        <div className="sm:w-[96%] m-auto h-4 mb-2">
          <hr />
        </div>
        <CardContent className="flex sm:flex-row flex-col items-center gap-4 justify-center sm:justify-start flex-wrap">
          <div className="">
            <h2 className="text-lg font-extrabold">Seleccione un mes</h2>
            <DropdownAE data={meses} title="Seleccione" setValueAE={setSelectedMonth} />
            {selectedMonth && <p>Seleccionaste el mes de {selectedMonth}</p>}
          </div>
          <div className="">
            <h2 className="text-lg font-extrabold">Seleccione un año</h2>
            <DropdownAE data={years} title="Seleccione" setValueAE={setSelectedYear} />
            {selectedYear && <p>Seleccionaste el año {selectedYear}</p>}
          </div>
          {canShowButton && (
            <Button className="w-full sm:w-auto mt-4 mb-12 px-24 flex" onClick={handleMostrarClick}>
              Mostrar
            </Button>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}

AttendanceByMonth.propTypes = {
  value: PropTypes.string.isRequired,
};
