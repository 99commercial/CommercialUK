import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '@/utils/axios';

type Role = 'user' | 'agent';

const requiredKeys = ['name', 'email', 'phone', 'address'] as const;

function WaitlistCard({ role, featured }: { role: Role; featured?: boolean }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [missing, setMissing] = useState<Record<(typeof requiredKeys)[number], boolean>>({
    name: false,
    email: false,
    phone: false,
    address: false,
  });

  const cardTitle = role === 'user' ? 'User Waitlist' : 'Agent Waitlist';

  const onChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const nextMissing = {
      name: !form.name.trim(),
      email: !form.email.trim(),
      phone: !form.phone.trim(),
      address: !form.address.trim(),
    };
    setMissing(nextMissing);
    return Object.values(nextMissing).every(Boolean) === false ? Object.values(nextMissing).every((v) => !v) : false;
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    const nextMissing: Record<(typeof requiredKeys)[number], boolean> = {
      name: !form.name.trim(),
      email: !form.email.trim(),
      phone: !form.phone.trim(),
      address: !form.address.trim(),
    };

    setMissing(nextMissing);
    const isValid = !Object.values(nextMissing).some(Boolean);
    if (!isValid) return;

    setLoading(true);
    try {
      await axiosInstance.post('/api/admin/preregister', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        role,
      });
      setSuccess(true);
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message || err?.message || 'Failed to submit.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`form-card ${featured ? 'featured' : ''}`} aria-live="polite">
        {featured && <div className="featured-tag">Most Popular</div>}
        <div className="success-state" style={{ display: 'flex' }}>
          <div className="success-icon">✓</div>
          <div className="success-title">{role === 'user' ? 'You\'re on the list.' : 'Welcome aboard.'}</div>
          <p className="success-msg">
            {role === 'user'
              ? 'We\'ll be in touch very soon. You\'re one step ahead of the market.'
              : 'We\'ll reach out with your early access details shortly.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`form-card ${featured ? 'featured' : ''}`}>
      {featured && <div className="featured-tag">Most Popular</div>}

      <div className="form-type">{role === 'user' ? 'For Property Owners' : 'For Commercial Agents'}</div>
      <div className="form-title">{cardTitle}</div>
      <div className="form-desc">
        Join the waitlist to get early access to CommercialUK and updates on pre-registration.
      </div>

      {/* <div className="perks">
        {role === 'user' ? (
          <>
            <div className="perk">
              <span className="perk-dot">◆</span> First 3 reports completely free
            </div>
            <div className="perk">
              <span className="perk-dot">◆</span> Priority access before public launch
            </div>
            <div className="perk">
              <span className="perk-dot">◆</span> 50% off first year subscription
            </div>
          </>
        ) : (
          <>
            <div className="perk">
              <span className="perk-dot">◆</span> Unlimited reports during beta
            </div>
            <div className="perk">
              <span className="perk-dot">◆</span> White-labelled PDF output
            </div>
            <div className="perk">
              <span className="perk-dot">◆</span> API access for CRM integration
            </div>
          </>
        )}
      </div> */}

      <div className="fields">
        <input
          type="text"
          placeholder="Name *"
          value={form.name}
          onChange={(e) => onChange('name', e.target.value)}
          style={missing.name ? { borderColor: '#C13B2A' } : undefined}
        />
        <input
          type="email"
          placeholder="Email *"
          value={form.email}
          onChange={(e) => onChange('email', e.target.value)}
          style={missing.email ? { borderColor: '#C13B2A' } : undefined}
        />
        <input
          type="tel"
          placeholder="Phone *"
          value={form.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          style={missing.phone ? { borderColor: '#C13B2A' } : undefined}
        />
        <textarea
          placeholder="Address *"
          rows={3}
          value={form.address}
          onChange={(e) => onChange('address', e.target.value)}
          style={missing.address ? { borderColor: '#C13B2A' } : undefined}
        />
      </div>

      <button
        className={`submit-btn ${role === 'user' ? 'gold' : ''}`}
        onClick={loading ? undefined : handleSubmit}
        disabled={loading}
        type="button"
      >
        <span>{loading ? 'Submitting...' : `Join Waitlist (${role === 'user' ? 'User' : 'Agent'}) →`}</span>
      </button>

      {submitError && (
        <p style={{ marginTop: 14, color: '#C13B2A', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
          {submitError}
        </p>
      )}

      <div className="success-state" style={{ display: 'none' }} />
    </div>
  );
}

export default function HomePage() {
  const images = useMemo(
    () => [
      { src: '/images/scroller1.png', alt: 'Valuation Report' },
      { src: '/images/scroller2.png', alt: 'Yield Analysis' },
      { src: '/images/scroller3.png', alt: 'Risk Report' },
      { src: '/images/scroller4.png', alt: 'Full Report' },
    ],
    [],
  );

  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!activeImage) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveImage(null);
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeImage]);

  return (
    <>
      <Head>
        <title>CommercialUK — AI Property Valuation Reports</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style>{`
        :root {
          --gold: #C9A84C;
          --gold-dark: #9A7A2E;
          --black: #0A0A0A;
          --off-white: #F5F2ED;
          --text-muted: #7A7268;
          --border: rgba(201,168,76,0.25);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--black);
          color: var(--off-white);
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          line-height: 1.6;
          overflow-x: hidden;
          min-height: 100vh;
        }

        body::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1000;
          opacity: 0.5;
        }

        /* ── NAV ── */
        nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 48px;
          border-bottom: 1px solid var(--border);
          background: #ffffff;
          position: sticky;
          top: 0;
          z-index: 1001;
        }
        .nav-logo {
          font-family: 'Inter', sans-serif;
          font-size: 15px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
          display: flex;
          align-items: center;
        }
        .nav-logo span { color: var(--gold); }
        .nav-logo-img {
          height: 60px;
          width: auto;
          display: block;
        }
        .nav-badge {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--gold); border: 1px solid var(--border); padding: 6px 16px;
          animation: pulse-border 3s ease infinite;
          white-space: nowrap;
        }
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(201,168,76,0.25); }
          50%       { border-color: rgba(201,168,76,0.7); }
        }

        /* ── HERO ── */
        .hero {
          padding: 80px 48px 0;
          text-align: center;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        .hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          opacity: 0.8;
        }
        .hero-glow {
          position: absolute;
          width: 700px; height: 400px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          pointer-events: none;
          opacity: 0.95;
        }
        .hero-inner { position: relative; z-index: 1; }

        .hero-kicker {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 28px;
          display: inline-flex; align-items: center; gap: 12px;
          border: 1px solid var(--border);
          padding: 8px 20px;
          opacity: 0; animation: fadeUp 0.7s ease 0.1s forwards;
        }
        .kicker-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--gold);
          animation: blink 2s ease infinite; flex-shrink: 0;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }

        .hero-eyebrow {
          display: block;
          font-family: 'DM Mono', monospace;
          font-size: clamp(10px, 1vw, 13px);
          font-weight: 400;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 18px;
          opacity: 0; animation: fadeUp 0.7s ease 0.2s forwards;
        }

        .hero-headline {
          font-family: 'Inter', sans-serif;
          font-size: clamp(36px, 5vw, 66px);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: var(--off-white);
          margin-bottom: 24px;
          opacity: 0; animation: fadeUp 0.7s ease 0.3s forwards;
        }
        .hero-headline em { font-style: normal; color: var(--gold); }

        .hero-sub {
          font-size: 17px; font-weight: 300; color: var(--text-muted);
          max-width: 540px; margin: 0 auto; line-height: 1.75;
          opacity: 0; animation: fadeUp 0.7s ease 0.45s forwards;
        }
        .hero-sub strong { color: var(--off-white); font-weight: 600; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── IMAGE SCROLLER ── */
        .scroller-wrap {
          margin-top: 56px;
          position: relative;
          overflow: hidden;
        }
        .scroller-wrap::before,
        .scroller-wrap::after {
          content: '';
          position: absolute; top: 0; bottom: 0;
          width: 160px; z-index: 2; pointer-events: none;
        }
        .scroller-wrap::before {
          left: 0;
          background: linear-gradient(to right, var(--black), transparent);
        }
        .scroller-wrap::after {
          right: 0;
          background: linear-gradient(to left, var(--black), transparent);
        }

        .scroller-track {
          display: flex; gap: 20px;
          width: max-content;
          animation: scroll-imgs 22s linear infinite;
          padding: 4px 0 24px;
        }
        .scroller-track:hover { animation-play-state: paused; }

        @keyframes scroll-imgs {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        .report-slide {
          /* Make exactly 4 slides cover the scroller width at once */
          /* hero horizontal padding (48px) + 3 gaps (20px * 3) = 156px */
          width: calc((100vw - 156px) / 4);
          aspect-ratio: 300 / 210;
          flex-shrink: 0;
          border: 1px solid var(--border);
          border-radius: 3px;
          overflow: hidden;
          position: relative;
          background: #111;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .report-slide:hover {
          transform: translateY(-6px) scale(1.02);
          border-color: var(--gold);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.4);
        }
        .report-slide::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 2px; background: var(--gold);
          opacity: 0; transition: opacity 0.3s; z-index: 1;
        }
        .report-slide:hover::before { opacity: 1; }

        .report-slide img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: top;
          display: block;
          filter: saturate(0.85) brightness(0.9);
          transition: filter 0.3s ease;
        }
        .report-slide:hover img { filter: saturate(1) brightness(1); }

        /* ── IMAGE LIGHTBOX MODAL ── */
        .img-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 10, 10, 0.75);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .img-modal-content {
          position: relative;
          max-width: 1100px;
          width: 100%;
        }
        .img-modal-content img {
          width: 100%;
          max-height: 80vh;
          object-fit: contain;
          display: block;
          border-radius: 8px;
          border: 1px solid rgba(201,168,76,0.25);
          background: #111;
        }
        .img-modal-close {
          position: absolute;
          top: -12px;
          right: -12px;
          width: 42px;
          height: 42px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: rgba(10,10,10,0.86);
          color: var(--off-white);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          line-height: 1;
        }
        .img-modal-close:hover {
          border-color: rgba(201,168,76,0.6);
          box-shadow: 0 12px 30px rgba(0,0,0,0.35);
        }

        /* ── WAITLIST ── */
        .waitlist {
          padding: 72px 24px 80px;
          background: var(--off-white);
          color: var(--black);
          position: relative;
          z-index: 1;
        }
        .waitlist::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
        }

        .waitlist-header { text-align: center; margin-bottom: 56px; }

        .wl-kicker {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--gold-dark); margin-bottom: 16px;
          display: flex; align-items: center; justify-content: center; gap: 12px;
        }
        .wl-kicker::before, .wl-kicker::after {
          content: ''; width: 28px; height: 1px; background: var(--gold-dark);
        }

        .wl-title {
          font-family: 'Inter', sans-serif;
          font-size: clamp(28px, 3.5vw, 44px); font-weight: 800;
          color: var(--black); line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 14px;
        }
        .wl-title em { font-style: normal; color: var(--gold-dark); }

        .wl-desc {
          font-size: 15px; font-weight: 400; color: #6A6560;
          max-width: 420px; margin: 0 auto; line-height: 1.7;
        }

        .forms-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 28px;
          max-width: none; width: 100%;
          margin: 0;
        }

        .form-card {
          background: white; border: 1px solid rgba(10,10,10,0.1);
          padding: 44px 40px; position: relative;
          transition: box-shadow 0.3s ease;
          border-radius: 6px;
        }
        .form-card:hover { box-shadow: 0 16px 56px rgba(0,0,0,0.1); }
        .form-card.featured {
          border-color: var(--gold);
          box-shadow: 0 0 0 1px var(--gold);
        }
        .form-card.featured:hover {
          box-shadow: 0 0 0 1px var(--gold), 0 16px 56px rgba(201,168,76,0.15);
        }

        .featured-tag {
          position: absolute; top: -12px; left: 32px;
          background: var(--gold); color: var(--black);
          font-family: 'DM Mono', monospace; font-size: 9px;
          letter-spacing: 0.2em; text-transform: uppercase; padding: 4px 14px; font-weight: 500;
        }

        .form-type {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;
        }
        .form-title {
          font-family: 'Inter', sans-serif; font-size: 24px; font-weight: 800;
          color: var(--black); margin-bottom: 8px; letter-spacing: -0.02em;
        }
        .form-desc { font-size: 14px; color: #7A7268; margin-bottom: 28px; line-height: 1.6; }

        .perks {
          display: flex; flex-direction: column; gap: 8px;
          margin-bottom: 28px; padding: 16px 18px;
          background: rgba(201,168,76,0.05); border: 1px solid rgba(201,168,76,0.18);
        }
        .perk { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--black); font-weight: 400; }
        .perk-dot { color: var(--gold-dark); font-size: 8px; flex-shrink: 0; }

        .fields { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        .fields input, .fields textarea {
          width: 100%; padding: 14px 18px; background: transparent;
          border: 1px solid rgba(10,10,10,0.18); color: var(--black);
          font-family: 'Inter', sans-serif; font-size: 14px; outline: none;
          transition: border-color 0.2s, background 0.2s; resize: none;
        }
        .fields input::placeholder, .fields textarea::placeholder { color: #B0ABA3; font-weight: 300; }
        .fields input:focus, .fields textarea:focus {
          border-color: var(--gold); background: rgba(201,168,76,0.02);
        }

        .submit-btn {
          width: 100%; padding: 18px;
          background: var(--black); color: var(--off-white);
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.2em; text-transform: uppercase;
          border: none; cursor: pointer;
          position: relative; overflow: hidden;
        }
        .submit-btn:disabled { cursor: not-allowed; opacity: 0.85; }
        .submit-btn::after {
          content: ''; position: absolute; inset: 0;
          background: var(--gold); transform: translateY(100%); transition: transform 0.3s ease;
        }
        .submit-btn:hover::after { transform: translateY(0); }
        .submit-btn span { position: relative; z-index: 1; transition: color 0.3s; }
        .submit-btn:hover span { color: var(--black); }
        .submit-btn.gold { background: var(--gold); color: var(--black); }
        .submit-btn.gold::after { background: var(--black); }
        .submit-btn.gold:hover span { color: var(--off-white); }

        .success-state {
          display: none; flex-direction: column; align-items: center;
          text-align: center; gap: 14px; padding: 32px 0;
        }
        .success-icon {
          width: 56px; height: 56px; border: 2px solid var(--gold); border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; color: var(--gold-dark);
        }
        .success-title { font-family: 'Inter', sans-serif; font-size: 20px; font-weight: 700; color: var(--black); }
        .success-msg { font-size: 14px; color: #7A7268; line-height: 1.6; }

        /* ── FOOTER ── */
        footer {
          padding: 32px 48px; border-top: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
          color: var(--off-white);
          z-index: 1;
          position: relative;
        }
        .footer-logo {
          font-family: 'Inter', sans-serif; font-size: 13px;
          font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
        }
        .footer-logo span { color: var(--gold); }
        .footer-copy { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-muted); }

        @media (max-width: 768px) {
          nav, .hero, .waitlist, footer { padding-left: 24px; padding-right: 24px; }
          .forms-grid { grid-template-columns: 1fr; }
          .form-card { padding: 36px 24px; }
          footer { flex-direction: column; gap: 16px; text-align: center; }
          .scroller-wrap::before, .scroller-wrap::after { width: 60px; }
          /* hero horizontal padding (24px) + 3 gaps (20px * 3) = 108px */
          .report-slide { width: calc((100vw - 108px) / 4); }
          .nav-logo-img { height: 36px; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ backgroundColor: '#f5f2ed' }}>
        <div className="nav-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/CUKLogo.png" alt="CommercialUK logo" className="nav-logo-img" />
        </div>
        <div className="nav-badge">Pre-Registration Open</div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-inner">
          <div className="hero-kicker">
            <span className="kicker-dot" />
            UK&apos;s First of Its Kind
          </div>

          <span className="hero-eyebrow">The World&apos;s First AI Tool That</span>

          <h1 className="hero-headline">
            Predicts the <em>Selling</em> &amp; <em>Letting Price</em>
            <br />
            of Any Commercial Property.
          </h1>

          <p className="hero-sub">
            No surveyor. No guesswork. No waiting weeks. CommercialUK analyses{' '}
            <strong>thousands of data points</strong> to deliver an accurate, AI-generated valuation report for any
            UK commercial property — instantly.
          </p>
        </div>

        {/* IMAGE SCROLLER */}
        <div className="scroller-wrap">
          <div className="scroller-track">
            {[0, 1].map((copy) =>
              images.map((img) => (
                <div
                  className="report-slide"
                  key={`${copy}-${img.src}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveImage(img)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setActiveImage(img);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.alt} />
                </div>
              )),
            )}
          </div>
        </div>
      </section>

      {activeImage && (
        <div
          className="img-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setActiveImage(null);
          }}
        >
          <div className="img-modal-content">
            <button
              className="img-modal-close"
              type="button"
              aria-label="Close"
              onClick={() => setActiveImage(null)}
            >
              ×
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={activeImage.src} alt={activeImage.alt} />
          </div>
        </div>
      )}

      {/* WAITLIST */}
      <section className="waitlist" id="waitlist">
        <div className="waitlist-header">
          <div className="wl-kicker">Limited Early Access</div>
          <h2 className="wl-title">
            Choose Your <em>Waitlist</em>
          </h2>
          <p className="wl-desc">Two separate forms for User and Agent pre-registration.</p>
        </div>

        <div className="forms-grid">
          <WaitlistCard role="user" />
          <WaitlistCard role="agent" featured />
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          <span>Commercial</span>UK
        </div>
        <div className="footer-copy">© 2026 CommercialUK. All rights reserved.</div>
      </footer>
    </>
  );
}
