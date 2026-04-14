/**
 * DESIGN: "Ironclad Proposal" — Dark luxury + athletic performance
 * Colors: Near-black bg, Gold (#C9A84C) accents, Off-white (#F5F0E8) text
 * Fonts: Playfair Display (display/prices), DM Sans (body), DM Mono (labels)
 * Layout: Asymmetric — left content, right sticky pricing panel
 */

import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown, ChevronUp, Download, Send, Star, Clock, Zap, BookOpen, TrendingUp, Sparkles } from "lucide-react";

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
    pricePerEpisode: 75,
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
    pricePerEpisode: 100,
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
    pricePerEpisode: 100,
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
    pricePerEpisode: 100,
    episodesPerMonth: 4,
    icon: "🖼️",
    required: true,
    timeEstimate: "~1.5 hrs/episode",
  },
];

const ADD_ONS = [
  {
    id: "instagram-clips",
    title: "Instagram Video Clips",
    description: "2–3 punchy vertical video clips per episode, cut from your audio/video and formatted for Instagram Reels — ready to post.",
    details: [
      "Pull the most compelling 60–90 second moments from each episode",
      "Format as vertical 9:16 video with branded captions",
      "Add animated waveform or B-roll overlay",
      "Include Iron Dentist logo watermark and episode title",
      "Delivered as MP4 files ready to upload",
    ],
    pricePerEpisode: 100,
    episodesPerMonth: 4,
    icon: "📸",
    timeEstimate: "~2 hrs/episode",
  },
  {
    id: "facebook-clips",
    title: "Facebook Video Clips",
    description: "2–3 square or landscape video clips per episode optimized for Facebook feed and Facebook Reels.",
    details: [
      "Repurpose episode highlights into 1:1 or 16:9 format",
      "Branded lower-thirds with guest name and episode title",
      "Captions burned in for silent autoplay",
      "Optimized for Facebook algorithm with hook-first editing",
      "Delivered as MP4 files ready to upload or schedule",
    ],
    pricePerEpisode: 100,
    episodesPerMonth: 4,
    icon: "📘",
    timeEstimate: "~2 hrs/episode",
  },
  {
    id: "show-notes",
    title: "Written Show Notes / Blog Post",
    description: "Full episode summary written for SEO, posted to website or newsletter.",
    details: [
      "300–500 word episode summary with key takeaways",
      "SEO-optimized title and meta description",
      "Guest bio and relevant links included",
      "Formatted for website or email newsletter",
    ],
    pricePerEpisode: 60,
    episodesPerMonth: 4,
    icon: "📝",
    timeEstimate: "~1 hr/episode",
  },
  {
    id: "transcript",
    title: "Episode Transcript",
    description: "Full verbatim transcript for accessibility, SEO, and repurposing.",
    details: [
      "Accurate word-for-word transcription",
      "Speaker-labeled for readability",
      "Delivered in Google Doc or PDF format",
      "Can be used as the foundation for show notes or ebooks",
    ],
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
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

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
  const annualTotal = monthlyTotal * 10; // 2 months free = pay 10
  const annualSavings = monthlyTotal * 2;

  const displayTotal = billingCycle === "annual" ? annualTotal : monthlyTotal;

  const totalHoursPerMonth = (() => {
    let mins = 0;
    if (selectedServices.has("riverside-pull")) mins += 30 * 4;
    if (selectedServices.has("buzzsprout-upload")) mins += 45 * 4;
    if (selectedServices.has("youtube-upload")) mins += 60 * 4;
    if (selectedServices.has("youtube-thumbnail")) mins += 90 * 4;
    if (selectedAddOns.has("instagram-clips")) mins += 120 * 4;
    if (selectedAddOns.has("facebook-clips")) mins += 120 * 4;
    if (selectedAddOns.has("show-notes")) mins += 60 * 4;
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/60 via-transparent to-transparent" />

        <div className="relative z-10 container pb-12 pt-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-8">
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
                  Grow Your Reach — Add-Ons
                </h2>
                <div className="diagonal-divider flex-1" />
              </div>

              <p className="text-sm text-white/40 mb-6 leading-relaxed">
                Turn every episode into a multi-platform content engine. Each add-on multiplies
                your audience reach without any extra work on your end.
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

            {/* ── Ebook Upsell Banner ── */}
            <div
              className="rounded-xl overflow-hidden mb-8 relative"
              style={{
                background: "linear-gradient(135deg, #0D1117 0%, #141A0F 50%, #0D1117 100%)",
                border: "1px solid rgba(201,168,76,0.25)",
                boxShadow: "0 0 40px rgba(201,168,76,0.06)",
              }}
            >
              {/* Gold accent bar */}
              <div style={{ height: "3px", background: "linear-gradient(90deg, transparent, #C9A84C, #F0D060, #C9A84C, transparent)" }} />

              <div className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  {/* Icon area */}
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))", border: "1px solid rgba(201,168,76,0.2)" }}
                  >
                    <BookOpen className="w-8 h-8 text-yellow-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-mono-label text-xs text-yellow-500/70 tracking-widest uppercase">
                        Premium Upsell
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-mono-label font-bold"
                        style={{ background: "rgba(201,168,76,0.15)", color: "#F0D060", border: "1px solid rgba(201,168,76,0.3)" }}
                      >
                        NEW REVENUE STREAM
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-black text-white mb-3">
                      Turn Your Podcast Into a{" "}
                      <span className="gold-gradient-text">Sellable Ebook</span>
                    </h3>

                    <p className="text-white/55 text-sm leading-relaxed mb-4">
                      Every episode of the Iron Dentist is packed with expert dental business knowledge
                      that your audience is hungry for. We compile your best episodes — transcripts,
                      key insights, and actionable frameworks — into a professionally designed ebook
                      that Dr. Bobby can sell directly on his website and social media platforms.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                      {[
                        { icon: "📖", title: "Quarterly Ebook", desc: "Compiled from 12 episodes per quarter" },
                        { icon: "💰", title: "Sell for $27–$97", desc: "Passive income from existing content" },
                        { icon: "📣", title: "Social-Ready", desc: "Formatted for website, Gumroad & social" },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="rounded-lg p-3"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          <div className="text-xl mb-1">{item.icon}</div>
                          <div className="text-xs font-bold text-white/80 mb-0.5">{item.title}</div>
                          <div className="text-xs text-white/35">{item.desc}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div>
                        <div className="font-mono-label text-xs text-white/30 uppercase tracking-wider mb-1">
                          One-Time Project Rate
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-display text-3xl font-black gold-gradient-text">$1,500</span>
                          <span className="text-white/30 text-sm">–</span>
                          <span className="font-display text-3xl font-black gold-gradient-text">$2,500</span>
                        </div>
                        <div className="text-xs text-white/30 mt-0.5">per ebook (based on length & design complexity)</div>
                      </div>

                      <div
                        className="rounded-lg p-3 text-xs text-yellow-400/80 leading-relaxed"
                        style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.12)" }}
                      >
                        <TrendingUp className="w-3.5 h-3.5 inline mr-1 mb-0.5" />
                        <strong>ROI Example:</strong> Sell 30 copies at $47 = <strong className="text-yellow-400">$1,410 back</strong> in month one alone.
                      </div>
                    </div>
                  </div>
                </div>
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
              {/* Billing Toggle */}
              <div className="px-6 pt-5 pb-4 border-b border-yellow-500/10">
                <div
                  className="flex rounded-lg overflow-hidden border border-white/10 mb-4"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`flex-1 py-2 text-xs font-mono-label font-bold tracking-wider transition-all duration-200 ${
                      billingCycle === "monthly"
                        ? "text-[#0A0A0A]"
                        : "text-white/40 hover:text-white/60"
                    }`}
                    style={billingCycle === "monthly" ? { background: "linear-gradient(135deg, #C9A84C, #F0D060)" } : {}}
                  >
                    MONTHLY
                  </button>
                  <button
                    onClick={() => setBillingCycle("annual")}
                    className={`flex-1 py-2 text-xs font-mono-label font-bold tracking-wider transition-all duration-200 relative ${
                      billingCycle === "annual"
                        ? "text-[#0A0A0A]"
                        : "text-white/40 hover:text-white/60"
                    }`}
                    style={billingCycle === "annual" ? { background: "linear-gradient(135deg, #C9A84C, #F0D060)" } : {}}
                  >
                    ANNUAL
                    {billingCycle !== "annual" && (
                      <span
                        className="absolute -top-2 -right-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                        style={{ background: "#C9A84C", color: "#0A0A0A" }}
                      >
                        SAVE 17%
                      </span>
                    )}
                  </button>
                </div>

                <div className="font-mono-label text-xs text-yellow-500/60 tracking-widest uppercase mb-1">
                  Your Quote
                </div>
                <div className="font-display text-4xl font-black gold-gradient-text">
                  $<AnimatedPrice value={displayTotal} />
                </div>
                <div className="text-sm text-white/40 font-mono-label mt-1">
                  {billingCycle === "annual" ? "billed annually" : "per month"}
                </div>
                {billingCycle === "annual" && (
                  <div className="mt-2 text-xs text-yellow-400/80 font-mono-label">
                    ✦ You save ${annualSavings.toLocaleString()} — 2 months free
                  </div>
                )}
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

              {/* ── Annual Plan Hero Block ── */}
              {billingCycle === "monthly" && monthlyTotal > 0 && (
                <div className="px-6 py-4 border-b border-white/5">
                  <button
                    onClick={() => setBillingCycle("annual")}
                    className="w-full rounded-xl overflow-hidden text-left transition-transform hover:scale-[1.01] active:scale-[0.99]"
                    style={{
                      background: "linear-gradient(135deg, #1A1400 0%, #1F1800 50%, #1A1400 100%)",
                      border: "1px solid rgba(201,168,76,0.35)",
                      boxShadow: "0 0 30px rgba(201,168,76,0.1)",
                    }}
                  >
                    <div style={{ height: "2px", background: "linear-gradient(90deg, #C9A84C, #F0D060, #C9A84C)" }} />
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="font-mono-label text-xs text-yellow-400/80 tracking-widest uppercase font-bold">
                          Best Value — Annual Plan
                        </span>
                      </div>
                      <div className="flex items-end justify-between mb-2">
                        <div>
                          <div className="font-display text-3xl font-black" style={{ color: "#F0D060" }}>
                            ${annualTotal.toLocaleString()}
                          </div>
                          <div className="text-xs text-yellow-500/50 font-mono-label">billed once per year</div>
                        </div>
                        <div className="text-right">
                          <div
                            className="font-display text-xl font-black"
                            style={{ color: "#F0D060" }}
                          >
                            ${annualSavings.toLocaleString()}
                          </div>
                          <div className="text-xs text-yellow-500/50">saved</div>
                        </div>
                      </div>
                      <div className="text-xs text-yellow-400/60 leading-relaxed">
                        Lock in your rate and get 2 months completely free — that's{" "}
                        <strong className="text-yellow-400">${annualSavings.toLocaleString()} back in your pocket.</strong>{" "}
                        Tap to switch.
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {/* CTA */}
              <div className="px-6 py-5 space-y-3">
                {!accepted ? (
                  <>
                    <button
                      onClick={() => setAccepted(true)}
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

            {/* Why Annual Makes Sense */}
            <div
              className="mt-4 rounded-lg p-4"
              style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.1)" }}
            >
              <div className="font-mono-label text-xs text-yellow-500/50 uppercase tracking-wider mb-3">
                Why Annual Wins
              </div>
              <div className="space-y-2">
                {[
                  { icon: "🔒", text: "Locked-in rate — no price increases for 12 months" },
                  { icon: "🎁", text: "2 months free — $3,000 in savings at base rate" },
                  { icon: "🚀", text: "Priority scheduling & faster turnaround" },
                  { icon: "📈", text: "Consistency builds audience — annual commitment = annual growth" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-white/45">
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span>{item.text}</span>
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
