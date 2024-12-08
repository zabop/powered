import mapboxgl from "mapbox-gl";

// Use your Mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1IjoiemFib3AiLCJhIjoiY2xrOHAyZGdjMDFsaDNlbWIyODhhc3VoZSJ9.ldiQmCyhLWNt1-U2jDI3PQ";

export const initializeMap = (
  mapContainerRef,
  canvasRef,
  fixedCircleMapRef
) => {
  const map = new mapboxgl.Map({
    container: mapContainerRef.current,
    style: "mapbox://styles/mapbox/satellite-streets-v12",
    center: [0, 0],
    zoom: 2,
    attributionControl: false,
  });

  const overlayCanvas = canvasRef.current;
  const ctx = overlayCanvas.getContext("2d");
  overlayCanvas.width = window.innerWidth;
  overlayCanvas.height = window.innerHeight;

  const fixedCircleMap = new mapboxgl.Map({
    container: document.createElement("div"),
    style: "mapbox://styles/mapbox/satellite-streets-v12",
    center: [0, 0],
    zoom: 5,
    interactive: false,
  });

  fixedCircleMapRef.current = fixedCircleMap;

  return { map, fixedCircleMap, ctx, overlayCanvas };
};

export const drawCircle = (
  ctx,
  overlayCanvas,
  fixedCirclePosition,
  fixedCircleRadius,
  fixedCircleMap
) => {
  const fixedCanvas = fixedCircleMap.getCanvas();

  ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  // Draw the fixed circle
  ctx.beginPath();
  ctx.arc(
    fixedCirclePosition.x,
    fixedCirclePosition.y,
    fixedCircleRadius,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(
    fixedCirclePosition.x,
    fixedCirclePosition.y,
    fixedCircleRadius,
    0,
    2 * Math.PI
  );
  ctx.strokeStyle = "red";
  ctx.lineWidth = 10;
  ctx.stroke();

  // Clip and draw the map within the fixed circle
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

export const handleResize = (canvas, fixedCirclePosition) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  fixedCirclePosition.x = window.innerWidth - 250;
  fixedCirclePosition.y = 250;
};
