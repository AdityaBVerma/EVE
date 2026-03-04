import { useMemo } from "react";
import { Coffee, Github } from "lucide-react";

function MainPage3() {

  const stars = useMemo(() => {
    return Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animationDelay: Math.random() * 1,
    }));
  }, []);

  return (
    <section id="about" className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden px-6">

      {/* Stars */}
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            width: star.size,
            height: star.size,
            top: `${star.top}%`,
            left: `${star.left}%`,
            animation: `spaceStar ${4 + Math.random() * 1}s ease-in-out infinite`,
            animationDelay: `${star.animationDelay}s`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-3xl text-center space-y-6">

        <h2 className="text-4xl bitcount-prop-double-dots font-bold">
          Why I Built This
        </h2>

        <p className="text-lg text-gray-300 bitcount-prop-double-normal leading-relaxed">
          A month ago I was having a conversation with a friend about the air
          quality in a European city. When I looked at the numbers, I was
          surprised by how different they were from what we see every day where
          I live.
        </p>

        <p className="text-lg text-gray-300 bitcount-prop-double-normal leading-relaxed">
          It made me realize something strange — I had never questioned the air
          quality around me because I was used to seeing those numbers. What I
          thought was “normal” was actually far from it.
        </p>

        <p className="text-lg text-gray-300 bitcount-prop-double-normal leading-relaxed">
          That realization inspired me to build this small project. Using
          global sensor data from OpenAQ and visualizing it on a 3D globe with
          Cesium, the goal is simple: to make it easier to see how the air we
          breathe differs around the world.
        </p>

        <p className="text-lg text-gray-300 bitcount-prop-double-normal leading-relaxed">
          Right now the visualization focuses on PM2.5 — one of the most
          harmful pollutants contributing to poor air quality. Each point on
          the globe represents real sensor readings from different locations.
        </p>

        {/* Support buttons */}
        <div className="mt-8 flex flex-col items-center gap-4">

          <a
            href="https://www.buymeachai.in/adityabverma2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 bitcount-prop-double-dots text-black rounded-lg font-semibold hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/30"
          >
            <Coffee size={18} strokeWidth={2} />
            <span>Buy Me a Chai</span>
          </a>

          <a
            href="https://github.com/AdityaBVerma/WALL.E"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white bitcount-prop-double-dots rounded-lg hover:bg-white hover:text-black transition"
          >
            <Github size={18} strokeWidth={2} />
            <span>View on GitHub</span>
          </a>

        </div>

      </div>

    </section>
  );
}

export default MainPage3;