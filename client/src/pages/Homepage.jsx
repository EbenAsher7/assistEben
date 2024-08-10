import InputDebounce from "@/components/UserAttendance/InputDebounce";
import "./Homepage.css";

const Homepage = () => {
  return (
    <div>
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
      <div className="w-full flex justify-center items-center flex-col sm:flex-row h-dvh sm:-mt-24 -mt-48 background-pattern">
        <div className="flex flex-col gap-3 justify-center max-w-[400px] items-center sm:mr-24">
          <img src="/cropped-favicon.png" alt="logo Ebenezer" className="size-32 sm:size-64 invert dark:invert-0" />
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
    </div>
  );
};

export default Homepage;
