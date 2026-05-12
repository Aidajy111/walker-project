import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./RouteMap.module.css";

const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving";

function isValidLatLng(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
}

/**
 * @typedef {Object} RouteMapPoint
 * @property {string} id
 * @property {string} title
 * @property {number} lat
 * @property {number} lng
 */

/**
 * @param {RouteMapPoint[]} geoPoints
 * @param {AbortSignal} signal
 * @returns {Promise<[number, number][]>} [lat, lng][]
 */
async function fetchRoadLatLngs(geoPoints, signal) {
  if (geoPoints.length < 2) {
    return geoPoints.map((p) => [p.lat, p.lng]);
  }

  /** @type {[number, number][]} */
  const merged = [];

  for (let i = 0; i < geoPoints.length - 1; i += 1) {
    const a = geoPoints[i];
    const b = geoPoints[i + 1];
    const url = `${OSRM_BASE}/${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url, { signal });
    if (!res.ok) {
      throw new Error("osrm_http");
    }
    const data = await res.json();
    const coords = data?.routes?.[0]?.geometry?.coordinates;
    if (!Array.isArray(coords) || coords.length === 0) {
      throw new Error("osrm_empty");
    }
    const segment = coords
      .map(([lng, lat]) => [Number(lat), Number(lng)])
      .filter(([lat, lng]) => isValidLatLng(lat, lng));
    if (merged.length === 0) {
      merged.push(...segment);
    } else {
      merged.push(...segment.slice(1));
    }
  }

  return merged;
}

export function RouteMap({ points, activePointId, onPointSelect }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const routeLayerRef = useRef(null);
  const markersByIdRef = useRef({});
  const [mapReady, setMapReady] = useState(false);

  const handleMarkerClick = useCallback(
    (point) => {
      onPointSelect(point);
    },
    [onPointSelect],
  );

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: true,
    });
    map.setView([51.8335, 107.5846], 11);

    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "",
      maxZoom: 20,
    }).addTo(map);

    routeLayerRef.current = L.layerGroup().addTo(map);

    setMapReady(true);

    return () => {
      setMapReady(false);
      map.remove();
      mapRef.current = null;
      routeLayerRef.current = null;
      markersByIdRef.current = {};
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !routeLayerRef.current) {
      return;
    }

    const map = mapRef.current;
    const routeLayer = routeLayerRef.current;
    const abortController = new AbortController();

    routeLayer.clearLayers();
    markersByIdRef.current = {};

    const geoPoints = points
      .map((point) => ({
        ...point,
        lat: Number(point.lat),
        lng: Number(point.lng),
      }))
      .filter((point) => isValidLatLng(point.lat, point.lng));
    if (geoPoints.length === 0) {
      return () => abortController.abort();
    }

    async function drawRoute() {
      let latLngs;
      try {
        latLngs = await fetchRoadLatLngs(geoPoints, abortController.signal);
      } catch {
        if (abortController.signal.aborted) {
          return;
        }
        latLngs = geoPoints.map((p) => [p.lat, p.lng]);
      }

      if (abortController.signal.aborted) {
        return;
      }

      const safeLatLngs = Array.isArray(latLngs) ? latLngs.filter(([lat, lng]) => isValidLatLng(lat, lng)) : [];
      if (safeLatLngs.length === 0) {
        return;
      }

      L.polyline(safeLatLngs, {
        color: "#0fae9f",
        weight: 4,
        opacity: 0.92,
        lineJoin: "round",
        lineCap: "round",
      }).addTo(routeLayer);

      geoPoints.forEach((point) => {
        const marker = L.circleMarker([point.lat, point.lng], {
          radius: 11,
          weight: 2,
          color: "#1f1f1f",
          fillColor: "#ffffff",
          fillOpacity: 1,
        }).addTo(routeLayer);

        marker.bindTooltip(point.title, {
          direction: "top",
          offset: [0, -10],
          opacity: 0.95,
        });

        marker.on("click", () => {
          handleMarkerClick(point);
        });

        markersByIdRef.current[point.id] = marker;
      });

      const bounds = L.latLngBounds(safeLatLngs);
      if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.12), { maxZoom: 14, animate: false });
      }
    }

    drawRoute();

    return () => {
      abortController.abort();
    };
  }, [mapReady, points, handleMarkerClick]);

  useEffect(() => {
    if (!mapReady) {
      return;
    }

    points.forEach((point) => {
      const marker = markersByIdRef.current[point.id];
      if (!marker) {
        return;
      }
      const isActive = point.id === activePointId;
      marker.setStyle({
        weight: isActive ? 4 : 2,
        color: isActive ? "#0fae9f" : "#1f1f1f",
      });
    });

    const active = points.find((p) => p.id === activePointId);
    const activeLat = Number(active?.lat);
    const activeLng = Number(active?.lng);
    if (active && isValidLatLng(activeLat, activeLng) && mapRef.current) {
      try {
        if (!mapRef.current._loaded) {
          return;
        }
        mapRef.current.panTo([activeLat, activeLng], { animate: true, duration: 0.45 });
      } catch {
        // ignore invalid intermediate map state
      }
    }
  }, [mapReady, activePointId, points]);

  useEffect(() => {
    if (!mapReady || !mapRef.current) {
      return;
    }
    const map = mapRef.current;
    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [mapReady]);

  return (
    <div className={styles.mapShell}>
      <div ref={containerRef} className={styles.mapRoot} role="presentation" aria-label="Карта маршрута" />
      <div className={styles.mapCredit}>
        © OpenStreetMap · маршрут по дорогам (OSRM demo)
      </div>
    </div>
  );
}
