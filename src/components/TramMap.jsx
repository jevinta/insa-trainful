import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { STATIONS } from '../simulation/tramSimulation.js'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const stationIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:12px;height:12px;
    background:#f59e0b;
    border:2.5px solid #fff;
    border-radius:50%;
    box-shadow:0 1px 4px rgba(0,0,0,0.35);
  "></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
  popupAnchor: [0, -8],
})

// Real T1 track geometry from OpenStreetMap
// Northern section uses exact OSM way waypoints; southern section uses station coords.
const routePositions = [
  // ── Croix-Luizet → INSA-Einstein (OSM Way 266717496) ──────────────
  [45.7836714, 4.8832536],
  [45.7836235, 4.8828068],
  [45.7834502, 4.8820338],
  [45.7832875, 4.8813079],
  [45.7831441, 4.8806683],
  [45.7828110, 4.8791821],
  [45.7826396, 4.8784177],
  [45.7825476, 4.8780071],
  [45.7824673, 4.8776491],
  [45.7824397, 4.8776632], // INSA - Einstein

  // ── INSA-Einstein → La Doua (Ways 1499653540 + 1499653541) ────────
  [45.7823940, 4.8773205],
  [45.7820115, 4.8756084],
  [45.7819598, 4.8755150],
  [45.7818697, 4.8752398],
  [45.7817953, 4.8750700],
  [45.7817306, 4.8747887],
  [45.7816386, 4.8743806],
  [45.7815624, 4.8740426],
  [45.7815064, 4.8739333],
  [45.7814141, 4.8733847],
  [45.7813849, 4.8732550],
  [45.7813568, 4.8730793],
  [45.7813532, 4.8730075],
  [45.7813544, 4.8729408],
  [45.7813735, 4.8728233],
  [45.7813976, 4.8727099],
  [45.7814436, 4.8725011],
  [45.7815207, 4.8721608], // La Doua - Gaston Berger

  // ── La Doua → Université Lyon 1 (Way 318825358 rev + Way 1499609244 rev) ──
  [45.7815027, 4.8721026],
  [45.7815748, 4.8717901],
  [45.7816019, 4.8716645],
  [45.7816396, 4.8714986],
  [45.7816642, 4.8713897],
  [45.7816777, 4.8712536],
  [45.7816564, 4.8710156],
  [45.7815490, 4.8705513],
  [45.7815351, 4.8704061],
  [45.7815370, 4.8703115],
  [45.7815740, 4.8696767],
  [45.7815575, 4.8694467],
  [45.7815182, 4.8692522],
  [45.7814138, 4.8687872],
  [45.7812616, 4.8681094],
  [45.7811226, 4.8674904],
  [45.7810374, 4.8671106],
  [45.7809242, 4.8666069],
  [45.7808653, 4.8663444], // Université Lyon 1

  // ── Université Lyon 1 → Condorcet ─────────────────────────────────
  [45.7779464, 4.8669658], // Condorcet

  // ── Condorcet → Le Tonkin ──────────────────────────────────────────
  [45.7740693, 4.8640433], // Le Tonkin

  // ── Le Tonkin → Charpennes (OSM Way 236135117) ────────────────────
  [45.7735031, 4.8632649],
  [45.7729309, 4.8631996],
  [45.7724730, 4.8631676],
  [45.7718922, 4.8631220],
  [45.7709529, 4.8630183],
  [45.7709503, 4.8630540], // Charpennes - Charles Hernu

  // ── Charpennes → Thiers-Lafayette (OSM Way 1339058148) ────────────
  [45.7691512, 4.8617581],
  [45.7681543, 4.8618170],
  [45.7673148, 4.8618667],
  [45.7666845, 4.8619410], // Collège Bellecombe
  [45.7652387, 4.8619645],
  [45.7643156, 4.8620519], // Thiers - Lafayette

  // ── Thiers-Lafayette → Debourg (station-coord waypoints) ──────────
  [45.7616011, 4.8579173], // Gare Part-Dieu - Vivier Merle
  [45.7606742, 4.8538132], // Part-Dieu - Auditorium
  [45.7603239, 4.8483963], // Palais de Justice - Mairie du 3e
  [45.7601118, 4.8452808], // Saxe-Préfecture
  [45.7588580, 4.8424556], // Liberté
  [45.7549452, 4.8425387], // Guillotière
  [45.7528829, 4.8410584], // Saint-André
  [45.7511473, 4.8389606], // Rue de l'Université
  [45.7496772, 4.8353169], // Quai Claude Bernard
  [45.7495322, 4.8270476], // Perrache
  [45.7470663, 4.8245818], // Place des Archives
  [45.7442030, 4.8221408], // Sainte-Blandine
  [45.7405673, 4.8190408], // Hôtel de Région Montrochet
  [45.7336611, 4.8189123], // Musée des Confluences
  [45.7317251, 4.8228408], // Halle Tony Garnier
  [45.7314628, 4.8288348], // ENS Lyon
  [45.7311865, 4.8346207], // Debourg
]

