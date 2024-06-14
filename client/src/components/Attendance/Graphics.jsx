import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import PropTypes from "prop-types";

export function Graphics({ value }) {
  return (
    <TabsContent value={value}>
      <Card>
        <CardHeader>
          <CardTitle>Mostrar graficas</CardTitle>
          <CardDescription>Mostar info los alumnos por gráficas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <h1>Mostrar graficas</h1>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

Graphics.propTypes = {
  value: PropTypes.string.isRequired,
};
