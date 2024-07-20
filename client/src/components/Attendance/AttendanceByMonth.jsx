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
  for (let i = 2020; i <= 2050; i++) {
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
        <CardContent className="space-y-2 flex flex-wrap">
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
            <h1>Seleccione un mes</h1>
            <DropdownAE data={meses} title="Seleccione" setValueAE={setSelectedMonth} />
            {selectedMonth && <p>Seleccionaste el mes de {selectedMonth}</p>}
          </div>
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
            <h1>Seleccione un año</h1>
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
