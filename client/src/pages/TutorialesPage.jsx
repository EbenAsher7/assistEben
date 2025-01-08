import "@justinribeiro/lite-youtube";

const TutorialesPage = () => {
  const videos = [
    {
      id: "1",
      videoId: "WeLu5PsrR0A",
      fallbackUrl: "https://www.youtube.com/watch?v=WeLu5PsrR0A",
      title: "Arrebatados",
      description: "Mensaje del pastor sobre el tema de los arrebatados",
    },
    {
      id: "2",
      videoId: "tf_iXtHLRMk",
      fallbackUrl: "https://www.youtube.com/watch?v=tf_iXtHLRMk",
      title: "Las Águilas",
      description: "Mensaje del pastor sobre el tema de las águilas",
    },
    {
      id: "3",
      videoId: "9e-W2K9DS8o",
      fallbackUrl: "https://www.youtube.com/watch?v=9e-W2K9DS8o",
      title: "Nuestro Rescate",
      description: "Mensaje del pastor sobre el tema de nuestro rescate",
    },
  ];

  return (
    <div className="container mx-auto px-4 pb-8">
      <h1 className="text-3xl text-center font-bold mb-4">Tutoriales</h1>

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          {/* Ícono SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-600 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4H9m4 0h2m-6-4h6m5 4a9 9 0 11-6.32-8.47M12 3v3m6 6h3" />
          </svg>

          {/* Mensaje principal */}
          <h1 className="text-3xl font-bold text-gray-700">En mantenimiento</h1>
          <p className="text-gray-600 mt-2">Estamos trabajando en el sitio. Los videos se están agregando.</p>
          <p className="text-gray-600 mt-2">Mientras tanto, aquí tienes algunos videos de prueba:</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="relative">
            <h2 className="font-bold mt-4">{video.title}</h2>
            <p>{video.description}</p>
            <lite-youtube
              videoid={video.videoId}
              videotitle={video.title}
              posterquality={video.posterQuality || "hqdefault"}
              autoload={video.autoload ? true : undefined}
              params={video.params || ""}
              short={video.short ? true : undefined}
              style={{
                "--lite-youtube-aspect-ratio": video.aspectRatio || "16 / 9",
              }}
            >
              {video.fallbackUrl && (
                <a href={video.fallbackUrl} target="_blank" rel="noopener noreferrer" className="block p-2 text-center">
                  Ver en YouTube: {video.title}
                </a>
              )}
            </lite-youtube>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutorialesPage;
