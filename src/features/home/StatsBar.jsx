const CAPABILITIES = [
  { label: 'Opportunity intelligence', value: 'Search + compare', sub: 'Filter assets and evaluate key metrics side by side.' },
  { label: 'Trust layer', value: 'Documents + eligibility', sub: 'Make compliance state visible before wallet actions.' },
  { label: 'Execution layer', value: 'Contract-gated', sub: 'Disable transactions until network and addresses are valid.' },
  { label: 'Portfolio layer', value: 'Holdings + activity', sub: 'Preview allocations, distributions, and account history.' },
];

export default function StatsBar() {
  return (
    <section style={{ position: 'relative', marginTop: -34, zIndex: 4 }}>
      <div className="vx-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderRadius: 20, overflow: 'hidden', background: '#fff', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
        {CAPABILITIES.map((item, index) => (
          <div key={item.label} style={{ padding: '23px 21px', borderRight: index < CAPABILITIES.length - 1 ? '1px solid var(--border)' : 0 }}>
            <div className="mono" style={{ color: 'var(--brand-deep)', fontSize: 8, letterSpacing: '.1em', textTransform: 'uppercase' }}>{item.label}</div>
            <div style={{ marginTop: 8, fontSize: 17, fontWeight: 800, letterSpacing: '-.03em' }}>{item.value}</div>
            <p style={{ margin: '7px 0 0', color: 'var(--muted)', fontSize: 11.5, lineHeight: 1.55 }}>{item.sub}</p>
          </div>
        ))}
      </div>
      <style>{`
        @media(max-width:900px){section .vx-container{grid-template-columns:1fr 1fr!important}section .vx-container>div:nth-child(2){border-right:0!important}}
        @media(max-width:560px){section .vx-container{grid-template-columns:1fr!important}section .vx-container>div{border-right:0!important;border-bottom:1px solid var(--border)}}
      `}</style>
    </section>
  );
}
