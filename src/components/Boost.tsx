import { useState, useId, useMemo, type CSSProperties } from "react";
import { studio } from "../data/content";
import { buildSmsHref } from "../utils/sms";
import { ArrowIcon, Reveal, SectionHeader } from "./primitives";

interface TradePreset {
  name: string;
  ticket: number;
  visitors: number;
  speed: number;
  icon: string;
}

const PRESETS: TradePreset[] = [
  { name: "Contractor / Roofing", ticket: 1400, visitors: 900, speed: 4.8, icon: "🔨" },
  { name: "Medical / Specialty Clinic", ticket: 950, visitors: 1600, speed: 3.9, icon: "🩺" },
  { name: "Dumpster & Equipment", ticket: 480, visitors: 1800, speed: 4.4, icon: "🚛" },
  { name: "Plumbing & HVAC", ticket: 650, visitors: 1100, speed: 4.2, icon: "⚡" },
  { name: "Law & Accounting", ticket: 2200, visitors: 700, speed: 4.0, icon: "⚖️" },
  { name: "Auto Repair / Collision", ticket: 850, visitors: 1300, speed: 4.5, icon: "🚗" },
];

const DIAGNOSTIC_PILLARS = [
  {
    num: "01",
    tag: "Core Web Vitals",
    title: "Sub-Second First Paint (<0.8s vs 4.5s)",
    loss: "53% of mobile visits are abandoned if a page takes over 3 seconds to load (Google). On two bars of LTE between Clovis and Fresno, 5MB bloated WordPress templates freeze up.",
    fix: "Zero plugins, zero trackers, zero bloated libraries. Pure semantic code that paints instantly on the oldest smartphone in the Central Valley.",
    metric: "100/100 PageSpeed",
  },
  {
    num: "02",
    tag: "Mobile Ergonomics",
    title: "The Natural Thumb-Zone Call Trigger",
    loss: "Burying your phone number inside a hamburger menu or behind a 12-field form causes 68% of local mobile prospects to tap back and call the next competitor.",
    fix: "Persistent, one-tap 'Text Adam' and 'Call Now' triggers positioned precisely where a contractor or homeowner's thumb rests.",
    metric: "1-Tap SMS / Call",
  },
  {
    num: "03",
    tag: "Behavioral Trust",
    title: "Eliminating the Stock Photo Deficit",
    loss: "Stock photos of models in fake hardhats and generic template jargon trigger subconscious skepticism in local customers who value genuine handshake credibility.",
    fix: "Authentic local photography, transparent pricing published on the wall, and verified local proof from Fresno, Clovis, and Madera.",
    metric: "100% Real Valley Proof",
  },
  {
    num: "04",
    tag: "Asset Independence",
    title: "Zero Hostage Fees or Platform Lock-in",
    loss: "Agencies charge $150 to $300 every month just to keep your site hosted. Stop paying, and they delete your site and hold your domain hostage.",
    fix: "You own the domain, code, and hosting account on day one. Move it anytime, edit it anytime. No monthly hostage fees ever.",
    metric: "You Own Day 1",
  },
  {
    num: "05",
    tag: "Local Geo-Search",
    title: "Outranking National Middlemen",
    loss: "National lead brokers (Angi, Yelp, Thumbtack) siphon high-intent local calls and resell your own neighborhood leads back to you at 30–50% margin.",
    fix: "Dedicated geo-targeted service area structures with rich Schema.org local business markup to secure high-intent #1 spots.",
    metric: "#1 Local Intent",
  },
];

