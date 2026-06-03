import { useState, useEffect, useRef } from 'react'

// ── T1 line: 26 stops, index 0 = Croix-Luizet (north), index 25 = Debourg (south) ──
export const T1_STATIONS = [
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

// Generic simulation factory — call once per line
function createSimulationHook(stations, directions, startSeg) {
  return function () {
    const [segmentIndex,   setSegmentIndex]   = useState(startSeg)
    const [progress,       setProgress]       = useState(0)
    const [directionIndex, setDirectionIndex] = useState(0)
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

    const tramPosition = interpolatePosition(fromStation, toStation, progress)
    const direction    = directions[directionIndex]
    const nextStation  = toStation

    const refreshSimulation = () => {
      setCars(initCars())
      setSegmentIndex(startSeg)
      setProgress(0)
      setDirectionIndex(0)
    }

    return { tramPosition, direction, nextStation, cars, arrivals, refreshSimulation }
  }
}

// T1: direction 0 = heading south toward Debourg
export const useTramSimulation    = createSimulationHook(T1_STATIONS, ['Debourg',                 'IUT Feyssine'], 10)
// T4: direction 0 = heading north toward La Doua
export const useTramSimulationT4  = createSimulationHook(T4_STATIONS, ['La Doua - Gaston Berger', 'Hôpital Feyzin Vénissieux'], 12)
