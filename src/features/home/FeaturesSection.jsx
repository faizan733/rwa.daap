import { galleryImages } from 'assets/remoteImages';

const FEATURES = [
  { icon: '01', title: 'Opportunity intelligence', desc: 'Search by property type or location, save a watchlist, compare opportunities, and open detailed underwriting views.' },
  { icon: '02', title: 'Visible compliance state', desc: 'Jurisdiction, identity, accreditation, disclosures, and document records live in a dedicated readiness center.' },
  { icon: '03', title: 'Safe transaction states', desc: 'Wallet, network, contract address, and on-chain status must all be valid before transaction actions become available.' },
  { icon: '04', title: 'Portfolio operations', desc: 'Holdings, asset allocation, projected distributions, and activity are organized in one exportable workspace.' },
];

export default function FeaturesSection() {
  return (
    <section className="vx-section">
      <div className="vx-container">
        <div style={{ display: 'grid', gridTemplateColumns: '.9fr 1.1fr', gap: 48, alignItems: 'center', marginBottom: 42 }}>
          <div>
            <div className="vx-eyebrow">One connected workspace</div>
            <h2 className="vx-title" style={{ fontSize: 'clamp(36px,4.6vw,62px)' }}>From diligence to portfolio operations.</h2>
            <p className="vx-copy" style={{ marginTop: 18 }}>
              The product separates information, eligibility, and execution so investors always understand what they are reviewing and which actions are actually available.
            </p>
          </div>
          <div className="vx-image-panel" style={{ minHeight: 330, backgroundImage: `linear-gradient(120deg,rgba(11,18,32,.04),rgba(54,88,245,.12)),url(${galleryImages[1]})` }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 15 }}>
          {FEATURES.map((item) => (
            <article key={item.title} className="vx-card card-lift" style={{ padding: 23 }}>
              <div className="mono" style={{ width: 40, height: 40, display: 'grid', placeItems: 'center', borderRadius: 12, background: 'var(--brand-soft)', color: 'var(--brand-deep)', fontSize: 10, fontWeight: 600, marginBottom: 18 }}>{item.icon}</div>
              <h3 style={{ margin: 0, fontSize: 17, letterSpacing: '-.025em' }}>{item.title}</h3>
              <p className="vx-copy" style={{ margin: '11px 0 0', fontSize: 13 }}>{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:980px){section .vx-container>div:first-child{grid-template-columns:1fr!important}section .vx-container>div:last-child{grid-template-columns:1fr 1fr!important}}
        @media(max-width:620px){section .vx-container>div:last-child{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  );
}
