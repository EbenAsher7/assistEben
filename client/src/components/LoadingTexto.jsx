import React from "react";
import './LoadingTexto.css'; // Importa el archivo CSS

const LoadingTexto = ({ texto }) => {
  const letras = texto.split("");

  return (
    <div className="loading-texto-container">
      {letras.map((letra, index) => (
        <span
          key={index}
          className="loading-texto-letra"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {letra}
        </span>
      ))}
    </div>
  );
};

export default LoadingTexto;
