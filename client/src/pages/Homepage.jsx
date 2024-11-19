import InputDebounce from "@/components/UserAttendance/InputDebounce";
import "./Homepage.css";

const Homepage = () => {
  return (
    <div className="flex flex-col min-h-dvh -mb-5 -mt-[60px] sm:-mt-[70px]">
      {/* Fondo animado para el homepage */}
      <ul className="circles">
        <li className="dark:invert-0 invert"></li>
        <li className="dark:invert-0 invert"></li>
        <li className="dark:invert-0 invert"></li>
        <li className="dark:invert-0 invert"></li>
        <li className="dark:invert-0 invert"></li>
        <li className="dark:invert-0 invert"></li>
        <li className="dark:invert-0 invert"></li>
        <li className="dark:invert-0 invert"></li>
        <li className="dark:invert-0 invert"></li>
        <li className="dark:invert-0 invert"></li>
      </ul>
      <div className="flex-grow flex justify-center items-center flex-col sm:flex-row background-pattern">
        <div className="flex flex-col gap-3 justify-center max-w-[400px] items-center sm:mr-24">
          <img src="/cropped-favicon.png" alt="logo Ebenezer" className="hidden sm:inline-flex size-32 sm:size-64 invert dark:invert-0" />
          <img src="/LOGODOCTRINA.webp" alt="logo Ebenezer" className="inline-flex sm:hidden h-16 mb-4" />
        </div>
        <div className="flex flex-col gap-3 sm:-mt-24">
          <div className="sm:min-w-[300px] sm:max-w-[700px] w-full">
            <div className="sm:mb-5 px-5 sm:px-0">
              <h1 className="text-center font-serif font-extrabold text-4xl sm:text-6xl mb-2">Registrar asistencia</h1>
              <h2 className="text-center text-sm sm:text-xl font-bold mb-1">Escribe tu nombre y asegúrate que sea el correcto</h2>
              <h3 className="text-center text-xs sm:text-md opacity-40 italic mb-3">*Si hay varios nombres iguales, puedes basarte en el tutor.</h3>
            </div>
            <InputDebounce />
          </div>
        </div>
      </div>

      <footer className="bg-neutral-600 dark:bg-neutral-900 text-white text-center py-4 flex justify-center gap-2 items-center fixed bottom-0 w-full z-[1000000000]">
        <p>Sistema hecho por Cristopher Paiz&nbsp;&nbsp;|&nbsp;&nbsp;Contáctame&nbsp;</p>
        <div className="space-x-4 flex flex-row items-center">
          <a href="https://wa.me/+50238639275" target="_blank" rel="noopener noreferrer">
            <img src="/whatsapp.png" alt="WhatsApp" className="h-6 w-6 invert-0 dark:invert" />
          </a>
          <a href="https://www.facebook.com/choper.paiz" target="_blank" rel="noopener noreferrer">
            <img src="/facebook.png" alt="Facebook" className="h-6 w-6" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
