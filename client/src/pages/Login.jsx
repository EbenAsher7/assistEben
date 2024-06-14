import { useContext, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react"; // Asegúrate de tener estos iconos disponibles
import LOGO from "/logoEbenezer.webp";
import { URL_BASE } from "@/config/config";
import MainContext from "../context/MainContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userLogin, setUserLogin] = useState("crpaiz6");
  const [pass, setPass] = useState("1234");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  //CONTEXTO
  const { setIsLogin, setUser } = useContext(MainContext);

  const handleLogin = () => {
    if (!userLogin || !pass)
      return toast({
        variant: "destructive",
        title: "Error",
        description: "Tanto el usuario como la contraseña son requeridos",
        duration: 2500,
      });

    //fetch post async/await
    const login = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${URL_BASE}/api/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: userLogin, password: pass }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        setIsLogin(true);
        setUser(data.user);
        console.log(data);
        navigate("/attendance");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
          duration: 2500,
        });
      } finally {
        setIsLoading(false);
      }
    };

    login();
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen -mt-20 lg:py-0">
        <div className="w-full bg-white dark:bg-neutral-800 rounded-lg shadow mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 sm:p-8 text-neutral-900 dark:text-white">
            <img src={LOGO} alt="logo" className="size-32 mx-auto -mt-4 invert dark:invert-0" />
            <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-neutral-900 dark:text-white">
              Inicia sesión con tu cuenta
            </h1>
            <article className="space-y-4" action="#">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">
                  Usuario
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  value={userLogin}
                  onChange={(e) => setUserLogin(e.target.value)}
                  className="bg-neutral-50 border dark:text-white placeholder:dark:text-[#333333] dark:bg-neutral-900 dark:border-0 placeholder:text-[#ccc] border-neutral-300 text-neutral-900 sm:text-sm rounded-lg block w-full p-2.5"
                  placeholder="Ej. joselopez"
                  required
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">
                  Contraseña
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  id="password"
                  placeholder="••••••••"
                  className="bg-neutral-50 dark:text-white dark:bg-neutral-900 placeholder:dark:text-[#333333] border dark:border-0 placeholder:text-[#ccc] border-neutral-300 text-neutral-900 sm:text-sm rounded-lg block w-full p-2.5"
                  required
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="h-1"></div>
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-bold rounded-lg text-sm px-5 py-4 text-center"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-3 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
                    </svg>
                    Iniciando sesión...
                  </div>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
