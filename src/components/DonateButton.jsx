export default function DonateButton() {
  return (
    <div className="panel-content donate-panel">
      <div className="donate-card">
        <div className="donate-emoji">☕</div>
        <h2 className="donate-title">Support Trainful</h2>
        <p className="donate-desc">
          Trainful is a free, open project tracking tram occupancy in Lyon.
          If you find it useful, consider buying us a coffee!
        </p>
        <a
          href="https://www.buymeacoffee.com/trainful"
          target="_blank"
          rel="noopener noreferrer"
          className="donate-btn"
        >
          ☕ Buy me a coffee
        </a>
        <p className="donate-note">
          Built with ❤️ for INSA Lyon students &amp; staff
        </p>
      </div>
    </div>
  )
}
