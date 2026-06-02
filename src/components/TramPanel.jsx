export default function TramPanel({ direction, nextStation, cars, onRefresh }) {
  function getColor(pct) {
    if (pct < 50) return '#22c55e'
    if (pct < 75) return '#eab308'
    if (pct < 90) return '#f97316'
    return '#ef4444'
  }

  function getLabel(pct) {
    if (pct < 50) return 'Comfortable'
    if (pct < 75) return 'Moderate'
    if (pct < 90) return 'Busy'
    return 'Packed'
  }

  return (
    <div className="panel-content">
      <div className="panel-header">
        <div className="line-badge">T1</div>
        <div className="panel-title-group">
          <h2 className="panel-title">T1 Tram</h2>
          <span className="panel-direction">
            Direction: <strong>{direction}</strong>
          </span>
          {nextStation && (
            <span className="panel-next-stop">
              Next stop: <strong>{nextStation.name}</strong>
            </span>
          )}
        </div>
      </div>

      <div className="cars-grid">
        {cars.map(car => {
          const pct = Math.round((car.current / car.capacity) * 100)
          const color = getColor(pct)
          return (
            <div key={car.id} className="car-card">
              <div className="car-header">
                <span className="car-label">Car {car.id}</span>
                <span className="car-status" style={{ color }}>
                  {getLabel(pct)}
                </span>
              </div>
              <div className="car-count">
                {car.current} <span className="car-capacity">/ {car.capacity}</span>
              </div>
              <div className="car-bar-bg">
                <div
                  className="car-bar-fill"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
              <div className="car-pct" style={{ color }}>
                {pct}%
              </div>
            </div>
          )
        })}
      </div>

      <div className="panel-footer">
        <div className="tram-specs">
          <span>🚋 3 cars</span>
          <span>👤 {cars.reduce((s, c) => s + c.current, 0)} / {cars.reduce((s, c) => s + c.capacity, 0)} total</span>
        </div>
        <button className="refresh-btn" onClick={onRefresh}>
          ↺ Refresh simulation
        </button>
      </div>
    </div>
  )
}
