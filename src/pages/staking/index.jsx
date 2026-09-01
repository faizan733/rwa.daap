import TokenPools from 'features/staking/TokenPools';

const TERMS = [
  { label:'Flexible', value:'4.8%', note:'No fixed lock' },
  { label:'30-day', value:'7.2%', note:'Illustrative APR' },
  { label:'90-day', value:'10.4%', note:'Illustrative APR' },
];

const PRINCIPLES = [
  ['Variable rewards', 'Rates are estimates until a verified staking contract and reward schedule are configured.'],
  ['Explicit approvals', 'Token allowance must be reviewed before a staking transaction can be submitted.'],
  ['Visible lock terms', 'Unlock dates, early-exit rules, and reward treatment should be shown before confirmation.'],
  ['Contract-gated actions', 'The transaction button remains disabled when wallet, network, or address checks fail.'],
];

export default function Stake() {
  return (
    <div className="vx-page">
      <section className="vx-hero" style={{ padding: '72px 0 56px' }}>
        <div className="vx-container" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr .64fr', gap: 42, alignItems: 'end' }}>
          <div>
            <div className="vx-eyebrow">VTX utility</div>
            <h1 className="vx-title" style={{ fontSize: 'clamp(42px,6vw,76px)', maxWidth: 820 }}>Model rewards before you lock tokens.</h1>
            <p className="vx-copy" style={{ maxWidth: 630, margin: '20px 0 0' }}>Compare term assumptions, estimate rewards, and see exactly which configuration gates must pass before staking becomes available.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 18, overflow: 'hidden' }}>
            {TERMS.map((term, index) => (
              <div key={term.label} style={{ padding: 17, borderRight: index < TERMS.length - 1 ? '1px solid rgba(255,255,255,.12)' : 0, background: 'rgba(255,255,255,.035)' }}>
                <div className="mono" style={{ color: '#91a0b8', fontSize: 7.5, letterSpacing: '.08em', textTransform: 'uppercase' }}>{term.label}</div>
                <strong style={{ display: 'block', marginTop: 7, fontSize: 20 }}>{term.value}</strong>
                <div style={{ marginTop: 4, color: '#95a2b8', fontSize: 9 }}>{term.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '34px 0 96px' }}>
        <div className="vx-container" style={{ display: 'grid', gridTemplateColumns: '.82fr 1.18fr', gap: 20, alignItems: 'start' }}>
          <div>
            <div className="vx-card-strong" style={{ padding: 23 }}>
              <div className="vx-kicker">Staking policy</div>
              <h2 style={{ margin: '8px 0 18px', fontSize: 24, letterSpacing: '-.04em' }}>What the interface protects</h2>
              {PRINCIPLES.map(([title, description], index) => (
                <div key={title} style={{ display: 'grid', gridTemplateColumns: '34px 1fr', gap: 12, padding: '14px 0', borderBottom: index < PRINCIPLES.length - 1 ? '1px solid var(--border)' : 0 }}>
                  <div className="mono" style={{ width: 32, height: 32, display: 'grid', placeItems: 'center', borderRadius: 10, background: index === 1 ? 'var(--accent-soft)' : 'var(--brand-soft)', color: index === 1 ? '#0b7658' : 'var(--brand-deep)', fontSize: 8 }}>{String(index + 1).padStart(2, '0')}</div>
                  <div><strong style={{ fontSize: 12.5 }}>{title}</strong><p style={{ margin: '5px 0 0', color: 'var(--muted)', fontSize: 11.5, lineHeight: 1.55 }}>{description}</p></div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 15, padding: 16, borderRadius: 15, background: 'var(--warning-soft)', border: '1px solid #f2d7aa', color: '#775121', fontSize: 10.5, lineHeight: 1.6 }}>
              Reward rates are illustrative UI assumptions. Production rates, lock periods, and exit rules must come from the verified staking deployment.
            </div>
          </div>
          <TokenPools />
        </div>
      </section>
      <style>{`
        @media(max-width:920px){section .vx-container,section.vx-hero .vx-container{grid-template-columns:1fr!important}}
        @media(max-width:560px){section.vx-hero .vx-container>div:last-child{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
}
