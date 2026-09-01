import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import { galleryImages } from 'assets/remoteImages';

const DATA = [
  { id:'VX-101', name:'Brickell Residence Fund', location:'Miami, Florida', type:'Residential', min:500, apy:8.4, funded:76, valuation:'$8.4M', term:'36 months', occupancy:'96%', units:'124', img:galleryImages[0], status:'Open', risk:'Balanced', documents:4, summary:'A stabilized multifamily opportunity model focused on occupancy-backed income and quarterly reporting.' },
  { id:'VX-205', name:'Downtown Office Core', location:'Chicago, Illinois', type:'Commercial', min:1000, apy:9.1, funded:63, valuation:'$14.8M', term:'48 months', occupancy:'91%', units:'1 asset', img:galleryImages[1], status:'Open', risk:'Moderate', documents:3, summary:'A core-office model with a diversified tenant profile and an illustrative value-add leasing program.' },
  { id:'VX-317', name:'Golden Gate Apartments', location:'San Francisco, California', type:'Multifamily', min:750, apy:7.8, funded:82, valuation:'$11.2M', term:'36 months', occupancy:'97%', units:'82', img:galleryImages[2], status:'Allocation', risk:'Balanced', documents:4, summary:'A multifamily income model combining stabilized occupancy with conservative renovation assumptions.' },
  { id:'VX-412', name:'Austin Growth Portfolio', location:'Austin, Texas', type:'Mixed-use', min:500, apy:8.7, funded:69, valuation:'$6.2M', term:'42 months', occupancy:'94%', units:'38', img:galleryImages[3], status:'Open', risk:'Moderate', documents:3, summary:'A mixed-use portfolio model designed around neighborhood retail and residential income diversification.' },
  { id:'VX-518', name:'Distribution Hub I', location:'Dallas, Texas', type:'Logistics', min:1250, apy:9.6, funded:58, valuation:'$12.7M', term:'48 months', occupancy:'100%', units:'1 asset', img:galleryImages[4], status:'Open', risk:'Moderate', documents:4, summary:'A lease-backed logistics model with full modeled occupancy and a long-duration operating tenant.' },
  { id:'VX-624', name:'Manhattan Income Tower', location:'New York, New York', type:'Office', min:2000, apy:8.2, funded:88, valuation:'$22.5M', term:'60 months', occupancy:'93%', units:'1 asset', img:galleryImages[5], status:'Priority', risk:'Elevated', documents:2, summary:'A premium urban office model with higher minimum participation and detailed tenant concentration review.' },
];

const FILTERS = ['All', 'Watchlist', 'Residential', 'Commercial', 'Multifamily', 'Mixed-use', 'Logistics', 'Office'];

