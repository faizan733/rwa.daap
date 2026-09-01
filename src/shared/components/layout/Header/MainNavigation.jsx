import { Fragment, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Account from 'features/wallet/WalletAccount';
import SideDrawer from './SideDrawer';
import Contracts from 'shared/components/common/Contracts';
import vaultxMark from 'assets/images/vaultx-mark.svg';

const NAV = [
  { label: 'Assets', href: '/gallery' },
  { label: 'Presale', href: '/presale' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Stake', href: '/stake' },
  { label: 'Swap', href: '/swap' },
  { label: 'Compliance', href: '/compliance' },
];

function Logo() {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate('/')} aria-label="VaultX home" style={{ display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0, cursor: 'pointer', background: 'transparent', padding: 0 }}>
      <img src={vaultxMark} alt="" width="38" height="38" style={{ borderRadius: 11 }} />
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: '#111827', lineHeight: 1, letterSpacing: '-.04em' }}>
          Vault<span style={{ color: 'var(--brand)' }}>X</span>
        </div>
        <div className="mono" style={{ fontSize: 7, color: '#768196', letterSpacing: '.19em', textTransform: 'uppercase', marginTop: 4 }}>
          Capital workspace
        </div>
      </div>
    </button>
  );
}

export default function MainNavigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contractsOpen, setContractsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (event, href) => {
    event.preventDefault();
    navigate(href);
  };

  return (
    <Fragment>
      <header style={{ position: 'fixed', inset: '0 0 auto', zIndex: 9999 }}>
        <div style={{ minHeight: 30, background: '#080b12', color: '#bac1ce', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <div className="vx-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div className="mono" style={{ fontSize: 8, letterSpacing: '.12em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="live-dot" /> Public testnet preview
            </div>
            <div className="mono vx-env-note" style={{ fontSize: 8, letterSpacing: '.08em' }}>Contract actions stay gated until a verified deployment is configured.</div>
          </div>
        </div>
        <div style={{ background: scrolled ? 'rgba(255,255,255,.94)' : 'rgba(255,255,255,.98)', borderBottom: '1px solid #deddd6', boxShadow: scrolled ? '0 16px 45px rgba(8,11,18,.10)' : 'none', backdropFilter: 'blur(18px)', transition: 'box-shadow .2s ease' }}>
          <div className="vx-container" style={{ minHeight: 76, display: 'flex', alignItems: 'center', gap: 20 }}>
            <button
              type="button"
              className="vx-mob-btn"
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              style={{ display: 'none', width: 40, height: 40, borderRadius: 11, background: '#f4f6fa', border: '1px solid #dde2eb', cursor: 'pointer', color: '#111827', fontSize: 18 }}
            >
              ☰
            </button>
            <Logo />

            <nav className="vx-nav-wrap" aria-label="Primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
              {NAV.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(event) => go(event, item.href)}
                    aria-current={active ? 'page' : undefined}
                    style={{
                      padding: '10px 13px',
                      borderRadius: 8,
                      color: active ? 'var(--brand-deep)' : '#5f6879',
                      background: active ? 'var(--brand-soft)' : 'transparent',
                      textDecoration: 'none',
                      fontSize: 11.5,
                      fontWeight: 700,
                      transition: 'all .16s ease',
                    }}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <button type="button" className="vx-contracts-btn" onClick={() => setContractsOpen(true)} style={{ minHeight: 38, padding: '0 12px', borderRadius: 10, background: '#f5f7fa', color: '#4d5769', border: '1px solid #dde2eb', cursor: 'pointer', fontSize: 10, fontWeight: 800 }}>
                Contracts
              </button>
              <Account />
            </div>
          </div>
        </div>
      </header>

      <SideDrawer
        mainLinks={[{ label: 'Home', href: '/', end: true }, ...NAV, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }]}
        onClose={() => setMobileOpen(false)}
        open={mobileOpen}
        handleClickContracts={() => { setContractsOpen(true); setMobileOpen(false); }}
      />
      <Contracts open={contractsOpen} handleClose={() => setContractsOpen(false)} />

      <style>{`
        @media(max-width:1050px){.vx-mob-btn{display:grid!important;place-items:center}.vx-nav-wrap{display:none!important}}
        @media(max-width:620px){.vx-env-note,.vx-contracts-btn{display:none!important}}
      `}</style>
    </Fragment>
  );
}
