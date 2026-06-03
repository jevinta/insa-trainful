import { useState, useEffect, useRef } from 'react'

export const STATIONS = [
  { id: 'insa1',    name: 'Université Lyon 1',       lat: 45.7808653, lng: 4.8663444 },
  { id: 'ladoua',   name: 'La Doua - Gaston Berger', lat: 45.7815207, lng: 4.8721608 },
  { id: 'einstein', name: 'INSA - Einstein',          lat: 45.7824397, lng: 4.8776632 },
]

// T1 real endpoints for direction display
const DIRECTIONS = ['IUT Feyssine', 'Debourg']

const CAR_CAPACITY = 60
const NUM_CARS = 3

function randomOccupancy() {
  return Math.floor(Math.random() * (CAR_CAPACITY + 1))
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

function randomVariation(current) {
  const delta = Math.floor(Math.random() * 11) - 5 // -5 to +5
  return clamp(current + delta, 0, CAR_CAPACITY)
}

function initCars() {
  return Array.from({ length: NUM_CARS }, (_, i) => ({
    id: i + 1,
    current: randomOccupancy(),
    capacity: CAR_CAPACITY,
  }))
}

/**
 * Interpolate lat/lng between two stations given progress 0..1
 */
export function interpolatePosition(fromStation, toStation, progress) {
  return {
    lat: fromStation.lat + (toStation.lat - fromStation.lat) * progress,
    lng: fromStation.lng + (toStation.lng - fromStation.lng) * progress,
  }
}

/**
 * Returns estimated arrival minutes for each station given tram state.
 * Very rough simulation: stations ahead get incrementing minutes.
 */
export function estimateArrivals(segmentIndex, progress, directionIndex) {
  // direction 0: moving from index 0→1→2 (IUT Feyssine end)
  // direction 1: moving from index 2→1→0 (Debourg end)
  const order = directionIndex === 0
    ? [0, 1, 2]
    : [2, 1, 0]

  const arrivals = {}
  let minutesAhead = 0

  for (let i = 0; i < order.length; i++) {
    const stIdx = order[i]
    const station = STATIONS[stIdx]

    // If the tram is currently travelling toward this station
    const isAhead = directionIndex === 0
      ? stIdx > segmentIndex || (stIdx === segmentIndex + 1)
      : stIdx < segmentIndex || (stIdx === segmentIndex - 1)

    minutesAhead += isAhead ? Math.floor(Math.random() * 3) + 2 : 0
    arrivals[station.id] = Math.max(1, minutesAhead + Math.floor(Math.random() * 2))
    minutesAhead += 2
  }

  // Make sure all stations have an arrival time (fallback random)
  STATIONS.forEach(s => {
    if (arrivals[s.id] === undefined) {
      arrivals[s.id] = Math.floor(Math.random() * 14) + 1
    }
  })

  return arrivals
}

export function useTramSimulation() {
  // segmentIndex: which segment tram is on (0 = between stations[0] and stations[1], 1 = between stations[1] and stations[2])
  // directionIndex: 0 = moving forward (0→1→2), 1 = moving backward (2→1→0)
  const [segmentIndex, setSegmentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [directionIndex, setDirectionIndex] = useState(0)
  const [cars, setCars] = useState(initCars)
  const [arrivals, setArrivals] = useState({})

  const stateRef = useRef({ segmentIndex, progress, directionIndex })
  stateRef.current = { segmentIndex, progress, directionIndex }

  // Advance tram position every 3 seconds
  useEffect(() => {
    const STEP = 0.08 // fraction of segment per tick

    const interval = setInterval(() => {
      const { segmentIndex: seg, progress: prog, directionIndex: dir } = stateRef.current
      let newProg = prog + STEP

      if (newProg >= 1) {
        newProg = 0
        // Move to next segment or reverse direction
        if (dir === 0) {
          if (seg < STATIONS.length - 2) {
            setSegmentIndex(seg + 1)
          } else {
            // Reached last station, reverse
            setSegmentIndex(seg)
            setDirectionIndex(1)
          }
        } else {
          if (seg > 0) {
            setSegmentIndex(seg - 1)
          } else {
            // Reached first station, reverse
            setSegmentIndex(0)
            setDirectionIndex(0)
          }
        }
      }

      setProgress(newProg >= 1 ? 0 : newProg)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Update occupancy every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCars(prev => prev.map(car => ({
        ...car,
        current: randomVariation(car.current),
      })))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Recompute arrivals whenever segment or direction changes
  useEffect(() => {
    setArrivals(estimateArrivals(segmentIndex, progress, directionIndex))
  }, [segmentIndex, directionIndex])

  // Compute current tram position
  const fromStation = directionIndex === 0
    ? STATIONS[segmentIndex]
    : STATIONS[segmentIndex + 1]
  const toStation = directionIndex === 0
    ? STATIONS[segmentIndex + 1]
    : STATIONS[segmentIndex]

  const tramPosition = interpolatePosition(fromStation, toStation, progress)
  const direction = DIRECTIONS[directionIndex]
  const nextStation = toStation

  const refreshSimulation = () => {
    setCars(initCars())
    setSegmentIndex(0)
    setProgress(0)
    setDirectionIndex(0)
  }

  return {
    tramPosition,
    direction,
    nextStation,
    cars,
    arrivals,
    refreshSimulation,
  }
}
