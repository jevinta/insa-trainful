import { useState, useEffect, useRef } from 'react'

// ── T1 line: 27 stops, index 0 = IUT - Feyssine (north), index 26 = Debourg (south) ──
export const T1_STATIONS = [
  { id: 'iutfeyssine',   name: 'IUT - Feyssine',                     lat: 45.7869337, lng: 4.8819277 },
  { id: 'croixluizet',   name: 'Croix-Luizet',                      lat: 45.7836714, lng: 4.8832536 },
  { id: 'einstein',      name: 'INSA - Einstein',                    lat: 45.7824397, lng: 4.8776632 },
  { id: 'ladoua',        name: 'La Doua - Gaston Berger',            lat: 45.7815207, lng: 4.8721608 },
  { id: 'univ1',         name: 'Université Lyon 1',                  lat: 45.7808653, lng: 4.8663444 },
  { id: 'condorcet',     name: 'Condorcet',                          lat: 45.7779464, lng: 4.8669658 },
  { id: 'tonkin',        name: 'Le Tonkin',                          lat: 45.7740693, lng: 4.8640433 },
  { id: 'charpennes',    name: 'Charpennes - Charles Hernu',         lat: 45.7709503, lng: 4.8630540 },
  { id: 'bellecombe',    name: 'Collège Bellecombe',                 lat: 45.7666845, lng: 4.8619410 },
  { id: 'thiers',        name: 'Thiers - Lafayette',                 lat: 45.7643156, lng: 4.8620519 },
  { id: 'partdieu',      name: 'Gare Part-Dieu - Vivier Merle',     lat: 45.7616011, lng: 4.8579173 },
  { id: 'auditorium',    name: 'Part-Dieu - Auditorium',             lat: 45.7606742, lng: 4.8538132 },
  { id: 'palais',        name: 'Palais de Justice - Mairie du 3e',  lat: 45.7603239, lng: 4.8483963 },
  { id: 'saxe',          name: 'Saxe-Préfecture',                    lat: 45.7601118, lng: 4.8452808 },
  { id: 'liberte',       name: 'Liberté',                            lat: 45.7588580, lng: 4.8424556 },
  { id: 'guillotiere',   name: 'Guillotière',                        lat: 45.7549452, lng: 4.8425387 },
  { id: 'standre',       name: 'Saint-André',                        lat: 45.7528829, lng: 4.8410584 },
  { id: 'universite',    name: "Rue de l'Université",               lat: 45.7511473, lng: 4.8389606 },
  { id: 'quaiclaude',    name: 'Quai Claude Bernard',               lat: 45.7496772, lng: 4.8353169 },
  { id: 'perrache',      name: 'Perrache',                           lat: 45.7495322, lng: 4.8270476 },
  { id: 'archives',      name: 'Place des Archives',                lat: 45.7470663, lng: 4.8245818 },
  { id: 'blandine',      name: 'Sainte-Blandine',                   lat: 45.7442030, lng: 4.8221408 },
  { id: 'montrochet',    name: 'Hôtel de Région Montrochet',        lat: 45.7405673, lng: 4.8190408 },
  { id: 'confluences',   name: 'Musée des Confluences',             lat: 45.7336611, lng: 4.8189123 },
  { id: 'tonygarn',      name: 'Halle Tony Garnier',                lat: 45.7317251, lng: 4.8228408 },
  { id: 'enslyon',       name: 'ENS Lyon',                           lat: 45.7314628, lng: 4.8288348 },
  { id: 'debourg',       name: 'Debourg',                            lat: 45.7311865, lng: 4.8346207 },
]