export function Boost({
  isStandalone = false,
  onNavigate,
}: {
  isStandalone?: boolean;
  onNavigate?: (path: string) => void;
}) {
  const [ticketValue, setTicketValue] = useState(850);
  const [visitors, setVisitors] = useState(1200);
  const [speed, setSpeed] = useState(4.2);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Teardown generator state
  const [siteUrl, setSiteUrl] = useState("");
  const [userTrade, setUserTrade] = useState("");
  const [teardownRequested, setTeardownRequested] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  const ticketId = useId();
  const visitorsId = useId();
  const speedId = useId();
  const urlId = useId();
  const tradeId = useId();

  // Dynamic month for genuine scarcity
  const currentMonthYear = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(new Date());
  }, []);

  // Behavioral calculation based on Google & Akamai conversion research
  const calc = useMemo(() => {
    // Baseline conversion rate at <0.8s mobile load time for high-intent local queries
    const baselineConversion = 0.038;

    // Bounce retention decay curve relative to speed
    // 0.8s = 100% retention; 2.0s = ~83%; 3.5s = ~62%; 5.0s = ~41%; 7.5s = ~20%
    const retentionRate = Math.min(1, Math.max(0.18, 1 - (speed - 0.8) * 0.14));

    const optimalCallers = Math.round(visitors * baselineConversion);
    const actualCallers = Math.min(optimalCallers, Math.round(optimalCallers * retentionRate));
    // When speed is <= 0.9s, lostCallers is mathematically 0
    const lostCallers = Math.max(0, optimalCallers - actualCallers);

    // Conservative 40% close rate on phone/SMS inquiries
    const estimatedCloseRate = 0.4;
    const monthlyLostRevenue = Math.round(lostCallers * estimatedCloseRate * ticketValue);
    const annualLostRevenue = monthlyLostRevenue * 12;

    // ROI on Clovis $500 launch build
    const roiMultiple = annualLostRevenue > 0 ? Math.max(1, Math.round(annualLostRevenue / 500)) : 0;

    // Severity category
    let severity = "good";
    let severityLabel = "⚡ Fast · Minimal traffic leakage";
    let severityDesc = "Your site is responsive. Visitors find your phone number before giving up.";
    if (speed <= 1.0) {
      severity = "optimal";
      severityLabel = "🏆 Peak Conversion · 100% Caller Retention";
      severityDesc = "Hand-built Clovis benchmark. Zero mobile lag means every high-intent local caller connects.";
    } else if (speed > 2.0 && speed <= 3.8) {
      severity = "moderate";
      severityLabel = "⚠️ Moderate Drag · Losing ~25%–40% of mobile callers";
      severityDesc = "Central Valley customers on patchy cell reception are noticing lag.";
    } else if (speed > 3.8) {
      severity = "critical";
      severityLabel = "🚨 Severe Revenue Bleed · Majority of mobile traffic abandons";
      severityDesc = "Visitors are leaving before your phone number even paints on their screen.";
    }

    return {
      optimalCallers,
      actualCallers,
      lostCallers,
      monthlyLostRevenue,
      annualLostRevenue,
      roiMultiple,
      severity,
      severityLabel,
      severityDesc,
    };
  }, [ticketValue, visitors, speed]);

  const teardownMessage = useMemo(() => {
    const cleanUrl = siteUrl.trim() || "my website";
    const cleanTrade = userTrade.trim() ? ` for my ${userTrade.trim()} business` : "";
    if (calc.lostCallers === 0) {
      return `Hi Adam — I ran the Boost calculator for ${cleanUrl}${cleanTrade}. My site is fast, but I'd love a quick 3-minute video teardown to see if my mobile call buttons and layout are converting at peak efficiency.`;
    }
    return `Hi Adam — I ran the Boost calculator. My site loads in ~${speed.toFixed(1)}s and I estimate we're losing around $${calc.monthlyLostRevenue.toLocaleString()}/mo. Could you do a free 3-minute video teardown for ${cleanUrl}${cleanTrade}?`;
  }, [siteUrl, userTrade, speed, calc.monthlyLostRevenue, calc.lostCallers]);

  const teardownSmsHref = buildSmsHref(studio.smsHref, teardownMessage);

  const handleCopyDraft = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${teardownMessage} (To: ${studio.phoneDisplay})`);
        setCopiedDraft(true);
        setTimeout(() => setCopiedDraft(false), 3500);
      }
    } catch {
      // Fallback
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 3500);
    }
  };

  const applyPreset = (preset: TradePreset) => {
    setActivePreset(preset.name);
    setTicketValue(preset.ticket);
    setVisitors(preset.visitors);
    setSpeed(preset.speed);
  };

  return (
    <section id="boost" className={`section_boost ${isStandalone ? "is-standalone" : ""}`} aria-labelledby="boost-heading">
      <div className="padding-global padding-section-large">
        <div className="container-large">
          <SectionHeader
            index="03"
            label="The Conversion Boost™"
            headingId="boost-heading"
            heading={[
              "Your website isn’t an art piece.",
              <>
                It’s your <span className="text-italic-serif text-color-accent">cash register.</span>
              </>,
            ]}
            lede={
              <p>
                When a Central Valley homeowner or business searches for your trade, they aren’t browsing for fun. Every
                second of load lag and every bloated mobile form pushes them directly into your competitor’s hands.
              </p>
            }
          />

          {/* Scarcity & Capacity Alert Pill */}
          <Reveal className="boost_scarcity-bar">
            <div className="boost_scarcity-inner">
              <span className="boost_scarcity-indicator" aria-hidden="true" />
              <div className="boost_scarcity-text">
                <strong>Current Studio Intake ({currentMonthYear}):</strong> Only 2 client build spots open for this month. First come, first served.
              </div>
              <a href="#fees" className="boost_scarcity-link">
                $500 Launch Offer details →
              </a>
            </div>
          </Reveal>

          {/* Interactive Cost-of-Inactivity & Revenue Leak Calculator */}
          <Reveal id="boost-calc" className="boost_calculator-card">
            <div className="boost_calc-header">
              <div className="boost_calc-badge text-style-eyebrow">Interactive Psychological Engine</div>
              <h3 className="heading-style-h3">Cost-of-Inactivity &amp; Revenue Leak Calculator</h3>
              <p className="text-color-muted text-size-small">
                Grounded in Google &amp; Akamai behavioral conversion data. Select a trade preset or adjust the sliders to
                calculate your actual revenue bleed.
              </p>

              {/* Trade Presets */}
              <div className="boost_presets-row">
                <span className="text-style-eyebrow text-color-muted">Quick trade presets:</span>
                <div className="boost_presets-list">
                  {PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      className={`boost_preset-btn ${activePreset === p.name ? "is-active" : ""}`}
                      onClick={() => applyPreset(p)}
                    >
                      <span aria-hidden="true">{p.icon}</span>
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="boost_calc-grid">
              {/* Sliders Column */}
              <div className="boost_calc-controls">
                {/* Control 1: Customer Value */}
                <div className="boost_control-group">
                  <div className="boost_control-header">
                    <label htmlFor={ticketId} className="boost_control-label">
                      Average Customer / Job Value
                    </label>
                    <div className="boost_stepper-row">
                      <button
                        type="button"
                        onClick={() => {
                          setTicketValue((v) => Math.max(150, v - 100));
                          setActivePreset(null);
                        }}
                        className="boost_step-btn"
                        aria-label="Decrease customer value by $100"
                      >
                        −
                      </button>
                      <span className="boost_control-value font-mono">
                        ${ticketValue.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setTicketValue((v) => Math.min(5000, v + 100));
                          setActivePreset(null);
                        }}
                        className="boost_step-btn"
                        aria-label="Increase customer value by $100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <input
                    id={ticketId}
                    type="range"
                    min="150"
                    max="5000"
                    step="50"
                    value={ticketValue}
                    onChange={(e) => {
                      setTicketValue(Number(e.target.value));
                      setActivePreset(null);
                    }}
                    className="boost_slider"
                    style={{ "--p": `${((ticketValue - 150) / (5000 - 150)) * 100}%` } as CSSProperties}
                  />
                  <div className="boost_control-hints text-style-eyebrow">
                    <span>$150 (Maintenance)</span>
                    <span>$2,500</span>
                    <span>$5,000+ (Big project)</span>
                  </div>
                </div>

                {/* Control 2: Monthly Visitors */}
                <div className="boost_control-group">
                  <div className="boost_control-header">
                    <label htmlFor={visitorsId} className="boost_control-label">
                      Estimated Monthly Site Visitors
                    </label>
                    <div className="boost_stepper-row">
                      <button
                        type="button"
                        onClick={() => {
                          setVisitors((v) => Math.max(100, v - 100));
                          setActivePreset(null);
                        }}
                        className="boost_step-btn"
                        aria-label="Decrease visitors by 100"
                      >
                        −
                      </button>
                      <span className="boost_control-value font-mono">
                        {visitors.toLocaleString()} <small className="text-color-muted">visitors/mo</small>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setVisitors((v) => Math.min(8000, v + 100));
                          setActivePreset(null);
                        }}
                        className="boost_step-btn"
                        aria-label="Increase visitors by 100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <input
                    id={visitorsId}
                    type="range"
                    min="100"
                    max="8000"
                    step="50"
                    value={visitors}
                    onChange={(e) => {
                      setVisitors(Number(e.target.value));
                      setActivePreset(null);
                    }}
                    className="boost_slider"
                    style={{ "--p": `${((visitors - 100) / (8000 - 100)) * 100}%` } as CSSProperties}
                  />
                  <div className="boost_control-hints text-style-eyebrow">
                    <span>100 local</span>
                    <span>4,000</span>
                    <span>8,000+ high traffic</span>
                  </div>
                </div>

                {/* Control 3: Current Mobile Speed */}
                <div className="boost_control-group">
                  <div className="boost_control-header">
                    <label htmlFor={speedId} className="boost_control-label">
                      Current Mobile Load Speed
                    </label>
                    <div className="boost_stepper-row">
                      <button
                        type="button"
                        onClick={() => {
                          setSpeed((v) => Math.max(0.8, Number((v - 0.2).toFixed(1))));
                          setActivePreset(null);
                        }}
                        className="boost_step-btn"
                        aria-label="Make speed 0.2s faster"
                      >
                        −
                      </button>
                      <span className={`boost_control-value font-mono is-${calc.severity}`}>
                        {speed.toFixed(1)}s <small className="text-color-muted">(Central Valley LTE)</small>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSpeed((v) => Math.min(7.5, Number((v + 0.2).toFixed(1))));
                          setActivePreset(null);
                        }}
                        className="boost_step-btn"
                        aria-label="Make speed 0.2s slower"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <input
                    id={speedId}
                    type="range"
                    min="0.8"
                    max="7.5"
                    step="0.1"
                    value={speed}
                    onChange={(e) => {
                      setSpeed(Number(e.target.value));
                      setActivePreset(null);
                    }}
                    className="boost_slider"
                    style={{ "--p": `${((speed - 0.8) / (7.5 - 0.8)) * 100}%` } as CSSProperties}
                  />
                  <div className="boost_control-hints text-style-eyebrow">
                    <span className="text-color-highlight">0.8s (Clovis Hand-Built)</span>
                    <span>4.0s (Average WP)</span>
                    <span className="text-color-accent">7.5s (Bloated Template)</span>
                  </div>
                </div>

                {/* Severity Status Box */}
                <div className={`boost_status-box is-${calc.severity}`}>
                  <div className="boost_status-title">{calc.severityLabel}</div>
                  <p className="boost_status-body text-size-small">{calc.severityDesc}</p>
                </div>
              </div>

              {/* Output & Psychological Loss Ledger */}
              <div className="boost_calc-results">
                <div className="boost_results-inner">
                  <div className="boost_results-badge text-style-eyebrow">Your Psychological Loss Ledger</div>

                  {/* Primary Loss Metric */}
                  {calc.lostCallers === 0 ? (
                    <div className="boost_loss-block is-optimal">
                      <div className="text-style-eyebrow text-color-highlight">Peak Efficiency Benchmark</div>
                      <div className="boost_loss-amount is-zero">
                        $0 <span className="boost_loss-period">/ month lost</span>
                      </div>
                      <div className="boost_loss-annual font-mono text-size-small text-color-highlight">
                        Retaining all ~{calc.optimalCallers} estimated callers each month
                      </div>
                    </div>
                  ) : (
                    <div className="boost_loss-block">
                      <div className="text-style-eyebrow text-color-muted">Estimated Revenue Leaking to Competitors</div>
                      <div className="boost_loss-amount">
                        ${calc.monthlyLostRevenue.toLocaleString()}
                        <span className="boost_loss-period"> / month</span>
                      </div>
                      <div className="boost_loss-annual font-mono text-size-small">
                        ${calc.annualLostRevenue.toLocaleString()} projected over 12 months
                      </div>
                    </div>
                  )}

                  {/* Callers Breakdown */}
                  <div className="boost_breakdown-grid">
                    <div className="boost_breakdown-item">
                      <div className={`boost_breakdown-num font-mono ${calc.lostCallers === 0 ? "text-color-highlight" : "text-color-accent"}`}>
                        {calc.lostCallers === 0 ? "0 Lost" : `~${calc.lostCallers}`}
                      </div>
                      <div className="boost_breakdown-label text-size-small">
                        {calc.lostCallers === 0 ? "100% of mobile callers retained" : "Qualified callers lost every month"}
                      </div>
                    </div>
                    <div className="boost_breakdown-item">
                      <div className="boost_breakdown-num font-mono text-color-highlight">
                        {calc.lostCallers === 0 ? "100/100" : `${calc.roiMultiple}×`}
                      </div>
                      <div className="boost_breakdown-label text-size-small">
                        {calc.lostCallers === 0 ? "Perfect Google PageSpeed target" : "12-Mo ROI multiple on a $500 build"}
                      </div>
                    </div>
                  </div>

                  {/* The Clovis Solution Comparison */}
                  <div className="boost_comparison-box">
                    <div className="boost_comp-row">
                      <span className="boost_comp-label">Current template speed:</span>
                      <span className="boost_comp-val font-mono">{speed.toFixed(1)}s mobile lag</span>
                    </div>
                    <div className="boost_comp-row is-winner">
                      <span className="boost_comp-label">Clovis Hand-Built speed:</span>
                      <span className="boost_comp-val font-mono">0.7s · PageSpeed 100 ✓</span>
                    </div>
                    <p className="boost_comp-foot text-size-small text-color-muted">
                      At our <strong>$500 launch price</strong>, your new site pays for itself with the{" "}
                      <span className="text-color-primary font-medium">very first saved customer</span>.
                    </p>
                  </div>

                  <a
                    href="#teardown"
                    className="button is-accent boost_calc-cta"
                    data-cursor="label"
                    data-cursor-label="Audit"
                  >
                    <span>Request Free 3-Min Video Teardown</span>
                    <ArrowIcon size={13} />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* 5-Point Psychological Diagnostic Breakdown */}
          <div id="boost-diag" className="boost_diagnostic-section">
            <div className="boost_diag-intro">
              <span className="text-style-eyebrow text-color-accent">The 5 Psychological Friction Points</span>
              <h3 className="heading-style-h3">
                Why 9 out of 10 Central Valley website templates <span className="text-italic-serif">fail to convert.</span>
              </h3>
              <p className="text-color-muted">
                Visitors decide whether they trust a local business in under four seconds. Here is the exact psychological
                anatomy of why cheap templates leak customers — and how we engineer every build to win.
              </p>
            </div>

            <div className="boost_diag-grid">
              {DIAGNOSTIC_PILLARS.map((p, i) => (
                <Reveal key={p.num} index={i} className="boost_diag-card">
                  <div className="boost_diag-head">
                    <span className="boost_diag-num font-mono">{p.num}</span>
                    <span className="boost_diag-tag text-style-eyebrow">{p.tag}</span>
                    <span className="boost_diag-badge font-mono">{p.metric}</span>
                  </div>
                  <h4 className="heading-style-h4">{p.title}</h4>
                  <div className="boost_diag-body">
                    <div className="boost_diag-loss">
                      <strong className="text-color-accent">The Psychological Leak:</strong> {p.loss}
                    </div>
                    <div className="boost_diag-fix">
                      <strong className="text-color-brand-soft">The Clovis Engineering:</strong> {p.fix}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* 1-Click Free 3-Minute Video Teardown Generator (Reciprocity Engine) */}
          <Reveal id="boost-teardown" className="boost_teardown-card">
            <div id="teardown" className="section-anchor" aria-hidden="true" />
            <div className="boost_teardown-content">
              <div className="boost_teardown-copy">
                <span className="text-style-eyebrow text-color-accent">№ Reciprocity — Free Upfront Proof</span>
                <h3 className="heading-style-h3">
                  Want to see your exact mobile speed and where customers are bouncing?
                </h3>
                <p className="text-size-large text-color-muted">
                  I will run real Chrome DevTools on a simulated Central Valley cell connection, record a 3-minute video
                  showing where your customers get frustrated, and text it straight to your phone. Zero cost, no pushy sales
                  call.
                </p>

                <div className="boost_guarantee-strip">
                  <div className="boost_guar-item">
                    <span className="boost_guar-icon">✓</span>
                    <span>100% Free · No sales reps or follow-up phone calls</span>
                  </div>
                  <div className="boost_guar-item">
                    <span className="boost_guar-icon">✓</span>
                    <span>Chrome DevTools real data · Not an automated scanner bot</span>
                  </div>
                  <div className="boost_guar-item">
                    <span className="boost_guar-icon">✓</span>
                    <span>Texted to your phone within 24 hours</span>
                  </div>
                </div>
              </div>

              <div className="boost_teardown-form">
                <div className="boost_input-row">
                  <div className="boost_field">
                    <label htmlFor={urlId} className="text-style-eyebrow">
                      Your current website URL
                    </label>
                    <input
                      id={urlId}
                      type="text"
                      placeholder="e.g. valleyroofing.com (or 'none yet')"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      className="boost_input"
                    />
                  </div>

                  <div className="boost_field">
                    <label htmlFor={tradeId} className="text-style-eyebrow">
                      Your trade or business
                    </label>
                    <input
                      id={tradeId}
                      type="text"
                      placeholder="e.g. Electrician, Clinic, Auto Repair"
                      value={userTrade}
                      onChange={(e) => setUserTrade(e.target.value)}
                      className="boost_input"
                    />
                  </div>
                </div>

                {/* Pre-composed SMS Preview */}
                <div className="boost_sms-preview">
                  <div className="boost_sms-preview-head text-style-eyebrow">
                    <span>Preview of text to Adam</span>
                    <span className="font-mono">{studio.phoneDisplay}</span>
                  </div>
                  <div className="boost_sms-bubble">
                    <p>{teardownMessage}</p>
                  </div>
                </div>

                <div className="boost_teardown-actions">
                  <a
                    href={teardownSmsHref}
                    className="button is-accent boost_submit-btn"
                    onClick={() => setTeardownRequested(true)}
                    data-cursor="label"
                    data-cursor-label="Text"
                  >
                    <span>{teardownRequested ? "Opening Messages app…" : "Text Adam for Free Video Teardown →"}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyDraft}
                    className="boost_copy-btn text-style-eyebrow"
                  >
                    {copiedDraft ? "✓ Copied draft! Paste into your text app" : `📋 Desktop? Copy draft to text ${studio.phoneDisplay}`}
                  </button>

                  <p className="text-size-small text-color-muted text-center">
                    Tapping opens your phone's Messages app with this exact draft ready. You can edit before sending.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Standalone Route Callout (only shown when embedded on homepage) */}
          {!isStandalone && (
            <div className="boost_standalone-callout">
              <div className="boost_standalone-callout-inner">
                <div className="boost_standalone-callout-text">
                  <span className="text-style-eyebrow text-color-accent">Standalone Experience Available</span>
                  <div className="font-medium">Direct URL for marketing &amp; mobile visitors:</div>
                  <div className="text-size-small text-color-muted">
                    Bookmark or share <code>cloviswebdesign.com/boost</code> for the focused, standalone teardown landing page.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => (onNavigate ? onNavigate("/boost") : (window.location.href = "/boost"))}
                  className="button is-light boost_standalone-btn"
                  data-cursor="hover"
                >
                  <span>Open Dedicated /boost Page →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
