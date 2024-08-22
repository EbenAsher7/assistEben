import { useContext, useEffect, useState } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import MainContext from "@/context/MainContext";
import { URL_BASE } from "@/config/config";
import LoaderAE from "@/components/LoaderAE";

const fetchChartData = async (token) => {
  try {
    const response = await fetch(`${URL_BASE}/admin/alumnosPendientesModulo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const COLORS = ["#5e3aee", "#f54291", "#36cfc9", "#ffc107", "#f7464a", "#47a7f5", "#a347f5", "#ff47a5", "#74f547"];

const PendientesModulos = () => {
  const { user } = useContext(MainContext);
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchChartData(user.token).then((data) => {
        setDatos(data);
        setLoading(false);
      });
    }
  }, [user]);

  const chartConfig = datos.reduce((config, moduleData, index) => {
    config[moduleData.modulo_nombre] = {
      label: moduleData.modulo_nombre,
      color: COLORS[index % COLORS.length],
    };
    return config;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alumnos Pendientes por Módulo</CardTitle>
        <CardDescription>
          Cantidad total de alumnos en estado pendiente por cada módulo, sumando todos los pendientes de todos los tutores.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoaderAE texto="Cargando datos de alumnos pendientes por módulo..." />
        ) : (
          <div className="w-full sm:w-[50%] m-auto">
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={datos.map((d) => ({
                  modulo_nombre: d.modulo_nombre,
                  "Cantidad alumnos pendientes: ": d.cantidad_alumnos_pendientes,
                  fill: chartConfig[d.modulo_nombre]?.color || "#ccc",
                }))}
                layout="vertical"
                margin={{
                  left: 0,
                }}
              >
                <YAxis dataKey="modulo_nombre" type="category" tickLine={false} tickMargin={10} />
                <XAxis dataKey="Cantidad alumnos pendientes: " type="number" />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="Cantidad alumnos pendientes: " layout="vertical" radius={5} />
              </BarChart>
            </ChartContainer>

            {/* Table */}
            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200 dark:bg-gray-800">
                  <tr className="p-3 font-medium text-gray-500 dark:text-white uppercase">
                    <th className="p-3">Módulo</th>
                    <th className="p-3"># Pendientes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {datos.map((row, index) => (
                    <tr key={index} className="cursor-pointer">
                      <td className="p-4 text-sm font-medium dark:text-white text-gray-900">{row.modulo_nombre}</td>
                      <td className="p-4 text-sm dark:text-white text-gray-500">{row.cantidad_alumnos_pendientes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendientesModulos;
