import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

type Page = 'home' | 'product' | 'privacy' | 'terms';

const SECTIONS = [
  {
    title: '1. Introduction',
    content: `QueryNexes, Inc. ("QueryNexes," "we," "us," or "our") is committed to protecting the privacy of individuals and organizations that interact with our Model Compilation and Optimization Platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our platform, or engage with our services.

By accessing or using QueryNexes, you acknowledge that you have read, understood, and agree to the practices described in this policy. If you do not agree with any provision herein, you must discontinue use of our services immediately.`,
  },
  {
    title: '2. Information We Collect',
    content: `We collect information necessary to deliver, maintain, and improve our platform. The categories of data we collect include:

Account Information: When you register for an account, we collect your name, email address, organization name, billing address, and payment information. Payment data is processed by our PCI-DSS compliant payment processors and is never stored on our servers.

Usage Data: We automatically collect information about how you interact with our platform, including model compilation metrics, API call frequency, feature utilization, session duration, and error logs. This data is aggregated and anonymized where possible to improve platform performance.

Model Metadata: When you upload models for compilation, we collect metadata such as model architecture, framework type, parameter counts, and hardware targets. We do not access or store the underlying training data or proprietary model weights beyond the duration necessary for compilation.

Communication Data: If you contact our support team, subscribe to our newsletter, or participate in surveys, we collect the information you provide, including correspondence records and communication preferences.`,
  },
  {
    title: '3. How We Use Your Information',
    content: `The information we collect is used exclusively for the following purposes:

Service Delivery: To process model compilations, generate optimized artifacts, manage your account, provide customer support, and fulfill our contractual obligations under our Terms of Service.

Platform Improvement: To analyze usage patterns, diagnose technical issues, optimize compilation engines, develop new features, and enhance overall platform performance and reliability.

Security and Compliance: To detect and prevent unauthorized access, fraud, abuse, or illegal activity; to enforce our Terms of Service; and to comply with applicable legal and regulatory obligations.

Communications: To send service-related announcements, technical notices, security alerts, and support messages. Marketing communications are sent only with your explicit consent, and you may opt out at any time.`,
  },
  {
    title: '4. Data Sharing and Disclosure',
    content: `QueryNexes does not sell, rent, or trade your personal information. We may share your data only in the following circumstances:

Service Providers: We engage trusted third-party vendors to assist with cloud infrastructure (AWS, GCP, Azure), payment processing (Stripe), customer relationship management, and analytics. These providers are contractually bound to process data solely on our behalf and in compliance with this policy.

Legal Requirements: We may disclose information if required to do so by law, regulation, legal process, or governmental request, or when we believe in good faith that disclosure is necessary to protect our rights, your safety, or the safety of others.

Business Transfers: In the event of a merger, acquisition, reorganization, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or control.`,
  },
  {
    title: '5. Cookies and Tracking Technologies',
    content: `We use cookies, web beacons, and similar tracking technologies to enhance platform functionality, analyze usage trends, and remember your preferences.

Essential Cookies: Required for platform operation, including session management, authentication, and security. These cannot be disabled.

Analytics Cookies: Help us understand how users interact with our platform, which features are most valuable, and where improvements are needed. We use first-party analytics and do not share browsing data with advertising networks.

Preference Cookies: Remember your settings, display preferences, and configuration choices across sessions.

You can control cookie preferences through your browser settings. Disabling certain cookies may affect platform functionality and user experience.`,
  },
  {
    title: '6. Data Security',
    content: `We implement industry-leading security measures to protect your information against unauthorized access, alteration, disclosure, or destruction:

Encryption: All data in transit is encrypted using TLS 1.3 protocols. Data at rest is encrypted using AES-256 encryption across all storage systems.

Access Controls: Strict role-based access controls (RBAC), multi-factor authentication (MFA), and principle of least privilege govern access to all systems containing personal or sensitive data.

Infrastructure Security: Our platform is hosted on SOC 2 Type II compliant cloud infrastructure with continuous monitoring, intrusion detection, and automated threat response.

Security Audits: We conduct regular penetration testing, vulnerability assessments, and third-party security audits to maintain the integrity of our systems.

Despite these measures, no method of electronic storage or transmission is completely secure. We cannot guarantee absolute security but will promptly notify you of any confirmed data breach in accordance with applicable law.`,
  },
  {
    title: '7. Data Retention',
    content: `We retain your information only as long as necessary to fulfill the purposes described in this policy, or as required by law.

Account Data: Retained for the duration of your account plus 90 days following account closure, after which it is securely deleted or anonymized.

Usage Analytics: Retained in aggregated form indefinitely for platform improvement. Personally identifiable usage data is retained for a maximum of 24 months.

Model Artifacts: Compiled model artifacts are retained for 30 days after generation unless otherwise specified in your service agreement.

You may request deletion of your personal data at any time by contacting our privacy team. We will fulfill such requests within 30 days, subject to legal retention obligations.`,
  },
  {
    title: '8. Your Rights and Choices',
    content: `Depending on your jurisdiction, you may have the following rights regarding your personal information:

Access: Request a copy of the personal data we hold about you.

Correction: Request that we correct inaccurate or incomplete information.

Deletion: Request deletion of your personal data, subject to legal retention requirements.

Portability: Request transfer of your data to another service provider in a structured, machine-readable format.

Objection: Object to the processing of your data for certain purposes, including direct marketing.

To exercise any of these rights, please contact us at privacy@querynexes.io. We will respond to your request within the timeframe required by applicable law. We may need to verify your identity before processing your request.`,
  },
  {
    title: '9. Third-Party Services',
    content: `Our platform integrates with various third-party services and tools, including:

Cloud Infrastructure: Amazon Web Services, Google Cloud Platform, and Microsoft Azure for compute and storage.

Payment Processing: Stripe, Inc. for secure payment handling.

Analytics: First-party and third-party analytics tools to monitor platform performance.

SDK Integrations: GPU compiler SDKs, TensorRT, and other ML framework toolkits necessary for model compilation.

We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies independently. Integration with third-party services is governed by your agreement with those providers.`,
  },
  {
    title: '10. International Data Transfers',
    content: `QueryNexes operates globally and may transfer your data to servers located in the United States, European Union, or other jurisdictions where we or our service providers maintain facilities.

When transferring data from the European Economic Area (EEA), Switzerland, or the United Kingdom to countries not deemed adequate by the European Commission, we rely on Standard Contractual Clauses (SCCs) and other appropriate safeguards to ensure your data receives an equivalent level of protection.

By using our services, you consent to the transfer of your information to countries that may have different data protection laws than your jurisdiction.`,
  },
  {
    title: '11. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or industry standards. Material changes will be communicated via email, platform notification, or a prominent notice on our website at least 14 days before the effective date.

Your continued use of QueryNexes after the effective date of any modification constitutes your acceptance of the updated policy. We encourage you to review this policy periodically for the latest information about our privacy practices.

The current version of this policy was last updated on June 1, 2026.`,
  },
  {
    title: '12. Contact Us',
    content: `If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

Data Protection Officer: dpo@querynexes.io
Privacy Inquiries: privacy@querynexes.io

Mailing Address:
QueryNexes, Inc.
548 Market Street, PMB 98210
San Francisco, CA 94104
United States

We aim to respond to all inquiries within 5 business days. If you are unsatisfied with our response, you may lodge a complaint with your local data protection authority.`,
  },
];

export default function PrivacyPolicy({ onNavigate, muted, onMuteToggle }: {
  onNavigate: (page: Page) => void;
  muted?: boolean;
  onMuteToggle?: () => void;
}) {
  return (
    <>
      <Navbar currentPage="privacy" onNavigate={onNavigate} muted={muted} onMuteToggle={onMuteToggle} />
      <main>
        <section
          style={{
            padding: '120px 48px 64px',
            background: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border-default)',
            position: 'relative',
            overflow: 'hidden',
          }}
          className="legal-hero"
        >
          {/* Background decorative elements */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
          }}>
            <div className="legal-grid-bg" />
            <div style={{
              position: 'absolute', top: '-40%', right: '-10%',
              width: '500px', height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,255,133,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: '-20%', left: '-5%',
              width: '300px', height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(45,211,255,0.04) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div className="legal-particle legal-particle-1" />
            <div className="legal-particle legal-particle-2" />
            <div className="legal-particle legal-particle-3" />
          </div>
          <div className="legal-hero-accent" />

          <span className="section-label" style={{ display: 'block', marginBottom: '12px', position: 'relative', zIndex: 1 }}>
            // LEGAL
          </span>
          <h1
            className="section-title"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(32px, 5vw, 52px)',
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              marginBottom: '16px',
              maxWidth: '720px',
              position: 'relative', zIndex: 1,
            }}
          >
            Privacy Policy
          </h1>
          <p
            className="section-sub"
            style={{
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              maxWidth: '600px',
              marginBottom: 0,
              position: 'relative', zIndex: 1,
            }}
          >
            How QueryNexes collects, uses, and protects your data across our
            Model Compilation and Optimization Platform.
          </p>
        </section>

        <section
          style={{
            padding: '72px 48px 96px',
            background: 'var(--bg-secondary)',
          }}
          className="legal-content"
        >
          <div
            style={{
              maxWidth: '840px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
            }}
          >
                {SECTIONS.map((section, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderLeft: '3px solid var(--green-neon)',
                  borderRadius: '12px',
                  padding: '32px',
                }}
              >
                <h2
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 600,
                    fontSize: 'clamp(18px, 2vw, 22px)',
                    color: 'var(--green-neon)',
                    marginBottom: '16px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {section.title}
                </h2>
                {section.content.split('\n\n').map((paragraph, j) => (
                  <p
                    key={j}
                    style={{
                      fontSize: 'clamp(14px, 1.5vw, 16px)',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.8,
                      marginBottom: j < section.content.split('\n\n').length - 1 ? '16px' : 0,
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer onNavigate={onNavigate} />

      <style>{`
        .legal-hero-accent {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--green-neon), transparent);
          opacity: 0.3;
        }
        .legal-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,255,133,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,133,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse at 50% 0%, black 30%, transparent 70%);
          -webkit-mask-image: radial-gradient(ellipse at 50% 0%, black 30%, transparent 70%);
        }
        .legal-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--green-neon);
          opacity: 0;
          pointer-events: none;
        }
        .legal-particle-1 {
          top: 20%;
          left: 15%;
          animation: legal-float 6s ease-in-out infinite;
          animation-delay: 0s;
        }
        .legal-particle-2 {
          top: 60%;
          right: 20%;
          width: 3px;
          height: 3px;
          animation: legal-float 8s ease-in-out infinite;
          animation-delay: 2s;
        }
        .legal-particle-3 {
          top: 35%;
          left: 60%;
          width: 5px;
          height: 5px;
          animation: legal-float 7s ease-in-out infinite;
          animation-delay: 4s;
        }
        @keyframes legal-float {
          0%, 100% {
            opacity: 0;
            transform: translateY(0) scale(0.5);
          }
          25% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.6;
            transform: translateY(-20px) scale(1);
          }
          75% {
            opacity: 0.2;
          }
        }
        @media (max-width: 768px) {
          .legal-hero { padding: 100px 24px 48px !important; }
          .legal-content { padding: 48px 24px 64px !important; }
          .legal-content div { gap: 20px !important; }
          .legal-content div > div { padding: 24px !important; }
        }
        @media (max-width: 425px) {
          .legal-hero { padding: 88px 16px 40px !important; }
          .legal-content { padding: 40px 16px 48px !important; }
          .legal-content div > div { padding: 20px !important; }
        }
        @media (max-width: 375px) {
          .legal-hero { padding: 80px 12px 32px !important; }
          .legal-content { padding: 32px 12px 40px !important; }
        }
      `}</style>
    </>
  );
}
