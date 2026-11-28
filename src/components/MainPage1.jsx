import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useMemo, useState, useEffect } from "react";

const countryCoords = [
  { name: "India", lat: 20.5937, lon: 78.9629 },
  { name: "Bangladesh", lat: 23.6850, lon: 90.3563 },
  { name: "China", lat: 35.8617, lon: 104.1954 },
  { name: "Pakistan", lat: 30.3753, lon: 69.3451 },
  { name: "Indonesia", lat: -0.7893, lon: 113.9213 },
  { name: "Vietnam", lat: 14.0583, lon: 108.2772 },
  { name: "Thailand", lat: 15.8700, lon: 100.9925 },
  { name: "Japan", lat: 36.2048, lon: 138.2529 },
  { name: "Germany", lat: 51.1657, lon: 10.4515 },
  { name: "France", lat: 46.2276, lon: 2.2137 },
  { name: "USA", lat: 37.0902, lon: -95.7129 },
  { name: "Australia", lat: -25.2744, lon: 133.7751 },
  { name: "Canada", lat: 56.1304, lon: -106.3468 },
  { name: "UK", lat: 55.3781, lon: -3.4360 }
];

function MainPage1() {
  const [countries, setCountries] = useState([]);
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  useEffect(() => {
  const fetchPM25 = async () => {
    const results = await Promise.all(
      countryCoords.map(async (country) => {
        try {
          const res = await fetch(
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${country.lat}&longitude=${country.lon}&current=pm2_5`
          );

          const data = await res.json();

          return {
            name: country.name,
            pm25: Math.round(data.current?.pm2_5 || 0),
            time: data.current?.time
          };

        } catch (err) {
          return { name: country.name, pm25: 0, time : null };
        }
      })
    );

    setCountries(results);
  };

  fetchPM25();
}, []);

  
  const xLeft = useTransform(scrollYProgress, [0, 0.5], ["0%", "-120%"]);
  const xRight = useTransform(scrollYProgress, [0, 0.5], ["0%", "120%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);


const getColor = (value) => {
  if (value <= 12) return "bg-green-500";
  if (value <= 35) return "bg-yellow-500";
  if (value <= 55) return "bg-orange-500";
  if (value <= 150) return "bg-red-500";
  if (value <= 250) return "bg-purple-500";
  return "bg-red-900"; // dark red equivalent
};
  // Generate stars once
  const stars = useMemo(() => {
    return Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animationDelay: Math.random() * 5
    }));
  }, []);

  const lastUpdated = countries.length ? countries[0].time : null;
  const formattedTime = lastUpdated
  ? new Date(lastUpdated).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })
  : null;
  return (
    <section id="home" ref={ref} className="relative min-h-[100svh] overflow-hidden bg-black">

      <div className="relative flex min-h-[100svh] items-center justify-center text-white px-4 sm:px-6 py-10 sm:py-12">

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

        {/* Content Grid */}
        <div className="relative z-10 max-w-5xl w-full flex flex-col gap-8 sm:gap-12 lg:gap-16 items-center text-center">

          {/* HERO SECTION */}
          <div>

            <div className="flex justify-center bitcount-prop-double-dots text-5xl leading-none sm:text-7xl lg:text-8xl mb-4 sm:mb-6">
              <motion.span style={{  opacity }}>
                The Air We Breathe
              </motion.span>
{/* 
              <motion.span style={{ x: xRight, opacity }} className="ml-4">
                We Breathe
              </motion.span> */}
            </div>

            <motion.p
              style={{ opacity }}
              className="mx-auto max-w-xl text-sm leading-relaxed sm:text-lg lg:text-xl bitcount-prop-double-normal text-white/80 mt-4 mb-5 sm:mb-8"
            >
              Air pollution is invisible but affects billions of people.
              Explore real-world sensor readings and discover how air
              quality differs across the planet.
            </motion.p>

            <motion.div style={{ opacity }} className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <a
                href="#map"
                className="px-5 py-3 bg-white border border-white text-black bitcount-prop-double-dots rounded-lg hover:bg-black hover:text-white transition"
              >
                Explore the Globe
              </a>

              <a
                href="#about"
                className="px-5 py-3 border border-white bitcount-prop-double-dots rounded-lg hover:bg-white hover:text-black transition"
              >
                Why This Exists
              </a>
            </motion.div>

          </div>

          {/* COUNTRY COMPARISON */}
          <motion.div style={{ opacity }} className="relative w-full">

            {/* LIVE INDICATOR */}
            {formattedTime && (
              <div className="mb-2 flex justify-center sm:justify-end items-center gap-2 text-[10px] sm:text-xs text-gray-400">

                <span className="flex items-center gap-1 bitcount-prop-double-dots  text-green-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Live
                </span>

                <span className="bitcount-prop-double-dots">Updated {formattedTime} UTC</span>

              </div>
            )}

            {/* GRAPH */}
            <div className="w-full overflow-x-auto pb-2">
              <div className="flex items-end bitcount-prop-double-dots justify-start sm:justify-center gap-2 sm:gap-6 lg:gap-10 h-36 sm:h-52 lg:h-64 min-w-[520px] sm:min-w-0 px-2">

              {countries.map((country, index) => {
                const maxPM = Math.max(...countries.map(c => c.pm25))
                const height = (country.pm25 / maxPM) * 120

                return (
                  <div key={index} className="flex flex-col items-center">

                    <span className="text-sm mb-2 text-gray-300">
                      {country.pm25}
                    </span>

                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height }}
                      transition={{ duration: 0.8 }}
                      className={`w-10 rounded-t-md ${getColor(country.pm25)}`}
                    />

                    <span className="text-xs mt-2 text-gray-400">
                      {country.name}
                    </span>

                  </div>
                )
              })}

              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default MainPage1;