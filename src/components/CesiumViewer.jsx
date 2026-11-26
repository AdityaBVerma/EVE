import React from "react";
import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import rawData from "../data/pm25.json";
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

  // --------------------------------------------------
  // CREATE VIEWER
  // --------------------------------------------------
  useEffect(() => {
    const imageryModels = Cesium.createDefaultImageryProviderViewModels();

const defaultImagery = imageryModels.find(
  (layer) => layer.name === "Stadia Alidade Smooth"
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

    // --------------------------------------------------
    // GEOLOCATION
    // --------------------------------------------------
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {

        const { latitude, longitude } = pos.coords;

        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            longitude,
            latitude,
            10_000_000
          ),
          duration: 2
        });

        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
          point: {
            pixelSize: 5,
            color: Cesium.Color.BLUE
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

      });
    }

    return () => viewer.destroy();

  }, []);

  // --------------------------------------------------
  // LOAD AOI
  // --------------------------------------------------
  useEffect(() => {
    if (!aoiData || !viewerRef.current) return;

    const viewer = viewerRef.current;

    viewer.dataSources.removeAll();

    Cesium.GeoJsonDataSource.load(aoiData).then((ds) => {
      viewer.dataSources.add(ds);
      viewer.zoomTo(ds);
    });

  }, [aoiData]);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full"
    />
  );
}

export default React.memo(CesiumViewer);