function AssetDrawer({ asset, onClose }) {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(asset?.min || 500);
  if (!asset) return null;
  const units = Math.max(0, Number(amount) || 0);
  const annual = units * (asset.apy / 100);

  return (
    <Drawer
      anchor="right"
      open={Boolean(asset)}
      onClose={onClose}
      sx={{ zIndex: 10050, '& .MuiDrawer-paper': { width: { xs: '100%', sm: 560 }, background: '#f3f5f9' } }}
      BackdropProps={{ style: { backgroundColor: 'rgba(11,18,32,.52)' } }}
    >
      <div style={{ position: 'relative', height: 260 }}>
        <img src={asset.img} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(11,18,32,.82),rgba(11,18,32,.08))' }} />
        <button type="button" aria-label="Close asset detail" onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,.9)', color: '#111827', cursor: 'pointer' }}>✕</button>
        <div style={{ position: 'absolute', left: 22, right: 70, bottom: 20, color: '#fff' }}>
          <div className="mono" style={{ color: '#c8d2ff', fontSize: 9, letterSpacing: '.12em' }}>{asset.id} · {asset.type}</div>
          <h2 style={{ margin: '8px 0 0', fontSize: 28, letterSpacing: '-.04em', lineHeight: 1.08 }}>{asset.name}</h2>
          <div style={{ marginTop: 7, color: '#c4cede', fontSize: 12 }}>{asset.location}</div>
        </div>
      </div>

      <div style={{ padding: 22 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
          <span className="vx-status">{asset.status}</span>
          <span className="vx-status warning">{asset.risk} risk model</span>
          <span className="vx-status">{asset.documents} demo documents</span>
        </div>
        <p className="vx-copy" style={{ margin: '0 0 20px', fontSize: 13 }}>{asset.summary}</p>

        <div className="vx-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', overflow: 'hidden', marginBottom: 18 }}>
          {[
            ['Target APY', `${asset.apy}%`],
            ['Modeled value', asset.valuation],
            ['Occupancy', asset.occupancy],
            ['Minimum', `$${asset.min.toLocaleString()}`],
            ['Term', asset.term],
            ['Units', asset.units],
          ].map(([label, value], index) => (
            <div key={label} style={{ padding: 15, borderRight: index % 3 < 2 ? '1px solid var(--border)' : 0, borderBottom: index < 3 ? '1px solid var(--border)' : 0 }}>
              <div className="mono" style={{ color: 'var(--dim)', fontSize: 7.5, letterSpacing: '.07em', textTransform: 'uppercase' }}>{label}</div>
              <strong style={{ display: 'block', marginTop: 6, fontSize: 13 }}>{value}</strong>
            </div>
          ))}
        </div>

        <div className="vx-card-strong" style={{ padding: 20, marginBottom: 18 }}>
          <div className="vx-kicker">Participation model</div>
          <h3 style={{ margin: '7px 0 15px', fontSize: 19, letterSpacing: '-.03em' }}>Estimate your allocation</h3>
          <label>
            <span className="mono" style={{ display: 'block', marginBottom: 7, color: 'var(--dim)', fontSize: 8, letterSpacing: '.08em', textTransform: 'uppercase' }}>Illustrative amount (USD)</span>
            <input className="vx-field" type="number" min={asset.min} step="100" value={amount} onChange={(event) => setAmount(event.target.value)} />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
            <div style={{ padding: 14, borderRadius: 13, background: 'var(--brand-soft)' }}>
              <div className="mono" style={{ color: 'var(--brand-deep)', fontSize: 7.5, textTransform: 'uppercase' }}>Reference units</div>
              <strong style={{ display: 'block', marginTop: 6 }}>{units.toLocaleString()} VTX</strong>
            </div>
            <div style={{ padding: 14, borderRadius: 13, background: 'var(--accent-soft)' }}>
              <div className="mono" style={{ color: '#0b7658', fontSize: 7.5, textTransform: 'uppercase' }}>Modeled annual amount</div>
              <strong style={{ display: 'block', marginTop: 6 }}>${annual.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>
            </div>
          </div>
          <p style={{ color: 'var(--dim)', fontSize: 9.5, lineHeight: 1.55, margin: '11px 0 0' }}>Reference only. APY is a target assumption, not a guarantee or investment recommendation.</p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="vx-btn" type="button" onClick={() => navigate('/compliance')} style={{ flex: 1 }}>Review eligibility</button>
          <button className="vx-btn secondary" type="button" onClick={() => navigate('/presale')} style={{ flex: 1 }}>Open presale</button>
        </div>
      </div>
    </Drawer>
  );
}

export default function GalleryItems() {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('funding');
  const [selected, setSelected] = useState(null);
  const [compare, setCompare] = useState([]);
  const [notice, setNotice] = useState('');
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('vaultx_watchlist') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('vaultx_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const items = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = DATA.filter((item) => {
      const categoryMatch = filter === 'All' || (filter === 'Watchlist' ? watchlist.includes(item.id) : item.type === filter);
      const searchMatch = !normalized || [item.name, item.location, item.type, item.id].some((value) => value.toLowerCase().includes(normalized));
      return categoryMatch && searchMatch;
    });
    return [...result].sort((a, b) => sort === 'apy' ? b.apy - a.apy : sort === 'minimum' ? a.min - b.min : b.funded - a.funded);
  }, [filter, query, sort, watchlist]);

  const toggleWatchlist = (id) => setWatchlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleCompare = (id) => {
    setCompare((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) {
        setNotice('Compare supports up to three opportunities.');
        window.setTimeout(() => setNotice(''), 1800);
        return current;
      }
      return [...current, id];
    });
  };

  const compared = compare.map((id) => DATA.find((item) => item.id === id)).filter(Boolean);

  return (
    <div>
      <div className="vx-card-strong" style={{ padding: 18, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,1fr) 180px auto', gap: 12, alignItems: 'center' }}>
          <label>
            <span className="mono" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>Search opportunities</span>
            <input className="vx-field" type="search" placeholder="Search asset, location, or ID" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <select className="vx-field" aria-label="Sort opportunities" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="funding">Sort: funding</option>
            <option value="apy">Sort: target APY</option>
            <option value="minimum">Sort: minimum</option>
          </select>
          <div className="mono" style={{ color: 'var(--dim)', fontSize: 9, textAlign: 'right' }}>{items.length} RESULT{items.length === 1 ? '' : 'S'}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
          {FILTERS.map((item) => (
            <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)} style={{ minHeight: 34, padding: '0 12px', borderRadius: 999, background: filter === item ? 'var(--brand)' : '#f4f6fa', color: filter === item ? '#fff' : 'var(--muted)', border: `1px solid ${filter === item ? 'var(--brand)' : 'var(--border)'}`, cursor: 'pointer', fontSize: 10.5, fontWeight: 700 }}>
              {item}{item === 'Watchlist' ? ` (${watchlist.length})` : ''}
            </button>
          ))}
        </div>
      </div>

      {notice && <div role="status" className="vx-status warning" style={{ marginBottom: 16 }}>{notice}</div>}

      {compared.length > 0 && (
        <div className="vx-card-strong" style={{ padding: 18, marginBottom: 20, borderColor: '#b8c4fb' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 14 }}>
            <div><div className="vx-kicker">Compare tray</div><strong style={{ display: 'block', marginTop: 5 }}>{compared.length} of 3 selected</strong></div>
            <button className="vx-btn ghost" type="button" onClick={() => setCompare([])}>Clear comparison</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${compared.length},minmax(0,1fr))`, gap: 10 }}>
            {compared.map((item) => (
              <button key={item.id} type="button" onClick={() => setSelected(item)} style={{ textAlign: 'left', padding: 14, borderRadius: 13, background: 'var(--brand-soft)', border: '1px solid #cbd4ff', cursor: 'pointer' }}>
                <div className="mono" style={{ color: 'var(--brand-deep)', fontSize: 8 }}>{item.id}</div>
                <strong style={{ display: 'block', marginTop: 6, fontSize: 12 }}>{item.name}</strong>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 8, color: 'var(--muted)', fontSize: 10 }}><span>{item.apy}% target</span><span>{item.funded}% modeled</span></div>
              </button>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="vx-empty">
          <div className="vx-kicker">No matching opportunities</div>
          <h2 style={{ margin: '9px 0', fontSize: 22 }}>Adjust the filters or search terms.</h2>
          <button className="vx-btn secondary" type="button" onClick={() => { setFilter('All'); setQuery(''); }}>Reset discovery</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
          {items.map((item) => {
            const saved = watchlist.includes(item.id);
            const comparing = compare.includes(item.id);
            return (
              <article key={item.id} className="vx-card-strong card-lift" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: 238 }}>
                  <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(11,18,32,.74),rgba(11,18,32,.04) 62%)' }} />
                  <div style={{ position: 'absolute', top: 14, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <span className="vx-status">{item.status}</span>
                    <button type="button" aria-label={saved ? `Remove ${item.name} from watchlist` : `Save ${item.name} to watchlist`} aria-pressed={saved} onClick={() => toggleWatchlist(item.id)} style={{ width: 36, height: 36, borderRadius: 11, background: saved ? 'var(--brand)' : 'rgba(255,255,255,.92)', color: saved ? '#fff' : '#344054', cursor: 'pointer', fontSize: 16 }}>
                      {saved ? '★' : '☆'}
                    </button>
                  </div>
                  <div style={{ position: 'absolute', left: 18, bottom: 17, right: 18, color: '#fff' }}>
                    <div className="mono" style={{ color: '#c8d2ff', fontSize: 8.5, letterSpacing: '.11em' }}>{item.id} · {item.type}</div>
                    <h2 style={{ margin: '7px 0 0', fontSize: 22, lineHeight: 1.08, letterSpacing: '-.04em' }}>{item.name}</h2>
                    <div style={{ color: '#c4cede', fontSize: 11.5, marginTop: 6 }}>{item.location}</div>
                  </div>
                </div>
                <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                    {[['Minimum', `$${item.min.toLocaleString()}`], ['Target APY', `${item.apy}%`], ['Occupancy', item.occupancy]].map(([label, value]) => (
                      <div key={label} style={{ padding: 12, borderRadius: 12, background: '#f5f7fa', border: '1px solid var(--border)' }}>
                        <strong style={{ fontSize: 12.5 }}>{value}</strong>
                        <div className="mono" style={{ color: 'var(--dim)', fontSize: 6.8, letterSpacing: '.06em', textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 17 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 7, fontSize: 10.5 }}><span style={{ color: 'var(--muted)' }}>Modeled allocation</span><strong>{item.funded}%</strong></div>
                    <div className="vx-progress"><span style={{ width: `${item.funded}%` }} /></div>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: 11.5, lineHeight: 1.55, margin: '15px 0 18px' }}>{item.summary}</p>
                  <div style={{ display: 'flex', gap: 9, marginTop: 'auto' }}>
                    <button className="vx-btn" type="button" onClick={() => setSelected(item)} style={{ flex: 1 }}>Review asset</button>
                    <button className="vx-btn secondary" type="button" aria-pressed={comparing} onClick={() => toggleCompare(item.id)} style={{ flex: 1 }}>{comparing ? 'Remove compare' : 'Compare'}</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 22, padding: 16, borderRadius: 14, background: 'var(--warning-soft)', border: '1px solid #f2d7aa', color: '#775121', fontSize: 11, lineHeight: 1.6 }}>
        All opportunities, valuation figures, target returns, occupancy rates, and document records shown in this proof of concept are illustrative.
      </div>

      <AssetDrawer asset={selected} onClose={() => setSelected(null)} />
      <style>{`
        @media(max-width:1050px){div[style*='repeat(3,1fr)']{grid-template-columns:1fr 1fr!important}}
        @media(max-width:720px){div.vx-card-strong>div[style*='minmax(220px,1fr)']{grid-template-columns:1fr!important}div[style*='repeat(3,1fr)']{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
}
