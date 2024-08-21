import "./LoadingTexto.css";
import PropTypes from "prop-types";

const LoadingTexto = ({ texto }) => {
  const letras = texto.split("");

  return (
    <div className="loading-texto-container">
      {letras.map((letra, index) => (
        <span key={index} className="loading-texto-letra" style={{ animationDelay: `${index * 0.2}s` }}>
          {letra === " " ? "\u00A0" : letra}
        </span>
      ))}
    </div>
  );
};

export default LoadingTexto;

LoadingTexto.propTypes = {
  texto: PropTypes.string.isRequired,
};
