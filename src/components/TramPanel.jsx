import { useState } from 'react'

export default function TramPanel({ line, lineColor, direction, currentStop, nextStation, arrivalTime, stopsAway, cars, predictedCars, onRefresh }) {
  const [openCar, setOpenCar] = useState(null)

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

  function TrainCar({ car, valueKey = 'current', type }) {
    const people = car[valueKey]
    const pct = Math.round((people / car.capacity) * 100)
    const color = getColor(pct)
    const status = getStatus(pct)
    const isOpen = openCar === `${valueKey}-${car.id}`

    return (
      <div className={`train-car-wrap ${type}`}>
        <button
          className={`train-car ${type}`}
          style={{ '--train-color': color }}
          onClick={() => setOpenCar(isOpen ? null : `${valueKey}-${car.id}`)}
        >
          <div className="train-windows">
            <span />
            <span />
            <span />
          </div>

          <div className="train-car-text">
            <span className="train-car-title">Car {car.id}</span>
            <span className="train-car-status">{status}</span>
          </div>

          <span className="train-car-arrow">{isOpen ? '⌄' : '›'}</span>
        </button>

        {isOpen && (
          <div className="train-car-details">
            <strong>{people} / {car.capacity} people</strong>
            <span>{pct}% full</span>
          </div>
        )}
      </div>
    )
  }

  function TrainSet({ trainCars, valueKey }) {
    return (
      <div className="train-set">
        {trainCars.map((car, index) => {
          const type = index === 0 ? 'front-car' : index === trainCars.length - 1 ? 'back-car' : 'middle-car'
          return <TrainCar key={car.id} car={car} valueKey={valueKey} type={type} />
        })}
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
        <TrainSet trainCars={cars} valueKey="current" />
      </div>

      <div className="info-box predicted-box">
        <div className="box-title">Predicted at your stop</div>
        <div className="best-car">
          Best choice: <strong>Car {bestCar.id}</strong> — estimated {bestCar.predicted} / {bestCar.capacity} people
        </div>
        <TrainSet trainCars={predictedCars} valueKey="predicted" />
      </div>

      <button className="refresh-btn full-refresh" onClick={onRefresh} style={{ background: lineColor }}>
        ↺ Refresh simulation
      </button>
    </>
  )
}