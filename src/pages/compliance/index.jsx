import { useEffect, useMemo, useRef, useState } from 'react';
import { useWeb3React } from '@web3-react/core';

const CHECKS = [
  { id: 'identity', title: 'Identity document', desc: 'Government-issued photo identification is ready for provider review.' },
  { id: 'address', title: 'Proof of address', desc: 'A recent utility, bank, or government statement is available.' },
  { id: 'tax', title: 'Tax classification', desc: 'Applicable tax residency and classification details are prepared.' },
  { id: 'risk', title: 'Risk acknowledgment', desc: 'The investor has reviewed the product and smart-contract risk disclosures.' },
];

const DOCUMENTS = [
  { type: 'Offering memorandum', version: 'Draft 0.8', date: '30 Jul 2026', hash: '0x6af1…92d4', status: 'Demo record' },
  { type: 'Risk disclosure', version: 'Draft 1.2', date: '30 Jul 2026', hash: '0x2d9e…11a7', status: 'Demo record' },
  { type: 'Property valuation', version: 'Sample 0.4', date: '28 Jul 2026', hash: '0x83c4…7fe2', status: 'Demo record' },
  { type: 'Contract review', version: 'Pending', date: 'Not issued', hash: 'Not anchored', status: 'Required' },
];

const JURISDICTIONS = ['United States', 'Singapore', 'Germany', 'United Kingdom', 'United Arab Emirates'];

