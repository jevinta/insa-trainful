import { useState } from 'react'
import 'leaflet/dist/leaflet.css'
import TramMap from './components/TramMap.jsx'
import TramPanel from './components/TramPanel.jsx'
import TrainCard from './components/TrainCard.jsx'
import DonateButton from './components/DonateButton.jsx'
import {
  useTramT1_1, useTramT1_2, useTramT1_3,
  useTramT4_1, useTramT4_2, useTramT4_3,
  useRhonexpressRX_1, useRhonexpressRX_2, useRhonexpressRX_3,
  T1_STATIONS, T4_STATIONS, RHONEXPRESS_STATIONS,
} from './simulation/tramSimulation.js'

const ROUTES = [
  {
    id: 'T1', color: '#f59e0b', label: 'T1', stations: T1_STATIONS,
    userStopIndex: 10, // Gare Part-Dieu — central stop
    directions: [
      { label: 'Debourg',        short: 'Debourg' },
      { label: 'IUT - Feyssine', short: 'IUT - Feyssine' },
    ],
  },
  {
    id: 'T4', color: '#873F98', label: 'T4', stations: T4_STATIONS,
    userStopIndex: 14, // Beauvisage — central stop
    directions: [
      { label: 'La Doua - Gaston Berger',    short: 'La Doua' },
      { label: 'Hôpital Feyzin Vénissieux',  short: 'Hôpital Feyzin' },
    ],
  },
  {
    id: 'RX', color: '#C0003C', label: 'Rhônexpress', stations: RHONEXPRESS_STATIONS,
    userStopIndex: 1, // Vaulx-en-Velin — middle of 4 stops
    directions: [
      { label: 'Aéroport Saint-Exupéry', short: 'Aéroport' },
      { label: 'Part-Dieu - Villette',   short: 'Part-Dieu' },
    ],
  },
]

export default function App() {
  const [openRoute,         setOpenRoute]         = useState('')
  const [selectedDirection, setSelectedDirection] = useState({ T1: null, T4: null, RX: null })
  const [selectedTrain,     setSelectedTrain]     = useState({ T1: null, T4: null, RX: null })

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

  function getUserStop(routeId) {
    const route = ROUTES.find(r => r.id === routeId)
    return route.stations[route.userStopIndex]
  }

  function getStopsAway(routeId, train) {
    const route = ROUTES.find(r => r.id === routeId)
    const userStop = getUserStop(routeId)
    const nextIndex = route.stations.findIndex(s => s.id === train.nextStation?.id)
    const stopIndex = route.stations.findIndex(s => s.id === userStop.id)
    if (nextIndex === -1 || stopIndex === -1) return 0
    return Math.abs(stopIndex - nextIndex)
  }

  function getArrivalTime(routeId, train) {
    const userStop = getUserStop(routeId)
    return train.arrivals[userStop.id] ?? 1
  }

  function getPredictedCars(routeId, train) {
    const stopsAway = getStopsAway(routeId, train)
    return train.cars.map((car, index) => ({
      ...car,
      predicted: Math.min(car.capacity, car.current + stopsAway * (index + 1)),
    }))
  }

  function getTrainsInDirection(routeId, direction) {
    return trains[routeId]
      .map((train, index) => ({ train, index }))
      .filter(({ train }) => train.direction === direction)
  }

  function pickDirection(routeId, dirLabel) {
    setSelectedDirection(prev => ({ ...prev, [routeId]: dirLabel }))
    setSelectedTrain(prev => ({ ...prev, [routeId]: null }))
  }

  function toggleTrain(routeId, index) {
    setSelectedTrain(prev => ({
      ...prev,
      [routeId]: prev[routeId] === index ? null : index,
    }))
  }

  // Called when a tram marker is tapped on the map
  function selectTrainFromMap(routeId, index) {
    const train = trains[routeId][index]
    setOpenRoute(routeId)
    setSelectedDirection(prev => ({ ...prev, [routeId]: train.direction }))
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
          t1Trains={trains.T1.map((train, i) => ({ ...train, onTramClick: () => selectTrainFromMap('T1', i) }))}
          t4Trains={trains.T4.map((train, i) => ({ ...train, onTramClick: () => selectTrainFromMap('T4', i) }))}
          rxTrains={trains.RX.map((train, i) => ({ ...train, onTramClick: () => selectTrainFromMap('RX', i) }))}
          selectedT1={selectedTrain.T1 ?? 0}
          selectedT4={selectedTrain.T4 ?? 0}
          selectedRX={selectedTrain.RX ?? 0}
        />
      </div>

      <div className="bottom-panel">
        <div className="panel-content">
          <div className="routes-title">Routes near you</div>

          <div className="route-list">
            {ROUTES.map(route => {
              const isOpen = openRoute === route.id
              const chosenDir = selectedDirection[route.id]
              const chosenTrainIdx = selectedTrain[route.id]
              const dirTrains = chosenDir ? getTrainsInDirection(route.id, chosenDir) : []

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

                      {/* ── Direction picker ── */}
                      <div className="direction-picker">
                        <div className="direction-picker-label">Choose direction</div>
                        <div className="direction-buttons">
                          {route.directions.map(dir => {
                            const active = chosenDir === dir.label
                            return (
                              <button
                                key={dir.label}
                                className={`direction-btn ${active ? 'active' : ''}`}
                                style={active ? { '--dir-color': route.color } : {}}
                                onClick={() => pickDirection(route.id, dir.label)}
                              >
                                → {dir.short}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* ── Train list ── */}
                      {chosenDir && (
                        <div className="train-list">
                          <div className="train-list-label">
                            Trams toward {chosenDir}
                          </div>

                          {dirTrains.length === 0 ? (
                            <div className="no-trains-msg">No trams currently heading this way</div>
                          ) : (
                            dirTrains.map(({ train, index }) => (
                              <TrainCard
                                key={index}
                                trainIndex={index}
                                train={train}
                                arrivalTime={getArrivalTime(route.id, train)}
                                stopsAway={getStopsAway(route.id, train)}
                                lineColor={route.color}
                                isSelected={chosenTrainIdx === index}
                                onClick={() => toggleTrain(route.id, index)}
                              />
                            ))
                          )}
                        </div>
                      )}

                      {/* ── Full details for selected train ── */}
                      {chosenTrainIdx !== null && (() => {
                        const trainData = trains[route.id][chosenTrainIdx]
                        return (
                          <TramPanel
                            line={route.label}
                            lineColor={route.color}
                            direction={trainData.direction}
                            currentStop={getUserStop(route.id)}
                            nextStation={trainData.nextStation}
                            arrivalTime={getArrivalTime(route.id, trainData)}
                            stopsAway={getStopsAway(route.id, trainData)}
                            cars={trainData.cars}
                            predictedCars={getPredictedCars(route.id, trainData)}
                            onRefresh={trainData.refreshSimulation}
                          />
                        )
                      })()}

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
