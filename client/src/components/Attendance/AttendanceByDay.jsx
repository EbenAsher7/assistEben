import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import PropTypes from "prop-types";

export function AttendanceByDay({ value }) {
  return (
    <TabsContent value={value}>
      <Card>
        <CardHeader>
          <CardTitle>Asistencia por día</CardTitle>
          <CardDescription>Lista de alumnos y su asistencia por día</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <h1>Asistencia por día</h1>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

AttendanceByDay.propTypes = {
  value: PropTypes.string.isRequired,
};
