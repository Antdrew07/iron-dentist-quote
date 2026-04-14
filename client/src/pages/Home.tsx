/**
 * DESIGN: "Ironclad Proposal" — Dark luxury + athletic performance
 * Colors: Near-black bg, Gold (#C9A84C) accents, Off-white (#F5F0E8) text
 * Fonts: Playfair Display (display/prices), DM Sans (body), DM Mono (labels)
 * Layout: Asymmetric — left content, right sticky pricing panel
 */

import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown, ChevronUp, Download, Send, Star, Clock, Zap } from "lucide-react";

// ── Asset URLs ──────────────────────────────────────────────────────────────
const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029617589/nCUUDSHpfnPJqzDj57Y6E8/iron-dentist-logo_f7630c04.jpeg";
const BANNER_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029617589/nCUUDSHpfnPJqzDj57Y6E8/iron-dentist-banner_0516170f.png";
const HERO_BG_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029617589/nCUUDSHpfnPJqzDj57Y6E8/hero-bg-UYm8KPMrDo9PnLzzfyNQgp.webp";

// ── Service Definitions ──────────────────────────────────────────────────────
interface Service {
  id: string;
  code: string;
  title: string;
  description: string;
  details: string[];
  pricePerEpisode: number;
  episodesPerMonth: number;
  icon: string;
  required: boolean;
  timeEstimate: string;
}

const SERVICES: Service[] = [
  {
    id: "riverside-pull",
    code: "SVC-01",
    title: "Riverside Recording Pull",
    description: "Download and organize your finished episode recordings from Riverside.fm each week.",
    details: [
      "Log into Riverside.fm and locate the latest episode",
      "Download high-quality audio and video tracks",
      "Rename and organize files with consistent naming convention",
      "Quality-check audio levels and flag any issues",
    ],
    pricePerEpisode: 50,
    episodesPerMonth: 4,
    icon: "🎙️",
    required: true,
    timeEstimate: "~30 min/episode",
  },
  {
    id: "buzzsprout-upload",
    code: "SVC-02",
    title: "Buzzsprout Upload & Publishing",
    description: "Upload, configure, and publish each episode to Buzzsprout for podcast distribution.",
    details: [
      "Upload audio file to Buzzsprout",
      "Write episode title, description, and show notes",
      "Set episode artwork, tags, and categories",
      "Schedule or publish to all podcast platforms",
      "Verify distribution to Apple, Spotify, and others",
    ],
    pricePerEpisode: 60,
    episodesPerMonth: 4,
    icon: "🎧",
    required: true,
    timeEstimate: "~45 min/episode",
  },
  {
    id: "youtube-upload",
    code: "SVC-03",
    title: "YouTube Upload & Optimization",
    description: "Upload the video episode to YouTube with full SEO optimization for maximum reach.",
    details: [
      "Upload video file to YouTube Studio",
      "Write SEO-optimized title, description, and tags",
      "Add chapters/timestamps for better viewer experience",
      "Set end screens, cards, and playlist assignment",
      "Configure monetization settings if applicable",
    ],
    pricePerEpisode: 65,
    episodesPerMonth: 4,
    icon: "▶️",
    required: true,
    timeEstimate: "~1 hr/episode",
  },
  {
    id: "youtube-thumbnail",
    code: "SVC-04",
    title: "Custom YouTube Thumbnail Design",
    description: "Professional, branded thumbnail designed to maximize click-through rate on YouTube.",
    details: [
      "Custom design using Iron Dentist brand colors and fonts",
      "Guest name and episode topic prominently featured",
      "Eye-catching composition optimized for mobile and desktop",
      "Delivered in 1280×720px high-resolution format",
      "Revisions included until approved",
    ],
    pricePerEpisode: 75,
    episodesPerMonth: 4,
    icon: "🖼️",
    required: true,
    timeEstimate: "~1.5 hrs/episode",
  },
];

