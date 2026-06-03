import { STATIONS } from '../simulation/tramSimulation.js'

function getColor(pct) {
  if (pct < 50) return 'var(--green)'
  if (pct < 75) return 'var(--yellow)'
  if (pct < 90) return 'var(--orange)'
  return 'var(--red)'
}

export default function StationList({ arrivals, cars }) {
  return (
    <div className="panel-content">
      <span className="section-label">Nearby stations</span>
      <div className="station-list">
        {STATIONS.map(station => {
          const arrivalMin = arrivals[station.id] ?? '—'
          return (
            <div key={station.id} className="station-card">
              <div className="station-top">
                <div className="station-name-row">
                  <span className="station-name">{station.name}</span>
                  <span className="line-badge small">T1</span>
                </div>
                <div className="station-arrival">
                  <span className="arrival-label">Next tram</span>
                  <span className="arrival-time">{arrivalMin} min</span>
                </div>
              </div>
              <div className="station-divider" />
              <div className="station-occupancy">
                <span className="occupancy-label">Car occupancy</span>
                <div className="occupancy-dots">
                  {cars.map(car => {
                    const pct = Math.round((car.current / car.capacity) * 100)
                    return (
                      <div
                        key={car.id}
                        className="occupancy-dot"
                        title={`Car ${car.id}: ${pct}%`}
                        style={{ background: getColor(pct) }}
                      />
                    )
                  })}
                  <span className="occupancy-avg">
                    {Math.round(
                      cars.reduce((s, c) => s + (c.current / c.capacity) * 100, 0) / cars.length
                    )}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
