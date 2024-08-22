import { useContext, useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import MainContext from "@/context/MainContext";
import { URL_BASE } from "@/config/config";
import LoaderAE from "@/components/LoaderAE";

const fetchChartData = async (token) => {
  try {
    const response = await fetch(`${URL_BASE}/admin/preguntasTipoAsistencia`, {
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

const COLORS = ["#1f78b4", "#33a02c", "#e31a1c"];

const PreguntasAsistencias = () => {
  const { user } = useContext(MainContext);
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [selectedModulo, setSelectedModulo] = useState(null);

  useEffect(() => {
    if (user) {
      fetchChartData(user.token).then((data) => {
        const groupedData = data.reduce((acc, item) => {
          if (!acc[item.modulo_nombre]) {
            acc[item.modulo_nombre] = {};
          }
          acc[item.modulo_nombre][item.tipo_asistencia] = (acc[item.modulo_nombre][item.tipo_asistencia] || 0) + item.cantidad_preguntas;
          return acc;
        }, {});

        const transformedData = Object.keys(groupedData).map((modulo) => {
          const asistencias = groupedData[modulo];
          return {
            modulo_nombre: modulo,
            ...asistencias,
          };
        });

        setDatos(data);
        setChartData(transformedData);
        setLoading(false);
      });
    }
  }, [user]);

  const asistenciaTypes = [...new Set(datos.map((d) => d.tipo_asistencia))];
  const chartConfig = asistenciaTypes.reduce((config, tipoAsistencia, index) => {
    config[tipoAsistencia] = {
      label: tipoAsistencia + " - ",
      color: COLORS[index % COLORS.length],
    };
    return config;
  }, {});

  const handleBarClick = (data) => {
    const moduloName = data.payload.modulo_nombre;
    setSelectedModulo(moduloName);
  };

  const handleRowClick = (moduloName) => {
    setSelectedModulo(moduloName);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preguntas por Tipo de Asistencia</CardTitle>
        <CardDescription>Cantidad de preguntas que se han hecho a lo largo del curso, tanto de alumnos virtuales como presenciales.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoaderAE texto="Cargando datos de preguntas por tipo de asistencia..." />
        ) : (
          <div className="w-full sm:w-[50%] m-auto">
            <div className="-ml-10">
              <ChartContainer config={chartConfig}>
                <BarChart data={chartData}>
                  <CartesianGrid vertical={true} />
                  <XAxis dataKey="modulo_nombre" tickLine={false} axisLine={false} tick={false} label={{ value: "" }} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend className="overflow-x-auto ml-10 pl-10 max-h-8" content={<ChartLegendContent />} />
                  {asistenciaTypes.map((tipo) => (
                    <Bar
                      key={tipo}
                      dataKey={tipo}
                      fill={chartConfig[tipo]?.color || "#ccc"}
                      radius={[4, 4, 0, 0]}
                      onClick={handleBarClick}
                      cursor={"pointer"}
                    />
                  ))}
                </BarChart>
              </ChartContainer>
            </div>

            {/* Table */}
            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200 dark:bg-gray-800">
                  <tr className="p-3 font-medium text-gray-500 dark:text-white uppercase">
                    <th className="p-3">Módulo</th>
                    <th className="p-3">Tipo de Asistencia</th>
                    <th className="p-3"># Preguntas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {datos.map((row, index) => (
                    <tr
                      key={index}
                      onClick={() => handleRowClick(row.modulo_nombre)}
                      className={`${row.modulo_nombre === selectedModulo ? "bg-blue-200 dark:bg-blue-800" : ""} cursor-pointer`}
                    >
                      <td className="p-4 text-sm font-medium dark:text-white text-gray-900">{row.modulo_nombre}</td>
                      <td className="p-4 text-sm dark:text-white text-gray-500">{row.tipo_asistencia}</td>
                      <td className="p-4 text-sm dark:text-white text-gray-500">{row.cantidad_preguntas}</td>
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

export default PreguntasAsistencias;
