import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import PropTypes from "prop-types";

export function EditStudents({ value }) {
  return (
    <TabsContent value={value}>
      <Card>
        <CardHeader>
          <CardTitle>Editar a un alumno</CardTitle>
          <CardDescription>Mostar info de alumno y editarlo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <h1>Editar a un Alumno</h1>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

EditStudents.propTypes = {
  value: PropTypes.string.isRequired,
};
