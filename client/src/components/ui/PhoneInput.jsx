import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { prefijos } from "@/context/prefijos";

const PhoneInput = ({ onPrefixChange, onPhoneChange, defaultPrefix = "", defaultPhone = "" }) => {
  const [prefix, setPrefix] = useState(defaultPrefix);
  const [phone, setPhone] = useState(defaultPhone);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef(null);

  const prefijosFormateados = prefijos[0]
    ? Object.entries(prefijos[0])
        .map(([label, value]) => ({ value, label: `${label} (${value})` }))
        .sort((a, b) => a.label.localeCompare(b.label))
    : [];

  const filteredPrefixes = prefijosFormateados.filter((p) => p.label.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    onPrefixChange(prefix);
  }, [prefix, onPrefixChange]);

  useEffect(() => {
    onPhoneChange(phone);
  }, [phone, onPhoneChange]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelectPrefix = (newPrefix) => {
    setPrefix(newPrefix);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="flex items-center w-full rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 focus-within:ring-2 focus-within:ring-neutral-950 dark:focus-within:ring-neutral-300">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex-shrink-0 w-1/4 h-10 px-2 text-sm text-left bg-neutral-100 dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 rounded-l-md truncate"
        >
          {prefix || "Prefijo"}
        </button>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Número"
          className="w-3/4 h-10 px-3 py-2 text-sm bg-transparent border-none outline-none"
          autoComplete="off"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-neutral-800 border rounded-md shadow-lg z-20">
          <input
            type="search"
            placeholder="Buscar país..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border-b dark:bg-neutral-700 dark:border-neutral-600 outline-none"
          />
          <ul className="max-h-60 overflow-y-auto">
            {filteredPrefixes.length > 0 ? (
              filteredPrefixes.map((p) => (
                <li
                  key={p.value}
                  onClick={() => handleSelectPrefix(p.value)}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                >
                  {p.label}
                </li>
              ))
            ) : (
              <li className="p-2 text-center text-gray-500">No se encontraron resultados</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

PhoneInput.propTypes = {
  onPrefixChange: PropTypes.func.isRequired,
  onPhoneChange: PropTypes.func.isRequired,
  defaultPrefix: PropTypes.string,
  defaultPhone: PropTypes.string,
};

export default PhoneInput;
