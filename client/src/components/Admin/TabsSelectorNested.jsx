import React from "react";

export const TabSelectorNested = ({ isActive, children, onClick }) => (
  <button
    className={`
      mr-4 group inline-flex items-center px-4 py-2 font-medium text-sm leading-5 cursor-pointer whitespace-nowrap transition-all duration-200 ease-in-out rounded-t-md
      ${
        isActive
          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:from-indigo-600 hover:to-purple-700 dark:from-indigo-400 dark:to-purple-500 dark:hover:from-indigo-500 dark:hover:to-purple-600"
          : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:text-white"
      }
    `}
    onClick={onClick}
  >
    {children}
  </button>
);
