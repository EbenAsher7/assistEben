import { useState, useContext, useCallback, useMemo } from "react";
import { ThemeToggle } from "./ThemeToggle";
import LOGO from "/logoEbenezer.webp";
import { Link } from "react-router-dom";
import MainContext from "../context/MainContext";
import "flowbite";
import { memo } from "react";

const Navbar = memo(() => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const { isLogin, setIsLogin, setUser } = useContext(MainContext);

  const toggleNavbar = useCallback(() => {
    setIsNavbarOpen((prev) => !prev);
  }, []);

  const closeNavbar = useCallback(() => {
    setIsNavbarOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLogin(false);
    setUser({});
    setIsNavbarOpen(false);
  }, [setIsLogin, setUser]);

  const renderNavLinks = useMemo(
    () => (
      <ul className="font-medium flex flex-col gap-3 p-2 bg-white sm:flex-row dark:bg-neutral-800">
        <li className="flex justify-end text-black dark:text-white items-center">
          {isLogin ? (
            <Link
              to="/login"
              className="bg-red-500 text-white dark:bg-red-800 w-[150px] px-4 py-[5px] flex justify-center rounded-md border-[1px] border-red-300 dark:border-red-700"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 text-white dark:bg-blue-800 w-[150px] px-4 py-[5px] flex justify-center rounded-md border-[1px] border-blue-300 dark:border-blue-700"
              onClick={closeNavbar}
            >
              Iniciar Sesión
            </Link>
          )}
        </li>
        {isLogin && (
          <>
            <li className="flex justify-end text-black dark:text-white items-center">
              <Link
                to="/attendance"
                className="bg-green-500 text-white dark:bg-green-700 w-[150px] px-4 py-[5px] flex justify-center rounded-md border-[1px] border-green-300 dark:border-green-800"
                onClick={closeNavbar}
              >
                Perfil
              </Link>
            </li>
            <li className="flex justify-end text-black dark:text-white items-center">
              <Link
                to="/profile"
                className="bg-blue-500 text-white dark:bg-blue-700 w-[150px] px-4 py-[5px] flex justify-center rounded-md border-[1px] border-blue-300 dark:border-blue-800"
                onClick={closeNavbar}
              >
                Ajustes
              </Link>
            </li>
          </>
        )}
        <li>
          <span className="flex justify-end text-black dark:text-white">
            <ThemeToggle />
          </span>
        </li>
      </ul>
    ),
    [isLogin, handleLogout, closeNavbar]
  );

  return (
    <nav className="bg-white border-neutral-200 dark:bg-neutral-800 dark:border-neutral-500 fixed top-0 w-full z-50">
      <div className="w-full flex flex-wrap items-center justify-between p-2 sm:pl-4">
        <Link to="/" className="flex items-center gap-2" onClick={closeNavbar}>
          <img src={LOGO} className="size-10 -mt-2 dark:invert-0 invert" alt="Logo Ministerios Ebenezer" />
          <span className="self-center text-md sm:text-xl font-semibold whitespace-nowrap dark:text-white">Ministerios Ebenezer</span>
        </Link>
        <button
          onClick={toggleNavbar}
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-neutral-500 rounded-lg md:hidden hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:ring-neutral-600"
          aria-controls="navbar-default"
          aria-expanded={isNavbarOpen}
        >
          <span className="sr-only">Abrir menú</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        <div className={`${isNavbarOpen ? "block" : "hidden"} w-1/2 sm:flex sm:justify-end`} id="navbar-default">
          <div className="flex w-[90vw] sm:w-full justify-center">{renderNavLinks}</div>
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
