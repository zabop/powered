import React, { useEffect, useRef } from "react";
import { initializeMap, drawCircle, handleResize } from "./mapUtils";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

const Maps = () => {
  const mapContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const fixedCircleMapRef = useRef(null);

  useEffect(() => {
    const { map, fixedCircleMap, ctx, overlayCanvas } = initializeMap(
      mapContainerRef,
      canvasRef,
      fixedCircleMapRef
    );

    const fixedCirclePosition = { x: window.innerWidth - 250, y: 250 };
    const fixedCircleRadius = 200;

    const handleMouseMove = (e) => {
      const center = [e.lngLat.lng, e.lngLat.lat];
      fixedCircleMap.setCenter(center);
      fixedCircleMap.setZoom(map.getZoom() + 4);

      drawCircle(
        ctx,
        overlayCanvas,
        fixedCirclePosition,
        fixedCircleRadius,
        fixedCircleMap
      );
    };

    map.on("mousemove", handleMouseMove);
    window.addEventListener("resize", () =>
      handleResize(canvasRef.current, fixedCirclePosition)
    );

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        line_string: true, // Switch to line tool
        trash: true,
      },
      defaultMode: "draw_line_string", // Use line tool as default
    });
    map.addControl(draw);

    return () => {
      map.remove();
      fixedCircleMap.remove();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <div id="map-container" ref={mapContainerRef}></div>
      <canvas id="map-overlay" ref={canvasRef}></canvas>
    </div>
  );
};

export default Maps;