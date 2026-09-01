import GalleryItems from 'features/marketplace/GalleryItems';

export default function Gallery() {
  return (
    <div className="vx-page">
      <section className="vx-hero" style={{ padding: '72px 0 56px' }}>
        <div className="vx-container" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr .5fr', gap: 42, alignItems: 'end' }}>
          <div>
            <div className="vx-eyebrow">Opportunity marketplace</div>
            <h1 className="vx-title" style={{ fontSize: 'clamp(42px,6vw,76px)', maxWidth: 820 }}>Find the right real asset exposure.</h1>
            <p className="vx-copy" style={{ maxWidth: 650, margin: '20px 0 0' }}>
              Search, save, compare, and inspect illustrative property opportunities through one consistent diligence workflow.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid rgba(255,255,255,.14)', borderRadius: 18, overflow: 'hidden' }}>
            {[['06', 'Opportunity models'], ['06', 'Asset categories'], ['03', 'Compare limit'], ['Local', 'Watchlist storage']].map(([value, label], index) => (
              <div key={label} style={{ padding: 17, borderRight: index % 2 === 0 ? '1px solid rgba(255,255,255,.12)' : 0, borderBottom: index < 2 ? '1px solid rgba(255,255,255,.12)' : 0, background: 'rgba(255,255,255,.035)' }}>
                <div style={{ fontWeight: 800, fontSize: 19 }}>{value}</div>
                <div className="mono" style={{ color: '#91a0b8', fontSize: 7.5, letterSpacing: '.08em', textTransform: 'uppercase', marginTop: 5 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ padding: '34px 0 100px' }}>
        <div className="vx-container"><GalleryItems /></div>
      </section>
      <style>{`@media(max-width:820px){section.vx-hero .vx-container{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
