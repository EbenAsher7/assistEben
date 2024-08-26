import { useState, useContext, useCallback, useMemo, useEffect, useRef } from "react";
import { ThemeToggle } from "./ThemeToggle";
import LOGO from "/logoEbenezer.webp";
import { Link, useNavigate } from "react-router-dom";
import MainContext from "../context/MainContext";
import "flowbite";
import { memo } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const Navbar = memo(() => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const navbarRef = useRef(null);

  const navigate = useNavigate();

  const { isLogin, setIsLogin, setUser, user } = useContext(MainContext);

  const toggleNavbar = useCallback(() => {
    setIsNavbarOpen((prev) => !prev);
  }, []);

  const closeNavbar = useCallback(() => {
    setIsNavbarOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    navigate("/login");
    setIsLogin(false);
    setUser(null);
    setIsNavbarOpen(false);
  }, [setIsLogin, setUser, navigate]);

  const renderNavLinks = useMemo(
    () => (
      <ul className="font-medium flex flex-col gap-3 p-2 bg-white sm:flex-row dark:bg-neutral-800 sm:space-x-2">
        {isLogin && (
          <>
            {user.tipo === "Administrador" && (
              <li className="text-black dark:text-white flex justify-center items-center">
                <Link
                  to="/adminquestions"
                  className="bg-pink-500 text-white dark:bg-pink-700 w-full sm:w-auto px-4 py-2 flex justify-center rounded-md border-[1px] border-pink-300 dark:border-pink-800"
                  onClick={closeNavbar}
                >
                  Preguntas
                </Link>
                <Link
                  to="/admin"
                  className="bg-purple-500 text-white dark:bg-purple-700 w-full sm:w-auto px-4 py-2 flex justify-center rounded-md border-[1px] border-purple-300 dark:border-purple-800"
                  onClick={closeNavbar}
                >
                  Administración
                </Link>
              </li>
            )}
            <li className="text-black dark:text-white flex justify-center items-center">
              <Link
                to="/attendance"
                className="bg-green-500 text-white dark:bg-green-700 w-full sm:w-auto px-4 py-2 flex justify-center rounded-md border-[1px] border-green-300 dark:border-green-800"
                onClick={closeNavbar}
              >
                Control asistencias
              </Link>
            </li>
            <li className="text-black dark:text-white flex justify-center items-center">
              <Link
                to="/profile"
                className="bg-blue-500 text-white dark:bg-blue-700 w-full sm:w-auto px-10 py-2 flex justify-center rounded-md border-[1px] border-blue-300 dark:border-blue-800"
                onClick={closeNavbar}
              >
                Ajustes
              </Link>
            </li>
          </>
        )}
        <li className="text-black dark:text-white flex justify-center items-center">
          {isLogin ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="bg-red-500 text-white dark:bg-red-800 w-full sm:w-auto px-4 py-2 flex justify-center rounded-md border-[1px] border-red-300 dark:border-red-700"
                >
                  Cerrar Sesión
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="text-black dark:text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro de cerrar sesión?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción cerrará tu sesión y no podrás acceder nuevamente hasta iniciar sesión de nuevo.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-700"
                  >
                    Cerrar Sesión
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 text-white dark:bg-blue-800 w-full sm:w-auto px-4 py-2 flex justify-center rounded-md border-[1px] border-blue-300 dark:border-blue-700"
              onClick={closeNavbar}
            >
              Iniciar Sesión
            </Link>
          )}
        </li>
        <li>
          <span className="flex justify-center text-black dark:text-white">
            <ThemeToggle />
          </span>
        </li>
      </ul>
    ),
    [isLogin, handleLogout, closeNavbar]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsNavbarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white border-neutral-200 dark:bg-neutral-800 dark:border-neutral-500 fixed top-0 w-full z-50" ref={navbarRef}>
      <div className="w-full flex flex-wrap items-center justify-between p-2 sm:pl-4">
        <Link to="/" className="flex items-center gap-2" onClick={closeNavbar}>
          <img src={LOGO} className="h-10 dark:invert-0 invert" alt="Logo Ministerios Ebenezer" />
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
        <div className={`${isNavbarOpen ? "block" : "hidden"} w-full md:flex md:w-auto`} id="navbar-default">
          <div className="flex w-full sm:w-auto justify-center">{renderNavLinks}</div>
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
