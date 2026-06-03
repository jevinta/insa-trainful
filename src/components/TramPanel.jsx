export default function TramPanel({ line = 'T1', lineColor = '#f59e0b', direction, nextStation, cars, onRefresh }) {
  function getColor(pct) {
    if (pct < 50) return '#059669'
    if (pct < 75) return '#d97706'
    if (pct < 90) return '#ea580c'
    return '#dc2626'
  }

  function getStatusBg(pct) {
    if (pct < 50) return '#ecfdf5'
    if (pct < 75) return '#fffbeb'
    if (pct < 90) return '#fff7ed'
    return '#fef2f2'
  }

  function getLabel(pct) {
    if (pct < 50) return 'Free'
    if (pct < 75) return 'Moderate'
    if (pct < 90) return 'Busy'
    return 'Packed'
  }

  const totalPeople = cars.reduce((s, c) => s + c.current, 0)
  const totalSeats  = cars.reduce((s, c) => s + c.capacity, 0)

  const badgeStyle = {
    background: lineColor,
    color: '#fff',
    fontWeight: 800,
    fontSize: '11px',
    borderRadius: '6px',
    padding: '3px 9px',
    letterSpacing: '.5px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  }

  return (
    <div className="panel-content">
      <div className="panel-header">
        <div style={badgeStyle}>{line}</div>
        <div className="panel-title-group">
          <h2 className="panel-title">{line} Tram</h2>
          <span className="panel-direction">
            Direction: <strong>{direction}</strong>
          </span>
          {nextStation && (
            <span className="panel-next-stop">
              Next stop: <strong style={{ color: lineColor }}>{nextStation.name}</strong>
            </span>
          )}
        </div>
      </div>

      <span className="section-label">Car occupancy</span>

      <div className="cars-grid">
        {cars.map(car => {
          const pct   = Math.round((car.current / car.capacity) * 100)
          const color = getColor(pct)
          const bg    = getStatusBg(pct)
          return (
            <div key={car.id} className="car-card" style={{ '--car-color': color }}>
              <div className="car-header">
                <span className="car-label">Car {car.id}</span>
                <span className="car-status" style={{ color, background: bg }}>{getLabel(pct)}</span>
              </div>
              <div className="car-pct" style={{ color }}>{pct}%</div>
              <div className="car-bar-bg">
                <div className="car-bar-fill" style={{ width: `${pct}%`, background: color }} />
              </div>
              <div className="car-count">{car.current} / {car.capacity} people</div>
            </div>
          )
        })}
      </div>

      <div className="panel-footer">
        <div className="tram-specs">
          <span>🚋 3 cars · {totalSeats} seats total</span>
          <span>👥 {totalPeople} people on board</span>
        </div>
        <button className="refresh-btn" onClick={onRefresh} style={{ background: `linear-gradient(135deg, ${lineColor}, ${lineColor}cc)` }}>
          ↺ Refresh
        </button>
      </div>
    </div>
  )
}
