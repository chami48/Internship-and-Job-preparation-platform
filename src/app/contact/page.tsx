import Link from "next/link";

const channels = [
  {
    title: "General",
    detail: "hiresmart31@gmail.com",
    note: "For platform questions, support, and feedback.",
  },
  {
    title: "Partnerships",
    detail: "partners@hiresmart.lk",
    note: "For companies, collaborations, and campus programs.",
  },
  {
    title: "Careers",
    detail: "careers@hiresmart.lk",
    note: "Join the team building fairer hiring workflows.",
  },
];

const faqs = [
  {
    q: "How fast do you respond?",
    a: "We reply within 24-48 hours on business days.",
  },
  {
    q: "Can I request a demo?",
    a: "Yes. Share your company details and we will schedule a walkthrough.",
  },
  {
    q: "Do you support campus partnerships?",
    a: "Absolutely. We partner with universities and career offices.",
  },
];

export default function ContactPage() {
  return (
    <main className="contact-root">
      <style>{`
        .contact-root {
          color: #0F172A;
          background:
            radial-gradient(circle at 20% 10%, rgba(14,165,233,0.12), transparent 38%),
            radial-gradient(circle at 90% 20%, rgba(14,165,233,0.08), transparent 30%),
            linear-gradient(120deg, #f7fbff 0%, #f3f7ff 40%, #f8fafc 100%);
          overflow-x: hidden;
        }

        .contact-display {
          letter-spacing: -0.03em;
        }

        .contact-hero {
          position: relative;
          padding: 96px 24px 80px;
          overflow: hidden;
          background: linear-gradient(180deg, #ffffff 0%, #f3f9ff 100%);
        }

        .contact-hero::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(135deg, rgba(14,165,233,0.08), transparent 55%),
            radial-gradient(circle at 70% 0%, rgba(14,165,233,0.12), transparent 35%);
          mask-image: radial-gradient(ellipse 70% 50% at 50% 0%, black 45%, transparent 85%);
          pointer-events: none;
        }

        .contact-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
        }

        .contact-hero-shell {
          display: grid;
          gap: 28px;
          align-items: center;
        }

        @media (min-width: 900px) {
          .contact-hero-shell { grid-template-columns: 1.1fr 0.9fr; }
        }

        .contact-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border-radius: 999px;
          padding: 6px 14px;
          border: 1px solid rgba(14,165,233,0.35);
          background: rgba(14,165,233,0.14);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #0F172A;
          margin-bottom: 20px;
        }

        .contact-title {
          font-size: clamp(2.2rem, 6vw, 3.8rem);
          font-weight: 700;
          line-height: 1.1;
        }

        .contact-title span {
          color: #0EA5E9;
        }

        .contact-sub {
          margin: 18px auto 0;
          max-width: 520px;
          font-size: 1.05rem;
          line-height: 1.8;
          color: #475569;
        }

        .contact-hero-card {
          background: white;
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 18px 45px rgba(15,23,42,0.08);
        }

        .contact-hero-card h3 {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 700;
        }

        .contact-hero-list {
          margin: 16px 0 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 12px;
          color: #475569;
        }

        .contact-hero-list li {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(15,23,42,0.08);
        }

        .contact-hero-list li:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .contact-hero-note {
          margin-top: 14px;
          font-size: 0.85rem;
          color: #94A3B8;
        }

        .contact-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 60px 24px;
        }

        .contact-grid {
          display: grid;
          gap: 22px;
        }

        @media (min-width: 900px) {
          .contact-grid { grid-template-columns: 1.1fr 0.9fr; }
        }

        .contact-panel {
          background: #ffffff;
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 12px 36px rgba(15,23,42,0.06);
        }

        .contact-list {
          margin-top: 20px;
          display: grid;
          gap: 16px;
        }

        .contact-item {
          padding-bottom: 16px;
          border-bottom: 1px dashed rgba(15,23,42,0.14);
        }

        .contact-item:last-child {
          border-bottom: none;
        }

        .contact-item h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
        }

        .contact-item p {
          margin: 8px 0 0;
          color: #475569;
          line-height: 1.7;
        }

        .contact-email {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #0EA5E9;
          text-decoration: none;
        }

        .contact-email:hover {
          text-decoration: underline;
        }

        .contact-card-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0 0 12px;
        }

        .contact-input {
          width: 100%;
          border-radius: 12px;
          border: 1px solid #CBD5E1;
          padding: 12px 14px;
          font-size: 0.95rem;
          color: #0F172A;
        }

        .contact-input:focus {
          outline: none;
          border-color: #0EA5E9;
          box-shadow: 0 0 0 3px rgba(14,165,233,0.15);
        }

        .contact-textarea {
          min-height: 140px;
          resize: vertical;
        }

        .contact-actions {
          margin-top: 16px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .contact-button {
          border-radius: 12px;
          background: #0F172A;
          color: white;
          padding: 12px 24px;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }

        .contact-button:hover {
          background: #1E293B;
          transform: translateY(-1px);
        }

        .contact-note {
          margin-top: 12px;
          font-size: 0.85rem;
          color: #94A3B8;
        }

        .faq {
          margin-top: 24px;
          display: grid;
          gap: 16px;
        }

        .faq-item {
          border-top: 1px solid rgba(15,23,42,0.1);
          padding-top: 16px;
        }

        .faq-item h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
        }

        .faq-item p {
          margin-top: 6px;
          color: #475569;
          line-height: 1.7;
        }

        .contact-footer {
          padding: 0 24px 80px;
          text-align: center;
          color: #64748B;
        }

        .contact-footer a {
          color: #0EA5E9;
          font-weight: 600;
          text-decoration: none;
        }

        .contact-footer a:hover {
          text-decoration: underline;
        }
      `}</style>

      <section className="contact-hero">
        <div className="contact-hero-inner">
          <div className="contact-hero-shell">
            <div>
              <div className="contact-badge">Contact</div>
              <h1 className="contact-display contact-title">
                Let&apos;s talk about a <span>smarter</span> hiring journey.
              </h1>
              <p className="contact-sub">
                Share your questions, feedback, or partnership ideas. We will guide you to the
                right team and respond quickly.
              </p>
            </div>
            <div className="contact-hero-card">
              <h3>Quick contact</h3>
              <ul className="contact-hero-list">
                {channels.slice(0, 2).map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    <a className="contact-email" href={`mailto:${item.detail}`}>
                      {item.detail}
                    </a>
                    <span>{item.note}</span>
                  </li>
                ))}
              </ul>
              <div className="contact-hero-note">Average response time: 24-48 hours.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-grid">
          <div className="contact-panel">
            <h2 className="contact-card-title">Reach the right team</h2>
            <p className="contact-sub" style={{ margin: 0 }}>
              Choose the channel that matches your request.
            </p>
            <div className="contact-list">
              {channels.map((item) => (
                <div key={item.title} className="contact-item">
                  <h3>{item.title}</h3>
                  <a className="contact-email" href={`mailto:${item.detail}`}>
                    {item.detail}
                  </a>
                  <p>{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-panel">
            <h2 className="contact-card-title">Send a message</h2>
            <p className="contact-sub" style={{ margin: 0 }}>
              Tell us about your needs and we will follow up.
            </p>
            <div className="contact-list">
              <input className="contact-input" placeholder="Full name" />
              <input className="contact-input" placeholder="Email address" />
              <input className="contact-input" placeholder="Company / University" />
              <textarea className="contact-input contact-textarea" placeholder="How can we help?" />
            </div>
            <div className="contact-actions">
              <button className="contact-button" type="button">Send Message</button>
              <Link className="contact-email" href="/how-it-works">View how it works</Link>
            </div>
            <p className="contact-note">We do not share your message with third parties.</p>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-panel">
          <h2 className="contact-card-title">Frequently asked</h2>
          <div className="faq">
            {faqs.map((item) => (
              <div key={item.q} className="faq-item">
                <h4>{item.q}</h4>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="contact-footer">
        Prefer email? Reach us directly at <a href="mailto:hiresmart31@gmail.com">hhiresmart31@gmail.com</a>.
      </div>
    </main>
  );
}
