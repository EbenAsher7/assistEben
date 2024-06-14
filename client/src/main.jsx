import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "./context/ThemeProvider.jsx";
import { BrowserRouter } from "react-router-dom";
import MainProvider from "./context/MainProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <MainProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MainProvider>
    </ThemeProvider>
  </>
);
