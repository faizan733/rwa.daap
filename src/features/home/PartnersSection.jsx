import { useNavigate } from 'react-router-dom';

const RAILS = ['Asset servicing', 'Identity and KYC', 'Custody', 'Transfer controls', 'Oracle data', 'Settlement', 'Document anchors', 'Reporting'];

export default function PartnersSection() {
  const navigate = useNavigate();
  return (
    <section className="vx-section" style={{ background: '#0b1220', color: '#fff' }}>
      <div className="vx-container" style={{ display: 'grid', gridTemplateColumns: '.85fr 1.15fr', gap: 56, alignItems: 'center' }}>
        <div>
          <div className="vx-eyebrow" style={{ color: '#dce4ff', background: 'rgba(72,100,255,.16)', borderColor: 'rgba(152,169,255,.28)' }}>Integration-ready foundation</div>
          <h2 className="vx-title" style={{ color: '#fff', fontSize: 'clamp(36px,4.4vw,58px)' }}>Built around the services real asset operations require.</h2>
          <p style={{ color: '#aeb9cd', lineHeight: 1.75, fontSize: 14, margin: '18px 0 28px' }}>
            The proof of concept keeps these rails modular so production providers can be integrated without rewriting the investor experience.
          </p>
          <div style={{ display: 'flex', gap: 11, flexWrap: 'wrap' }}>
            <button className="vx-btn" type="button" onClick={() => navigate('/compliance')}>Open compliance center</button>
            <button className="vx-btn secondary" type="button" onClick={() => navigate('/about')}>Review platform model</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 22, overflow: 'hidden' }}>
          {RAILS.map((rail, index) => (
            <div key={rail} style={{ padding: '21px 20px', borderRight: index % 2 === 0 ? '1px solid rgba(255,255,255,.1)' : 0, borderBottom: index < RAILS.length - 2 ? '1px solid rgba(255,255,255,.1)' : 0, background: index % 3 === 0 ? 'rgba(54,88,245,.08)' : 'rgba(255,255,255,.025)' }}>
              <div className="mono" style={{ color: '#8196ff', fontSize: 8, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 7 }}>Rail {String(index + 1).padStart(2, '0')}</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{rail}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:900px){section .vx-container{grid-template-columns:1fr!important}}
        @media(max-width:520px){section .vx-container>div:last-child{grid-template-columns:1fr!important}section .vx-container>div:last-child>div{border-right:0!important}}
      `}</style>
    </section>
  );
}
