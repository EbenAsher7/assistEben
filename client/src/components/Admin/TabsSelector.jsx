import PropTypes from "prop-types";

export const TabSelector = ({ isActive, children, onClick, color = "orange" }) => {
  const colorClasses = {
    orange: {
      gradient:
        "from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 dark:from-orange-500 dark:to-orange-700 dark:hover:from-orange-600 dark:hover:to-orange-800",
      hoverText: "hover:text-orange-700 dark:hover:text-orange-300",
    },
    purple: {
      gradient:
        "from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 dark:from-purple-500 dark:to-purple-700 dark:hover:from-purple-600 dark:hover:to-purple-800",
      hoverText: "hover:text-purple-700 dark:hover:text-purple-300",
    },
    indigo: {
      gradient:
        "from-indigo-400 to-indigo-600 hover:from-indigo-500 hover:to-indigo-700 dark:from-indigo-500 dark:to-indigo-700 dark:hover:from-indigo-600 dark:hover:to-indigo-800",
      hoverText: "hover:text-indigo-700 dark:hover:text-indigo-300",
    },
    green: {
      gradient:
        "from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 dark:from-green-500 dark:to-green-700 dark:hover:from-green-600 dark:hover:to-green-800",
      hoverText: "hover:text-green-700 dark:hover:text-green-300",
    },
    blue: {
      gradient:
        "from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 dark:from-blue-500 dark:to-blue-700 dark:hover:from-blue-600 dark:hover:to-blue-800",
      hoverText: "hover:text-blue-700 dark:hover:text-blue-300",
    },
    red: {
      gradient:
        "from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 dark:from-red-500 dark:to-red-700 dark:hover:from-red-600 dark:hover:to-red-800",
      hoverText: "hover:text-red-700 dark:hover:text-red-300",
    },
    lime: {
      gradient:
        "from-lime-400 to-lime-600 hover:from-lime-500 hover:to-lime-700 dark:from-lime-500 dark:to-lime-700 dark:hover:from-lime-600 dark:hover:to-lime-800",
      hoverText: "hover:text-lime-700 dark:hover:text-lime-300",
    },
    violet: {
      gradient:
        "from-violet-400 to-violet-600 hover:from-violet-500 hover:to-violet-700 dark:from-violet-500 dark:to-violet-700 dark:hover:from-violet-600 dark:hover:to-violet-800",
      hoverText: "hover:text-violet-700 dark:hover:text-violet-300",
    },
    yellow: {
      gradient:
        "from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 dark:from-yellow-500 dark:to-yellow-700 dark:hover:from-yellow-600 dark:hover:to-yellow-800",
      hoverText: "hover:text-yellow-700 dark:hover:text-yellow-300",
    },
  };

  const { gradient, hoverText } = colorClasses[color] || colorClasses.orange;

  return (
    <button
      className={`
        mr-4 group inline-flex items-center px-4 py-2 font-medium text-sm leading-5 cursor-pointer whitespace-nowrap transition-all duration-200 ease-in-out rounded-t-md
        ${
          isActive
            ? `bg-gradient-to-r ${gradient} text-white shadow-md`
            : `bg-white text-gray-600 hover:bg-gray-50 ${hoverText} dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700 dark:focus:text-gray-300`
        }
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

TabSelector.propTypes = {
  isActive: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  color: PropTypes.oneOf(["orange", "purple", "indigo", "green", "blue", "red", "lime", "violet", "yellow"]),
};
