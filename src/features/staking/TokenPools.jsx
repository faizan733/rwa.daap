import { useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import Account from 'features/wallet/WalletAccount';

const POOLS = [
  { id: 'flex', label: 'Flexible', days: 0, apr: 4.8, note: 'No fixed lock' },
  { id: '30', label: '30 days', days: 30, apr: 7.2, note: 'Modeled term' },
  { id: '90', label: '90 days', days: 90, apr: 10.4, note: 'Modeled term' },
];

export default function TokenPools() {
  const { account, library } = useWeb3React();
  const [poolId, setPoolId] = useState('30');
  const [amount, setAmount] = useState('10000');
  const pool = POOLS.find((item) => item.id === poolId) || POOLS[1];
  const numericAmount = Math.max(0, Number(amount) || 0);
  const annualReward = useMemo(() => numericAmount * (pool.apr / 100), [numericAmount, pool.apr]);
  const termReward = pool.days ? annualReward * (pool.days / 365) : annualReward / 12;
  const connected = Boolean(account && library);

  return (
    <div className="vx-card-strong" style={{ padding: 25 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <div className="vx-kicker">Reward calculator</div>
          <h2 style={{ margin: '8px 0 0', fontSize: 25, letterSpacing: '-.04em' }}>Configure a modeled position</h2>
        </div>
        <span className={`vx-status ${connected ? '' : 'warning'}`}>{connected ? 'Wallet connected' : 'Wallet required'}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 9, marginTop: 23 }}>
        {POOLS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={poolId === item.id}
            onClick={() => setPoolId(item.id)}
            style={{ textAlign: 'left', padding: 15, borderRadius: 14, background: poolId === item.id ? 'var(--brand-soft)' : 'var(--surface-2)', border: `1px solid ${poolId === item.id ? '#cbd4ff' : 'var(--border)'}`, cursor: 'pointer' }}
          >
            <div className="mono" style={{ color: poolId === item.id ? 'var(--brand-deep)' : 'var(--dim)', fontSize: 8, textTransform: 'uppercase' }}>{item.label}</div>
            <strong style={{ display: 'block', marginTop: 7, fontSize: 20 }}>{item.apr}%</strong>
            <div style={{ marginTop: 3, color: 'var(--muted)', fontSize: 9 }}>{item.note}</div>
          </button>
        ))}
      </div>

      <label style={{ display: 'block', marginTop: 20 }}>
        <span className="mono" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 7, color: 'var(--dim)', fontSize: 8, letterSpacing: '.08em', textTransform: 'uppercase' }}>
          <span>Amount to model</span><span>Wallet balance: unavailable</span>
        </span>
        <input className="vx-field" type="number" min="0" step="100" value={amount} onChange={(event) => setAmount(event.target.value)} />
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 13 }}>
        <div style={{ padding: 16, borderRadius: 14, background: 'var(--brand-soft)' }}>
          <div className="mono" style={{ color: 'var(--brand-deep)', fontSize: 7.5, textTransform: 'uppercase' }}>Modeled term reward</div>
          <strong style={{ display: 'block', marginTop: 7, fontSize: 20 }}>{termReward.toLocaleString(undefined, { maximumFractionDigits: 2 })} VTX</strong>
        </div>
        <div style={{ padding: 16, borderRadius: 14, background: 'var(--accent-soft)' }}>
          <div className="mono" style={{ color: '#0b7658', fontSize: 7.5, textTransform: 'uppercase' }}>Modeled annual reward</div>
          <strong style={{ display: 'block', marginTop: 7, fontSize: 20 }}>{annualReward.toLocaleString(undefined, { maximumFractionDigits: 2 })} VTX</strong>
        </div>
      </div>

      <div style={{ marginTop: 16, padding: 15, borderRadius: 14, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        {[['Selected term', pool.label], ['Illustrative APR', `${pool.apr}%`], ['Approval state', 'Not requested'], ['Staking contract', 'Not configured']].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: label !== 'Staking contract' ? '1px solid var(--border)' : 0, fontSize: 11.5 }}>
            <span style={{ color: 'var(--muted)' }}>{label}</span><strong>{value}</strong>
          </div>
        ))}
      </div>

      {!connected && <div style={{ display: 'flex', justifyContent: 'center', marginTop: 17 }}><Account /></div>}
      <button className="vx-btn" type="button" disabled style={{ width: '100%', marginTop: 14 }}>Staking contract not configured</button>
      <p style={{ margin: '10px 0 0', color: 'var(--dim)', textAlign: 'center', fontSize: 9.5, lineHeight: 1.5 }}>No allowance or staking transaction is submitted by this calculator.</p>
    </div>
  );
}
