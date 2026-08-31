import { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { BD_CENTER } from '../constants.js';

function Recenter({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(
        center,
        zoom ?? map.getZoom()
      );
    }
  }, [center?.[0], center?.[1], zoom]); // eslint-disable-line

  return null;
}

function ClickToPin({ onPick }) {
  useMapEvents({
    click(e) {
      onPick?.(
        e.latlng.lat,
        e.latlng.lng
      );
    },
  });

  return null;
}

// Sprint 2 Feature 11:
// Leaflet.heat overlay for open/unmet requests.
function HeatLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (
      !points ||
      !points.length
    ) {
      return;
    }

    const layer = L.heatLayer(
      points.map((point) => [
        point.lat,
        point.lng,
        point.weight ?? 0.5,
      ]),
      {
        radius: 35,
        blur: 25,
        maxZoom: 12,
      }
    ).addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [points, map]);

  return null;
}

/**
 * Reusable map.
 *
 * points:
 * [{ id, lat, lng, color, radius, popup }]
 *
 * heat:
 * [{ lat, lng, weight }]
 *
 * onPick:
 * (lat, lng) => void
 *
 * picked:
 * { lat, lng }
 */
export default function MapView({
  points = [],
  heat = null,
  onPick = null,
  picked = null,
  center = BD_CENTER,
  zoom = 7,
  className = 'map-wrap',
}) {
  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Recenter
          center={center}
          zoom={zoom}
        />

        {onPick && (
          <ClickToPin
            onPick={onPick}
          />
        )}

        {heat && (
          <HeatLayer
            points={heat}
          />
        )}

        {points.map((point) => (
          <CircleMarker
            key={point.id}
            center={[
              point.lat,
              point.lng,
            ]}
            radius={
              point.radius ?? 9
            }
            pathOptions={{
              color:
                point.color ||
                '#0d6efd',

              fillColor:
                point.color ||
                '#0d6efd',

              fillOpacity:
                0.7,

              weight: 2,
            }}
          >
            {point.popup && (
              <Popup>
                {point.popup}
              </Popup>
            )}
          </CircleMarker>
        ))}

        {picked && (
          <CircleMarker
            center={[
              picked.lat,
              picked.lng,
            ]}
            radius={11}
            pathOptions={{
              color: '#111',
              fillColor: '#fde047',
              fillOpacity: 0.9,
              weight: 3,
            }}
          >
            <Popup>
              Pinned location
            </Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}