const ADD_ONS = [
  {
    id: "show-notes",
    title: "Written Show Notes / Blog Post",
    description: "Full episode summary written for SEO, posted to website or newsletter.",
    pricePerEpisode: 60,
    episodesPerMonth: 4,
    icon: "📝",
    timeEstimate: "~1 hr/episode",
  },
  {
    id: "social-clips",
    title: "Social Media Audiogram Clips",
    description: "2–3 short highlight clips per episode formatted for Instagram, Facebook & LinkedIn.",
    pricePerEpisode: 80,
    episodesPerMonth: 4,
    icon: "📱",
    timeEstimate: "~1.5 hrs/episode",
  },
  {
    id: "transcript",
    title: "Episode Transcript",
    description: "Full verbatim transcript for accessibility, SEO, and repurposing.",
    pricePerEpisode: 30,
    episodesPerMonth: 4,
    icon: "📄",
    timeEstimate: "~30 min/episode",
  },
];

// ── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedPrice({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    const duration = 400;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
      else prevRef.current = end;
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{displayed.toLocaleString()}</span>;
}

// ── Service Card ─────────────────────────────────────────────────────────────
function ServiceCard({
  service,
  selected,
  onToggle,
  index,
}: {
  service: Service | (typeof ADD_ONS)[0];
  selected: boolean;
  onToggle: () => void;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const monthlyPrice = service.pricePerEpisode * service.episodesPerMonth;
  const isService = "required" in service;

  return (
    <div
      className={`service-card rounded-lg overflow-hidden fade-slide-up fade-slide-up-delay-${Math.min(index + 1, 5)}`}
    >
      {/* Card Header */}
      <div
        className="p-5 flex items-start gap-4 cursor-pointer"
        onClick={onToggle}
      >
        {/* Checkbox */}
        <div
          className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-all duration-200 ${
            selected
              ? "border-yellow-500 bg-yellow-500/20"
              : "border-white/20 bg-transparent"
          }`}
        >
          {selected && <Check className="w-3 h-3 text-yellow-400" />}
        </div>

        {/* Icon + Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{service.icon}</span>
            <span className="font-mono-label text-xs text-yellow-600/70 tracking-widest uppercase">
              {"code" in service ? service.code : "ADD-ON"}
            </span>
            {isService && service.required && (
              <span className="text-xs bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded-full font-mono-label">
                CORE
              </span>
            )}
          </div>
          <h3 className="font-display text-base font-bold text-white/90 leading-tight">
            {service.title}
          </h3>
          <p className="text-sm text-white/50 mt-1 leading-relaxed">
            {service.description}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-white/30 font-mono-label">
              <Clock className="w-3 h-3" />
              {service.timeEstimate}
            </span>
            <span className="text-xs text-white/30 font-mono-label">
              {service.episodesPerMonth} eps/mo
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0">
          <div className="font-display text-xl font-bold gold-gradient-text">
            ${monthlyPrice}
          </div>
          <div className="text-xs text-white/30 font-mono-label">/month</div>
          <div className="text-xs text-white/25 font-mono-label mt-0.5">
            ${service.pricePerEpisode}/ep
          </div>
        </div>
      </div>

      {/* Expand Toggle */}
      {"details" in service && service.details && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-5 pb-3 flex items-center gap-1 text-xs text-white/30 hover:text-yellow-500/70 transition-colors font-mono-label"
          >
            {expanded ? (
              <><ChevronUp className="w-3 h-3" /> Hide details</>
            ) : (
              <><ChevronDown className="w-3 h-3" /> View what's included</>
            )}
          </button>

          {expanded && (
            <div className="px-5 pb-4 border-t border-white/5 pt-3">
              <ul className="space-y-1.5">
                {service.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/50">
                    <span className="text-yellow-500/60 mt-0.5 flex-shrink-0">◆</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set(SERVICES.map((s) => s.id))
  );
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());
  const [accepted, setAccepted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleService = (id: string) => {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const coreTotal = SERVICES.filter((s) => selectedServices.has(s.id)).reduce(
    (sum, s) => sum + s.pricePerEpisode * s.episodesPerMonth,
    0
  );

  const addOnTotal = ADD_ONS.filter((a) => selectedAddOns.has(a.id)).reduce(
    (sum, a) => sum + a.pricePerEpisode * a.episodesPerMonth,
    0
  );

  const monthlyTotal = coreTotal + addOnTotal;
  const annualTotal = monthlyTotal * 12;
  const annualSavings = monthlyTotal * 2; // 2 months free on annual

  const handleAccept = () => {
    setAccepted(true);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  // Episodes per month breakdown
  const totalEpisodesPerMonth = 4;
  const totalHoursPerMonth = (() => {
    let mins = 0;
    if (selectedServices.has("riverside-pull")) mins += 30 * 4;
    if (selectedServices.has("buzzsprout-upload")) mins += 45 * 4;
    if (selectedServices.has("youtube-upload")) mins += 60 * 4;
    if (selectedServices.has("youtube-thumbnail")) mins += 90 * 4;
    if (selectedAddOns.has("show-notes")) mins += 60 * 4;
    if (selectedAddOns.has("social-clips")) mins += 90 * 4;
    if (selectedAddOns.has("transcript")) mins += 30 * 4;
    return (mins / 60).toFixed(1);
  })();

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* ── Hero Section ── */}
      <div
        className="relative min-h-[420px] flex flex-col justify-end overflow-hidden"
        style={{
          backgroundImage: `url(${HERO_BG_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 container pb-12 pt-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-8">
            {/* Left: Branding */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4 fade-slide-up">
                <img
                  src={LOGO_URL}
                  alt="Iron Dentist Logo"
                  className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500/40"
                />
                <div>
                  <div className="font-mono-label text-xs text-yellow-500/70 tracking-[0.3em] uppercase mb-1">
                    Service Proposal
                  </div>
                  <div className="font-mono-label text-xs text-white/30 tracking-widest">
                    PREPARED FOR DR. BOBBY GROSSI
                  </div>
                </div>
              </div>

              <h1 className="font-display text-4xl lg:text-6xl font-black text-white leading-tight fade-slide-up fade-slide-up-delay-1">
                Podcast Management
                <br />
                <span className="gold-gradient-text">Monthly Retainer</span>
              </h1>

              <p className="mt-4 text-white/50 text-base max-w-xl leading-relaxed fade-slide-up fade-slide-up-delay-2">
                Full-service weekly podcast workflow for the{" "}
                <span className="text-yellow-500/80 font-medium">Iron Dentist</span> — from
                Riverside recording to published episode, every single week.
              </p>

              <div className="flex flex-wrap gap-4 mt-6 fade-slide-up fade-slide-up-delay-3">
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <Zap className="w-4 h-4 text-yellow-500/60" />
                  <span>4 episodes/month</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <Clock className="w-4 h-4 text-yellow-500/60" />
                  <span>{totalHoursPerMonth} hrs/month of work handled</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <Star className="w-4 h-4 text-yellow-500/60" />
                  <span>Weekly turnaround</span>
                </div>
              </div>
            </div>

            {/* Right: Banner image */}
            <div className="hidden lg:block w-72 flex-shrink-0 fade-slide-up fade-slide-up-delay-2">
              <img
                src={BANNER_URL}
                alt="Iron Dentist Podcast"
                className="w-full rounded-lg opacity-80 border border-yellow-500/10"
                style={{ boxShadow: "0 0 60px rgba(201,168,76,0.15)" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Left Column: Services ── */}
          <div className="flex-1 min-w-0">

            {/* Core Services */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="diagonal-divider flex-1" />
                <h2 className="font-display text-xl font-bold text-white/90 flex-shrink-0">
                  Core Services
                </h2>
                <div className="diagonal-divider flex-1" />
              </div>

              <p className="text-sm text-white/40 mb-6 leading-relaxed">
                These four services form the complete weekly podcast workflow. Toggle any service
                to customize your quote — all are recommended for a seamless, hands-off experience.
              </p>

              <div className="space-y-3">
                {SERVICES.map((service, i) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    selected={selectedServices.has(service.id)}
                    onToggle={() => toggleService(service.id)}
                    index={i}
                  />
                ))}
              </div>
            </div>

            {/* Add-On Services */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="diagonal-divider flex-1" />
                <h2 className="font-display text-xl font-bold text-white/90 flex-shrink-0">
                  Optional Add-Ons
                </h2>
                <div className="diagonal-divider flex-1" />
              </div>

              <p className="text-sm text-white/40 mb-6 leading-relaxed">
                Extend your reach with these additional services. Add or remove to see the price
                update in real time.
              </p>

              <div className="space-y-3">
                {ADD_ONS.map((addon, i) => (
                  <ServiceCard
                    key={addon.id}
                    service={addon}
                    selected={selectedAddOns.has(addon.id)}
                    onToggle={() => toggleAddOn(addon.id)}
                    index={i}
                  />
                ))}
              </div>
            </div>

            {/* Pricing Philosophy */}
            <div className="rounded-lg border border-yellow-500/10 bg-yellow-500/5 p-6 mb-8">
              <h3 className="font-display text-lg font-bold text-yellow-400/90 mb-3">
                How This Rate Was Determined
              </h3>
              <div className="space-y-2 text-sm text-white/50 leading-relaxed">
                <p>
                  Market rates for podcast management services range from{" "}
                  <span className="text-yellow-500/80">$500–$1,500/month</span> for freelancers
                  handling 4 episodes. This quote reflects a{" "}
                  <span className="text-yellow-500/80">premium independent rate</span> — below
                  agency pricing, above commodity VA rates — appropriate for a professional,
                  brand-consistent service for a recognized podcast like Iron Dentist.
                </p>
                <p>
                  Each service is priced per episode to keep things transparent. At 4 episodes/month,
                  you get a predictable monthly investment with no hidden fees.
                </p>
              </div>
            </div>

            {/* What You Get Summary */}
            <div className="rounded-lg border border-white/8 bg-white/3 p-6">
              <h3 className="font-display text-lg font-bold text-white/80 mb-4">
                What's Always Included
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Weekly turnaround (48-hr SLA)",
                  "Consistent brand voice & formatting",
                  "Monthly performance check-in",
                  "Direct communication via Slack/email",
                  "File organization & archiving",
                  "Platform troubleshooting support",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white/50">
                    <Check className="w-4 h-4 text-yellow-500/60 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Column: Sticky Pricing Panel ── */}
          <div className="lg:w-80 xl:w-96 flex-shrink-0 lg:sticky lg:top-8">
            <div
              className="rounded-xl border border-yellow-500/20 overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #111318 0%, #0D0F14 100%)",
                boxShadow: "0 0 60px rgba(201,168,76,0.08), 0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* Panel Header */}
              <div
                className="px-6 py-5 border-b border-yellow-500/10"
                style={{
                  background: "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, transparent 100%)",
                }}
              >
                <div className="font-mono-label text-xs text-yellow-500/60 tracking-widest uppercase mb-1">
                  Your Quote
                </div>
                <div className="font-display text-4xl font-black gold-gradient-text">
                  $<AnimatedPrice value={monthlyTotal} />
                </div>
                <div className="text-sm text-white/40 font-mono-label mt-1">per month</div>
              </div>

              {/* Breakdown */}
              <div className="px-6 py-4 space-y-2 border-b border-white/5">
                {SERVICES.filter((s) => selectedServices.has(s.id)).map((s) => (
                  <div key={s.id} className="flex justify-between items-center text-sm">
                    <span className="text-white/50 truncate pr-2">{s.title}</span>
                    <span className="text-white/70 font-mono-label flex-shrink-0">
                      ${s.pricePerEpisode * s.episodesPerMonth}
                    </span>
                  </div>
                ))}
                {ADD_ONS.filter((a) => selectedAddOns.has(a.id)).map((a) => (
                  <div key={a.id} className="flex justify-between items-center text-sm">
                    <span className="text-yellow-500/50 truncate pr-2">{a.title}</span>
                    <span className="text-yellow-500/70 font-mono-label flex-shrink-0">
                      ${a.pricePerEpisode * a.episodesPerMonth}
                    </span>
                  </div>
                ))}
                {selectedServices.size === 0 && selectedAddOns.size === 0 && (
                  <div className="text-xs text-white/25 text-center py-2">
                    Select services above to build your quote
                  </div>
                )}
              </div>

              {/* Per-episode breakdown */}
              <div className="px-6 py-4 border-b border-white/5">
                <div className="flex justify-between items-center text-xs text-white/30 font-mono-label mb-2">
                  <span>Per episode</span>
                  <span>${Math.round(monthlyTotal / 4)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-white/30 font-mono-label">
                  <span>Hours managed/month</span>
                  <span>~{totalHoursPerMonth} hrs</span>
                </div>
              </div>

              {/* Annual Option */}
              <div className="px-6 py-4 border-b border-white/5">
                <div className="rounded-lg bg-yellow-500/8 border border-yellow-500/15 p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-mono-label text-yellow-500/70 uppercase tracking-wider mb-1">
                        Annual Plan
                      </div>
                      <div className="font-display text-2xl font-bold text-white/80">
                        $<AnimatedPrice value={annualTotal - annualSavings} />
                        <span className="text-sm font-sans font-normal text-white/30">/yr</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-yellow-500/70 font-mono-label">Save</div>
                      <div className="font-display text-lg font-bold text-yellow-400">
                        $<AnimatedPrice value={annualSavings} />
                      </div>
                      <div className="text-xs text-white/30">(2 months free)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="px-6 py-5 space-y-3">
                {!accepted ? (
                  <>
                    <button
                      onClick={handleAccept}
                      disabled={monthlyTotal === 0}
                      className="gold-shimmer w-full py-3.5 rounded-lg font-display font-bold text-base text-[#0A0A0A] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed gold-pulse"
                      style={{
                        background: monthlyTotal > 0
                          ? "linear-gradient(135deg, #C9A84C 0%, #F0D060 50%, #C9A84C 100%)"
                          : "#555",
                      }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" />
                        Accept This Quote
                      </span>
                    </button>
                    <button
                      className="w-full py-3 rounded-lg border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                      onClick={() => window.print()}
                    >
                      <Download className="w-4 h-4" />
                      Download / Print Quote
                    </button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-3xl mb-2">🏆</div>
                    <div className="font-display text-lg font-bold text-yellow-400 mb-1">
                      Quote Accepted!
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">
                      Thank you, Dr. Bobby! We'll follow up within 24 hours to get started.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-xs text-white/25">
                  <Send className="w-3 h-3" />
                  <span>No commitment until contract signed</span>
                </div>
              </div>
            </div>

            {/* Market Context Card */}
            <div className="mt-4 rounded-lg border border-white/6 bg-white/3 p-4">
              <div className="font-mono-label text-xs text-white/30 uppercase tracking-wider mb-3">
                Market Context
              </div>
              <div className="space-y-2">
                {[
                  { label: "Commodity VA", range: "$300–$500/mo", note: "Basic upload only" },
                  { label: "This Quote", range: `$${monthlyTotal}/mo`, note: "Full workflow", highlight: true },
                  { label: "Agency Rate", range: "$2,000–$3,500/mo", note: "Same services" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className={`flex justify-between items-center text-xs py-1.5 px-2 rounded ${
                      row.highlight
                        ? "bg-yellow-500/8 border border-yellow-500/15"
                        : "border border-transparent"
                    }`}
                  >
                    <div>
                      <span className={row.highlight ? "text-yellow-400 font-medium" : "text-white/40"}>
                        {row.label}
                      </span>
                      <span className="text-white/20 ml-2">{row.note}</span>
                    </div>
                    <span className={row.highlight ? "text-yellow-400 font-mono-label font-bold" : "text-white/30 font-mono-label"}>
                      {row.range}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 mt-8 py-8">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={LOGO_URL}
              alt="Iron Dentist"
              className="w-8 h-8 rounded-full object-cover opacity-60"
            />
            <span className="text-xs text-white/25 font-mono-label">
              Iron Dentist Podcast — Dental CEO Podcast
            </span>
          </div>
          <div className="text-xs text-white/20 font-mono-label">
            Quote valid for 30 days · Rates subject to change
          </div>
        </div>
      </footer>

      {/* ── Print Styles ── */}
      <style>{`
        @media print {
          .lg\\:sticky { position: static !important; }
          button { display: none !important; }
          body { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  );
}
