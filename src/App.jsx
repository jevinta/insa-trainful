import { useState } from 'react'
import 'leaflet/dist/leaflet.css'
import TramMap from './components/TramMap.jsx'
import TramPanel from './components/TramPanel.jsx'
import StationList from './components/StationList.jsx'
import DonateButton from './components/DonateButton.jsx'
import { useTramSimulation, useTramSimulationT4 } from './simulation/tramSimulation.js'

const TABS = [
  { id: 'stations', label: 'Stations', icon: '🚏' },
  { id: 't1',       label: 'T1',       icon: '🚋' },
  { id: 't4',       label: 'T4',       icon: '🚋' },
  { id: 'donate',   label: 'Donate',   icon: '☕' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('stations')

  const t1 = useTramSimulation()
  const t4 = useTramSimulationT4()

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <div className="app-logo">🚋</div>
          <span className="app-name">Trainful</span>
          <a
            href="https://www.tcl.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="app-sub tcl-link"
          >
            tcl.fr ↗
          </a>
        </div>
      </header>

      <div className="map-area">
        <TramMap
          t1={{ ...t1, onTramClick: () => setActiveTab('t1') }}
          t4={{ ...t4, onTramClick: () => setActiveTab('t4') }}
        />
      </div>

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

      <div className="bottom-panel">
        {activeTab === 'stations' && (
          <StationList t1Arrivals={t1.arrivals} t4Arrivals={t4.arrivals} t1Cars={t1.cars} t4Cars={t4.cars} />
        )}
        {activeTab === 't1' && (
          <TramPanel line="T1" lineColor="#f59e0b" direction={t1.direction} nextStation={t1.nextStation} cars={t1.cars} onRefresh={t1.refreshSimulation} />
        )}
        {activeTab === 't4' && (
          <TramPanel line="T4" lineColor="#873F98" direction={t4.direction} nextStation={t4.nextStation} cars={t4.cars} onRefresh={t4.refreshSimulation} />
        )}
        {activeTab === 'donate' && <DonateButton />}
      </div>
    </div>
  )
}
