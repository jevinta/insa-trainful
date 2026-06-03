import { T1_STATIONS, T4_STATIONS } from '../simulation/tramSimulation.js'

// T1 station IDs that are also served by T4
const T4_SHARED_IDS = new Set(['thiers', 'bellecombe', 'charpennes', 'tonkin', 'condorcet', 'univ1', 'ladoua'])

function getColor(pct) {
  if (pct < 50) return '#059669'
  if (pct < 75) return '#d97706'
  if (pct < 90) return '#ea580c'
  return '#dc2626'
}

function OccupancyDots({ cars }) {
  const avg = Math.round(cars.reduce((s, c) => s + (c.current / c.capacity) * 100, 0) / cars.length)
  return (
    <div className="occupancy-dots">
      {cars.map(car => {
        const pct = Math.round((car.current / car.capacity) * 100)
        return (
          <div key={car.id} className="occupancy-dot" title={`Car ${car.id}: ${pct}%`} style={{ background: getColor(pct) }} />
        )
      })}
      <span className="occupancy-avg">{avg}%</span>
    </div>
  )
}

export default function StationList({ t1Arrivals, t4Arrivals, t1Cars, t4Cars }) {
  return (
    <div className="panel-content">
      <span className="section-label">Nearby stations</span>
      <div className="station-list">
        {T1_STATIONS.map(station => {
          const isShared = T4_SHARED_IDS.has(station.id)
          const t1Arr = t1Arrivals[station.id] ?? '—'
          // For shared stations, also find the matching T4 station arrival
          const t4Station = isShared
            ? T4_STATIONS.find(s => s.name === station.name)
            : null
          const t4Arr = t4Station ? (t4Arrivals[t4Station.id] ?? '—') : null

          return (
            <div key={station.id} className="station-card">
              <div className="station-top">
                <div className="station-name-row">
                  <span className="station-name">{station.name}</span>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <span className="line-badge small" style={{ background: '#f59e0b' }}>T1</span>
                    {isShared && (
                      <span className="line-badge small" style={{ background: '#873F98' }}>T4</span>
                    )}
                  </div>
                </div>
                <div className="station-arrival">
                  <span className="arrival-label">Next tram</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                    <span className="arrival-time">{t1Arr}</span>
                    <span className="arrival-unit">min</span>
                  </div>
                  {isShared && t4Arr !== null && (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginTop: '2px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#873F98', lineHeight: 1 }}>{t4Arr}</span>
                      <span className="arrival-unit">min T4</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="station-divider" />
              <div className="station-occupancy">
                <span className="occupancy-label">T1 occupancy</span>
                <OccupancyDots cars={t1Cars} />
              </div>
              {isShared && (
                <div className="station-occupancy" style={{ marginTop: '4px' }}>
                  <span className="occupancy-label">T4 occupancy</span>
                  <OccupancyDots cars={t4Cars} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
