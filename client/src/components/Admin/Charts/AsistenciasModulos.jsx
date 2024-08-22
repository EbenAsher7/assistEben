import { useContext, useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import MainContext from "@/context/MainContext";
import { URL_BASE } from "@/config/config";
import LoaderAE from "@/components/LoaderAE";

const fetchChartData = async (token) => {
  try {
    const response = await fetch(`${URL_BASE}/admin/asistenciasModulo`, {
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

const COLORS = ["#6baed6", "#fd8d3c", "#74c476", "#e377c2", "#bcbd22", "#17becf", "#9edae5", "#f7b6d2", "#c7c7c7"];

const AsistenciasModulos = () => {
  const { user } = useContext(MainContext);
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);

  useEffect(() => {
    if (user) {
      fetchChartData(user.token).then((data) => {
        const groupedData = data.reduce((acc, item) => {
          if (!acc[item.tutor_nombre]) {
            acc[item.tutor_nombre] = {};
          }
          acc[item.tutor_nombre][`${item.modulo_nombre} (Virtual)`] =
            (acc[item.tutor_nombre][`${item.modulo_nombre} (Virtual)`] || 0) + item.cantidad_virtuales;
          acc[item.tutor_nombre][`${item.modulo_nombre} (Presencial)`] =
            (acc[item.tutor_nombre][`${item.modulo_nombre} (Presencial)`] || 0) + item.cantidad_presenciales;
          return acc;
        }, {});

        const transformedData = Object.keys(groupedData).map((tutor) => {
          const modules = groupedData[tutor];
          return {
            tutor_nombre: tutor,
            ...modules,
          };
        });

        setDatos(data);
        setChartData(transformedData);
        setLoading(false);
      });
    }
  }, [user]);

  const moduleNames = [...new Set(datos.flatMap((d) => [`${d.modulo_nombre} (Virtual)`, `${d.modulo_nombre} (Presencial)`]))];
  const chartConfig = moduleNames.reduce((config, moduleName, index) => {
    config[moduleName] = {
      label: moduleName + " - ",
      color: COLORS[index % COLORS.length],
    };
    return config;
  }, {});

  const handleBarClick = (data) => {
    const tutorName = data.payload.tutor_nombre;
    setSelectedTutor(tutorName);
  };

  const handleRowClick = (tutorName) => {
    setSelectedTutor(tutorName);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asistencias por Módulo</CardTitle>
        <CardDescription>Cantidad de asistencias Virtuales y Presenciales de los alumnos asignados a un tutor y a un módulo.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoaderAE texto="Cargando datos de asistencias por módulo..." />
        ) : (
          <div className="w-full sm:w-[50%] m-auto">
            <div className="-ml-10">
              <ChartContainer config={chartConfig}>
                <BarChart data={chartData}>
                  <CartesianGrid vertical={true} />
                  <XAxis dataKey="tutor_nombre" tickLine={false} axisLine={false} tick={false} label={{ value: "" }} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend className="overflow-x-auto ml-10 pl-10 max-h-12" content={<ChartLegendContent />} />
                  {moduleNames.map((module) => (
                    <Bar
                      key={module}
                      dataKey={module}
                      stackId="a"
                      fill={chartConfig[module]?.color || "#ccc"}
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
              <table className="min-w-full divide-y divide-gray-200 ">
                <thead className="bg-gray-200 dark:bg-gray-800">
                  <tr className="p-3 font-medium text-gray-500 dark:text-white uppercase">
                    <th className="p-3">Tutor</th>
                    <th className="p-3">Módulo</th>
                    <th className="p-3">Virtual</th>
                    <th className="p-3">Presencial</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {datos.map((row, index) => (
                    <tr
                      key={index}
                      onClick={() => handleRowClick(row.tutor_nombre)}
                      className={`${row.tutor_nombre === selectedTutor ? "bg-blue-200 dark:bg-blue-800" : ""} cursor-pointer`}
                    >
                      <td className="p-4 text-sm font-medium dark:text-white text-gray-900">{row.tutor_nombre}</td>
                      <td className="p-4 text-sm dark:text-white text-gray-500">{row.modulo_nombre}</td>
                      <td className="p-4 text-sm dark:text-white text-gray-500">{row.cantidad_virtuales}</td>
                      <td className="p-4 text-sm dark:text-white text-gray-500">{row.cantidad_presenciales}</td>
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

export default AsistenciasModulos;
