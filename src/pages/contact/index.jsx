import { useState } from 'react';

const VAULTX_PUBLIC_ADDRESS = '0xBb569C738f56348B21a84D520f679fe41Fd01cc5';
const ROUTES = [
  ['Asset partnerships', 'Opportunity sourcing, diligence data, servicing, and tokenization infrastructure.'],
  ['Technical review', 'Frontend integration, contracts, testnet configuration, security, and deployment readiness.'],
  ['Investor information', 'Platform workflow, token utility, opportunity data, and public product materials.'],
];

export default function Contact() {
  const [type, setType] = useState(ROUTES[0][0]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const copyAddress = async () => {
    await navigator.clipboard?.writeText(VAULTX_PUBLIC_ADDRESS);
    setStatus('Public address copied.');
  };

  const prepareSummary = async (event) => {
    event.preventDefault();
    const summary = [`VaultX inquiry: ${type}`, `Name: ${name || 'Not provided'}`, '', message || 'No message provided.'].join('\n');
    await navigator.clipboard?.writeText(summary);
    setStatus('Inquiry summary copied. No data was sent.');
  };

  return (
    <div className="vx-page">
      <section className="vx-hero" style={{ padding: '72px 0 56px' }}>
        <div className="vx-container" style={{ position: 'relative' }}>
          <div className="vx-eyebrow">Review desk</div>
          <h1 className="vx-title" style={{ fontSize: 'clamp(42px,6vw,76px)', maxWidth: 850 }}>Route the right question to the right workstream.</h1>
          <p className="vx-copy" style={{ maxWidth: 650, margin: '20px 0 0' }}>Prepare an inquiry brief, copy the public reference address, or identify the correct product-review path.</p>
        </div>
      </section>

      <section style={{ padding: '34px 0 96px' }}>
        <div className="vx-container" style={{ display: 'grid', gridTemplateColumns: '.78fr 1.22fr', gap: 20, alignItems: 'start' }}>
          <div>
            <div className="vx-card-strong" style={{ padding: 23, marginBottom: 16 }}>
              <div className="vx-kicker">Public VaultX address</div>
              <h2 style={{ margin: '8px 0 10px', fontSize: 24, letterSpacing: '-.04em' }}>Verify before interacting.</h2>
              <p className="vx-copy" style={{ margin: '0 0 16px', fontSize: 12.5 }}>Use official project materials and a trusted explorer to verify every deployed address before sending funds or granting approvals.</p>
              <div className="mono" style={{ padding: 14, borderRadius: 13, background: 'var(--brand-soft)', color: 'var(--brand-deep)', border: '1px solid #cbd4ff', wordBreak: 'break-all', fontSize: 10, lineHeight: 1.7 }}>{VAULTX_PUBLIC_ADDRESS}</div>
              <button className="vx-btn secondary" type="button" onClick={copyAddress} style={{ width: '100%', marginTop: 12 }}>Copy public address</button>
            </div>
            <div style={{ padding: 16, borderRadius: 15, background: 'var(--warning-soft)', border: '1px solid #f2d7aa', color: '#775121', fontSize: 10.5, lineHeight: 1.6 }}>
              This page does not transmit form data. It creates a structured inquiry summary in your clipboard.
            </div>
          </div>

          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 11, marginBottom: 16 }}>
              {ROUTES.map(([title, description]) => (
                <button key={title} type="button" aria-pressed={type === title} onClick={() => setType(title)} style={{ textAlign: 'left', padding: 17, borderRadius: 15, background: type === title ? 'var(--brand-soft)' : '#fff', border: `1px solid ${type === title ? '#cbd4ff' : 'var(--border)'}`, cursor: 'pointer' }}>
                  <strong style={{ fontSize: 12.5 }}>{title}</strong>
                  <p style={{ margin: '7px 0 0', color: 'var(--muted)', fontSize: 10.5, lineHeight: 1.5 }}>{description}</p>
                </button>
              ))}
            </div>
            <form className="vx-card-strong" onSubmit={prepareSummary} style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'center', marginBottom: 20 }}>
                <div><div className="vx-kicker">Inquiry builder</div><h2 style={{ margin: '8px 0 0', fontSize: 24, letterSpacing: '-.04em' }}>{type}</h2></div>
                <span className="vx-status">Local only</span>
              </div>
              <label style={{ display: 'block', marginBottom: 14 }}>
                <span className="mono" style={{ display: 'block', marginBottom: 7, color: 'var(--dim)', fontSize: 8, textTransform: 'uppercase' }}>Name or organization</span>
                <input className="vx-field" value={name} onChange={(event) => setName(event.target.value)} placeholder="Optional" />
              </label>
              <label style={{ display: 'block' }}>
                <span className="mono" style={{ display: 'block', marginBottom: 7, color: 'var(--dim)', fontSize: 8, textTransform: 'uppercase' }}>Review request</span>
                <textarea className="vx-field" rows="7" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Describe the asset, integration, or product review you need." style={{ padding: 14, resize: 'vertical' }} />
              </label>
              <button className="vx-btn" type="submit" style={{ width: '100%', marginTop: 14 }}>Copy inquiry summary</button>
              {status && <div role="status" className="vx-status" style={{ marginTop: 13 }}>{status}</div>}
            </form>
          </div>
        </div>
      </section>
      <style>{`
        @media(max-width:900px){section .vx-container{grid-template-columns:1fr!important}}
        @media(max-width:680px){section .vx-container>div>div[style*='repeat(3,1fr)']{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
}
