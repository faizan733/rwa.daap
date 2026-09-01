const LAYERS = [
  { label: 'Discover', title: 'Opportunity workspace', items: ['Search and multi-filter', 'Persistent watchlist', 'Three-asset comparison'], status: 'Ready in PoC', tone: 'ok' },
  { label: 'Verify', title: 'Compliance center', items: ['Jurisdiction readiness', 'Identity checklist', 'Document anchor view'], status: 'Ready in PoC', tone: 'ok' },
  { label: 'Execute', title: 'Contract interactions', items: ['Presale state gates', 'Swap quote workflow', 'Stake calculator'], status: 'Configuration required', tone: 'warn' },
  { label: 'Monitor', title: 'Portfolio operations', items: ['Allocation view', 'Distribution schedule', 'CSV export'], status: 'Preview data', tone: 'info' },
];

export default function RoadmapSection() {
  return (
    <section className="vx-section-soft">
      <div className="vx-container">
        <div style={{ maxWidth: 790, marginBottom: 38 }}>
          <div className="vx-eyebrow">Product architecture</div>
          <h2 className="vx-title" style={{ fontSize: 'clamp(36px,4.4vw,58px)' }}>Four layers, one clear operating model.</h2>
          <p className="vx-copy" style={{ marginTop: 17 }}>Preview-only data is labeled, while transaction modules remain constrained by real wallet and contract state.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 15 }}>
          {LAYERS.map((layer) => (
            <article key={layer.label} className="vx-card card-lift" style={{ padding: 23 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                <div className="vx-kicker">{layer.label}</div>
                <span className={`vx-status ${layer.tone === 'warn' ? 'warning' : ''}`} style={{ fontSize: 8 }}>{layer.status}</span>
              </div>
              <h3 style={{ margin: '16px 0 14px', fontSize: 19, letterSpacing: '-.03em' }}>{layer.title}</h3>
              <div style={{ display: 'grid', gap: 9 }}>
                {layer.items.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, color: 'var(--muted)', fontSize: 12.5, lineHeight: 1.5 }}>
                    <span style={{ width: 6, height: 6, marginTop: 7, borderRadius: 99, background: layer.tone === 'warn' ? 'var(--warning)' : 'var(--brand)' }} />
                    {item}
                  </div>
                ))}
              </div>
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
