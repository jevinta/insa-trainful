import { useState } from 'react'
import 'leaflet/dist/leaflet.css'
import TramMap from './components/TramMap.jsx'
import TramPanel from './components/TramPanel.jsx'
import DonateButton from './components/DonateButton.jsx'
import {
  useTramT1_1, useTramT1_2, useTramT1_3,
  useTramT4_1, useTramT4_2, useTramT4_3,
  useRhonexpressRX_1, useRhonexpressRX_2, useRhonexpressRX_3,
  T1_STATIONS, T4_STATIONS, RHONEXPRESS_STATIONS,
} from './simulation/tramSimulation.js'

const ROUTES = [
  { id: 'T1', color: '#f59e0b', label: 'T1',           stations: T1_STATIONS },
  { id: 'T4', color: '#873F98', label: 'T4',           stations: T4_STATIONS },
  { id: 'RX', color: '#C0003C', label: 'Rhônexpress',  stations: RHONEXPRESS_STATIONS },
]

export default function App() {
  const [openRoute, setOpenRoute] = useState('')
  const [selectedTrain, setSelectedTrain] = useState({ T1: 0, T4: 0, RX: 0 })

  const t1_1 = useTramT1_1()
  const t1_2 = useTramT1_2()
  const t1_3 = useTramT1_3()
  const t4_1 = useTramT4_1()
  const t4_2 = useTramT4_2()
  const t4_3 = useTramT4_3()
  const rx_1 = useRhonexpressRX_1()
  const rx_2 = useRhonexpressRX_2()
  const rx_3 = useRhonexpressRX_3()

  const trains = {
    T1: [t1_1, t1_2, t1_3],
    T4: [t4_1, t4_2, t4_3],
    RX: [rx_1, rx_2, rx_3],
  }

  function getSelectedTrainData(routeId) {
    return trains[routeId][selectedTrain[routeId]]
  }

  function getUserStop(routeId) {
    return ROUTES.find(r => r.id === routeId).stations[0]
  }

  function getStopsAway(routeId) {
    const routeInfo = ROUTES.find(r => r.id === routeId)
    const train = getSelectedTrainData(routeId)
    const userStop = getUserStop(routeId)
    const nextIndex = routeInfo.stations.findIndex(s => s.id === train.nextStation?.id)
    const stopIndex = routeInfo.stations.findIndex(s => s.id === userStop.id)
    if (nextIndex === -1 || stopIndex === -1) return 0
    return Math.abs(stopIndex - nextIndex)
  }

  function getArrivalTime(routeId) {
    const train = getSelectedTrainData(routeId)
    const userStop = getUserStop(routeId)
    return train.arrivals[userStop.id] ?? 1
  }

  function getPredictedCars(routeId) {
    const train = getSelectedTrainData(routeId)
    const stopsAway = getStopsAway(routeId)
    return train.cars.map((car, index) => ({
      ...car,
      predicted: Math.min(car.capacity, car.current + stopsAway * (index + 1)),
    }))
  }

  function selectTrain(routeId, index) {
    setOpenRoute(routeId)
    setSelectedTrain(prev => ({ ...prev, [routeId]: index }))
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
          t1Trains={trains.T1.map((train, i) => ({ ...train, onTramClick: () => selectTrain('T1', i) }))}
          t4Trains={trains.T4.map((train, i) => ({ ...train, onTramClick: () => selectTrain('T4', i) }))}
          rxTrains={trains.RX.map((train, i) => ({ ...train, onTramClick: () => selectTrain('RX', i) }))}
          selectedT1={selectedTrain.T1}
          selectedT4={selectedTrain.T4}
          selectedRX={selectedTrain.RX}
        />
      </div>

      <div className="bottom-panel">
        <div className="panel-content">
          <div className="routes-title">Routes near you</div>

          <div className="route-list">
            {ROUTES.map(route => {
              const isOpen = openRoute === route.id
              const userStop = getUserStop(route.id)
              const trainData = getSelectedTrainData(route.id)

              return (
                <div key={route.id} className="route-accordion">
                  <button className="route-bar" onClick={() => setOpenRoute(isOpen ? '' : route.id)}>
                    <span className="route-left">
                      <span className="route-color-dot" style={{ background: route.color }} />
                      <span>{route.label}</span>
                    </span>
                    <span className="route-arrow">{isOpen ? '⌄' : '›'}</span>
                  </button>

                  {isOpen && (
                    <div className="route-dropdown-content">
                      <div className="train-picker-card">
                        <label>Train to view</label>
                        <select
                          value={selectedTrain[route.id]}
                          onChange={e => setSelectedTrain(prev => ({ ...prev, [route.id]: Number(e.target.value) }))}
                        >
                          {trains[route.id].map((train, i) => (
                            <option key={i} value={i}>
                              Train {i + 1} · → {train.direction} · near {train.nextStation?.name ?? '—'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <TramPanel
                        line={route.label}
                        lineColor={route.color}
                        direction={trainData.direction}
                        currentStop={userStop}
                        nextStation={trainData.nextStation}
                        arrivalTime={getArrivalTime(route.id)}
                        stopsAway={getStopsAway(route.id)}
                        cars={trainData.cars}
                        predictedCars={getPredictedCars(route.id)}
                        onRefresh={trainData.refreshSimulation}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <DonateButton />
    </div>
  )
}
