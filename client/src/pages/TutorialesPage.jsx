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

      <div className="flex flex-col items-center justify-center my-4 bg-yellow-200 rounded-b-xl">
        <div className="text-center">
          <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 512 512">
            <path d="M503.58 126.2a16.85 16.85 0 0 0-27.07-4.55l-51.15 51.15a11.15 11.15 0 0 1-15.66 0l-22.48-22.48a11.17 11.17 0 0 1 0-15.67l50.88-50.89a16.85 16.85 0 0 0-5.27-27.4c-39.71-17-89.08-7.45-120 23.29-26.81 26.61-34.83 68-22 113.7a11 11 0 0 1-3.16 11.1L114.77 365.1a56.76 56.76 0 1 0 80.14 80.18L357 272.08a11 11 0 0 1 10.9-3.17c45 12 86 4 112.43-22 15.2-15 25.81-36.17 29.89-59.71 3.83-22.2 1.41-44.44-6.64-61z" />
            <path d="M437.33 378.41c-13.94-11.59-43.72-38.4-74.07-66.22l-66.07 70.61c28.24 30 53.8 57.85 65 70.88l.07.08A30 30 0 0 0 383.72 464h1.1a30.11 30.11 0 0 0 21-8.62l.07-.07 33.43-33.37a29.46 29.46 0 0 0-2-43.53zM118.54 214.55a20.48 20.48 0 0 0-3-10.76 2.76 2.76 0 0 1 2.62-4.22h.06c.84.09 5.33.74 11.7 4.61 4.73 2.87 18.23 12.08 41.73 35.54a34.23 34.23 0 0 0 7.22 22.12l66.23-61.55a33.73 33.73 0 0 0-21.6-9.2 2.65 2.65 0 0 1-.21-.26l-.65-.69-24.54-33.84a28.45 28.45 0 0 1-4-26.11 35.23 35.23 0 0 1 11.78-16.35c5.69-4.41 18.53-9.72 29.44-10.62a52.92 52.92 0 0 1 15.19.94 65.57 65.57 0 0 1 7.06 2.13 15.46 15.46 0 0 0 2.15.63 16 16 0 0 0 16.38-25.06c-.26-.35-1.32-1.79-2.89-3.73a91.85 91.85 0 0 0-9.6-10.36c-8.15-7.36-29.27-19.77-57-19.77a123.13 123.13 0 0 0-46.3 9c-38.37 15.45-63.47 36.58-75.01 47.79l-.09.09A222.14 222.14 0 0 0 63.7 129.5a27 27 0 0 0-4.7 11.77 7.33 7.33 0 0 1-7.71 6.17H50.2a20.65 20.65 0 0 0-14.59 5.9L6.16 182.05l-.32.32a20.89 20.89 0 0 0-.24 28.72c.19.2.37.39.57.58L53.67 258a21 21 0 0 0 14.65 6 20.65 20.65 0 0 0 14.59-5.9l29.46-28.79a20.51 20.51 0 0 0 6.17-14.76z" />
          </svg>

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
