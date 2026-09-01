import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';

import MainNavigation from 'shared/components/layout/Header/MainNavigation';
import Footer from 'shared/components/layout/Footer';
import ErrorBoundary from 'shared/components/ui/ErrorBoundary';

const Home = lazy(() => import('pages/home'));
const About = lazy(() => import('pages/about'));
const Gallery = lazy(() => import('pages/marketplace'));
const Transactions = lazy(() => import('pages/transactions'));
const NFTs = lazy(() => import('pages/nfts'));
const Swap = lazy(() => import('pages/swap'));
const Presale = lazy(() => import('pages/presale'));
const Mint = lazy(() => import('pages/mint'));
const Stake = lazy(() => import('pages/staking'));
const Contact = lazy(() => import('pages/contact'));
const Portfolio = lazy(() => import('pages/portfolio'));
const Compliance = lazy(() => import('pages/compliance'));
const Ramper = lazy(() => import('shared/components/Ramper'));
const ERC20Balance = lazy(() => import('shared/components/ERC20Balance'));
const NotFound = lazy(() => import('pages/not-found'));

function RouteLoader() {
  return (
    <div style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div className="vx-card" style={{ padding: '22px 26px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="live-dot" />
        <span className="mono" style={{ color: 'var(--muted)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase' }}>
          Loading workspace
        </span>
      </div>
    </div>
  );
}

const App = () => {
  const { library, account } = useWeb3React();

  useEffect(() => {
    if (library) localStorage.setItem('connected', 'true');
  }, [library, account]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <MainNavigation />
        <main id="main-content" style={{ flex: 1 }}>
          <ErrorBoundary>
            <Suspense fallback={<RouteLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/swap" element={<Swap />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/erc20balance" element={<ERC20Balance />} />
                <Route path="/onramp" element={<Ramper />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/nfts" element={<NFTs />} />
                <Route path="/presale" element={<Presale />} />
                <Route path="/pre-sale" element={<Navigate to="/presale" replace />} />
                <Route path="/mint" element={<Mint />} />
                <Route path="/stake" element={<Stake />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/compliance" element={<Compliance />} />
                <Route path="/account" element={<Navigate to="/portfolio" replace />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
