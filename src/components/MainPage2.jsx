import { useState , useEffect} from "react";
import CesiumViewer from "./CesiumViewer";

function MainPage2() {
  const [aoiData, setAoiData] = useState(null);
  const [open, setOpen] = useState(true);
  const [selectedAOI, setSelectedAOI] = useState("pm25");
  const API = import.meta.env.VITE_API_URL;

  async function loadAOI(path) {
    try {
      const res = await fetch(`${API}/${path}`);
      const data = await res.json();
      setAoiData(data);
      setSelectedAOI(path);
    } catch (err) {
      console.error("Failed to load AOI", err);
    }
  }
  useEffect(() => {
    loadAOI("pm25");
  }, []);

  const aois = [
    { id: 1, name: "  Today PM2.5", path:"pm25" },
    { id: 2, name: "  ...Coming Soon", path:"#" },
  ];

  return (
    <div id="map" className="flex">

      {/* Sidebar */}
      <aside
        className={`bg-black text-white transition-all duration-300
        ${open ? "w-64" : "w-10 flex flex-col items-center"}`}
      >
        {/* Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className={`p-4 font-bold w-full transition
            ${open
              ? " text-left hover:bg-white hover:text-black bitcount-prop-double-dots text-4xl"
              : "bg-white text-black rounded-sm mt-4 w-8 h-8 flex items-center justify-center"
            }`}
        >
          {open ? 'Menu': "☰"}
        </button>

        {/* AOI list (only when open) */}
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
        {aoiData ? (
          <CesiumViewer aoiData={aoiData} />
        ) : (
          <div className="h-screen flex items-center justify-center text-white bg-black">
            Loading air quality data...
          </div>
        )}
      </div>

    </div>
  );
}

export default MainPage2;