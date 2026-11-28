import React from "react";
import { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

function getColorBySeverity(value) {
  if (value <= 12) return Cesium.Color.GREEN;
  if (value <= 35) return Cesium.Color.YELLOW;
  if (value <= 55) return Cesium.Color.ORANGE;
  if (value <= 150) return Cesium.Color.RED;
  if (value <= 250) return Cesium.Color.PURPLE;
  return Cesium.Color.DARKRED;
}

function CesiumViewer({ aoiData }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [locationReady, setLocationReady] = useState(false);

  // --------------------------------------------------
  // CREATE VIEWER
  // --------------------------------------------------
  useEffect(() => {
    const imageryModels = Cesium.createDefaultImageryProviderViewModels();
    const defaultImagery = imageryModels.find(
      (layer) => layer.name === "OpenStreetMap"
    );

    viewerRef.current = new Cesium.Viewer(containerRef.current, {
      imageryProviderViewModels: imageryModels,
      selectedImageryProviderViewModel: defaultImagery,

      terrainProvider: new Cesium.EllipsoidTerrainProvider(),

      timeline: false,
      animation: false,
      geocoder: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity
    });

    const viewer = viewerRef.current;
    let isMounted = true;

    viewer.scene.globe.depthTestAgainstTerrain = false;
    viewer.scene.globe.enableLighting = false;

    // --------------------------------------------------
    // ADD PM2.5 RECTANGLES
    // --------------------------------------------------
    (aoiData || [])
      .filter(item =>
        item.coordinates?.latitude != null &&
        item.coordinates?.longitude != null &&
        item.coordinates.latitude >= -90 &&
        item.coordinates.latitude <= 90 &&
        item.coordinates.longitude >= -180 &&
        item.coordinates.longitude <= 180
      )
      .forEach(item => {
        const value = Number(item.value) || 0;
        const lon = item.coordinates.longitude;
        const lat = item.coordinates.latitude;
        const offset = 0.05;

        viewer.entities.add({
          rectangle: {
            coordinates: Cesium.Rectangle.fromDegrees(
              lon - offset,
              lat - offset,
              lon + offset,
              lat + offset
            ),
            material: getColorBySeverity(value).withAlpha(0.4),
            outline: true,
            outlineColor: Cesium.Color.WHITE
          },
          description: `
            <b>Country:</b> ${item.country?.name || "Unknown"}<br/>
            <b>PM2.5:</b> ${value}<br/>
            <b>Provider:</b> ${item.provider?.name || "Unknown"}<br/>
            <b>Time:</b> ${item.datetime?.utc}
          `
        });
      });

    const focusLocation = (latitude, longitude, height) => {
      if (!isMounted || viewer.isDestroyed()) return;

      // Set the camera directly so users see their city, not a globe fly-in.
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
      });

      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
        point: {
          pixelSize: 8,
          color: Cesium.Color.BLUE,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2
        },
        label: {
          text: "You are here",
          font: "16px sans-serif",
          fillColor: Cesium.Color.YELLOW,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 3,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -20),
          showBackground: true,
          backgroundColor: Cesium.Color.BLACK.withAlpha(0.6)
        }
      });

      setLocationReady(true);
    };

    const focusByIp = async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch("https://ipapi.co/json/", {
          signal: controller.signal
        });
        if (!response.ok) throw new Error(`IP geolocation error: ${response.status}`);

        const location = await response.json();
        const latitude = Number(location.latitude);
        const longitude = Number(location.longitude);

        if (
          Number.isFinite(latitude) && latitude >= -90 && latitude <= 90 &&
          Number.isFinite(longitude) && longitude >= -180 && longitude <= 180
        ) {
          // IP location is city-level, so use a wider view than precise GPS.
          focusLocation(latitude, longitude, 60_000);
        } else {
          setLocationReady(true);
        }
      } catch (error) {
        if (isMounted) {
          console.warn("Could not determine location from IP:", error);
          setLocationReady(true);
        }
      } finally {
        clearTimeout(timeout);
      }
    };

    // Prefer precise browser GPS. If it is denied or unavailable, use IP location.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          focusLocation(
            position.coords.latitude,
            position.coords.longitude,
            25_000
          );
        },
        () => {
          focusByIp();
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 300_000 }
      );
    } else {
      focusByIp();
    }

    return () => {
      isMounted = false;
      viewer.destroy();
    };
  }, []);

  // --------------------------------------------------
  // LOAD AOI
  // --------------------------------------------------
  useEffect(() => {
    if (!aoiData || !viewerRef.current) return;

    const viewer = viewerRef.current;
    let isMounted = true;

    viewer.dataSources.removeAll();

    Cesium.GeoJsonDataSource.load(aoiData)
      .then((dataSource) => {
        if (isMounted && !viewer.isDestroyed()) {
          // Do not zoomTo the global dataset; keep the camera on the user's city.
          viewer.dataSources.add(dataSource);
        }
      })
      .catch((error) => console.error("Failed to load air quality data:", error));

    return () => {
      isMounted = false;
    };
  }, [aoiData]);

  return (
    <div className="relative h-[100svh] w-full">
      <div ref={containerRef} className="h-full w-full" />
      {!locationReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
          Finding your city...
        </div>
      )}
    </div>
  );
}

export default React.memo(CesiumViewer);
