import { useState } from 'react'
import 'leaflet/dist/leaflet.css'
import TramMap from './components/TramMap.jsx'
import TramPanel from './components/TramPanel.jsx'
import StationList from './components/StationList.jsx'
import DonateButton from './components/DonateButton.jsx'
import { useTramSimulation } from './simulation/tramSimulation.js'

const TABS = [
  { id: 'stations', label: 'Stations', icon: '🚏' },
  { id: 'tram', label: 'T1 Tram', icon: '🚋' },
  { id: 'donate', label: 'Donate', icon: '☕' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('stations')

  const {
    tramPosition,
    direction,
    nextStation,
    cars,
    arrivals,
    refreshSimulation,
  } = useTramSimulation()

  function handleTramMarkerClick() {
    setActiveTab('tram')
  }

  return (
    <div className="app-shell">
      {/* App header */}
      <header className="app-header">
        <div className="header-inner">
          <span className="app-logo">🚋</span>
          <span className="app-name">Trainful</span>
          <span className="app-sub">Lyon T1 Live Tracker</span>
        </div>
      </header>

      {/* Map area */}
      <div className="map-area">
        <TramMap
          tramPosition={tramPosition}
          direction={direction}
          nextStation={nextStation}
          cars={cars}
          onTramClick={handleTramMarkerClick}
        />
      </div>

      {/* Tab bar */}
      <nav className="tab-bar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom panel */}
      <div className="bottom-panel">
        {activeTab === 'stations' && (
          <StationList arrivals={arrivals} cars={cars} />
        )}
        {activeTab === 'tram' && (
          <TramPanel
            direction={direction}
            nextStation={nextStation}
            cars={cars}
            onRefresh={refreshSimulation}
          />
        )}
        {activeTab === 'donate' && (
          <DonateButton />
        )}
      </div>
    </div>
  )
}
