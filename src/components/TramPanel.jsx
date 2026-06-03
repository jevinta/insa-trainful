export default function TramPanel({ line, lineColor, direction, currentStop, nextStation, arrivalTime, stopsAway, cars, predictedCars, onRefresh }) {
  function getColor(pct) {
    if (pct < 50) return '#059669'
    if (pct < 75) return '#d97706'
    if (pct < 90) return '#ea580c'
    return '#dc2626'
  }

  function getStatus(pct) {
    if (pct < 50) return 'Free'
    if (pct < 75) return 'Moderate'
    if (pct < 90) return 'Busy'
    return 'Packed'
  }

  const bestCar = predictedCars.reduce((best, car) => car.predicted < best.predicted ? car : best, predictedCars[0])

  function CarBox({ car, valueKey = 'current' }) {
    const people = car[valueKey]
    const pct = Math.round((people / car.capacity) * 100)
    const color = getColor(pct)

    return (
      <div className="car-card readable-car" style={{ '--car-color': color }}>
        <div className="car-header">
          <span className="car-label">Car {car.id}</span>
          <span className="car-status" style={{ color }}>{getStatus(pct)}</span>
        </div>
        <div className="big-people">{people} / {car.capacity}</div>
        <div className="people-label">people</div>

        <div
          className="occupancy-word"
          style={{ color }}
        >
          {getStatus(pct)}
</div>
        <div className="car-bar-bg">
          <div className="car-bar-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="info-box ride-box">
        <div className="box-title">Your ride</div>
        <div className="ride-main">
          <span className="line-pill" style={{ background: lineColor }}>{line}</span>
          <div>
            <h2>{line} toward {direction}</h2>
            <p>Your stop: <strong>{currentStop.name}</strong></p>
          </div>
        </div>

        <div className="ride-stats">
          <div>
            <span className="stat-big">{arrivalTime}</span>
            <span className="stat-label">min away</span>
          </div>
          <div>
            <span className="stat-big">{stopsAway}</span>
            <span className="stat-label">stops away</span>
          </div>
          <div>
            <span className="stat-big">{nextStation?.name || '—'}</span>
            <span className="stat-label">tram is near</span>
          </div>
        </div>
      </div>

      <div className="info-box">
        <div className="box-title">Current train status</div>
        <div className="cars-grid">
          {cars.map(car => <CarBox key={car.id} car={car} valueKey="current" />)}
        </div>
      </div>

      <div className="info-box predicted-box">
        <div className="box-title">Predicted at your stop</div>
        <div className="best-car">
          Best choice: <strong>Car {bestCar.id}</strong> — estimated {bestCar.predicted} / {bestCar.capacity} people
        </div>
        <div className="cars-grid">
          {predictedCars.map(car => <CarBox key={car.id} car={car} valueKey="predicted" />)}
        </div>
      </div>

      <button className="refresh-btn full-refresh" onClick={onRefresh} style={{ background: lineColor }}>
        ↺ Refresh simulation
      </button>
    </>
  )
}