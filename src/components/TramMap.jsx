import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import { T1_STATIONS, T4_STATIONS } from '../simulation/tramSimulation.js'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function makeStationIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:10px;height:10px;background:${color};border:2px solid #fff;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
    popupAnchor: [0, -7],
  })
}

const t1StationIcon = makeStationIcon('#f59e0b')
const t4StationIcon = makeStationIcon('#873F98')

const userLocationIcon = L.divIcon({
  className: '',
  html: `<div style="width:18px;height:18px;background:#3b82f6;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(59,130,246,0.6);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -12],
})

// ── T1 route: exact OSM waypoints for northern section, station coords south ──
const t1RoutePositions = [
  // IUT - Feyssine → Croix-Luizet (OSM Ways 1499609250 rev, 1499609247 rev, 1499609249 rev, 1499609248 rev)
  [45.7869337, 4.8819277], // IUT - Feyssine
  [45.7866804, 4.8820416],
  [45.7866335, 4.8820627],
  [45.7861221, 4.8822926],
  [45.7859649, 4.8823633],
  [45.7854566, 4.8825888],
  [45.7853733, 4.8826268],
  [45.7852554, 4.8827724],
  [45.7851814, 4.8830628],
  [45.7851031, 4.8833122],
  [45.7850386, 4.8833925],
  [45.7849731, 4.8834346],
  [45.7841793, 4.8837968],
  [45.7840433, 4.8838500],
  [45.7839019, 4.8838215],
  [45.7838592, 4.8837919],
  [45.7837305, 4.8835248],
  [45.7837038, 4.8834052],
  [45.7836714, 4.8832536], // Croix-Luizet
  [45.7836235, 4.8828068],
  [45.7834502, 4.8820338],
  [45.7832875, 4.8813079],
  [45.7831441, 4.8806683],
  [45.7828110, 4.8791821],
  [45.7826396, 4.8784177],
  [45.7825476, 4.8780071],
  [45.7824673, 4.8776491],
  [45.7824397, 4.8776632],
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
  [45.7815207, 4.8721608],
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
  [45.7808653, 4.8663444],
  [45.7779464, 4.8669658],
  [45.7740693, 4.8640433],
  [45.7735031, 4.8632649],
  [45.7729309, 4.8631996],
  [45.7724730, 4.8631676],
  [45.7718922, 4.8631220],
  [45.7709529, 4.8630183],
  [45.7709503, 4.8630540],
  [45.7691512, 4.8617581],
  [45.7681543, 4.8618170],
  [45.7673148, 4.8618667],
  [45.7666845, 4.8619410],
  [45.7652387, 4.8619645],
  [45.7643156, 4.8620519],
  [45.7616011, 4.8579173],
  [45.7606742, 4.8538132],
  [45.7603239, 4.8483963],
  [45.7601118, 4.8452808],
  [45.7588580, 4.8424556],
  [45.7549452, 4.8425387],
  [45.7528829, 4.8410584],
  [45.7511473, 4.8389606],
  [45.7496772, 4.8353169],
  [45.7495322, 4.8270476],
  [45.7470663, 4.8245818],
  [45.7442030, 4.8221408],
  [45.7405673, 4.8190408],
  [45.7336611, 4.8189123],
  [45.7317251, 4.8228408],
  [45.7314628, 4.8288348],
  [45.7311865, 4.8346207],
]

// ── T4 route: OSM waypoints for all sections ──────────────────────────────────
const t4RoutePositions = [
  // Hôpital Feyzin → Darnaise (OSM Ways 1508807637-1508807639)
  [45.6882795, 4.8651840],
  [45.6887480, 4.8651735],
  [45.6892484, 4.8651719],
  [45.6896439, 4.8652892],
  [45.6900995, 4.8656092],
  [45.6904827, 4.8660377],
  [45.6908060, 4.8661957],
  [45.6909832, 4.8660686],
  [45.6912896, 4.8656231],
  [45.6916989, 4.8652582],
  [45.6921232, 4.8650164],
  [45.6924247, 4.8646902],
  [45.6926515, 4.8643379], // Darnaise
  // Darnaise → Lénine - Corsière (OSM Ways 1508807640-1508807641)
  [45.6928188, 4.8640632],
  [45.6930493, 4.8637382],
  [45.6933985, 4.8633648],
  [45.6937930, 4.8630802],
  [45.6941909, 4.8629189],
  [45.6946563, 4.8628353],
  [45.6954403, 4.8627254],
  [45.6957762, 4.8626765],
  [45.6961234, 4.8625598],
  [45.6963225, 4.8624271],
  [45.6966666, 4.8620258],
  [45.6968368, 4.8617597], // Lénine - Corsière
  // Lénine → Maurice Thorez (OSM Ways 1508807641-1508807643)
  [45.6972787, 4.8610330],
  [45.6978679, 4.8605776],
  [45.6982347, 4.8604661],
  [45.6994746, 4.8602974],
  [45.6997423, 4.8603244],
  [45.6999366, 4.8605768],
  [45.6999653, 4.8607992],
  [45.6999144, 4.8613394],
  [45.6998886, 4.8616574],
  [45.6998412, 4.8632933], // Maurice Thorez
  // Maurice Thorez → Division Leclerc (OSM Ways 1508807643-1508807645)
  [45.6998119, 4.8654854],
  [45.6997632, 4.8658005],
  [45.6996330, 4.8662132],
  [45.6994514, 4.8665515],
  [45.6992115, 4.8669279],
  [45.6987547, 4.8676430],
  [45.6984273, 4.8681589], // Division Leclerc
  // Division Leclerc → Herriot (OSM Way 1508807645)
  [45.6980136, 4.8688034],
  [45.6969345, 4.8704926],
  [45.6960059, 4.8719378], // Vénissy - Frida Kahlo
  [45.6951308, 4.8733180],
  [45.6941160, 4.8749034],
  [45.6937696, 4.8754428], // Herriot - Cagne
  [45.6935673, 4.8757611],
  [45.6932238, 4.8763016],
  // Herriot → Lycée Jacques Brel (OSM Ways 1508807646-1508807647)
  [45.6931120, 4.8764919],
  [45.6930047, 4.8769178],
  [45.6930335, 4.8772694],
  [45.6931833, 4.8776162],
  [45.6935249, 4.8780708],
  [45.6940226, 4.8787264],
  [45.6947023, 4.8796278],
  [45.6949124, 4.8799064], // Lycée Jacques Brel
  // Lycée Jacques Brel → Marcel Houël (OSM Way 1508807647)
  [45.6955882, 4.8808109],
  [45.6959842, 4.8816258],
  [45.6961805, 4.8823854],
  [45.6963587, 4.8836224],
  [45.6964885, 4.8845462], // Marcel Houël - Hôtel de Ville
  [45.6967836, 4.8866579],
  // Marcel Houël → Croizat - Paul Bert (OSM Ways 1508807648, 33549342)
  [45.6968780, 4.8873232],
  [45.6969649, 4.8875672],
  [45.6971206, 4.8876661],
  [45.6976350, 4.8876662],
  [45.6997818, 4.8876520],
  [45.7000467, 4.8876491], // Croizat - Paul Bert
  // Croizat → Gare de Vénissieux (OSM Ways 33549342, 1508807649-1508807651)
  [45.7028409, 4.8876274],
  [45.7034666, 4.8877791],
  [45.7041844, 4.8877735],
  [45.7050915, 4.8877628],
  [45.7054012, 4.8877573],
  [45.7056646, 4.8877581], // Gare de Vénissieux
  [45.7062055, 4.8877481],
  // Gare de Vénissieux → La Borelle → Joliot Curie (OSM Ways 1508807652-1508807655)
  [45.7069540, 4.8877202],
  [45.7073691, 4.8876196],
  [45.7076618, 4.8874954],
  [45.7079671, 4.8872841],
  [45.7081474, 4.8870455],
  [45.7083651, 4.8866901],
  [45.7093496, 4.8850896],
  [45.7109754, 4.8824474],
  [45.7111586, 4.8821497], // La Borelle
  [45.7118296, 4.8812281],
  [45.7126113, 4.8806654],
  [45.7135901, 4.8799079],
  [45.7145236, 4.8791942],
  [45.7152598, 4.8786186],
  [45.7155233, 4.8784129], // Joliot Curie - Marcel Sembat
  // Joliot Curie → États-Unis Viviani (direct)
  [45.7249362, 4.8710796], // États-Unis Viviani
  // → Beauvisage (direct)
  [45.7298419, 4.8672560], // Beauvisage - C.I.S.L.
  // Beauvisage → Jet d'eau (OSM Way 34939074)
  [45.7299551, 4.8671677],
  [45.7310783, 4.8662939],
  [45.7318606, 4.8656851],
  [45.7320511, 4.8655354],
  [45.7330342, 4.8647708], // États-Unis - Musée Tony Garnier
  [45.7346047, 4.8635472],
  [45.7365560, 4.8620202],
  [45.7368618, 4.8617905], // Lycée Lumière
  [45.7376865, 4.8611410],
  [45.7386503, 4.8603896],
  [45.7392122, 4.8599119],
  // Jet d'eau → Lycée Colbert (OSM Ways 187407210 + 83653818)
  [45.7400728, 4.8591894], // Jet d'eau - Mendès France
  [45.7402890, 4.8589713],
  [45.7408108, 4.8585692],
  [45.7428517, 4.8583606],
  [45.7444645, 4.8587502],
  [45.7453278, 4.8589643],
  [45.7456554, 4.8590580], // Lycée Colbert
  [45.7470299, 4.8594398],
  // Lycée Colbert → Archives (station coords, tunnel section)
  [45.7501481, 4.8603440], // Manufacture Montluc
  [45.7543642, 4.8617906], // Archives Départementales
  // Archives → Gare Part-Dieu Villette (OSM Ways 195736521, 196540680, 1251989054)
  [45.7575676, 4.8618014],
  [45.7594280, 4.8619158],
  [45.7599839, 4.8619427],
  [45.7604181, 4.8619646],
  [45.7607803, 4.8619820], // Gare Part-Dieu - Villette
  // Gare Part-Dieu Villette → La Doua (shared T1/T4 track, OSM Way 195738775 + T1 ways)
  [45.7614888, 4.8620150],
  [45.7627212, 4.8620743],
  [45.7634426, 4.8620886],
  [45.7639943, 4.8620668],
  [45.7643156, 4.8620519], // Thiers - Lafayette
  [45.7652387, 4.8619645],
  [45.7666845, 4.8619410], // Collège Bellecombe
  [45.7681543, 4.8618170],
  [45.7691512, 4.8617581],
  [45.7709503, 4.8630540], // Charpennes - Charles Hernu
  [45.7729309, 4.8631996],
  [45.7740693, 4.8640433], // Le Tonkin
  [45.7779464, 4.8669658], // Condorcet
  [45.7808653, 4.8663444], // Université Lyon 1
  // Université Lyon 1 → La Doua (eastbound T1/T4 track)
  [45.7809242, 4.8666069],
  [45.7811226, 4.8674904],
  [45.7814138, 4.8687872],
  [45.7815182, 4.8692522],
  [45.7815740, 4.8696767],
  [45.7815490, 4.8705513],
  [45.7816777, 4.8712536],
  [45.7816019, 4.8716645],
  [45.7815748, 4.8717901],
  [45.7815027, 4.8721026],
  [45.7815207, 4.8721608], // La Doua - Gaston Berger
]

function getOccupancyColor(pct) {
  if (pct < 50) return '#059669'
  if (pct < 75) return '#d97706'
  if (pct < 90) return '#ea580c'
  return '#dc2626'
}

function makeTramIcon(bgColor, borderColor, num, selected) {
  const ring = selected ? `box-shadow:0 0 0 3px ${bgColor},0 2px 8px rgba(0,0,0,0.35);` : 'box-shadow:0 2px 8px rgba(0,0,0,0.3);'
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:28px;height:28px;background:${bgColor};border:3px solid ${borderColor};border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;${ring}cursor:pointer;">🚋<div style="position:absolute;top:-6px;right:-6px;background:#fff;color:${bgColor};border:1.5px solid ${bgColor};border-radius:50%;width:14px;height:14px;font-size:9px;font-weight:900;display:flex;align-items:center;justify-content:center;line-height:1;">${num}</div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -18],
  })
}

function useUserLocation() {
  const [location, setLocation] = useState(null)
  const [accuracy, setAccuracy] = useState(null)
  useEffect(() => {
    if (!navigator.geolocation) return
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setAccuracy(pos.coords.accuracy)
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 10000 }
    )
    return () => navigator.geolocation.clearWatch(id)
  }, [])
  return { location, accuracy }
}

function InvalidateSizeOnMount() {
  const map = useMap()
  useEffect(() => { setTimeout(() => map.invalidateSize(), 100) }, [map])
  return null
}

function avgOcc(cars) {
  return Math.round(cars.reduce((s, c) => s + (c.current / c.capacity) * 100, 0) / cars.length)
}

export default function TramMap({ t1Trains, t4Trains, selectedT1, selectedT4 }) {
  const { location: userLoc, accuracy } = useUserLocation()

  return (
    <MapContainer
      center={[45.738, 4.862]}
      zoom={12}
      style={{ width: '100%', height: '100%' }}
      zoomControl={true}
    >
      <InvalidateSizeOnMount />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* T1 route — amber */}
      <Polyline positions={t1RoutePositions} pathOptions={{ color: '#f59e0b', weight: 4, opacity: 0.9 }} />

      {/* T4 route — purple */}
      <Polyline positions={t4RoutePositions} pathOptions={{ color: '#873F98', weight: 4, opacity: 0.9 }} />

      {/* T1 station markers */}
      {T1_STATIONS.map(s => (
        <Marker key={s.id} position={[s.lat, s.lng]} icon={t1StationIcon}>
          <Popup>
            <div style={{ fontFamily: 'system-ui', fontSize: '13px', color: '#1e293b' }}>
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>{s.name}</div>
              <span style={{ background: '#f59e0b', color: '#fff', fontWeight: 700, fontSize: '10px', borderRadius: '4px', padding: '2px 6px' }}>T1</span>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* T4 station markers */}
      {T4_STATIONS.map(s => (
        <Marker key={s.id} position={[s.lat, s.lng]} icon={t4StationIcon}>
          <Popup>
            <div style={{ fontFamily: 'system-ui', fontSize: '13px', color: '#1e293b' }}>
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>{s.name}</div>
              <span style={{ background: '#873F98', color: '#fff', fontWeight: 700, fontSize: '10px', borderRadius: '4px', padding: '2px 6px' }}>T4</span>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* T1 tram markers */}
      {t1Trains.map((train, i) => {
        if (!train.tramPosition) return null
        const occ = avgOcc(train.cars)
        const selected = i === selectedT1
        return (
          <Marker
            key={i}
            position={[train.tramPosition.lat, train.tramPosition.lng]}
            icon={makeTramIcon('#f59e0b', getOccupancyColor(occ), i + 1, selected)}
            eventHandlers={{ click: train.onTramClick }}
          >
            <Popup>
              <div style={{ fontFamily: 'system-ui', fontSize: '13px', minWidth: '155px', color: '#1e293b' }}>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '5px' }}>T1 · Train {i + 1}</div>
                <div style={{ color: '#64748b', marginBottom: '2px' }}>→ <strong style={{ color: '#1e293b' }}>{train.direction}</strong></div>
                <div style={{ color: '#64748b', marginBottom: '5px' }}>Next: <strong style={{ color: '#d97706' }}>{train.nextStation?.name}</strong></div>
                <div style={{ color: getOccupancyColor(occ), fontWeight: 700, marginBottom: '7px' }}>{occ}% occupied</div>
                <button onClick={train.onTramClick} style={{ background: '#f59e0b', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 700, fontSize: '12px', color: '#fff', width: '100%' }}>View details →</button>
              </div>
            </Popup>
          </Marker>
        )
      })}

      {/* T4 tram markers */}
      {t4Trains.map((train, i) => {
        if (!train.tramPosition) return null
        const occ = avgOcc(train.cars)
        const selected = i === selectedT4
        return (
          <Marker
            key={i}
            position={[train.tramPosition.lat, train.tramPosition.lng]}
            icon={makeTramIcon('#873F98', getOccupancyColor(occ), i + 1, selected)}
            eventHandlers={{ click: train.onTramClick }}
          >
            <Popup>
              <div style={{ fontFamily: 'system-ui', fontSize: '13px', minWidth: '155px', color: '#1e293b' }}>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '5px' }}>T4 · Train {i + 1}</div>
                <div style={{ color: '#64748b', marginBottom: '2px' }}>→ <strong style={{ color: '#1e293b' }}>{train.direction}</strong></div>
                <div style={{ color: '#64748b', marginBottom: '5px' }}>Next: <strong style={{ color: '#873F98' }}>{train.nextStation?.name}</strong></div>
                <div style={{ color: getOccupancyColor(occ), fontWeight: 700, marginBottom: '7px' }}>{occ}% occupied</div>
                <button onClick={train.onTramClick} style={{ background: '#873F98', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 700, fontSize: '12px', color: '#fff', width: '100%' }}>View details →</button>
              </div>
            </Popup>
          </Marker>
        )
      })}

      {/* User location */}
      {userLoc && (
        <>
          {accuracy && (
            <Circle
              center={[userLoc.lat, userLoc.lng]}
              radius={accuracy}
              pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 1.5, opacity: 0.4 }}
            />
          )}
          <Marker position={[userLoc.lat, userLoc.lng]} icon={userLocationIcon}>
            <Popup>
              <div style={{ fontFamily: 'system-ui', fontSize: '13px', color: '#1e293b' }}>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>📍 You are here</div>
                {accuracy && <div style={{ color: '#64748b', fontSize: '11px' }}>Accuracy: ~{Math.round(accuracy)}m</div>}
              </div>
            </Popup>
          </Marker>
        </>
      )}
    </MapContainer>
  )
}