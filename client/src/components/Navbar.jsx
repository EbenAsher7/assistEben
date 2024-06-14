import { ThemeToggle } from "./ThemeToggle";
import LOGO from "/logoEbenezer.webp";
import "flowbite";

const Navbar = () => {
  return (
    <>
      <nav className="bg-white border-neutral-200 dark:bg-neutral-800 dark:border-neutral-500">
        <div className="w-full flex flex-wrap items-center justify-between p-2 sm:pl-4">
          <a href="/" className="flex items-center gap-2">
            <img src={LOGO} className="size-10 -mt-2 dark:invert-0 invert" alt="Logo Ministerios Ebenezer" />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Asistencias Ebenezer
            </span>
          </a>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-neutral-500 rounded-lg md:hidden hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:ring-neutral-600"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Abrir menú</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div className="hidden w-1/2 sm:flex sm:justify-end" id="navbar-default">
            <div className="flex w-[90vw] sm:w-full justify-center">
              <ul className="font-medium flex flex-col gap-3 p-2 bg-white sm:flex-row dark:bg-neutral-800">
                <li className="flex justify-end text-black dark:text-white items-center">
                  <a
                    href=""
                    className="bg-blue-500 text-white dark:bg-blue-800 w-[150px] px-4 py-[5px] flex justify-center rounded-md border-[1px] border-blue-300 dark:border-blue-700"
                  >
                    Iniciar Sesión
                  </a>
                </li>
                <li className="flex justify-end text-black dark:text-white items-center">
                  <a
                    href=""
                    className="bg-green-500 text-white dark:bg-green-700 w-[150px] px-4 py-[5px] flex justify-center rounded-md border-[1px] border-green-300 dark:border-green-800"
                  >
                    Información
                  </a>
                </li>
                <li>
                  <span className="flex justify-end text-black dark:text-white">
                    <ThemeToggle />
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
