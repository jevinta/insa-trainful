import { useState } from 'react'
import 'leaflet/dist/leaflet.css'
import TramMap from './components/TramMap.jsx'
import TramPanel from './components/TramPanel.jsx'
import { useTramSimulation, useTramSimulationT4, T1_STATIONS, T4_STATIONS } from './simulation/tramSimulation.js'

const ROUTES = [
  { id: 'T1', color: '#f59e0b', label: 'T1 Tram', stations: T1_STATIONS },
  { id: 'T4', color: '#873F98', label: 'T4 Tram', stations: T4_STATIONS },
]

export default function App() {
  const [openRoute, setOpenRoute] = useState('')
  const [selectedTrain, setSelectedTrain] = useState({
    T1: 'nearest',
    T4: 'nearest',
  })

  const t1 = useTramSimulation()
  const t4 = useTramSimulationT4()

  function getRouteData(routeId) {
    return routeId === 'T1' ? t1 : t4
  }

  function getRouteInfo(routeId) {
    return ROUTES.find(route => route.id === routeId)
  }

  function getUserStop(routeId) {
    const routeInfo = getRouteInfo(routeId)
    return routeInfo.stations[0] // mock nearest stop from user location for now
  }

  function getTrainOffset(routeId) {
    if (selectedTrain[routeId] === 'second') return 2
    if (selectedTrain[routeId] === 'third') return 4
    return 0
  }

  function getStopsAway(routeId) {
    const routeInfo = getRouteInfo(routeId)
    const routeData = getRouteData(routeId)
    const userStop = getUserStop(routeId)
    const offset = getTrainOffset(routeId)

    const nextIndex = routeInfo.stations.findIndex(station => station.id === routeData.nextStation?.id)
    const stopIndex = routeInfo.stations.findIndex(station => station.id === userStop.id)

    if (nextIndex === -1 || stopIndex === -1) return 0
    return Math.abs(stopIndex - nextIndex) + offset
  }

  function getArrivalTime(routeId) {
    const routeData = getRouteData(routeId)
    const userStop = getUserStop(routeId)
    const baseArrival = routeData.arrivals[userStop.id] ?? 1

    if (selectedTrain[routeId] === 'second') return Number(baseArrival) + 5
    if (selectedTrain[routeId] === 'third') return Number(baseArrival) + 10
    return baseArrival
  }

  function getDisplayCars(routeId) {
    const routeData = getRouteData(routeId)
    const offset = getTrainOffset(routeId)

    return routeData.cars.map((car, index) => ({
      ...car,
      current: Math.min(car.capacity, Math.max(0, car.current + offset * (index + 2) - index * 3)),
    }))
  }

  function getPredictedCars(routeId) {
    const cars = getDisplayCars(routeId)
    const stopsAway = getStopsAway(routeId)

    return cars.map((car, index) => {
      const addedPeople = stopsAway * (index + 1)
      return {
        ...car,
        predicted: Math.min(car.capacity, car.current + addedPeople),
      }
    })
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <div className="app-logo">🚋</div>
          <span className="app-name">Trainful</span>
          <a href="https://www.tcl.fr" target="_blank" rel="noopener noreferrer" className="app-sub tcl-link">
            tcl.fr ↗
          </a>
        </div>
      </header>

      <div className="map-area compact-map">
        <TramMap
          t1={{ ...t1, onTramClick: () => setOpenRoute('T1') }}
          t4={{ ...t4, onTramClick: () => setOpenRoute('T4') }}
        />
      </div>

      <div className="bottom-panel">
        <div className="panel-content">
          <div className="routes-title">Routes near you</div>

          <div className="route-list">
            {ROUTES.map(route => {
              const routeData = getRouteData(route.id)
              const isOpen = openRoute === route.id
              const userStop = getUserStop(route.id)

              return (
                <div key={route.id} className="route-accordion">
                  <button className="route-bar" onClick={() => setOpenRoute(isOpen ? '' : route.id)}>
                    <span className="route-left">
                      <span className="route-color-dot" style={{ background: route.color }} />
                      <span>{route.id}</span>
                    </span>
                    <span className="route-arrow">{isOpen ? '⌄' : '›'}</span>
                  </button>

                  {isOpen && (
                    <div className="route-dropdown-content">
                      <div className="train-picker-card">
                        <label>Train to view</label>
                        <select
                          value={selectedTrain[route.id]}
                          onChange={e => setSelectedTrain(prev => ({ ...prev, [route.id]: e.target.value }))}
                        >
                          <option value="nearest">Nearest train</option>
                          <option value="second">Second nearest train</option>
                          <option value="third">Third nearest train</option>
                        </select>
                      </div>

                      <TramPanel
                        line={route.id}
                        lineColor={route.color}
                        direction={routeData.direction}
                        currentStop={userStop}
                        nextStation={routeData.nextStation}
                        arrivalTime={getArrivalTime(route.id)}
                        stopsAway={getStopsAway(route.id)}
                        cars={getDisplayCars(route.id)}
                        predictedCars={getPredictedCars(route.id)}
                        onRefresh={routeData.refreshSimulation}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}