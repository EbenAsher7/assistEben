// Sistema de control de límite de registros por navegador
// No requiere base de datos, todo se maneja en localStorage

const STORAGE_KEY = "registration_control";
const MAX_REGISTRATIONS = 3;
const RESET_DAYS = 30; // Días para resetear el contador

/**
 * Genera un fingerprint único del navegador
 * Basado en características del navegador que son difíciles de cambiar
 */
const generateBrowserFingerprint = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "top";
  ctx.font = "14px 'Arial'";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#f60";
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = "#069";
  ctx.fillText("AssistEben", 2, 15);

  const canvasData = canvas.toDataURL();

  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas: canvasData.substring(0, 50), // Solo una porción para reducir tamaño
  };

  // Crear un hash simple del fingerprint
  return btoa(JSON.stringify(fingerprint)).substring(0, 32);
};

/**
 * Obtiene los datos de control de registros
 */
const getRegistrationData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer datos de registro:", error);
    return null;
  }
};

/**
 * Guarda los datos de control de registros
 */
const saveRegistrationData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error al guardar datos de registro:", error);
  }
};

/**
 * Verifica si el periodo de reseteo ha expirado
 */
const isResetPeriodExpired = (lastRegistrationDate) => {
  const resetDate = new Date(lastRegistrationDate);
  resetDate.setDate(resetDate.getDate() + RESET_DAYS);
  return new Date() > resetDate;
};

/**
 * Verifica si el usuario puede registrarse
 * @returns {Object} { canRegister: boolean, remainingRegistrations: number, message: string }
 */
export const checkRegistrationLimit = () => {
  const fingerprint = generateBrowserFingerprint();
  const data = getRegistrationData();

  // Si no hay datos, es la primera vez
  if (!data) {
    return {
      canRegister: true,
      remainingRegistrations: MAX_REGISTRATIONS,
      message: "",
    };
  }

  // Verificar si el periodo de reseteo ha expirado
  if (isResetPeriodExpired(data.lastRegistrationDate)) {
    // Resetear el contador
    return {
      canRegister: true,
      remainingRegistrations: MAX_REGISTRATIONS,
      message: "",
    };
  }

  // Verificar si el fingerprint coincide
  if (data.fingerprint === fingerprint) {
    const remaining = MAX_REGISTRATIONS - data.count;

    if (remaining <= 0) {
      return {
        canRegister: false,
        remainingRegistrations: 0,
        message: `Has alcanzado el límite de ${MAX_REGISTRATIONS} registros. El contador se reiniciará el ${new Date(data.lastRegistrationDate).toLocaleDateString()}.`,
      };
    }

    return {
      canRegister: true,
      remainingRegistrations: remaining,
      message: remaining === 1 ? "Esta es tu última oportunidad de registro." : "",
    };
  }

  // Si el fingerprint no coincide, podría ser otro dispositivo/navegador
  // Aún así, verificamos el contador como medida adicional
  const remaining = MAX_REGISTRATIONS - data.count;

  return {
    canRegister: remaining > 0,
    remainingRegistrations: remaining,
    message: "",
  };
};

/**
 * Incrementa el contador de registros
 */
export const incrementRegistrationCount = () => {
  const fingerprint = generateBrowserFingerprint();
  const data = getRegistrationData();

  if (!data) {
    // Primera inscripción
    saveRegistrationData({
      fingerprint,
      count: 1,
      lastRegistrationDate: new Date().toISOString(),
      firstRegistrationDate: new Date().toISOString(),
    });
    return;
  }

  // Si el periodo de reseteo ha expirado, reiniciar
  if (isResetPeriodExpired(data.lastRegistrationDate)) {
    saveRegistrationData({
      fingerprint,
      count: 1,
      lastRegistrationDate: new Date().toISOString(),
      firstRegistrationDate: new Date().toISOString(),
    });
    return;
  }

  // Incrementar el contador
  saveRegistrationData({
    ...data,
    fingerprint, // Actualizar fingerprint por si cambió
    count: data.count + 1,
    lastRegistrationDate: new Date().toISOString(),
  });
};

/**
 * Resetea el contador (solo para administradores en caso de emergencia)
 * Esta función no se exporta por defecto, pero puede ser útil
 */
export const resetRegistrationLimit = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log("Límite de registros reseteado");
  } catch (error) {
    console.error("Error al resetear límite:", error);
  }
};
