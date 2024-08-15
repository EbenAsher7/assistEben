import React from "react";

export const TabSelector = ({ isActive, children, onClick }) => (
  <button
    className={`
      mr-4 group inline-flex items-center px-4 py-2 font-medium text-sm leading-5 cursor-pointer whitespace-nowrap transition-all duration-200 ease-in-out rounded-t-md
      ${
        isActive
          ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-md hover:from-orange-500 hover:to-orange-700 dark:from-orange-500 dark:to-orange-700 dark:hover:from-orange-600 dark:hover:to-orange-800"
          : "bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-orange-300 dark:focus:bg-gray-700 dark:focus:text-orange-300"
      }
    `}
    onClick={onClick}
  >
    {children}
  </button>
);
