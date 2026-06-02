import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { STATIONS } from '../simulation/tramSimulation.js'

// Fix Leaflet default icon paths (Vite asset handling quirk)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const stationIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 14px;
    height: 14px;
    background: #E0A800;
    border: 3px solid #fff;
    border-radius: 50%;
    box-shadow: 0 0 6px rgba(0,0,0,0.5);
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -10],
})

const tramIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 28px;
    height: 28px;
    background: #E0A800;
    border: 3px solid #fff;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    box-shadow: 0 0 8px rgba(224,168,0,0.8);
    cursor: pointer;
  ">🚋</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16],
})

const routePositions = STATIONS.map(s => [s.lat, s.lng])

function InvalidateSizeOnMount() {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100)
  }, [map])
  return null
}

export default function TramMap({ tramPosition, direction, nextStation, cars, onTramClick }) {
  const center = [45.782, 4.873]

  const avgOccupancy = Math.round(
    cars.reduce((sum, c) => sum + Math.round((c.current / c.capacity) * 100), 0) / cars.length
  )

  const occupancyColor =
    avgOccupancy < 50 ? '#22c55e'
    : avgOccupancy < 75 ? '#eab308'
    : avgOccupancy < 90 ? '#f97316'
    : '#ef4444'

  const tramIconWithColor = L.divIcon({
    className: '',
    html: `<div style="
      width: 30px;
      height: 30px;
      background: #E0A800;
      border: 3px solid ${occupancyColor};
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 17px;
      box-shadow: 0 0 10px rgba(224,168,0,0.7);
      cursor: pointer;
    ">🚋</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
  })

  return (
    <MapContainer
      center={center}
      zoom={16}
      style={{ width: '100%', height: '100%' }}
      zoomControl={true}
    >
      <InvalidateSizeOnMount />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* T1 Route line */}
      <Polyline
        positions={routePositions}
        pathOptions={{ color: '#E0A800', weight: 5, opacity: 0.85 }}
      />

      {/* Station markers */}
      {STATIONS.map(station => (
        <Marker key={station.id} position={[station.lat, station.lng]} icon={stationIcon}>
          <Popup>
            <div style={{ fontFamily: 'system-ui', fontSize: '13px', minWidth: '120px' }}>
              <strong>{station.name}</strong>
              <br />
              <span style={{ color: '#E0A800', fontWeight: 600 }}>T1</span>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Tram marker */}
      {tramPosition && (
        <Marker
          position={[tramPosition.lat, tramPosition.lng]}
          icon={tramIconWithColor}
          eventHandlers={{ click: onTramClick }}
        >
          <Popup>
            <div style={{ fontFamily: 'system-ui', fontSize: '13px', minWidth: '140px' }}>
              <strong>T1 Tram</strong>
              <br />
              Direction: <em>{direction}</em>
              <br />
              Next stop: <strong>{nextStation?.name}</strong>
              <br />
              <span style={{ color: occupancyColor, fontWeight: 600 }}>
                Avg occupancy: {avgOccupancy}%
              </span>
              <br />
              <button
                onClick={onTramClick}
                style={{
                  marginTop: '6px',
                  background: '#E0A800',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                View details
              </button>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
}
