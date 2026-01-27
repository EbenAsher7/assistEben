import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Search, BookOpen, Languages } from "lucide-react";

const Glossary = () => {
  const [searchNumber, setSearchNumber] = useState("");
  const [language, setLanguage] = useState("greek"); // 'greek' o 'hebrew'
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const handleSearch = useCallback(async () => {
    if (!searchNumber.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor ingresa un número Strong para buscar",
        duration: 2500,
      });
      return;
    }

    // Validar que sea un número
    const cleanNumber = searchNumber.trim().replace(/^[GHgh]/, "");
    if (!/^\d+$/.test(cleanNumber)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El número Strong debe ser un valor numérico",
        duration: 2500,
      });
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const prefix = language === "greek" ? "G" : "H";
      const strongNumber = `${prefix}${cleanNumber}`;

      // API pública de Strong's Concordance
      const response = await fetch(
        `https://api.getbible.net/v2/strongs/${strongNumber}.json`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError(`No se encontró el término Strong ${strongNumber}`);
        } else {
          throw new Error("Error al consultar la API");
        }
        return;
      }

      const data = await response.json();
      setResult({
        number: strongNumber,
        language: language === "greek" ? "Griego" : "Hebreo",
        ...data,
      });
    } catch (err) {
      console.error("Error fetching Strong data:", err);
      setError("Ocurrió un error al buscar. Intenta nuevamente.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo conectar con el servicio. Intenta más tarde.",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [searchNumber, language, toast]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Glosario Strong
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Consulta palabras en griego y hebreo utilizando los números de la Concordancia Strong
          </p>
        </div>

        {/* Search Card */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Search className="w-5 h-5" />
              Buscar Término
            </CardTitle>
            <CardDescription>
              Ingresa el número Strong y selecciona el idioma para consultar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language Selector */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Selecciona el idioma</Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setLanguage("greek")}
                  className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    language === "greek"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <Languages className="w-5 h-5" />
                  <span className="font-medium">Griego (G)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("hebrew")}
                  className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    language === "hebrew"
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <Languages className="w-5 h-5" />
                  <span className="font-medium">Hebreo (H)</span>
                </button>
              </div>
            </div>

            {/* Number Input */}
            <div className="space-y-2">
              <Label htmlFor="strongNumber" className="text-base font-medium">
                Número Strong
              </Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold">
                    {language === "greek" ? "G" : "H"}
                  </span>
                  <Input
                    id="strongNumber"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Ej: 26, 430, 2316..."
                    value={searchNumber}
                    onChange={(e) => setSearchNumber(e.target.value.replace(/[^0-9]/g, ""))}
                    onKeyDown={handleKeyPress}
                    className="pl-10 text-lg h-12"
                    maxLength={5}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={loading || !searchNumber.trim()}
                  className="h-12 px-8 text-base"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Buscando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Buscar
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Examples */}
            <div className="pt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Ejemplos populares:
              </p>
              <div className="flex flex-wrap gap-2">
                {language === "greek" ? (
                  <>
                    <button
                      onClick={() => setSearchNumber("26")}
                      className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                    >
                      G26 - Agape (Amor)
                    </button>
                    <button
                      onClick={() => setSearchNumber("2316")}
                      className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                    >
                      G2316 - Theos (Dios)
                    </button>
                    <button
                      onClick={() => setSearchNumber("4102")}
                      className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                    >
                      G4102 - Pistis (Fe)
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setSearchNumber("430")}
                      className="px-3 py-1 text-sm bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors"
                    >
                      H430 - Elohim (Dios)
                    </button>
                    <button
                      onClick={() => setSearchNumber("3068")}
                      className="px-3 py-1 text-sm bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors"
                    >
                      H3068 - YHWH (Jehová)
                    </button>
                    <button
                      onClick={() => setSearchNumber("7965")}
                      className="px-3 py-1 text-sm bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors"
                    >
                      H7965 - Shalom (Paz)
                    </button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <CardContent className="py-4">
              <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Result Card */}
        {result && (
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="text-2xl sm:text-3xl">
                  <span
                    className={
                      result.language === "Griego"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-amber-600 dark:text-amber-400"
                    }
                  >
                    {result.number}
                  </span>
                </CardTitle>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${
                    result.language === "Griego"
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                      : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {result.language}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Original Word */}
              {result.original && (
                <div className="space-y-1">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Palabra Original</Label>
                  <p className="text-3xl sm:text-4xl font-serif">{result.original}</p>
                </div>
              )}

              {/* Transliteration */}
              {result.translit && (
                <div className="space-y-1">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Transliteración</Label>
                  <p className="text-xl italic">{result.translit}</p>
                </div>
              )}

              {/* Pronunciation */}
              {result.pronounce && (
                <div className="space-y-1">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Pronunciación</Label>
                  <p className="text-lg text-gray-700 dark:text-gray-300">{result.pronounce}</p>
                </div>
              )}

              {/* Definition */}
              {result.definition && (
                <div className="space-y-1">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Definición</Label>
                  <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    {result.definition}
                  </p>
                </div>
              )}

              {/* Etymology / Derivation */}
              {result.derivation && (
                <div className="space-y-1">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Derivación / Etimología</Label>
                  <p className="text-base text-gray-700 dark:text-gray-300">{result.derivation}</p>
                </div>
              )}

              {/* Part of Speech */}
              {result.part_of_speech && (
                <div className="space-y-1">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Categoría Gramatical</Label>
                  <p className="text-base text-gray-700 dark:text-gray-300">{result.part_of_speech}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Initial State - No Search Yet */}
        {!result && !error && !loading && (
          <Card className="bg-gray-50 dark:bg-gray-800/50 border-dashed">
            <CardContent className="py-12">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">
                  Ingresa un número Strong para comenzar
                </p>
                <p className="text-sm">
                  Los resultados de tu búsqueda aparecerán aquí
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Los números Strong son un sistema de indexación que permite estudiar las palabras
            originales de la Biblia en griego (Nuevo Testamento) y hebreo (Antiguo Testamento).
          </p>
        </div>
      </div>
    </div>
  );
};

export default Glossary;
