import SwapCard from 'features/swap/SwapCard';
import WalletGate from 'shared/components/ui/WalletGate';
import oneInch from 'assets/images/partners/1inch.svg';

const CHECKS = [
  ['Wallet', 'Required', 'Injected EIP-1193 provider'],
  ['Supported networks', 'Ethereum · BSC', 'Chain IDs 1 and 56'],
  ['Quote source', '1inch API', 'API key required'],
  ['Slippage policy', '0.5% default', 'Review before production'],
  ['Transaction control', 'Wallet confirmation', 'Never signed by the frontend'],
];

export default function Swap() {
  return (
    <div className="vx-page">
      <section className="vx-hero" style={{ padding: '72px 0 56px' }}>
        <div className="vx-container" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr .52fr', gap: 42, alignItems: 'end' }}>
          <div>
            <div className="vx-eyebrow">Liquidity workspace</div>
            <h1 className="vx-title" style={{ fontSize: 'clamp(42px,6vw,76px)', maxWidth: 810 }}>Quote first. Verify every route.</h1>
            <p className="vx-copy" style={{ maxWidth: 620, margin: '20px 0 0' }}>Token selection, price impact, gas estimate, and wallet confirmation remain distinct steps in the swap workflow.</p>
          </div>
          <div style={{ padding: 21, border: '1px solid rgba(255,255,255,.14)', borderRadius: 18, background: 'rgba(255,255,255,.035)' }}>
            <div className="mono" style={{ color: '#91a0b8', fontSize: 8, letterSpacing: '.1em', textTransform: 'uppercase' }}>Routing provider</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginTop: 13 }}>
              <div style={{ width: 62, height: 42, borderRadius: 10, display: 'grid', placeItems: 'center', background: '#fff' }}><img src={oneInch} alt="1inch" width="46" /></div>
              <div><strong style={{ fontSize: 15 }}>1inch aggregation</strong><div style={{ marginTop: 4, color: '#98a5ba', fontSize: 9.5 }}>External quote and execution API</div></div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '34px 0 96px' }}>
        <div className="vx-container">
          <WalletGate title="Connect a wallet to request a quote" description="Token lists, quotes, and swap transactions require a connected wallet on a supported network.">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(360px,.72fr) 1fr', gap: 20, alignItems: 'start' }}>
              <SwapCard />
              <div>
                <div className="vx-card-strong" style={{ padding: 23 }}>
                  <div className="vx-kicker">Execution policy</div>
                  <h2 style={{ margin: '8px 0 18px', fontSize: 24, letterSpacing: '-.04em' }}>What must be true before a swap</h2>
                  {CHECKS.map(([label, value, note], index) => (
                    <div key={label} style={{ display: 'grid', gridTemplateColumns: '34px 1fr auto', gap: 12, alignItems: 'center', padding: '14px 0', borderBottom: index < CHECKS.length - 1 ? '1px solid var(--border)' : 0 }}>
                      <div className="mono" style={{ width: 32, height: 32, display: 'grid', placeItems: 'center', borderRadius: 10, background: index === 2 ? 'var(--accent-soft)' : 'var(--brand-soft)', color: index === 2 ? '#0b7658' : 'var(--brand-deep)', fontSize: 8 }}>{String(index + 1).padStart(2, '0')}</div>
                      <div><strong style={{ fontSize: 12 }}>{label}</strong><div style={{ marginTop: 4, color: 'var(--muted)', fontSize: 10 }}>{note}</div></div>
                      <span className="vx-status" style={{ fontSize: 8 }}>{value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 15, padding: 16, borderRadius: 15, background: 'var(--warning-soft)', border: '1px solid #f2d7aa', color: '#775121', fontSize: 10.5, lineHeight: 1.6 }}>
                  Quotes can expire or change between request and confirmation. Review the final wallet transaction, route, gas, slippage, and recipient before signing.
                </div>
              </div>
            </div>
          </WalletGate>
        </div>
      </section>
      <style>{`
        @media(max-width:920px){section .vx-container>div>div[style*='minmax(360px']{grid-template-columns:1fr!important}section.vx-hero .vx-container{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
}
