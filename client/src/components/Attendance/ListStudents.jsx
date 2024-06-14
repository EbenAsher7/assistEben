import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import PropTypes from "prop-types";

export function ListStudents({ value }) {
  return (
    <TabsContent value={value}>
      <Card>
        <CardHeader>
          <CardTitle>Listado de alumnos</CardTitle>
          <CardDescription>Lista de alumnos inscritos en el curso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <h1>Listado de alumnos</h1>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

ListStudents.propTypes = {
  value: PropTypes.string.isRequired,
};
