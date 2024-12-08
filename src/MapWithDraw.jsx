import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const MapboxExample = () => {
  const mapContainerRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    // Set the Mapbox access token
    mapboxgl.accessToken =
      "pk.eyJ1IjoiemFib3AiLCJhIjoiY2xrOHAyZGdjMDFsaDNlbWIyODhhc3VoZSJ9.ldiQmCyhLWNt1-U2jDI3PQ";

    // Initialize the map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [-91.874, 42.76],
      zoom: 12,
    });

    // Initialize MapboxDraw with line drawing capabilities
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        line_string: true, // Enable line drawing
        trash: true, // Enable the delete tool
      },
      defaultMode: "draw_line_string", // Start in line drawing mode
    });
    mapRef.current.addControl(draw);

    // // Add event listeners for drawing actions (optional for debugging or additional functionality)
    // mapRef.current.on("draw.create", () => {
    //   console.log("Line created:", draw.getAll());
    // });
    // mapRef.current.on("draw.update", () => {
    //   console.log("Line updated:", draw.getAll());
    // });
    // mapRef.current.on("draw.delete", () => {
    //   console.log("Line deleted:", draw.getAll());
    // });
  }, []);

  return <div ref={mapContainerRef} id="map" style={{ height: "100%" }}></div>;
};

export default MapboxExample;
