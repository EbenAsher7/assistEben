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
