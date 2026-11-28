
import { useState, useEffect } from "react";
import CesiumViewer from "./CesiumViewer";

function MainPage2() {
  const [aoiData, setAoiData] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedAOI, setSelectedAOI] = useState("pm25");
  const [loading, setLoading] = useState(false);

  const API = "https://walle-api.orangeglacier-c20ac5b0.canadacentral.azurecontainerapps.io/";

  async function loadAOI(path) {
    if (path === "#") path = "pm25";

    try {
      setLoading(true);

      const res = await fetch(`${API}/${path}`);
      console.log("API URL:", API);
console.log("Request URL:", `${API}/${path}`);
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();

      setAoiData(data);
      setSelectedAOI(path);

    } catch (err) {
      console.error("Failed to load AOI:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAOI("pm25");
  }, []);

  const aois = [
    { id: 1, name: "Last seen PM2.5", path: "pm25" },
    { id: 2, name: "...Coming Soon", path: "#" },
  ];

  return (
    <div id="map" className="relative flex h-screen overflow-hidden lg:static">

      {/* Sidebar */}
      <aside
        className={`absolute inset-y-0 left-0 z-40 h-full bg-black/95 text-white transition-all duration-300 lg:relative lg:h-screen lg:bg-black
        ${open ? "w-64" : "w-10 flex flex-col items-center"}`}
      >
        <button
          onClick={() => setOpen(!open)}
          className={`p-4 font-bold w-full transition
            ${open
              ? "text-left hover:bg-white hover:text-black bitcount-prop-double-dots text-4xl"
              : "bg-white text-black rounded-sm mt-4 w-8 h-8 flex items-center justify-center"
            }`}
        >
          {open ? "Menu" : "☰"}
        </button>

        {open && (
          <nav className="flex flex-col gap-2 p-4">
            {aois.map((aoi) => (
              <button
                key={aoi.id}
                onClick={() => loadAOI(aoi.path)}
                className={`text-left bitcount-prop-double-dots p-2 rounded transition
                  ${
                    selectedAOI === aoi.path
                      ? "bg-white text-black"
                      : "hover:bg-gray-700"
                  }`}
              >
                {aoi.name}
              </button>
            ))}
          </nav>
        )}
      </aside>

      {/* Cesium Viewer */}
      <div className="flex-1">
        {loading ? (
          <div className="h-screen flex items-center justify-center text-white bg-black">
            Loading air quality data...
          </div>
        ) : aoiData ? (
          <CesiumViewer aoiData={aoiData} />
        ) : (
          <div className="h-screen flex items-center justify-center text-white bg-black">
            Unable to load air quality data.
          </div>
        )}
      </div>

    </div>
  );
}

export default MainPage2;
