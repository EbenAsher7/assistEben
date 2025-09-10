import { useContext } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import MainContext from "@/context/MainContext";
import LoaderAE from "@/components/LoaderAE";

const FeatureRoute = ({ children, settingKey }) => {
  const { appSettings } = useContext(MainContext);

  if (appSettings === null) {
    return (
      <div className="flex w-full h-dvh justify-center items-center">
        <LoaderAE texto="Verificando permisos..." />
      </div>
    );
  }

  if (appSettings[settingKey] === false) {
    return <Navigate to="/not-found" replace />;
  }

  return children;
};

FeatureRoute.propTypes = {
  children: PropTypes.node.isRequired,
  settingKey: PropTypes.oneOf(["asistencia_activa", "registro_activo", "preguntas_activas"]).isRequired,
};

export default FeatureRoute;
