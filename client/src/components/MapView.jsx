import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { BD_CENTER } from '../constants.js';

function Recenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom ?? map.getZoom());
  }, [center?.[0], center?.[1], zoom]); // eslint-disable-line
  return null;
}

function ClickToPin({ onPick }) {
  useMapEvents({
    click(e) {
      onPick?.(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/**
 * Reusable Sprint 1 map.
 * - points: [{ id, lat, lng, color, radius, popup }]
 * - onPick: (lat, lng) => void
 * - picked: { lat, lng }
 */
export default function MapView({
  points = [],
  onPick = null,
  picked = null,
  center = BD_CENTER,
  zoom = 7,
  className = 'map-wrap',
}) {
  return (
    <div className={className}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter center={center} zoom={zoom} />
        {onPick && <ClickToPin onPick={onPick} />}

        {points.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={p.radius ?? 9}
            pathOptions={{ color: p.color || '#0d6efd', fillColor: p.color || '#0d6efd', fillOpacity: 0.7, weight: 2 }}
          >
            {p.popup && <Popup>{p.popup}</Popup>}
          </CircleMarker>
        ))}

        {picked && (
          <CircleMarker
            center={[picked.lat, picked.lng]}
            radius={11}
            pathOptions={{ color: '#111', fillColor: '#fde047', fillOpacity: 0.9, weight: 3 }}
          >
            <Popup>Pinned location</Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}
