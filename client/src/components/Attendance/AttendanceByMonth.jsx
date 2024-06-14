import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import PropTypes from "prop-types";

export function AttendanceByMonth({ value }) {
  return (
    <TabsContent value={value}>
      <Card>
        <CardHeader>
          <CardTitle>Asistencia por mes</CardTitle>
          <CardDescription>Lista de alumnos y su asistencia por mes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <h1>Asistencia por mes</h1>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

AttendanceByMonth.propTypes = {
  value: PropTypes.string.isRequired,
};
