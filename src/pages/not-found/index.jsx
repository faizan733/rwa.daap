import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <section className="vx-page vx-hero" style={{ minHeight: '76vh', display: 'grid', placeItems: 'center', padding: '150px 24px 80px' }}>
      <div style={{ position: 'relative', maxWidth: 720, textAlign: 'center' }}>
        <div className="vx-eyebrow">404 · Route unavailable</div>
        <h1 className="vx-title" style={{ fontSize: 'clamp(48px,8vw,88px)' }}>This capital workspace does not exist.</h1>
        <p className="vx-copy" style={{ maxWidth: 560, margin: '22px auto 30px' }}>
          Return to the opportunity marketplace or open your portfolio workspace.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="vx-btn" type="button" onClick={() => navigate('/gallery')}>Explore assets</button>
          <button className="vx-btn secondary" type="button" onClick={() => navigate('/')}>Return home</button>
        </div>
      </div>
    </section>
  );
}
