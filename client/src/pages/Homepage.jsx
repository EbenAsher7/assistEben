import InputDebounce from "@/components/UserAttendance/InputDebounce";
import "./Homepage.css";

const Homepage = () => {
  return (
    <div className="flex flex-col min-h-dvh -mb-[100px] -mt-[100px]">
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
          <img src="/LOGODOCTRINA.webp" alt="logo Ebenezer" className="inline-flex sm:hidden h-16 mb-4 invert-0 dark:invert" />
        </div>
        <div className="flex flex-col gap-3 sm:-mt-24">
          <div className="sm:min-w-[300px] sm:max-w-[700px] w-full flex-1 flex-grow-0">
            <div className="sm:mb-5 px-5 sm:px-0">
              <h1 className="text-center font-serif font-extrabold text-4xl sm:text-6xl mb-2">Registrar asistencia</h1>
              <h2 className="text-center text-sm sm:text-xl font-bold mb-1">Escribe tu nombre y asegúrate que sea el correcto</h2>
              <h3 className="text-center text-xs sm:text-md opacity-40 italic mb-3">*Si hay varios nombres iguales, puedes basarte en el tutor.</h3>
            </div>
            <InputDebounce />
          </div>
        </div>
      </div>

      <footer className="dark:bg-black/30 bg-white/50 dark:text-white text-black text-center -gap-1 py-2 sm:py-6 flex justify-between items-center fixed bottom-0 w-full z-[1000000000] px-4 sm:px-8 flex-col">
        <p className="text-xs sm:text-base">Sistema desarrollado exclusivamente para Iglesia Ebenezer, Guatemala</p>
        <div className="sm:space-x-4 flex flex-row items-center justify-center -mt-1">
          <p className="text-xs sm:text-base">Buscas un sistema similar, contáctame: </p>
          <a href="https://wa.me/+50238639275" target="_blank" rel="noopener noreferrer" className="p-1 sm:p-2 flex items-center justify-center">
            <img src="/whatsapp.png" alt="WhatsApp" className="h-5 w-5 sm:h-6 sm:w-6 invert-0 dark:invert" />
          </a>
          <a href="https://www.facebook.com/choper.paiz" target="_blank" rel="noopener noreferrer" className="p-1 sm:p-2 flex items-center justify-center">
            <img src="/facebook.png" alt="Facebook" className="h-5 w-5 sm:h-6 sm:w-6 invert-0 dark:invert" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
