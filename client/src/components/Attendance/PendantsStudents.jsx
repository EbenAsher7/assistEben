import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import PropTypes from "prop-types";

export function PendantStudents({ value }) {
  return (
    <TabsContent value={value}>
      <Card>
        <CardHeader>
          <CardTitle>Alumnnos pendientes</CardTitle>
          <CardDescription>Mostar info los alumnos pendientes de aceptar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <h1>Alumnnos pendientes</h1>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

PendantStudents.propTypes = {
  value: PropTypes.string.isRequired,
};
