const STEPS = [
  { n: '01', t: 'Discover', d: 'Search, filter, save, and compare opportunity models using consistent asset metrics.' },
  { n: '02', t: 'Verify', d: 'Review eligibility, disclosures, document records, and contract configuration before connecting capital.' },
  { n: '03', t: 'Participate', d: 'Use presale, swap, or staking modules only when wallet, network, address, and contract state agree.' },
  { n: '04', t: 'Monitor', d: 'Track holdings, allocation, projected distributions, and transaction activity in the portfolio workspace.' },
];

export default function HowToSection() {
  return (
    <section className="vx-section">
      <div className="vx-container">
        <div style={{ maxWidth: 760, marginBottom: 42 }}>
          <div className="vx-eyebrow">Investor workflow</div>
          <h2 className="vx-title" style={{ fontSize: 'clamp(36px,4.4vw,58px)' }}>A deliberate path from discovery to execution.</h2>
          <p className="vx-copy" style={{ marginTop: 17 }}>Each stage exposes the information needed for the next decision instead of collapsing diligence and transaction actions into one screen.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 15 }}>
          {STEPS.map((step, index) => (
            <article key={step.n} className="vx-card card-lift" style={{ padding: 24, position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div className="mono" style={{ width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center', background: index === 1 ? 'var(--accent-soft)' : 'var(--brand-soft)', color: index === 1 ? '#0b7658' : 'var(--brand-deep)', fontSize: 10, fontWeight: 600 }}>{step.n}</div>
                {index < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />}
              </div>
              <h3 style={{ margin: 0, fontSize: 19, letterSpacing: '-.03em' }}>{step.t}</h3>
              <p className="vx-copy" style={{ margin: '11px 0 0', fontSize: 13 }}>{step.d}</p>
            </article>
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:980px){section .vx-container>div:last-child{grid-template-columns:1fr 1fr!important}}
        @media(max-width:620px){section .vx-container>div:last-child{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  );
}
