import { useState } from "react";
import InputDebounce from "@/components/UserAttendance/InputDebounce";
import "./Homepage.css";
import FloattingBubble from "@/components/FloatingBubble";

const Homepage = () => {
  const [showFooter, setShowFooter] = useState(false);

  return (
    <>
      <FloattingBubble />
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

        {!showFooter && (
          <button
            onClick={() => setShowFooter(true)}
            className="fixed bottom-4 left-4 p-3 rounded-full bg-gray-400 text-white text-xl shadow-lg z-[1000000001] bounce-animation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1536 1536" width="1em" height="1em">
              <path
                fill="currentColor"
                d="M1024 1248v-160q0-14-9-23t-23-9h-96V544q0-14-9-23t-23-9H544q-14 0-23 9t-9 23v160q0 14 9 23t23 9h96v320h-96q-14 0-23 9t-9 23v160q0 14 9 23t23 9h448q14 0 23-9t9-23M896 352V192q0-14-9-23t-23-9H672q-14 0-23 9t-9 23v160q0 14 9 23t23 9h192q14 0 23-9t9-23m640 416q0 209-103 385.5T1153.5 1433T768 1536t-385.5-103T103 1153.5T0 768t103-385.5T382.5 103T768 0t385.5 103T1433 382.5T1536 768"
              ></path>
            </svg>
          </button>
        )}

        {showFooter && (
          <footer className="dark:bg-black/30 bg-white/50 dark:text-white text-black text-center -gap-1 py-2 sm:py-6 flex justify-between items-center fixed bottom-0 w-full z-[1000000000] px-4 sm:px-8 flex-col">
            <p className="text-xs sm:text-base">Sistema desarrollado exclusivamente para Iglesia Ebenezer, Guatemala</p>
            <div className="sm:space-x-4 flex flex-row items-center justify-center -mt-1">
              <p className="text-xs sm:text-base">Buscas un sistema similar, contáctame: </p>
              <a href="https://wa.me/+50238639275" target="_blank" rel="noopener noreferrer" className="p-1 sm:p-2 flex items-center justify-center">
                <img src="/whatsapp.png" alt="WhatsApp" className="h-5 w-5 sm:h-6 sm:w-6 invert-0 dark:invert" />
              </a>
              <a
                href="https://www.facebook.com/choper.paiz"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 sm:p-2 flex items-center justify-center"
              >
                <img src="/facebook.png" alt="Facebook" className="h-5 w-5 sm:h-6 sm:w-6 invert-0 dark:invert" />
              </a>
            </div>
          </footer>
        )}
      </div>
    </>
  );
};

export default Homepage;
