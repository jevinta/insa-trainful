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

// Real T1 track geometry from OpenStreetMap (ways 1499609243→1499609244→318825358→1499609245→1499609246)
const routePositions = [
  [45.7808653, 4.8663444], // Université Lyon 1
  [45.7809242, 4.8666069],
  [45.7809467, 4.8667070],
  [45.7810374, 4.8671106],
  [45.7810532, 4.8671811],
  [45.7811226, 4.8674904],
  [45.7812616, 4.8681094],
  [45.7814138, 4.8687872],
  [45.7815182, 4.8692522],
  [45.7815496, 4.8693919],
  [45.7815575, 4.8694467],
  [45.7815697, 4.8695316],
  [45.7815725, 4.8695515],
  [45.7815740, 4.8696767],
  [45.7815370, 4.8703115],
  [45.7815351, 4.8704061],
  [45.7815490, 4.8705513],
  [45.7816564, 4.8710156],
  [45.7816735, 4.8711268],
  [45.7816777, 4.8712536],
  [45.7816642, 4.8713897],
  [45.7816396, 4.8714986],
  [45.7816019, 4.8716645],
  [45.7815748, 4.8717901],
  [45.7815027, 4.8721026],
  [45.7814923, 4.8721478], // near La Doua - Gaston Berger
  [45.7815207, 4.8721608], // La Doua - Gaston Berger
  [45.7814562, 4.8723197],
  [45.7814300, 4.8724441],
  [45.7813923, 4.8725960],
  [45.7813546, 4.8727577],
  [45.7813273, 4.8729111],
  [45.7813230, 4.8730015],
  [45.7813278, 4.8730971],
  [45.7813424, 4.8732014],
  [45.7813865, 4.8733982],
  [45.7814428, 4.8736495],
  [45.7814815, 4.8738222],
  [45.7815064, 4.8739333],
  [45.7815859, 4.8742882],
  [45.7816167, 4.8744256],
  [45.7816701, 4.8746638],
  [45.7817023, 4.8748077],
  [45.7817394, 4.8749297],
  [45.7817953, 4.8750700],
  [45.7818697, 4.8752398],
  [45.7819149, 4.8753629],
  [45.7819598, 4.8755150],
  [45.7823380, 4.8772077],
  [45.7823574, 4.8772944],
  [45.7823662, 4.8773339],
  [45.7824397, 4.8776632], // INSA - Einstein
]

function InvalidateSizeOnMount() {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100)
  }, [map])
  return null
}

export default function TramMap({ tramPosition, direction, nextStation, cars, onTramClick }) {
  const center = [45.7816, 4.8720]

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
            <div style={{ fontFamily: 'system-ui', fontSize: '13px', minWidth: '130px', color: '#1e293b' }}>
              <div style={{ fontWeight: 700, marginBottom: '3px' }}>{station.name}</div>
              <span style={{ background: '#d97706', color: '#fff', fontWeight: 700, fontSize: '11px', borderRadius: '4px', padding: '2px 7px' }}>T1</span>
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
            <div style={{ fontFamily: 'system-ui', fontSize: '13px', minWidth: '160px', color: '#1e293b' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>T1 Tram</div>
              <div style={{ color: '#64748b', marginBottom: '2px' }}>→ <strong style={{ color: '#1e293b' }}>{direction}</strong></div>
              <div style={{ color: '#64748b', marginBottom: '6px' }}>Next: <strong style={{ color: '#d97706' }}>{nextStation?.name}</strong></div>
              <div style={{ color: occupancyColor, fontWeight: 700, marginBottom: '8px' }}>
                {avgOccupancy}% occupied
              </div>
              <button
                onClick={onTramClick}
                style={{
                  background: '#d97706',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '12px',
                  color: '#fff',
                  width: '100%',
                }}
              >
                View details →
              </button>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
}