function InvalidateSizeOnMount() {
  const map = useMap()
  useEffect(() => { setTimeout(() => map.invalidateSize(), 100) }, [map])
  return null
}

function getOccupancyColor(pct) {
  if (pct < 50) return '#059669'
  if (pct < 75) return '#d97706'
  if (pct < 90) return '#ea580c'
  return '#dc2626'
}

export default function TramMap({ tramPosition, direction, nextStation, cars, onTramClick }) {
  // Center on middle of the T1 line, zoom out enough to show all 26 stops
  const center = [45.758, 4.851]

  const avgOccupancy = Math.round(
    cars.reduce((sum, c) => sum + (c.current / c.capacity) * 100, 0) / cars.length
  )
  const occupancyColor = getOccupancyColor(avgOccupancy)

  const tramIcon = L.divIcon({
    className: '',
    html: `<div style="
      width:30px;height:30px;
      background:#f59e0b;
      border:3px solid ${occupancyColor};
      border-radius:8px;
      display:flex;align-items:center;justify-content:center;
      font-size:17px;
      box-shadow:0 2px 8px rgba(245,158,11,0.5);
      cursor:pointer;
    ">🚋</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
  })

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ width: '100%', height: '100%' }}
      zoomControl={true}
    >
      <InvalidateSizeOnMount />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Polyline
        positions={routePositions}
        pathOptions={{ color: '#f59e0b', weight: 4, opacity: 0.9 }}
      />

      {STATIONS.map(station => (
        <Marker key={station.id} position={[station.lat, station.lng]} icon={stationIcon}>
          <Popup>
            <div style={{ fontFamily: 'system-ui', fontSize: '13px', minWidth: '130px', color: '#1e293b' }}>
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>{station.name}</div>
              <span style={{ background: '#f59e0b', color: '#fff', fontWeight: 700, fontSize: '10px', borderRadius: '4px', padding: '2px 6px' }}>T1</span>
            </div>
          </Popup>
        </Marker>
      ))}

      {tramPosition && (
        <Marker
          position={[tramPosition.lat, tramPosition.lng]}
          icon={tramIcon}
          eventHandlers={{ click: onTramClick }}
        >
          <Popup>
            <div style={{ fontFamily: 'system-ui', fontSize: '13px', minWidth: '160px', color: '#1e293b' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>T1 Tram</div>
              <div style={{ color: '#64748b', marginBottom: '2px' }}>→ <strong style={{ color: '#1e293b' }}>{direction}</strong></div>
              <div style={{ color: '#64748b', marginBottom: '6px' }}>Next: <strong style={{ color: '#d97706' }}>{nextStation?.name}</strong></div>
              <div style={{ color: occupancyColor, fontWeight: 700, marginBottom: '8px' }}>{avgOccupancy}% occupied</div>
              <button
                onClick={onTramClick}
                style={{ background: '#f59e0b', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 700, fontSize: '12px', color: '#fff', width: '100%' }}
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
