import { useState } from 'react'

export default function DonateButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className="donate-fab" onClick={() => setOpen(true)} aria-label="Support Trainful">
        ☕
      </button>

      {open && (
        <div className="donate-overlay" onClick={() => setOpen(false)}>
          <div className="donate-popup" onClick={e => e.stopPropagation()}>
            <button className="donate-popup-close" onClick={() => setOpen(false)}>✕</button>
            <div className="donate-popup-emoji">☕</div>
            <h2 className="donate-popup-title">Support Trainful</h2>
            <p className="donate-popup-desc">
              Trainful is a free project tracking tram occupancy in Lyon.
              If it saves you a crowded commute, consider buying us a coffee!
            </p>
            <a
              href="https://www.buymeacoffee.com/trainful"
              target="_blank"
              rel="noopener noreferrer"
              className="donate-btn"
              onClick={() => setOpen(false)}
            >
              ☕ Buy me a coffee
            </a>
            <p className="donate-note">Built with ❤️ for INSA Lyon students &amp; staff</p>
          </div>
        </div>
      )}
    </>
  )
}
