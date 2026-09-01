import { useNavigate } from 'react-router-dom';
import vaultxMark from 'assets/images/vaultx-mark.svg';

const GROUPS = {
  Platform: [
    ['Opportunities', '/gallery'],
    ['Presale', '/presale'],
    ['Portfolio', '/portfolio'],
    ['Staking', '/stake'],
  ],
  Trust: [
    ['Compliance center', '/compliance'],
    ['Contract registry', '/contact'],
    ['Transactions', '/transactions'],
  ],
  Company: [
    ['About', '/about'],
    ['Contact', '/contact'],
  ],
};

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,.1)', background: '#080b12', color: '#fff', padding: '72px 0 26px' }}>
      <div className="vx-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.45fr repeat(3,1fr)', gap: 36, marginBottom: 36 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 15 }}>
              <img src={vaultxMark} alt="" width="42" height="42" style={{ borderRadius: 12 }} />
              <div>
                <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-.04em' }}>Vault<span style={{ color: 'var(--brand)' }}>X</span></div>
                <div className="mono" style={{ fontSize: 7, color: 'var(--dim)', letterSpacing: '.18em', textTransform: 'uppercase', marginTop: 3 }}>Real asset capital workspace</div>
              </div>
            </div>
            <p style={{ maxWidth: 380, margin: 0, fontSize: 13, lineHeight: 1.75, color: '#9ea8b9' }}>
              A contract-aware proof of concept for discovering, verifying, and managing tokenized real-world asset opportunities.
            </p>
          </div>
          {Object.entries(GROUPS).map(([group, links]) => (
            <div key={group}>
              <div className="mono" style={{ fontSize: 9, fontWeight: 600, color: '#7f899b', letterSpacing: '.13em', textTransform: 'uppercase', marginBottom: 13 }}>{group}</div>
              {links.map(([label, route]) => (
                <button key={label} type="button" onClick={() => navigate(route)} style={{ display: 'block', background: 'transparent', color: '#b9c1cf', padding: '6px 0', cursor: 'pointer', fontSize: 13, textAlign: 'left' }}>
                  {label}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 21, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div className="mono" style={{ fontSize: 9, color: '#717b8d', letterSpacing: '.06em' }}>© 2026 VAULTX PROTOCOL · PROOF OF CONCEPT</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span className="vx-status">Contract-gated</span>
            <span className="vx-status warning">Testnet only</span>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:840px){footer .vx-container>div:first-child{grid-template-columns:1fr 1fr!important}}
        @media(max-width:560px){footer .vx-container>div:first-child{grid-template-columns:1fr!important}}
      `}</style>
    </footer>
  );
}
