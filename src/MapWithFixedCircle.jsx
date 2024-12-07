import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

// Use your Mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1IjoiemFib3AiLCJhIjoiY2xrOHAyZGdjMDFsaDNlbWIyODhhc3VoZSJ9.ldiQmCyhLWNt1-U2jDI3PQ";

const MapWithFixedCircle = () => {
  const mapContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const fixedCircleMapRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-v9", // Satellite view for the main map
      center: [0, 0],
      zoom: 2,
      attributionControl: false,
    });

    const overlayCanvas = canvasRef.current;
    const ctx = overlayCanvas.getContext("2d");

    const fixedCircleRadius = 200; // Radius of the fixed circle in pixels
    const fixedCirclePosition = { x: window.innerWidth - 250, y: 250 };

    overlayCanvas.width = window.innerWidth;
    overlayCanvas.height = window.innerHeight;

    const fixedCircleMap = new mapboxgl.Map({
      container: document.createElement("div"), // Hidden container for the fixed map
      style: "mapbox://styles/mapbox/satellite-v9", // Satellite view for the fixed circle map
      center: [0, 0],
      zoom: 5,
      interactive: false,
    });

    fixedCircleMapRef.current = fixedCircleMap;

    const drawCircle = (
      x,
      y,
      radius,
      strokeColor = "red",
      fillColor = "rgba(0, 0, 0, 0.4)"
    ) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 10;
      ctx.stroke();
    };

    const handleMouseMove = (e) => {
      const center = [e.lngLat.lng, e.lngLat.lat];
      fixedCircleMap.setCenter(center);
      fixedCircleMap.setZoom(map.getZoom() + 4);

      // Clear and redraw the fixed circle
      ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      drawCircle(
        fixedCirclePosition.x,
        fixedCirclePosition.y,
        fixedCircleRadius
      );

      const fixedCanvas = fixedCircleMap.getCanvas();
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        fixedCirclePosition.x,
        fixedCirclePosition.y,
        fixedCircleRadius,
        0,
        Math.PI * 2,
        true
      );
      ctx.clip();
      ctx.drawImage(
        fixedCanvas,
        0,
        0,
        fixedCanvas.width,
        fixedCanvas.height,
        fixedCirclePosition.x - fixedCircleRadius,
        fixedCirclePosition.y - fixedCircleRadius,
        fixedCircleRadius * 2,
        fixedCircleRadius * 2
      );
      ctx.restore();
    };

    const resizeCanvas = () => {
      overlayCanvas.width = window.innerWidth;
      overlayCanvas.height = window.innerHeight;
      fixedCirclePosition.x = window.innerWidth - 250;
      fixedCirclePosition.y = 250;
    };

    map.on("mousemove", handleMouseMove);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      map.remove();
      fixedCircleMap.remove();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div>
      <div id="map-container" ref={mapContainerRef}></div>
      <canvas id="map-overlay" ref={canvasRef}></canvas>
    </div>
  );
};

export default MapWithFixedCircle;