// ── T4 line: 29 stops, index 0 = Hôpital Feyzin (south), index 28 = La Doua (north) ──
export const T4_STATIONS = [
  { id: 't4_hopital',    name: 'Hôpital Feyzin Vénissieux',        lat: 45.6882795, lng: 4.8651840 },
  { id: 't4_darnaise',   name: 'Darnaise',                          lat: 45.6926515, lng: 4.8643379 },
  { id: 't4_lenine',     name: 'Lénine - Corsière',                 lat: 45.6968368, lng: 4.8617597 },
  { id: 't4_thorez',     name: 'Maurice Thorez',                    lat: 45.6998412, lng: 4.8632933 },
  { id: 't4_leclerc',    name: 'Division Leclerc',                  lat: 45.6984273, lng: 4.8681589 },
  { id: 't4_venissy',    name: 'Vénissy - Frida Kahlo',            lat: 45.6960059, lng: 4.8719378 },
  { id: 't4_herriot',    name: 'Herriot - Cagne',                   lat: 45.6937696, lng: 4.8754428 },
  { id: 't4_brel',       name: 'Lycée Jacques Brel',               lat: 45.6949124, lng: 4.8799064 },
  { id: 't4_hotel',      name: 'Marcel Houël - Hôtel de Ville',   lat: 45.6964885, lng: 4.8845462 },
  { id: 't4_croizat',    name: 'Croizat - Paul Bert',               lat: 45.7000467, lng: 4.8876491 },
  { id: 't4_garevenil',  name: 'Gare de Vénissieux',               lat: 45.7056646, lng: 4.8877581 },
  { id: 't4_borelle',    name: 'La Borelle',                        lat: 45.7111586, lng: 4.8821497 },
  { id: 't4_joliot',     name: 'Joliot Curie - Marcel Sembat',     lat: 45.7155233, lng: 4.8784129 },
  { id: 't4_etatsviv',   name: 'États-Unis Viviani',               lat: 45.7249362, lng: 4.8710796 },
  { id: 't4_beauvisage', name: 'Beauvisage - C.I.S.L.',            lat: 45.7298419, lng: 4.8672560 },
  { id: 't4_etatsmus',   name: 'États-Unis - Musée Tony Garnier',  lat: 45.7330342, lng: 4.8647708 },
  { id: 't4_lumiere',    name: 'Lycée Lumière',                    lat: 45.7368618, lng: 4.8617905 },
  { id: 't4_jetdeau',    name: "Jet d'eau - Mendès France",        lat: 45.7400728, lng: 4.8591894 },
  { id: 't4_colbert',    name: 'Lycée Colbert',                    lat: 45.7456554, lng: 4.8590580 },
  { id: 't4_montluc',    name: 'Manufacture Montluc',              lat: 45.7501481, lng: 4.8603440 },
  { id: 't4_archivedep', name: 'Archives Départementales',         lat: 45.7543642, lng: 4.8617906 },
  { id: 't4_villette',   name: 'Gare Part-Dieu - Villette',        lat: 45.7607803, lng: 4.8619820 },
  { id: 't4_thiers',     name: 'Thiers - Lafayette',               lat: 45.7643156, lng: 4.8620519 },
  { id: 't4_belle',      name: 'Collège Bellecombe',               lat: 45.7666845, lng: 4.8619410 },
  { id: 't4_charpen',    name: 'Charpennes - Charles Hernu',       lat: 45.7709503, lng: 4.8630540 },
  { id: 't4_tonkin',     name: 'Le Tonkin',                        lat: 45.7740693, lng: 4.8640433 },
  { id: 't4_condorcet',  name: 'Condorcet',                        lat: 45.7779464, lng: 4.8669658 },
  { id: 't4_univ',       name: 'Université Lyon 1',                lat: 45.7808653, lng: 4.8663444 },
  { id: 't4_ladoua',     name: 'La Doua - Gaston Berger',          lat: 45.7815207, lng: 4.8721608 },
]

// Keep STATIONS pointing to T1 for any legacy usage
export const STATIONS = T1_STATIONS

const CAR_CAPACITY = 60
const NUM_CARS = 3

