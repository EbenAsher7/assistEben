import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import PropTypes from "prop-types";

// Colores para la gráfica
const COLORS = ["#00C49F", "#FF0000"]; // Verde para los que asistieron, rojo para los que no asistieron

const RadarByMonth = ({ attendedStudents, notAttendedStudents }) => {
  // Procesar los datos para la gráfica
  const chartData = [
    {
      name: "Asistieron",
      value: attendedStudents,
    },
    {
      name: "No asistieron",
      value: notAttendedStudents,
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex mb-4">
        <div className="flex items-center mr-4">
          <div style={{ width: 10, height: 10, backgroundColor: COLORS[0], marginRight: 4 }}></div>
          <span>Asistieron</span>
        </div>
        <div className="flex items-center">
          <div style={{ width: 10, height: 10, backgroundColor: COLORS[1], marginRight: 4 }}></div>
          <span>No asistieron</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label animationDuration={500}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

RadarByMonth.propTypes = {
  attendedStudents: PropTypes.number.isRequired,
  notAttendedStudents: PropTypes.number.isRequired,
};

export default RadarByMonth;
