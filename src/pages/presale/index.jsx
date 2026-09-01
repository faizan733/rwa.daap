import { useMemo, useState } from 'react';
import PhaseOne from 'features/presale/phases/phase-one/PhaseOne';

const STEPS = [
  { n: '01', t: 'Verify environment', d: 'Confirm the network, sale address, token address, and contract state.' },
  { n: '02', t: 'Review eligibility', d: 'Complete the required compliance and offering-document checks.' },
  { n: '03', t: 'Preview allocation', d: 'Model contribution size and token allocation before opening a wallet action.' },
  { n: '04', t: 'Submit or recover', d: 'Deposit only while active, claim after success, or refund after failure.' },
];

function ContributionPlanner() {
  const [amount, setAmount] = useState('0.1');
  const rate = 2000000;
  const tokens = useMemo(() => Math.max(0, Number(amount) || 0) * rate, [amount]);
  return (
    <div className="vx-card-strong" style={{ padding: 22, marginBottom: 16 }}>
      <div className="vx-kicker">Contribution planner</div>
      <h3 style={{ margin: '8px 0 15px', fontSize: 19, letterSpacing: '-.03em' }}>Preview an illustrative allocation</h3>
      <label>
        <span className="mono" style={{ display: 'block', marginBottom: 7, color: 'var(--dim)', fontSize: 8, letterSpacing: '.08em', textTransform: 'uppercase' }}>Contribution amount (ETH)</span>
        <input className="vx-field" type="number" min="0" step="0.05" value={amount} onChange={(event) => setAmount(event.target.value)} />
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginTop: 11 }}>
        {['0.05', '0.1', '0.25', '0.5'].map((value) => (
          <button key={value} type="button" onClick={() => setAmount(value)} style={{ minHeight: 34, borderRadius: 10, background: amount === value ? 'var(--brand-soft)' : 'var(--surface-2)', color: amount === value ? 'var(--brand-deep)' : 'var(--muted)', border: `1px solid ${amount === value ? '#cbd4ff' : 'var(--border)'}`, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>{value} ETH</button>
        ))}
      </div>
      <div style={{ marginTop: 14, padding: 15, borderRadius: 13, background: 'var(--brand-soft)' }}>
        <div className="mono" style={{ color: 'var(--brand-deep)', fontSize: 8, letterSpacing: '.08em', textTransform: 'uppercase' }}>Modeled VTX allocation</div>
        <strong style={{ display: 'block', marginTop: 6, fontSize: 20 }}>{tokens.toLocaleString(undefined, { maximumFractionDigits: 0 })} VTX</strong>
      </div>
      <p style={{ margin: '10px 0 0', color: 'var(--dim)', fontSize: 9.5, lineHeight: 1.55 }}>Uses the illustrative 2,000,000 VTX/ETH reference rate. The configured contract remains the execution source of truth.</p>
    </div>
  );
}

export default function PreSale() {
  return (
    <div className="vx-page">
      <section className="vx-hero" style={{ padding: '72px 0 54px' }}>
        <div className="vx-container" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr .66fr', gap: 42, alignItems: 'end' }}>
          <div>
            <div className="vx-eyebrow"><span className="live-dot" /> Contract-aware sale workspace</div>
            <h1 className="vx-title" style={{ fontSize: 'clamp(42px,6vw,76px)', maxWidth: 820 }}>Review every gate before you transact.</h1>
            <p className="vx-copy" style={{ maxWidth: 650, margin: '20px 0 0' }}>
              The presale console reads wallet, network, deployed address, and on-chain sale state before enabling any deposit, claim, or refund action.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid rgba(255,255,255,.14)', borderRadius: 18, overflow: 'hidden' }}>
            {[['Round', 'Public model'], ['Allocation', '100M VTX'], ['Reference rate', '2M / ETH'], ['Hard cap', '100 ETH']].map(([label, value], index) => (
              <div key={label} style={{ padding: 17, borderRight: index % 2 === 0 ? '1px solid rgba(255,255,255,.12)' : 0, borderBottom: index < 2 ? '1px solid rgba(255,255,255,.12)' : 0, background: 'rgba(255,255,255,.035)' }}>
                <div className="mono" style={{ color: '#91a0b8', fontSize: 7.5, letterSpacing: '.08em', textTransform: 'uppercase' }}>{label}</div>
                <strong style={{ display: 'block', marginTop: 6, fontSize: 14 }}>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '30px 0 96px' }}>
        <div className="vx-container" style={{ display: 'grid', gridTemplateColumns: '.66fr 1fr', gap: 22, alignItems: 'start' }}>
          <aside>
            <ContributionPlanner />
            <div className="vx-card-strong" style={{ padding: 22, marginBottom: 16 }}>
              <div className="vx-kicker">Safe execution path</div>
              <div style={{ marginTop: 12 }}>
                {STEPS.map((step, index) => (
                  <div key={step.n} style={{ display: 'grid', gridTemplateColumns: '34px 1fr', gap: 12, padding: '14px 0', borderBottom: index < STEPS.length - 1 ? '1px solid var(--border)' : 0 }}>
                    <div className="mono" style={{ width: 32, height: 32, borderRadius: 10, display: 'grid', placeItems: 'center', background: 'var(--brand-soft)', color: 'var(--brand-deep)', fontSize: 8, fontWeight: 600 }}>{step.n}</div>
                    <div><strong style={{ fontSize: 12.5 }}>{step.t}</strong><p style={{ margin: '5px 0 0', color: 'var(--muted)', lineHeight: 1.55, fontSize: 11 }}>{step.d}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: 16, borderRadius: 15, border: '1px solid #f2c6ca', background: 'var(--danger-soft)' }}>
              <div className="mono" style={{ color: '#a63843', fontSize: 8.5, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 7 }}>Risk disclosure</div>
              <p style={{ margin: 0, color: '#7e3b42', lineHeight: 1.6, fontSize: 10.5 }}>Confirm official addresses, legal terms, token documentation, and independent contract review before any production transaction.</p>
            </div>
          </aside>
          <main><PhaseOne /></main>
        </div>
      </section>
      <style>{`
        @media(max-width:980px){section .vx-container{grid-template-columns:1fr!important}}
        @media(max-width:520px){section.vx-hero .vx-container>div:last-child{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
}
