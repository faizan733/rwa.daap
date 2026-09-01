import { brandImages } from 'assets/remoteImages';

const SEGMENTS = [
  { label: 'Property reserve', pct: 35 },
  { label: 'Public presale', pct: 20 },
  { label: 'Ecosystem incentives', pct: 20 },
  { label: 'Treasury and liquidity', pct: 15 },
  { label: 'Operations reserve', pct: 10 },
];

export default function TokenomicsSection() {
  return (
    <section className="vx-section-soft">
      <div className="vx-container" style={{ display: 'grid', gridTemplateColumns: '.88fr 1.12fr', gap: 48, alignItems: 'center' }}>
        <div>
          <div className="vx-eyebrow">Illustrative allocation model</div>
          <h2 className="vx-title" style={{ fontSize: 'clamp(36px,4.4vw,58px)' }}>Token utility needs an auditable source of truth.</h2>
          <p className="vx-copy" style={{ marginTop: 18 }}>
            The interface treats allocation values as model data until they are reconciled with deployed contracts, governance approvals, and final legal documentation.
          </p>
          <div className="vx-image-panel" style={{ backgroundImage: `linear-gradient(120deg,rgba(11,18,32,.2),rgba(54,88,245,.12)),url(${brandImages.dashboard})`, marginTop: 24, minHeight: 250 }} />
        </div>
        <div className="vx-card-strong" style={{ padding: 30 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', marginBottom: 24 }}>
            <div>
              <div className="vx-kicker">VTX allocation</div>
              <div style={{ marginTop: 7, fontSize: 23, fontWeight: 800, letterSpacing: '-.04em' }}>100% modeled supply</div>
            </div>
            <span className="vx-status warning">Prototype values</span>
          </div>
          {SEGMENTS.map((segment) => (
            <div key={segment.label} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                <span style={{ fontWeight: 700 }}>{segment.label}</span>
                <span className="mono" style={{ color: 'var(--brand-deep)', fontSize: 11 }}>{segment.pct}%</span>
              </div>
              <div className="vx-progress"><span style={{ width: `${segment.pct}%` }} /></div>
            </div>
          ))}
          <div style={{ marginTop: 10, padding: 16, borderRadius: 14, background: 'var(--warning-soft)', border: '1px solid #f2d7aa', color: '#775121', lineHeight: 1.65, fontSize: 12 }}>
            Production releases must derive these values from an approved token specification and verified deployment.
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){section .vx-container{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}
