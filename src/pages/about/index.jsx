import { useNavigate } from 'react-router-dom';

const METRICS = [
  ['06', 'Opportunity models'],
  ['04', 'Configured EVM networks'],
  ['02', 'Core Solidity modules'],
  ['00', 'Ungated transaction actions'],
];

const PRINCIPLES = [
  { title: 'Asset context first', desc: 'Opportunity structure, location, modeled value, occupancy, target return, and disclosure state appear before transaction controls.' },
  { title: 'Truthful interface states', desc: 'Preview data, unavailable integrations, missing addresses, and disabled actions are identified directly in the product.' },
  { title: 'Compliance as product logic', desc: 'Identity, jurisdiction, agreements, and document readiness are treated as visible workflow gates rather than hidden administration.' },
  { title: 'Modular infrastructure', desc: 'Asset discovery, portfolio, presale, swap, staking, and contract registry modules can evolve independently.' },
];

const MODEL = [
  ['01', 'Source', 'Represent an income-producing asset using a consistent opportunity data model.'],
  ['02', 'Verify', 'Attach eligibility requirements, disclosures, documents, and deployment references.'],
  ['03', 'Offer', 'Expose a contract-aware participation flow with explicit network and sale-state gates.'],
  ['04', 'Operate', 'Monitor holdings, distributions, activity, and document changes after participation.'],
];

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="vx-page">
      <section className="vx-hero" style={{ padding: '78px 0 68px' }}>
        <div className="vx-container" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr .52fr', gap: 48, alignItems: 'end' }}>
          <div>
            <div className="vx-eyebrow">About VaultX</div>
            <h1 className="vx-title" style={{ fontSize: 'clamp(44px,6.5vw,80px)', maxWidth: 900 }}>A clearer operating layer for tokenized real assets.</h1>
            <p className="vx-copy" style={{ maxWidth: 670, margin: '22px 0 0' }}>VaultX is a proof-of-concept investor workspace that connects asset diligence, eligibility, contract-aware execution, and portfolio monitoring.</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="vx-btn" type="button" onClick={() => navigate('/gallery')}>Explore opportunities</button>
            <button className="vx-btn secondary" type="button" onClick={() => navigate('/compliance')}>Review trust layer</button>
          </div>
        </div>
      </section>

      <section style={{ position: 'relative', marginTop: -25, zIndex: 3 }}>
        <div className="vx-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: '#fff', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
          {METRICS.map(([value, label], index) => (
            <div key={label} style={{ padding: 22, borderRight: index < METRICS.length - 1 ? '1px solid var(--border)' : 0 }}>
              <div style={{ fontSize: 27, fontWeight: 800, color: 'var(--brand-deep)', letterSpacing: '-.045em' }}>{value}</div>
              <div className="mono" style={{ marginTop: 7, color: 'var(--dim)', fontSize: 8, letterSpacing: '.09em', textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="vx-section">
        <div className="vx-container" style={{ display: 'grid', gridTemplateColumns: '.82fr 1.18fr', gap: 48, alignItems: 'start' }}>
          <div>
            <div className="vx-eyebrow">Product thesis</div>
            <h2 className="vx-title" style={{ fontSize: 'clamp(36px,4.4vw,58px)' }}>Trust comes from structure, not decoration.</h2>
            <p className="vx-copy" style={{ marginTop: 18 }}>A serious RWA interface must separate modeled data from verified data, make transaction prerequisites visible, and preserve a clear audit trail across the investor journey.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {PRINCIPLES.map((item, index) => (
              <article key={item.title} className="vx-card card-lift" style={{ padding: 22 }}>
                <div className="mono" style={{ width: 38, height: 38, display: 'grid', placeItems: 'center', borderRadius: 11, background: index === 2 ? 'var(--accent-soft)' : 'var(--brand-soft)', color: index === 2 ? '#0b7658' : 'var(--brand-deep)', fontSize: 9 }}>{String(index + 1).padStart(2, '0')}</div>
                <h3 style={{ margin: '16px 0 8px', fontSize: 17, letterSpacing: '-.025em' }}>{item.title}</h3>
                <p className="vx-copy" style={{ margin: 0, fontSize: 12.5 }}>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="vx-section-soft">
        <div className="vx-container">
          <div style={{ maxWidth: 760, marginBottom: 38 }}>
            <div className="vx-eyebrow">Operating model</div>
            <h2 className="vx-title" style={{ fontSize: 'clamp(36px,4.4vw,58px)' }}>From source asset to portfolio operations.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {MODEL.map(([number, title, description]) => (
              <article key={title} className="vx-card" style={{ padding: 23 }}>
                <div className="vx-kicker">{number}</div>
                <h3 style={{ margin: '12px 0 9px', fontSize: 20, letterSpacing: '-.03em' }}>{title}</h3>
                <p className="vx-copy" style={{ margin: 0, fontSize: 12.5 }}>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="vx-section">
        <div className="vx-container">
          <div className="vx-card-strong" style={{ padding: 30, display: 'grid', gridTemplateColumns: '1fr auto', gap: 28, alignItems: 'center' }}>
            <div>
              <div className="vx-kicker">Proof-of-concept boundary</div>
              <h2 style={{ margin: '9px 0', fontSize: 29, letterSpacing: '-.045em' }}>Designed for evaluation, not production capital.</h2>
              <p className="vx-copy" style={{ margin: 0, maxWidth: 760 }}>Production deployment requires legal review, regulated providers where applicable, verified contracts, audited integrations, real asset-servicing data, monitoring, and incident response.</p>
            </div>
            <button className="vx-btn" type="button" onClick={() => navigate('/contact')}>Open review desk</button>
          </div>
        </div>
      </section>
      <style>{`
        @media(max-width:920px){section .vx-container[style*='.82fr'],section.vx-hero .vx-container{grid-template-columns:1fr!important}}
        @media(max-width:760px){section .vx-container[style*='repeat(4,1fr)']{grid-template-columns:1fr 1fr!important}}
        @media(max-width:580px){section .vx-container[style*='repeat(4,1fr)'],section .vx-container>div[style*='1fr 1fr'],section .vx-card-strong{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
}
