import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showcaseAssets } from 'assets/remoteImages';

function Metric({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-.04em' }}>{value}</div>
      <div className="mono" style={{ marginTop: 5, fontSize: 8, color: '#8f9db5', letterSpacing: '.11em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

function OpportunityCard({ asset, active, onSelect }) {
  const navigate = useNavigate();
  return (
    <article className="hero-asset-card" style={{ borderRadius: 22, overflow: 'hidden', background: '#fff', color: 'var(--text)', boxShadow: '0 42px 100px rgba(0,0,0,.34)', border: '1px solid rgba(255,255,255,.18)' }}>
      <div style={{ position: 'relative', height: 316 }}>
        <img src={asset.img} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,18,32,.76), rgba(11,18,32,.04) 65%)' }} />
        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
          <span className="vx-status">Illustrative opportunity</span>
          <span className="vx-status warning">{asset.raise} modeled</span>
        </div>
        <div style={{ position: 'absolute', left: 22, bottom: 20, right: 22, color: '#fff' }}>
          <div className="mono" style={{ color: '#c9d2ff', fontSize: 9, letterSpacing: '.14em', marginBottom: 7 }}>{asset.id}</div>
          <h2 style={{ margin: 0, fontSize: 27, lineHeight: 1.08, letterSpacing: '-.04em' }}>{asset.name}</h2>
          <p style={{ margin: '7px 0 0', color: '#c2ccdc', fontSize: 13 }}>{asset.location}</p>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 9 }}>
          {[
            ['Units', asset.specs.units],
            ['Occupancy', asset.specs.occupancy],
            ['Target APY', asset.specs.yield],
          ].map(([label, value]) => (
            <div key={label} style={{ padding: 13, borderRadius: 10, background: '#f4f3ee', border: '1px solid #deddd6' }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{value}</div>
              <div className="mono" style={{ marginTop: 4, color: 'var(--dim)', fontSize: 7, letterSpacing: '.08em', textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, margin: '18px 0' }}>
          <div>
            <div className="mono" style={{ color: 'var(--dim)', fontSize: 8, letterSpacing: '.1em', textTransform: 'uppercase' }}>Modeled value</div>
            <strong style={{ display: 'block', marginTop: 4, fontSize: 18 }}>{asset.price}</strong>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="mono" style={{ color: 'var(--dim)', fontSize: 8, letterSpacing: '.1em', textTransform: 'uppercase' }}>Reference unit</div>
            <strong style={{ display: 'block', marginTop: 4, color: 'var(--brand-deep)' }}>{asset.tokenPrice}</strong>
          </div>
        </div>
        <button className="vx-btn" type="button" onClick={() => navigate('/gallery')} style={{ width: '100%' }}>Review opportunity</button>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginTop: 15 }}>
          {showcaseAssets.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Show ${item.name}`}
              aria-pressed={active === index}
              onClick={() => onSelect(index)}
              style={{ width: active === index ? 25 : 7, height: 7, padding: 0, borderRadius: 99, background: active === index ? 'var(--brand)' : '#cdd3de', cursor: 'pointer', transition: '.2s' }}
            />
          ))}
        </div>
      </div>
    </article>
  );
}

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setInterval(() => setActive((value) => (value + 1) % showcaseAssets.length), 7000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="vx-hero" style={{ minHeight: 900, padding: '176px 0 108px', display: 'flex', alignItems: 'center' }}>
      <div className="vx-container hero-layout" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0,1.08fr) minmax(400px,.64fr)', gap: 76, alignItems: 'center' }}>
        <div>
          <div className="vx-eyebrow"><span className="live-dot" /> Institutional RWA infrastructure · v3.1</div>
          <h1 className="vx-title" style={{ fontSize: 'clamp(52px,6.9vw,102px)', maxWidth: 900 }}>
            Real assets.<br /><span style={{ color: '#b8f23f' }}>Programmable capital.</span>
          </h1>
          <p className="vx-copy" style={{ maxWidth: 680, margin: '27px 0 34px', fontSize: 17 }}>
            Discover, verify, and manage tokenized real-world assets through a single contract-aware investment workspace.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="vx-btn" type="button" onClick={() => navigate('/gallery')}>Explore opportunities</button>
            <button className="vx-btn secondary" type="button" onClick={() => navigate('/portfolio')}>Open portfolio preview</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22, marginTop: 50, paddingTop: 25, borderTop: '1px solid rgba(255,255,255,.13)', maxWidth: 700 }}>
            <Metric label="Opportunity models" value="06" />
            <Metric label="Configured networks" value="04" />
            <Metric label="Transaction policy" value="Gated" />
          </div>
          <p className="mono" style={{ margin: '24px 0 0', color: '#7f8ba2', fontSize: 8, lineHeight: 1.7, letterSpacing: '.06em', maxWidth: 610 }}>
            Preview values are illustrative. Production use requires verified contracts, completed compliance review, and final offering documents.
          </p>
        </div>
        <OpportunityCard asset={showcaseAssets[active]} active={active} onSelect={setActive} />
      </div>
      <style>{`
        .hero-asset-card{transform:rotate(1.2deg);transition:transform .35s ease}.hero-asset-card:hover{transform:rotate(0deg) translateY(-7px)}
        @media(max-width:980px){section .hero-layout{grid-template-columns:1fr!important}section.vx-hero{padding-top:154px}.hero-asset-card{transform:none;max-width:620px}}
        @media(max-width:580px){section .vx-container>div:first-child>div[style*='repeat(3,1fr)']{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  );
}
