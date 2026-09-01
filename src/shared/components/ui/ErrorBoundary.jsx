import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('VaultX interface error', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <section className="vx-page" style={{ display: 'grid', placeItems: 'center', padding: '140px 24px 80px' }}>
        <div className="vx-card-strong" style={{ maxWidth: 620, padding: 36, textAlign: 'center' }}>
          <div className="vx-status danger" style={{ marginBottom: 18 }}>Interface interrupted</div>
          <h1 className="vx-title" style={{ fontSize: 36 }}>This workspace could not finish loading.</h1>
          <p className="vx-copy">No transaction was submitted. Reload the page to restore the interface, then confirm your wallet and network before continuing.</p>
          <button className="vx-btn" type="button" onClick={() => window.location.reload()}>Reload workspace</button>
        </div>
      </section>
    );
  }
}