function randomOccupancy() {
  return Math.floor(Math.random() * (CAR_CAPACITY + 1))
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

function randomVariation(current) {
  const delta = Math.floor(Math.random() * 11) - 5
  return clamp(current + delta, 0, CAR_CAPACITY)
}

function initCars() {
  return Array.from({ length: NUM_CARS }, (_, i) => ({
    id: i + 1,
    current: randomOccupancy(),
    capacity: CAR_CAPACITY,
  }))
}

export function interpolatePosition(fromStation, toStation, progress) {
  return {
    lat: fromStation.lat + (toStation.lat - fromStation.lat) * progress,
    lng: fromStation.lng + (toStation.lng - fromStation.lng) * progress,
  }
}

// Interpolate along an ordered array of [lat, lng] waypoints at fractional progress 0–1
function interpolateAlongWaypoints(waypoints, progress) {
  if (waypoints.length === 1) return { lat: waypoints[0][0], lng: waypoints[0][1] }
  let total = 0
  const segs = []
  for (let i = 0; i < waypoints.length - 1; i++) {
    const d = Math.hypot(waypoints[i + 1][0] - waypoints[i][0], waypoints[i + 1][1] - waypoints[i][1])
    segs.push(d)
    total += d
  }
  let dist = progress * total
  for (let i = 0; i < segs.length; i++) {
    if (dist <= segs[i] || i === segs.length - 1) {
      const t = segs[i] > 0 ? Math.min(dist / segs[i], 1) : 0
      return {
        lat: waypoints[i][0] + (waypoints[i + 1][0] - waypoints[i][0]) * t,
        lng: waypoints[i][1] + (waypoints[i + 1][1] - waypoints[i][1]) * t,
      }
    }
    dist -= segs[i]
  }
  const last = waypoints[waypoints.length - 1]
  return { lat: last[0], lng: last[1] }
}

export function estimateArrivals(stations, segmentIndex, directionIndex) {
  const n = stations.length
  const order = directionIndex === 0
    ? Array.from({ length: n }, (_, i) => i)
    : Array.from({ length: n }, (_, i) => n - 1 - i)

  const arrivals = {}
  let mins = 0

  for (const stIdx of order) {
    const isAhead = directionIndex === 0 ? stIdx > segmentIndex : stIdx <= segmentIndex
    if (isAhead) mins += Math.floor(Math.random() * 3) + 2
    arrivals[stations[stIdx].id] = Math.max(1, mins + Math.floor(Math.random() * 2))
    if (isAhead) mins += 1
  }

  return arrivals
}

// Generic simulation factory — call once per line.
// segmentWaypoints: optional array of [[lat,lng],...] per segment for accurate polyline tracking.
function createSimulationHook(stations, directions, startSeg, startDirection = 0, segmentWaypoints = null) {
  return function () {
    const [segmentIndex,   setSegmentIndex]   = useState(startSeg)
    const [progress,       setProgress]       = useState(0)
    const [directionIndex, setDirectionIndex] = useState(startDirection)
    const [cars,           setCars]           = useState(initCars)
    const [arrivals,       setArrivals]       = useState({})

    const stateRef = useRef({ segmentIndex, progress, directionIndex })
    stateRef.current = { segmentIndex, progress, directionIndex }

    useEffect(() => {
      const STEP = 0.06
      const interval = setInterval(() => {
        const { segmentIndex: seg, progress: prog, directionIndex: dir } = stateRef.current
        let newProg = prog + STEP

        if (newProg >= 1) {
          newProg = 0
          if (dir === 0) {
            if (seg < stations.length - 2) setSegmentIndex(seg + 1)
            else { setSegmentIndex(seg); setDirectionIndex(1) }
          } else {
            if (seg > 0) setSegmentIndex(seg - 1)
            else { setSegmentIndex(0); setDirectionIndex(0) }
          }
        }

        setProgress(newProg >= 1 ? 0 : newProg)
      }, 3000)

      return () => clearInterval(interval)
    }, [])

    useEffect(() => {
      const interval = setInterval(() => {
        setCars(prev => prev.map(car => ({ ...car, current: randomVariation(car.current) })))
      }, 10000)
      return () => clearInterval(interval)
    }, [])

    useEffect(() => {
      setArrivals(estimateArrivals(stations, segmentIndex, directionIndex))
    }, [segmentIndex, directionIndex])

    const fromStation = directionIndex === 0 ? stations[segmentIndex]     : stations[segmentIndex + 1]
    const toStation   = directionIndex === 0 ? stations[segmentIndex + 1] : stations[segmentIndex]

    const tramPosition = segmentWaypoints
      ? interpolateAlongWaypoints(
          directionIndex === 0
            ? segmentWaypoints[segmentIndex]
            : [...segmentWaypoints[segmentIndex]].reverse(),
          progress
        )
      : interpolatePosition(fromStation, toStation, progress)
    const direction    = directions[directionIndex]
    const nextStation  = toStation

    const refreshSimulation = () => {
      setCars(initCars())
      setSegmentIndex(startSeg)
      setProgress(0)
      setDirectionIndex(startDirection)
    }

    return { tramPosition, direction, nextStation, cars, arrivals, refreshSimulation }
  }
}

// T1: direction 0 = heading south toward Debourg, direction 1 = heading north toward IUT
export const useTramT1_1 = createSimulationHook(T1_STATIONS, ['Debourg', 'IUT - Feyssine'],  3, 0)
export const useTramT1_2 = createSimulationHook(T1_STATIONS, ['Debourg', 'IUT - Feyssine'], 11, 0)
export const useTramT1_3 = createSimulationHook(T1_STATIONS, ['Debourg', 'IUT - Feyssine'], 20, 1)

// T4: direction 0 = heading north toward La Doua, direction 1 = heading south toward Hôpital Feyzin
export const useTramT4_1 = createSimulationHook(T4_STATIONS, ['La Doua - Gaston Berger', 'Hôpital Feyzin Vénissieux'],  4, 0)
export const useTramT4_2 = createSimulationHook(T4_STATIONS, ['La Doua - Gaston Berger', 'Hôpital Feyzin Vénissieux'], 13, 0)
export const useTramT4_3 = createSimulationHook(T4_STATIONS, ['La Doua - Gaston Berger', 'Hôpital Feyzin Vénissieux'], 22, 1)

// ── Rhônexpress line: 4 stops, index 0 = Part-Dieu (west), index 3 = Airport (east) ──
export const RHONEXPRESS_STATIONS = [
  { id: 'rx_partdieu', name: 'Part-Dieu - Villette',          lat: 45.7602839, lng: 4.8620314 },
  { id: 'rx_lasoie',   name: 'Vaulx-en-Velin - La Soie',     lat: 45.7610693, lng: 4.9221567 },
  { id: 'rx_meyzieu',  name: 'Meyzieu - Zone Industrielle',  lat: 45.7677854, lng: 5.0316974 },
  { id: 'rx_airport',  name: 'Aéroport Saint-Exupéry',       lat: 45.7210481, lng: 5.0755092 },
]

// Per-segment route waypoints for accurate on-track interpolation (OSM-sourced)
const RX_SEG_WAYPOINTS = [
  // Segment 0: Part-Dieu → La Soie
  [
    [45.7602839, 4.8620314],
    [45.7545197, 4.8849958],
    [45.7551689, 4.8867540],
    [45.7576247, 4.9045150],
    [45.7584382, 4.9104685],
    [45.7589174, 4.9135004],
    [45.7610693, 4.9221567],
  ],
  // Segment 1: La Soie → Meyzieu ZI
  // OSM ways (reversed where needed): existing arc data + Ways 16580687, 187397462,
  // 187379316, 187397465, 195732521
  [
    [45.7610693, 4.9221567],
    [45.7630000, 4.9310000],
    [45.7655000, 4.9395000],
    [45.7675078, 4.9477221],
    [45.7682802, 4.9496944],
    [45.7738648, 4.9593147],
    [45.7747676, 4.9611013],
    [45.7774723, 4.9690520],
    [45.7774623, 4.9696918],
    [45.7773994, 4.9703076],
    [45.7772111, 4.9711915],
    [45.7769572, 4.9719157],
    [45.7762832, 4.9731246],
    [45.7757557, 4.9739142],
    [45.7752833, 4.9746536],
    [45.7749646, 4.9753386],
    [45.7746142, 4.9763231],
    [45.7742381, 4.9779249],
    [45.7739000, 4.9800000],
    [45.7736000, 4.9820000],
    // Way 16580687
    [45.7734639, 4.9841516],
    [45.7733723, 4.9849113],
    // Way 187397462 (reversed)
    [45.7732641, 4.9858119],
    [45.7732439, 4.9859804],
    [45.7731348, 4.9868294],
    [45.7730464, 4.9875891],
    [45.7727376, 4.9900946],
    [45.7727285, 4.9901683],
    [45.7727217, 4.9902272],
    [45.7727129, 4.9903025],
    [45.7727046, 4.9903710],
    [45.7725483, 4.9916634],
    [45.7723936, 4.9929257],
    [45.7721845, 4.9945864],
    [45.7720082, 4.9960795],
    [45.7718461, 4.9974591],
    // Way 187379316 (reversed)
    [45.7717873, 4.9979150],
    [45.7717084, 4.9985636],
    [45.7716122, 4.9993107],
    [45.7715409, 4.9999353],
    [45.7714894, 5.0003681],
    // Way 187397465 (reversed)
    [45.7714457, 5.0007095],
    [45.7714395, 5.0007655],
    [45.7714329, 5.0008237],
    [45.7714263, 5.0008727],
    [45.7714088, 5.0010113],
    [45.7712581, 5.0022036],
    [45.7711706, 5.0029130],
    [45.7711285, 5.0032682],
    [45.7710880, 5.0035681],
    [45.7710803, 5.0036245],
    [45.7707110, 5.0066732],
    [45.7705234, 5.0081985],
    [45.7704287, 5.0089619],
    [45.7703368, 5.0097300],
    [45.7699933, 5.0125843],
    [45.7699778, 5.0127148],
    [45.7699655, 5.0128180],
    [45.7699582, 5.0128794],
    [45.7699317, 5.0131031],
    [45.7697873, 5.0143267],
    [45.7693037, 5.0182877],
    [45.7688238, 5.0222037],
    [45.7686623, 5.0235206],
    [45.7682000, 5.0260000],
    [45.7680000, 5.0283000],
    // Way 195732521 nodes 27→15 (approaching Meyzieu ZI from west)
    [45.7679900, 5.0295224],
    [45.7679631, 5.0299659],
    [45.7679550, 5.0300895],
    [45.7679510, 5.0301508],
    [45.7679470, 5.0302109],
    [45.7679433, 5.0302668],
    [45.7679379, 5.0303567],
    [45.7679268, 5.0304963],
    [45.7679135, 5.0306316],
    [45.7678957, 5.0307906],
    [45.7678287, 5.0313434],
    [45.7678266, 5.0313602],
    [45.7677854, 5.0316974],
  ],
  // Segment 2: Meyzieu ZI → Airport
  // OSM Ways 195732521 (nodes 15→1), 194776609 (139-node viaduct), 195738508 (reversed)
  [
    [45.7677854, 5.0316974],
    // Way 195732521 nodes 14→1 (departing east from station)
    [45.7677640, 5.0318689],
    [45.7677503, 5.0319673],
    [45.7677372, 5.0320569],
    [45.7677189, 5.0321666],
    [45.7677016, 5.0322554],
    [45.7676763, 5.0323705],
    [45.7676551, 5.0324588],
    [45.7676060, 5.0326570],
    [45.7675759, 5.0327851],
    [45.7675548, 5.0328830],
    [45.7675329, 5.0329902],
    [45.7675103, 5.0331387],
    [45.7674818, 5.0333600],
    [45.7674395, 5.0337112],
    // Way 194776609 (all 128 captured nodes, full viaduct to airport)
    [45.7674073, 5.0337020],
    [45.7671328, 5.0359790],
    [45.7670975, 5.0362699],
    [45.7669598, 5.0373950],
    [45.7668740, 5.0380428],
    [45.7668069, 5.0384838],
    [45.7667452, 5.0388235],
    [45.7666762, 5.0391357],
    [45.7665880, 5.0394683],
    [45.7664328, 5.0400010],
    [45.7663158, 5.0403419],
    [45.7662258, 5.0405655],
    [45.7660616, 5.0409375],
    [45.7659712, 5.0411224],
    [45.7658539, 5.0413536],
    [45.7657841, 5.0414849],
    [45.7657367, 5.0415740],
    [45.7656282, 5.0417562],
    [45.7654988, 5.0419565],
    [45.7653870, 5.0421214],
    [45.7652396, 5.0423203],
    [45.7650707, 5.0425361],
    [45.7649428, 5.0426861],
    [45.7647994, 5.0428503],
    [45.7646319, 5.0430178],
    [45.7645180, 5.0431250],
    [45.7643686, 5.0432603],
    [45.7641656, 5.0434258],
    [45.7640457, 5.0435142],
    [45.7639928, 5.0435557],
    [45.7638447, 5.0436542],
    [45.7636784, 5.0437606],
    [45.7634197, 5.0439004],
    [45.7631809, 5.0440131],
    [45.7629317, 5.0441098],
    [45.7626181, 5.0442092],
    [45.7623780, 5.0442638],
    [45.7621203, 5.0443083],
    [45.7617395, 5.0443405],
    [45.7613423, 5.0443401],
    [45.7605038, 5.0443225],
    [45.7598393, 5.0442996],
    [45.7597275, 5.0443063],
    [45.7596214, 5.0443224],
    [45.7591985, 5.0443695],
    [45.7586740, 5.0444720],
    [45.7582667, 5.0445872],
    [45.7579960, 5.0446783],
    [45.7577361, 5.0447855],
    [45.7572403, 5.0450106],
    [45.7567996, 5.0452680],
    [45.7565343, 5.0454404],
    [45.7562595, 5.0456394],
    [45.7558739, 5.0459397],
    [45.7556474, 5.0461387],
    [45.7551860, 5.0465897],
    [45.7548100, 5.0470247],
    [45.7523553, 5.0501562],
    [45.7497241, 5.0535219],
    [45.7447054, 5.0599556],
    [45.7440915, 5.0607643],
    [45.7438549, 5.0611121],
    [45.7437352, 5.0612983],
    [45.7435644, 5.0615703],
    [45.7433761, 5.0619006],
    [45.7431825, 5.0622631],
    [45.7430579, 5.0625176],
    [45.7428498, 5.0629509],
    [45.7426594, 5.0633924],
    [45.7424505, 5.0639233],
    [45.7422660, 5.0644699],
    [45.7421365, 5.0648777],
    [45.7419522, 5.0655542],
    [45.7417507, 5.0664354],
    [45.7414509, 5.0680955],
    [45.7413531, 5.0686142],
    [45.7412386, 5.0691349],
    [45.7411240, 5.0696445],
    [45.7409835, 5.0701429],
    [45.7408198, 5.0706669],
    [45.7407287, 5.0709242],
    [45.7406346, 5.0711771],
    [45.7404333, 5.0716627],
    [45.7402244, 5.0721210],
    [45.7400144, 5.0725474],
    [45.7397846, 5.0729587],
    [45.7396746, 5.0731567],
    [45.7395590, 5.0733431],
    [45.7394509, 5.0735097],
    [45.7392094, 5.0738608],
    [45.7390763, 5.0740442],
    [45.7388603, 5.0743217],
    [45.7386865, 5.0745320],
    [45.7384697, 5.0747765],
    [45.7383109, 5.0749454],
    [45.7379951, 5.0752534],
    [45.7377573, 5.0754665],
    [45.7375130, 5.0756721],
    [45.7373314, 5.0758123],
    [45.7371503, 5.0759479],
    [45.7368762, 5.0761296],
    [45.7367059, 5.0762373],
    [45.7364558, 5.0763821],
    [45.7362734, 5.0764805],
    [45.7359513, 5.0766335],
    [45.7356394, 5.0767621],
    [45.7354495, 5.0768312],
    [45.7352615, 5.0768891],
    [45.7350037, 5.0769652],
    [45.7347472, 5.0770274],
    [45.7346090, 5.0770578],
    [45.7344604, 5.0770864],
    [45.7343156, 5.0771108],
    [45.7341459, 5.0771365],
    [45.7339782, 5.0771575],
    [45.7338203, 5.0771715],
    [45.7336501, 5.0771855],
    [45.7334554, 5.0771931],
    [45.7333182, 5.0771973],
    [45.7331068, 5.0771971],
    [45.7329026, 5.0771903],
    [45.7326977, 5.0771770],
    [45.7325068, 5.0771615],
    [45.7323260, 5.0771394],
    [45.7319188, 5.0770845],
    [45.7298454, 5.0767746],
    [45.7277759, 5.0764601],
    [45.7274069, 5.0764146],
    // Way 195738508 (reversed, nodes 7→1, continuing south to airport terminal)
    [45.7263582, 5.0762589],
    [45.7253033, 5.0760868],
    [45.7242105, 5.0759149],
    [45.7236721, 5.0758231],
    [45.7233969, 5.0757842],
    [45.7230754, 5.0757320],
    [45.7224879, 5.0756363],
    [45.7210481, 5.0755092],
  ],
]

// Full polyline for TramMap (segments joined, duplicate boundary points removed)
export const RHONEXPRESS_ROUTE_POSITIONS = [
  ...RX_SEG_WAYPOINTS[0],
  ...RX_SEG_WAYPOINTS[1].slice(1),
  ...RX_SEG_WAYPOINTS[2].slice(1),
]

const RX_DIRS = ['Aéroport Saint-Exupéry', 'Part-Dieu - Villette']

// RX: direction 0 = heading east toward Airport, direction 1 = heading west toward Part-Dieu
export const useRhonexpressRX_1 = createSimulationHook(RHONEXPRESS_STATIONS, RX_DIRS, 0, 0, RX_SEG_WAYPOINTS)
export const useRhonexpressRX_2 = createSimulationHook(RHONEXPRESS_STATIONS, RX_DIRS, 1, 0, RX_SEG_WAYPOINTS)
export const useRhonexpressRX_3 = createSimulationHook(RHONEXPRESS_STATIONS, RX_DIRS, 2, 1, RX_SEG_WAYPOINTS)

// Legacy aliases
export const useTramSimulation   = useTramT1_2
export const useTramSimulationT4 = useTramT4_2
