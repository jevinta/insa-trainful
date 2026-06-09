function getColor(pct) {
  if (pct < 50) return '#059669'
  if (pct < 75) return '#d97706'
  if (pct < 90) return '#ea580c'
  return '#dc2626'
}

function getLabel(pct) {
  if (pct < 50) return 'Free'
  if (pct < 75) return 'Moderate'
  if (pct < 90) return 'Busy'
  return 'Full'
}

export default function TrainCard({ trainIndex, train, arrivalTime, stopsAway, lineColor, isSelected, onClick }) {
  const avgPct = Math.round(
    train.cars.reduce((sum, car) => sum + (car.current / car.capacity) * 100, 0) / train.cars.length
  )
  const avgColor = getColor(avgPct)

  return (
    <button
      className={`train-card ${isSelected ? 'selected' : ''}`}
      style={{ '--line-color': lineColor }}
      onClick={onClick}
    >
      <div className="train-card-header">
        <span className="train-card-num">Train {trainIndex + 1}</span>
        <span className="train-card-location">approaching {train.nextStation?.name ?? '—'}</span>
      </div>

      <div className="train-card-stats">
        <span className="train-card-badge" style={{ color: avgColor, background: avgColor + '1a' }}>
          {arrivalTime} min away
        </span>
        <span className="train-card-badge muted">
          {stopsAway} stop{stopsAway !== 1 ? 's' : ''}
        </span>
        <span className="train-card-badge" style={{ color: avgColor, background: avgColor + '1a' }}>
          {getLabel(avgPct)}
        </span>
      </div>

      <div className="train-card-cars">
        {train.cars.map(car => {
          const pct = Math.round((car.current / car.capacity) * 100)
          const c = getColor(pct)
          return (
            <div key={car.id} className="car-bar-wrap">
              <span className="car-bar-label">Car {car.id}</span>
              <div className="car-bar-track">
                <div className="car-bar-fill" style={{ width: `${pct}%`, background: c }} />
              </div>
              <span className="car-bar-pct" style={{ color: c }}>{pct}%</span>
            </div>
          )
        })}
      </div>

      <div className="train-card-chevron">{isSelected ? '⌄' : '›'}</div>
    </button>
  )
}