export default function Compliance() {
  const { account, library } = useWeb3React();
  const reviewRef = useRef(null);
  const [jurisdiction, setJurisdiction] = useState('United States');
  const [investorType, setInvestorType] = useState('Individual');
  const [checks, setChecks] = useState({});
  const [copied, setCopied] = useState('');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('vaultx_compliance_checklist') || '{}');
      if (saved && typeof saved === 'object') setChecks(saved);
    } catch {
      setChecks({});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vaultx_compliance_checklist', JSON.stringify(checks));
  }, [checks]);

  const completed = useMemo(() => CHECKS.filter((item) => checks[item.id]).length, [checks]);
  const progress = (completed / CHECKS.length) * 100;

  const toggle = (id) => setChecks((current) => ({ ...current, [id]: !current[id] }));
  const copyHash = async (hash) => {
    if (hash === 'Not anchored') return;
    await navigator.clipboard?.writeText(hash);
    setCopied(hash);
    window.setTimeout(() => setCopied(''), 1400);
  };

  const GATES = [
    ['Wallet connected', Boolean(account && library), account ? 'Detected' : 'Required'],
    ['Identity checklist', completed === CHECKS.length, `${completed}/${CHECKS.length} prepared`],
    ['Jurisdiction review', false, 'Manual review required'],
    ['Offering agreement', false, 'Not accepted'],
    ['Verified contract', false, 'Deployment not configured'],
  ];

  return (
    <div className="vx-page">
      <section className="vx-hero" style={{ padding: '72px 0 56px' }}>
        <div className="vx-container" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr .52fr', gap: 42, alignItems: 'end' }}>
          <div>
            <div className="vx-eyebrow">Trust and eligibility</div>
            <h1 className="vx-title" style={{ fontSize: 'clamp(42px,6vw,76px)', maxWidth: 820 }}>Compliance state you can understand.</h1>
            <p className="vx-copy" style={{ maxWidth: 640, margin: '20px 0 0' }}>Prepare identity information, review transaction gates, and inspect document-anchor records before entering an asset flow.</p>
          </div>
          <div style={{ padding: 22, borderRadius: 20, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.14)' }}>
            <div className="mono" style={{ color: '#9daeff', fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase' }}>Self-assessment progress</div>
            <div style={{ marginTop: 9, fontSize: 32, fontWeight: 800 }}>{completed} / {CHECKS.length}</div>
            <div className="vx-progress" style={{ marginTop: 13, background: 'rgba(255,255,255,.12)' }}><span style={{ width: `${progress}%` }} /></div>
            <p style={{ margin: '12px 0 0', color: '#9eabc0', fontSize: 10.5, lineHeight: 1.55 }}>Local preparation only. This is not identity verification or legal eligibility approval.</p>
          </div>
        </div>
      </section>

      <section style={{ padding: '32px 0 96px' }}>
        <div className="vx-container">
          <div style={{ display: 'grid', gridTemplateColumns: '.68fr 1.32fr', gap: 18, marginBottom: 18 }}>
            <aside className="vx-card-strong" style={{ padding: 23, alignSelf: 'start' }}>
              <div className="vx-kicker">Investor profile</div>
              <h2 style={{ margin: '8px 0 20px', fontSize: 22, letterSpacing: '-.035em' }}>Review context</h2>
              <label style={{ display: 'block', marginBottom: 16 }}>
                <span className="mono" style={{ display: 'block', marginBottom: 7, color: 'var(--dim)', fontSize: 8, letterSpacing: '.08em', textTransform: 'uppercase' }}>Jurisdiction</span>
                <select className="vx-field" value={jurisdiction} onChange={(event) => setJurisdiction(event.target.value)}>
                  {JURISDICTIONS.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label style={{ display: 'block' }}>
                <span className="mono" style={{ display: 'block', marginBottom: 7, color: 'var(--dim)', fontSize: 8, letterSpacing: '.08em', textTransform: 'uppercase' }}>Investor profile</span>
                <select className="vx-field" value={investorType} onChange={(event) => setInvestorType(event.target.value)}>
                  <option>Individual</option>
                  <option>Entity</option>
                  <option>Professional investor</option>
                </select>
              </label>
              <div style={{ marginTop: 18, padding: 15, borderRadius: 14, background: 'var(--warning-soft)', border: '1px solid #f2d7aa' }}>
                <div style={{ color: '#8a5b1e', fontWeight: 800, fontSize: 12 }}>Manual review required</div>
                <p style={{ margin: '6px 0 0', color: '#775121', fontSize: 11, lineHeight: 1.55 }}>{jurisdiction} · {investorType}. No automated legal conclusion is provided by this PoC.</p>
              </div>
              <button className="vx-btn" type="button" onClick={() => reviewRef.current?.scrollIntoView({ behavior: 'smooth' })} style={{ width: '100%', marginTop: 18 }}>Continue checklist</button>
            </aside>

            <div className="vx-card-strong" style={{ padding: 23 }} ref={reviewRef}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                  <div className="vx-kicker">Preparation checklist</div>
                  <h2 style={{ margin: '8px 0 0', fontSize: 22, letterSpacing: '-.035em' }}>Information readiness</h2>
                </div>
                <button type="button" className="vx-btn ghost" onClick={() => setChecks({})}>Clear local checklist</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20 }}>
                {CHECKS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={Boolean(checks[item.id])}
                    onClick={() => toggle(item.id)}
                    style={{ textAlign: 'left', padding: 17, borderRadius: 15, border: `1px solid ${checks[item.id] ? '#aee3d3' : 'var(--border)'}`, background: checks[item.id] ? 'var(--accent-soft)' : 'var(--surface-2)', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 24, height: 24, borderRadius: 8, display: 'grid', placeItems: 'center', background: checks[item.id] ? 'var(--accent)' : '#fff', color: '#fff', border: `1px solid ${checks[item.id] ? 'var(--accent)' : 'var(--border-strong)'}`, fontSize: 12 }}>{checks[item.id] ? '✓' : ''}</span>
                      <strong style={{ fontSize: 13 }}>{item.title}</strong>
                    </div>
                    <p style={{ margin: '9px 0 0 34px', color: 'var(--muted)', fontSize: 11.5, lineHeight: 1.55 }}>{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '.82fr 1.18fr', gap: 18 }}>
            <div className="vx-card-strong" style={{ padding: 23 }}>
              <div className="vx-kicker">Transaction policy</div>
              <h2 style={{ margin: '8px 0 18px', fontSize: 22, letterSpacing: '-.035em' }}>Readiness gates</h2>
              {GATES.map(([label, passed, note]) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '25px 1fr auto', alignItems: 'center', gap: 10, padding: '13px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ width: 22, height: 22, display: 'grid', placeItems: 'center', borderRadius: 7, background: passed ? 'var(--accent-soft)' : 'var(--warning-soft)', color: passed ? '#0b7658' : '#9b5b17', fontSize: 11 }}>{passed ? '✓' : '!'}</span>
                  <strong style={{ fontSize: 12.5 }}>{label}</strong>
                  <span className={`vx-status ${passed ? '' : 'warning'}`} style={{ fontSize: 8 }}>{note}</span>
                </div>
              ))}
            </div>

            <div className="vx-card-strong" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '21px 22px', borderBottom: '1px solid var(--border)' }}>
                <div className="vx-kicker">Document register</div>
                <h2 style={{ margin: '8px 0 0', fontSize: 22, letterSpacing: '-.035em' }}>Asset disclosure records</h2>
                <p className="vx-copy" style={{ margin: '8px 0 0', fontSize: 11.5 }}>Hashes below are illustrative UI records, not production blockchain attestations.</p>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="vx-data-table">
                  <thead><tr><th>Document</th><th>Version</th><th>Date</th><th>Anchor</th><th>Status</th></tr></thead>
                  <tbody>
                    {DOCUMENTS.map((document) => (
                      <tr key={document.type}>
                        <td><strong>{document.type}</strong></td>
                        <td>{document.version}</td>
                        <td>{document.date}</td>
                        <td><button type="button" onClick={() => copyHash(document.hash)} disabled={document.hash === 'Not anchored'} style={{ padding: 0, background: 'transparent', color: document.hash === 'Not anchored' ? 'var(--dim)' : 'var(--brand-deep)', cursor: document.hash === 'Not anchored' ? 'default' : 'pointer', fontFamily: 'IBM Plex Mono, monospace', fontSize: 9 }}>{copied === document.hash ? 'Copied' : document.hash}</button></td>
                        <td><span className={`vx-status ${document.status === 'Required' ? 'warning' : ''}`}>{document.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
      <style>{`
        @media(max-width:980px){section .vx-container>div[style*='.68fr'],section .vx-container>div[style*='.82fr'],section.vx-hero .vx-container{grid-template-columns:1fr!important}}
        @media(max-width:680px){section .vx-card-strong>div[style*='1fr 1fr']{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
}
