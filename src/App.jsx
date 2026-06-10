import { useState, useEffect, useRef } from "react";


// ════════════════════════════════════════════════════════════════
// Brand Tokens
// ════════════════════════════════════════════════════════════════
const C = {
  navy: "#04071A",
  navyMid: "#0a1230",
  navyLight: "#0d1a40",
  gold: "#F5A623",
  goldBright: "#F8C94C",
  orange: "#F0653C",
  teal: "#2DD4C8",
  white: "#ffffff",
  textMuted: "#8a9dc0",
  textFaint: "#5a6a85",
  border: "rgba(245,166,35,0.12)",
  borderHover: "rgba(245,166,35,0.45)",
};

// ════════════════════════════════════════════════════════════════
// D.Z EGYPT Logo (radar / intelligence monogram)
// ════════════════════════════════════════════════════════════════
function DZLogo({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dzGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F8C94C" />
          <stop offset="100%" stopColor="#E9B422" />
        </linearGradient>
        <linearGradient id="dzOrange" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF8A4C" />
          <stop offset="100%" stopColor="#F0653C" />
        </linearGradient>
        <linearGradient id="dzTeal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2DD4C8" />
          <stop offset="100%" stopColor="#15B8AA" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="200" r="196" fill="#04071A" stroke="#0d1a4d" strokeWidth="2" />
      <circle cx="200" cy="200" r="168" fill="none" stroke="#F5A623" strokeWidth="1" opacity="0.15" />
      <circle cx="200" cy="200" r="140" fill="none" stroke="#F5A623" strokeWidth="1" opacity="0.2" />
      <path d="M 200 200 L 200 32 A 168 168 0 0 1 318.8 81.2 Z" fill="url(#dzGold)" opacity="0.9" />
      <path d="M120 120 L120 280 L172 280 C220 280 252 248 252 200 C252 152 220 120 172 120 Z M152 150 L172 150 C200 150 220 170 220 200 C220 230 200 250 172 250 L152 250 Z" fill="#FFFFFF" />
      <path d="M205 150 L280 150 L280 178 L235 252 L282 252 L282 280 L200 280 L200 250 L246 178 L205 178 Z" fill="url(#dzOrange)" />
      <circle cx="297" cy="103" r="5" fill="#2DD4C8" />
      <circle cx="318" cy="130" r="3.5" fill="#2DD4C8" opacity="0.7" />
      <circle cx="270" cy="88" r="3" fill="#F8C94C" opacity="0.8" />
      <line x1="297" y1="103" x2="318" y2="130" stroke="#2DD4C8" strokeWidth="1.5" opacity="0.5" />
      <line x1="297" y1="103" x2="270" y2="88" stroke="#2DD4C8" strokeWidth="1.5" opacity="0.5" />
      <path d="M 90 280 A 130 130 0 0 0 310 280" fill="none" stroke="url(#dzTeal)" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
      <circle cx="200" cy="200" r="196" fill="none" stroke="#F5A623" strokeWidth="3" opacity="0.6" />
    </svg>
  );
}

// ════════════════════════════════════════════════════════════════
// Animation hooks
// ════════════════════════════════════════════════════════════════
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function useCounter(target, inView, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const num = parseInt(String(target).replace(/\D/g, "")) || 0;
    const start = Date.now();
    const timer = setInterval(() => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * num));
      if (p === 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

function FadeIn({ children, delay = 0, dir = "up", className = "", style = {} }) {
  const [ref, inView] = useInView();
  const transforms = { up: "translateY(40px)", down: "translateY(-40px)", left: "translateX(-40px)", right: "translateX(40px)" };
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : (transforms[dir] || "translateY(40px)"),
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

// ════════════════════════════════════════════════════════════════
// Page header (eyebrow + title + sub) — used across inner pages
// ════════════════════════════════════════════════════════════════
function PageHeader({ eyebrow, title, sub, accent }) {
  return (
    <FadeIn>
      <div style={{ textAlign: "center", marginBottom: 64, maxWidth: 760, margin: "0 auto 64px" }}>
        <span style={{ display: "block", color: C.gold, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>{eyebrow}</span>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1.8rem,4.5vw,3rem)", color: "#fff", margin: 0, lineHeight: 1.2 }}>
          {title}{accent && <span style={{ color: C.gold }}> {accent}</span>}
        </h1>
        {sub && <p style={{ color: C.textMuted, marginTop: 18, lineHeight: 1.7, fontSize: "1rem" }}>{sub}</p>}
      </div>
    </FadeIn>
  );
}

// ════════════════════════════════════════════════════════════════
// Section label (small eyebrow used inline within sections)
// ════════════════════════════════════════════════════════════════
function SectionLabel({ children }) {
  return <span style={{ display: "block", color: C.gold, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>{children}</span>;
}

// ════════════════════════════════════════════════════════════════
// Industry icons (simple line icons, brand-colored)
// ════════════════════════════════════════════════════════════════
function IndustryIcon({ type, size = 32 }) {
  const stroke = C.gold;
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (type) {
    case "hotel":
      return <svg {...common}><path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-5h6v5M9 12h.01M15 12h.01M9 9h.01M15 9h.01"/></svg>;
    case "resort":
      return <svg {...common}><path d="M2 22h20M5 22V11l5-6 5 6v11M14 22v-7h4v7M3 11l2-2M19 11l2-2"/><circle cx="10" cy="6" r="1.5"/></svg>;
    case "camp":
      return <svg {...common}><path d="M3 21h18M12 3l8 18H4L12 3zM12 11l4 10H8l4-10z"/></svg>;
    case "tourism":
      return <svg {...common}><circle cx="12" cy="12" r="10"/><path d="M12 2a14 14 0 0 1 0 20M12 2a14 14 0 0 0 0 20M2 12h20"/></svg>;
    case "construction":
      return <svg {...common}><path d="M3 21h18M5 21V10l4-3 4 3v11M13 21V14l4-3 4 3v7M9 7V3h2v4"/></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="10"/></svg>;
  }
}

// ════════════════════════════════════════════════════════════════
// WhatsApp icon
// ════════════════════════════════════════════════════════════════
function WhatsAppIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.12 1.524 5.857L0 24l6.335-1.51A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.653-.49-5.193-1.349l-.372-.22-3.862.921.999-3.761-.242-.39A9.961 9.961 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
    </svg>
  );
}

// ════════════════════════════════════════════════════════════════
// Card hover wrapper (consistent hover lift across the site)
// ════════════════════════════════════════════════════════════════
function HoverCard({ children, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 8, transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s", cursor: onClick ? "pointer" : "default", ...style }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.35)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >{children}</div>
  );
}

// ════════════════════════════════════════════════════════════════
// Primary / outline buttons
// ════════════════════════════════════════════════════════════════
function PrimaryButton({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{ background: `linear-gradient(135deg,${C.gold},#d4880e)`, border: "none", cursor: "pointer", padding: "14px 36px", borderRadius: 4, fontSize: "0.9rem", fontWeight: 700, color: C.navy, letterSpacing: "0.06em", textTransform: "uppercase", boxShadow: "0 6px 24px rgba(245,166,35,0.35)", transition: "transform 0.2s", ...style }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "none"}
    >{children}</button>
  );
}

function OutlineButton({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{ background: "rgba(245,166,35,0.08)", border: `1px solid ${C.borderHover}`, cursor: "pointer", padding: "14px 36px", borderRadius: 4, fontSize: "0.9rem", fontWeight: 700, color: C.gold, letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.2s", ...style }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,166,35,0.16)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(245,166,35,0.08)"; }}
    >{children}</button>
  );
}


// ════════════════════════════════════════════════════════════════
// D.Z EGYPT — Content (EN / AR)
// ════════════════════════════════════════════════════════════════
const T = {
en: {
  brand: "D.Z EGYPT",
  tagline: "Hospitality Operations, Systems & Intelligence",
  nav: {
    home: "Home", dosi: "DOSI™ Method", services: "Services", products: "Products",
    industries: "Industries", projects: "Projects", insights: "Insights",
    about: "About", contact: "Contact", cta: "Request Consultation",
  },

  // ── Home ──────────────────────────────────────────────────────
  home: {
    hero: {
      eyebrow: "Hospitality Operations, Systems & Intelligence",
      h1: "Transforming Hotels & Tourism Businesses Into",
      h1Accent: "Measurable, Manageable & Scalable Operations.",
      sub: "D.Z EGYPT combines operational expertise, system development, business intelligence, and execution to give hospitality businesses visibility, control, accountability, and sustainable growth.",
      btn1: "Explore DOSI™",
      btn2: "View Projects",
      btn3: "Request Consultation",
    },
    challenges: {
      eyebrow: "The Reality We See",
      title: "Industry Challenges",
      sub: "Most hospitality businesses operate without the visibility they need to grow with confidence.",
      list: [
        { t: "Operations Without Visibility", d: "Owners and managers cannot see what is really happening on the ground in real time." },
        { t: "Decisions Without Data", d: "Strategic choices are made on instinct rather than measurable operational evidence." },
        { t: "Unstructured Processes", d: "Tasks depend on memory and habit rather than documented, repeatable systems." },
        { t: "Asset Uncertainty", d: "No clear record of what assets exist, their condition, or their lifecycle status." },
        { t: "Dependency On Individuals", d: "Critical knowledge lives in people's heads, creating risk when they leave." },
        { t: "Lack Of Accountability", d: "No clear ownership of tasks, outcomes, or performance across departments." },
        { t: "Operational Inefficiencies", d: "Resources, time, and budget are lost to processes that were never designed deliberately." },
      ],
    },
    dosi: {
      eyebrow: "Our Methodology",
      title: "The DOSI™ Method",
      sub: "Dahalianz Operations, Systems & Intelligence — the framework behind every D.Z EGYPT engagement.",
      steps: [
        { letter: "D", t: "Discover", d: "Understand the current reality of the business through assessments, audits, interviews, and field inspections." },
        { letter: "O", t: "Observe", d: "Convert operations into measurable data using analytics, inspections, asset reviews, and intelligence tools." },
        { letter: "S", t: "Structure", d: "Build systems, procedures, workflows, accountability structures, and reporting mechanisms." },
        { letter: "I", t: "Improve", d: "Execute transformation initiatives, optimize performance, align teams, and establish sustainable growth." },
      ],
      cta: "Explore the Full Method",
    },
    industries: {
      eyebrow: "Who We Work With",
      title: "Industries We Serve",
      list: [
        { t: "Hotels", icon: "hotel" },
        { t: "Resorts", icon: "resort" },
        { t: "Camps", icon: "camp" },
        { t: "Tourism Companies", icon: "tourism" },
        { t: "Hospitality Projects Under Development", icon: "construction" },
      ],
    },
    products: {
      eyebrow: "Our Frameworks",
      title: "Products & Frameworks",
      list: [
        { t: "HCIS™", sub: "Hotel Condition Intelligence System", d: "Evaluate, monitor, and analyze hotel conditions through structured inspections and operational intelligence." },
        { t: "Asset Intelligence™", sub: "Asset Tracking & Lifecycle", d: "Asset identification, tracking, condition analysis, and lifecycle management." },
        { t: "Operations Control™", sub: "Visibility & Performance", d: "Operational visibility and performance monitoring platform for ownership and management." },
        { t: "Future Innovations", sub: "Coming Soon", d: "Upcoming D.Z EGYPT frameworks and technologies, built on the DOSI™ foundation." },
      ],
    },
    featuredProjects: {
      eyebrow: "Proven Results",
      title: "Featured Projects",
      list: ["Dahab Now Hotel", "Sunset Dahab Luxury", "Playa Luxury", "Dahalianz Camp"],
    },
    cta: {
      title: "Let's Transform Your Operation",
      sub: "Whether you manage a single property or a portfolio, the DOSI™ Method gives you the visibility and systems to grow with confidence.",
      btn: "Request Consultation",
    },
  },

  // ── DOSI™ Method Page ─────────────────────────────────────────
  dosiPage: {
    eyebrow: "The Methodology",
    title: "What Is DOSI™?",
    intro: "DOSI™ — Dahalianz Operations, Systems & Intelligence — is the structured methodology behind every D.Z EGYPT engagement. It moves a hospitality business from uncertainty to clarity in four deliberate phases, each building on the last.",
    phases: [
      {
        letter: "D", t: "Discover", tag: "Phase 1",
        title: "Understanding reality before making decisions.",
        d: "Before any system can be built or any process improved, we need an honest picture of how the business actually operates today — not how it's assumed to operate. This phase combines on-site assessments, operational audits, stakeholder interviews, and field inspections to build that picture.",
        points: ["On-site operational assessments", "Stakeholder & staff interviews", "Process and workflow audits", "Field inspections across departments"],
      },
      {
        letter: "O", t: "Observe", tag: "Phase 2",
        title: "Turning operations into measurable data.",
        d: "Once we understand the business, we convert what we see into structured, measurable data. This is where our intelligence tools come in — HCIS™ for property condition, asset reviews for lifecycle tracking, and operational analysis for performance benchmarking.",
        points: ["HCIS™ — Hotel Condition Intelligence System", "Asset Reviews & lifecycle tracking", "Operational Analysis & benchmarking", "Data collection frameworks"],
      },
      {
        letter: "S", t: "Structure", tag: "Phase 3",
        title: "Building systems and accountability.",
        d: "With clear data in hand, we design the systems, procedures, and accountability structures the business needs — documented workflows, reporting mechanisms, and operational frameworks that don't depend on any one individual.",
        points: ["Standard operating procedures", "Accountability & ownership structures", "Reporting mechanisms & dashboards", "Operational frameworks by department"],
      },
      {
        letter: "I", t: "Improve", tag: "Phase 4",
        title: "Executing transformation and continuous improvement.",
        d: "Systems on paper mean nothing without execution. We work alongside teams to implement transformation initiatives, optimize day-to-day performance, align departments around shared goals, and establish a rhythm of continuous, sustainable growth.",
        points: ["Transformation initiative execution", "Performance optimization", "Team alignment programs", "Continuous improvement cycles"],
      },
    ],
    outcomes: {
      title: "Expected Outcomes",
      list: ["Visibility", "Control", "Accountability", "Scalability", "Better Decision Making"],
    },
  },

  // ── Services Page ────────────────────────────────────────────
  servicesPage: {
    eyebrow: "What We Do",
    title: "Services",
    sub: "End-to-end services that take a hospitality business from assessment to transformation.",
    list: [
      { t: "Operational Assessment", d: "Operational audits and business evaluations that establish a clear, evidence-based picture of how a property or company currently performs — across departments, processes, and assets." },
      { t: "Operational Transformation", d: "Redesigning operations and workflows from the ground up, removing inefficiencies and replacing ad-hoc habits with deliberate, repeatable processes." },
      { t: "Systems Development", d: "Building the operational systems, procedures, and documentation a business needs to run consistently — regardless of which individuals are on shift." },
      { t: "Performance Intelligence", d: "Dashboards, reporting systems, KPIs, and business intelligence tools that give ownership and management real-time visibility into performance." },
      { t: "Advisory Services", d: "Strategic and operational support for ownership groups navigating growth, repositioning, or new development — grounded in the DOSI™ methodology." },
    ],
  },

  // ── Products Page ─────────────────────────────────────────────
  productsPage: {
    eyebrow: "The DOSI™ Ecosystem",
    title: "Products & Frameworks",
    sub: "Purpose-built tools that bring the Observe phase of DOSI™ to life — and form the foundation for everything that follows.",
    list: [
      {
        t: "HCIS™", sub: "Hotel Condition Intelligence System",
        d: "A platform designed to evaluate, monitor, and analyze hotel conditions through structured inspections and operational intelligence. HCIS™ gives ownership a continuous, evidence-based view of property condition — from rooms and public areas to back-of-house infrastructure.",
        features: ["Structured inspection frameworks", "Condition scoring & trend tracking", "Maintenance prioritization", "Reporting for ownership & management"],
      },
      {
        t: "Asset Intelligence™", sub: "Asset Identification, Tracking & Lifecycle Management",
        d: "Most hospitality businesses have no clear record of what assets they own, their condition, or where they are in their useful life. Asset Intelligence™ creates that record — and keeps it current.",
        features: ["Full asset identification & tagging", "Condition analysis", "Lifecycle & replacement planning", "Asset uncertainty eliminated"],
      },
      {
        t: "Operations Control™", sub: "Operational Visibility & Performance Monitoring",
        d: "A platform that gives ownership and management a real-time view of how the operation is performing — bridging the gap between daily activity on the ground and strategic decision-making at the top.",
        features: ["Real-time operational dashboards", "Performance monitoring across departments", "Decision-support reporting", "Built on DOSI™ data foundations"],
      },
      {
        t: "Future Innovations", sub: "Coming Soon",
        d: "D.Z EGYPT continues to develop new frameworks and technologies under the DOSI™ umbrella, extending the methodology into new areas of hospitality operations and intelligence.",
        features: ["Built on the DOSI™ foundation", "Driven by real project needs", "Announced as they launch"],
      },
    ],
  },

  // ── Industries Page ───────────────────────────────────────────
  industriesPage: {
    eyebrow: "Where We Operate",
    title: "Industries We Serve",
    sub: "D.Z EGYPT works across the full spectrum of hospitality and tourism businesses — wherever operations need structure and intelligence.",
    list: [
      { t: "Hotels", d: "From boutique properties to large-scale hotels, we bring structure and intelligence to every department — front office, housekeeping, F&B, maintenance, and revenue." },
      { t: "Resorts", d: "Multi-facility resort operations require coordination across many moving parts. DOSI™ creates the systems that keep them aligned and accountable." },
      { t: "Camps", d: "Eco-camps and boutique desert properties have unique operational realities. We build systems that fit their scale without losing their character." },
      { t: "Tourism Companies", d: "Tour operators, travel agencies, and tourism businesses gain the same operational clarity and systems thinking applied to their service delivery." },
      { t: "Hospitality Projects Under Development", d: "Pre-opening and development support — building the right systems, structures, and intelligence frameworks before day one of operations." },
    ],
  },

  // ── Projects Page ──────────────────────────────────────────────
  projectsPage: {
    eyebrow: "Our Track Record",
    title: "Projects",
    hospitalityTitle: "Hospitality Projects",
    tourismTitle: "Tourism Business Projects",
    caseLabels: { challenge: "Challenge", approach: "Approach", solution: "Solution", results: "Results" },
    overview: "Project Overview",
    hospitality: [
      {
        n: "Dahab Now Hotel", rooms: "75 Rooms", loc: "Dahab, South Sinai",
        overview: "A 75-room property requiring full operational takeover and a structured approach to revenue and performance.",
        challenge: "Operations relied on individual staff knowledge with no documented procedures, leading to inconsistent guest experience and unpredictable revenue performance.",
        approach: "Applied the DOSI™ Method — beginning with a full Discover-phase audit across departments, followed by Observe-phase data collection on occupancy, rates, and operational condition.",
        solution: "Built standard operating procedures across front office, housekeeping, and F&B, alongside a structured revenue management framework and OTA distribution strategy.",
        results: "Improved occupancy consistency, clearer departmental accountability, and a documented operational framework the team continues to use.",
      },
      {
        n: "Sunset Dahab Luxury", rooms: "40 Rooms", loc: "Dahab, South Sinai",
        overview: "A boutique Red Sea hotel needing a marketing overhaul and structured distribution management.",
        challenge: "Strong property fundamentals were undermined by inconsistent online presence and uncoordinated rate management across booking channels.",
        approach: "Conducted an Observe-phase review of OTA listings, pricing, and digital presence, benchmarked against comparable properties in the area.",
        solution: "Restructured OTA distribution and rate parity, refreshed digital presence, and introduced a consulting framework for ongoing channel management.",
        results: "More consistent rate positioning across channels and a clearer operational picture for ownership going forward.",
      },
      {
        n: "Playa Luxury", rooms: "Boutique Property", loc: "South Sinai",
        overview: "A premium boutique property positioning itself for the next phase of growth.",
        challenge: "As the property scaled, informal processes that worked at a small size began creating inconsistency in guest experience and internal coordination.",
        approach: "Applied Discover and Observe phases to map current processes against the property's growth ambitions.",
        solution: "Designed structured workflows and accountability frameworks suited to the property's premium positioning and next stage of growth.",
        results: "A clearer operational foundation to support consistent guest experience as the property scales.",
      },
      {
        n: "Dahalianz Camp", rooms: "30 Rooms", loc: "Dahab, South Sinai",
        overview: "A premium eco-camp requiring full brand development and an occupancy growth strategy.",
        challenge: "The camp had strong character and guest appeal but lacked the systems and brand clarity needed to convert that appeal into consistent occupancy.",
        approach: "Combined Discover-phase brand and operational review with Observe-phase analysis of occupancy patterns and guest sources.",
        solution: "Full brand development paired with an occupancy growth strategy — aligning the camp's identity with its operational delivery.",
        results: "A unified brand identity and operational approach designed to convert the camp's character into sustained occupancy growth.",
      },
    ],
    tourism: [
      {
        n: "Lions", logo: "blueLion",
        challenge: "A tourism business needed clearer operational structure as it scaled its service offering.",
        approach: "Applied Discover and Structure phases to map current operations and design accountability frameworks.",
        solution: "Documented workflows and reporting structures suited to the business's service model.",
        results: "Clearer internal accountability and a foundation for scaling operations.",
      },
      {
        n: "Socrates", logo: "sokrat",
        challenge: "Sokrat Travel Group needed a structured approach to managing operations across its travel services.",
        approach: "Conducted operational assessment across the business's core service areas.",
        solution: "Built operational frameworks aligned with the DOSI™ methodology.",
        results: "Improved operational structure supporting consistent service delivery.",
      },
      {
        n: "Al Mazina Travel", logo: "mezeina",
        challenge: "El Mezeina Traveling Tours required clearer processes for managing its desert and traveling tour operations.",
        approach: "Applied Discover-phase review of current tour operations and logistics.",
        solution: "Structured operational processes for tour planning, logistics, and guest coordination.",
        results: "More consistent operational delivery across tour offerings.",
      },
    ],
  },

  // ── Insights Page ──────────────────────────────────────────────
  insightsPage: {
    eyebrow: "Knowledge Center",
    title: "Insights",
    sub: "Articles, case studies, and operational insights from the D.Z EGYPT team.",
    comingSoon: "Articles Coming Soon",
    topics: [
      { t: "From Excel To Systems", d: "Why spreadsheets are where operational visibility goes to disappear — and what to build instead." },
      { t: "Hospitality Operational Visibility", d: "What true visibility looks like for hotel owners and managers, and how to achieve it." },
      { t: "Hotel Asset Intelligence", d: "Why most properties don't actually know what they own — and the cost of that uncertainty." },
      { t: "Pre-Opening Readiness", d: "Building the right systems and structures before day one changes everything that follows." },
      { t: "Building Accountability In Hospitality", d: "How structured ownership of tasks and outcomes transforms team performance." },
      { t: "Hospitality Performance Improvement", d: "Practical approaches to improving performance without losing what makes a property special." },
      { t: "Operational Transformation Strategies", d: "Lessons from real transformation projects across hotels, resorts, and camps." },
    ],
  },

  // ── About Page ─────────────────────────────────────────────────
  aboutPage: {
    eyebrow: "Who We Are",
    title: "About D.Z EGYPT",
    intro: "D.Z EGYPT is a Hospitality Operations, Systems & Intelligence Company focused on transforming hotels, resorts, camps, tourism businesses, and hospitality projects into measurable, manageable, and scalable operations.",
    intro2: "We combine operational expertise, system development, business intelligence, and execution to help hospitality businesses gain visibility, control, accountability, and sustainable growth.",
    visionTitle: "Vision",
    vision: "Creating Smarter Hospitality Operations.",
    whyTitle: "Why D.Z EGYPT",
    why: [
      { t: "Operations Expertise", d: "Hands-on experience managing and growing hospitality properties across South Sinai." },
      { t: "Systems Thinking", d: "We build repeatable systems, not one-off fixes — designed to outlast any individual." },
      { t: "Intelligence & Analytics", d: "Our proprietary frameworks turn operational reality into measurable, actionable data." },
      { t: "Real-World Execution", d: "We don't just recommend — we work alongside teams to implement and embed change." },
      { t: "Hospitality Focus", d: "Every framework, system, and product is purpose-built for hotels, resorts, camps, and tourism businesses." },
    ],
    philosophyTitle: "Core Philosophy",
    philosophy: "Transforming hospitality businesses into measurable, manageable, and scalable operations.",
    positioningTitle: "Final Brand Positioning",
    positioning1: "D.Z EGYPT is not a travel company.",
    positioning2: "D.Z EGYPT is a Hospitality Operations, Systems & Intelligence Company that helps hotels and tourism businesses gain visibility, build systems, improve performance, and execute transformation through the DOSI™ Method.",
  },

  // ── Contact Page ───────────────────────────────────────────────
  contactPage: {
    eyebrow: "Get In Touch",
    title: "Request a Consultation",
    sub: "Tell us about your operation and the challenges you're facing — we'll take it from there.",
    fields: {
      name: "Name", company: "Company", position: "Position",
      businessType: "Business Type", challenge: "Current Challenge",
      contactInfo: "Contact Information (Phone or Email)",
    },
    businessTypes: ["Hotel", "Resort", "Camp", "Tourism Company", "Hospitality Project Under Development", "Other"],
    send: "Send Request",
    success: "Thank you — your request has been received. We'll be in touch shortly.",
    methodsTitle: "Other Ways to Reach Us",
    methods: [
      { t: "WhatsApp", d: "Quick questions and direct conversation." },
      { t: "Email", d: "For detailed inquiries and proposals." },
      { t: "LinkedIn", d: "Connect with us professionally." },
    ],
  },

  footer: {
    tagline: "Hospitality Operations, Systems & Intelligence — transforming hotels and tourism businesses through the DOSI™ Method.",
    copy: "© 2025 D.Z EGYPT. All rights reserved.",
    columns: {
      company: "Company",
      method: "Method & Products",
      resources: "Resources",
    },
  },
},

ar: {
  brand: "دي.زد إيجيبت",
  tagline: "عمليات وأنظمة وذكاء الضيافة",
  nav: {
    home: "الرئيسية", dosi: "منهجية DOSI™", services: "الخدمات", products: "المنتجات",
    industries: "القطاعات", projects: "المشاريع", insights: "رؤى",
    about: "من نحن", contact: "تواصل معنا", cta: "اطلب استشارة",
  },

  home: {
    hero: {
      eyebrow: "عمليات وأنظمة وذكاء الضيافة",
      h1: "نحوّل الفنادق وشركات السياحة إلى",
      h1Accent: "عمليات قابلة للقياس والإدارة والتوسع.",
      sub: "تجمع دي.زد إيجيبت بين الخبرة التشغيلية وتطوير الأنظمة وذكاء الأعمال والتنفيذ، لمنح شركات الضيافة الرؤية والتحكم والمساءلة والنمو المستدام.",
      btn1: "اكتشف منهجية DOSI™",
      btn2: "مشاريعنا",
      btn3: "اطلب استشارة",
    },
    challenges: {
      eyebrow: "الواقع الذي نراه",
      title: "تحديات القطاع",
      sub: "معظم شركات الضيافة تعمل بدون الرؤية اللازمة للنمو بثقة.",
      list: [
        { t: "عمليات بدون رؤية", d: "لا يستطيع الملاك والمديرون رؤية ما يحدث فعلياً على الأرض في الوقت الفعلي." },
        { t: "قرارات بدون بيانات", d: "تُتخذ القرارات الاستراتيجية بناءً على الحدس وليس على أدلة تشغيلية قابلة للقياس." },
        { t: "عمليات غير منظمة", d: "تعتمد المهام على الذاكرة والعادة بدلاً من أنظمة موثقة وقابلة للتكرار." },
        { t: "عدم وضوح الأصول", d: "لا يوجد سجل واضح للأصول الموجودة، حالتها، أو مرحلتها في دورة حياتها." },
        { t: "الاعتماد على الأفراد", d: "المعرفة الحرجة موجودة في عقول الأفراد، مما يخلق مخاطرة عند مغادرتهم." },
        { t: "غياب المساءلة", d: "لا توجد ملكية واضحة للمهام أو النتائج أو الأداء عبر الأقسام." },
        { t: "عدم الكفاءة التشغيلية", d: "تُفقد الموارد والوقت والميزانية في عمليات لم تُصمم بشكل مدروس." },
      ],
    },
    dosi: {
      eyebrow: "منهجيتنا",
      title: "منهجية DOSI™",
      sub: "Dahalianz Operations, Systems & Intelligence — الإطار الذي يقف خلف كل مشروع لدي.زد إيجيبت.",
      steps: [
        { letter: "D", t: "اكتشف", d: "فهم الواقع الحالي للعمل من خلال التقييمات والمراجعات والمقابلات والتفتيش الميداني." },
        { letter: "O", t: "راقب", d: "تحويل العمليات إلى بيانات قابلة للقياس باستخدام التحليلات والتفتيش ومراجعات الأصول وأدوات الذكاء التشغيلي." },
        { letter: "S", t: "هيكل", d: "بناء الأنظمة والإجراءات وسير العمل وهياكل المساءلة وآليات التقارير." },
        { letter: "I", t: "حسّن", d: "تنفيذ مبادرات التحول، تحسين الأداء، مواءمة الفرق، وتأسيس نمو مستدام." },
      ],
      cta: "اكتشف المنهجية كاملة",
    },
    industries: {
      eyebrow: "من نعمل معهم",
      title: "القطاعات التي نخدمها",
      list: [
        { t: "الفنادق", icon: "hotel" },
        { t: "المنتجعات", icon: "resort" },
        { t: "المخيمات", icon: "camp" },
        { t: "شركات السياحة", icon: "tourism" },
        { t: "مشاريع الضيافة قيد التطوير", icon: "construction" },
      ],
    },
    products: {
      eyebrow: "أطر عملنا",
      title: "المنتجات والأطر",
      list: [
        { t: "HCIS™", sub: "نظام ذكاء حالة الفندق", d: "تقييم ومراقبة وتحليل حالة الفندق من خلال عمليات تفتيش منظمة وذكاء تشغيلي." },
        { t: "Asset Intelligence™", sub: "تتبع الأصول ودورة الحياة", d: "تحديد الأصول وتتبعها وتحليل حالتها وإدارة دورة حياتها." },
        { t: "Operations Control™", sub: "الرؤية والأداء", d: "منصة رؤية تشغيلية ومراقبة أداء للملاك والإدارة." },
        { t: "ابتكارات قادمة", sub: "قريباً", d: "أطر وتقنيات جديدة من دي.زد إيجيبت، مبنية على أساس DOSI™." },
      ],
    },
    featuredProjects: {
      eyebrow: "نتائج مثبتة",
      title: "المشاريع المميزة",
      list: ["فندق دهب ناو", "صنسيت دهب لاكشري", "بلايا لاكشري", "مخيم داهليانز"],
    },
    cta: {
      title: "لنحوّل عملياتك معاً",
      sub: "سواء كنت تدير عقاراً واحداً أو محفظة عقارات، تمنحك منهجية DOSI™ الرؤية والأنظمة للنمو بثقة.",
      btn: "اطلب استشارة",
    },
  },

  dosiPage: {
    eyebrow: "المنهجية",
    title: "ما هي منهجية DOSI™؟",
    intro: "DOSI™ — Dahalianz Operations, Systems & Intelligence — هي المنهجية المنظمة وراء كل مشروع لدي.زد إيجيبت. تنقل عمل الضيافة من حالة عدم اليقين إلى الوضوح عبر أربع مراحل مدروسة، تبني كل منها على سابقتها.",
    phases: [
      {
        letter: "D", t: "اكتشف", tag: "المرحلة الأولى",
        title: "فهم الواقع قبل اتخاذ القرارات.",
        d: "قبل بناء أي نظام أو تحسين أي عملية، نحتاج لصورة صادقة عن كيفية عمل المنشأة فعلياً اليوم — وليس كيف يُفترض أن تعمل. تجمع هذه المرحلة بين التقييمات الميدانية والمراجعات التشغيلية ومقابلات أصحاب المصلحة والتفتيش الميداني لبناء هذه الصورة.",
        points: ["تقييمات تشغيلية ميدانية", "مقابلات مع أصحاب المصلحة والموظفين", "مراجعة العمليات وسير العمل", "تفتيش ميداني عبر الأقسام"],
      },
      {
        letter: "O", t: "راقب", tag: "المرحلة الثانية",
        title: "تحويل العمليات إلى بيانات قابلة للقياس.",
        d: "بمجرد فهم العمل، نحوّل ما نراه إلى بيانات منظمة وقابلة للقياس. هنا يأتي دور أدوات الذكاء لدينا — HCIS™ لحالة العقار، ومراجعات الأصول لتتبع دورة الحياة، والتحليل التشغيلي لقياس الأداء.",
        points: ["HCIS™ — نظام ذكاء حالة الفندق", "مراجعات الأصول وتتبع دورة الحياة", "التحليل التشغيلي والمقارنة المعيارية", "أطر جمع البيانات"],
      },
      {
        letter: "S", t: "هيكل", tag: "المرحلة الثالثة",
        title: "بناء الأنظمة والمساءلة.",
        d: "مع وجود بيانات واضحة، نصمم الأنظمة والإجراءات وهياكل المساءلة التي يحتاجها العمل — سير عمل موثق، آليات تقارير، وأطر تشغيلية لا تعتمد على أي فرد بعينه.",
        points: ["إجراءات التشغيل القياسية", "هياكل المساءلة والملكية", "آليات التقارير ولوحات المتابعة", "أطر تشغيلية لكل قسم"],
      },
      {
        letter: "I", t: "حسّن", tag: "المرحلة الرابعة",
        title: "تنفيذ التحول والتحسين المستمر.",
        d: "الأنظمة على الورق لا تعني شيئاً بدون تنفيذ. نعمل جنباً إلى جنب مع الفرق لتنفيذ مبادرات التحول، وتحسين الأداء اليومي، ومواءمة الأقسام حول أهداف مشتركة، وتأسيس إيقاع من النمو المستمر والمستدام.",
        points: ["تنفيذ مبادرات التحول", "تحسين الأداء", "برامج مواءمة الفرق", "دورات التحسين المستمر"],
      },
    ],
    outcomes: {
      title: "النتائج المتوقعة",
      list: ["الرؤية", "التحكم", "المساءلة", "قابلية التوسع", "اتخاذ قرارات أفضل"],
    },
  },

  servicesPage: {
    eyebrow: "ما الذي نقدمه",
    title: "الخدمات",
    sub: "خدمات متكاملة تأخذ عمل الضيافة من التقييم إلى التحول الكامل.",
    list: [
      { t: "التقييم التشغيلي", d: "مراجعات تشغيلية وتقييمات أعمال تؤسس صورة واضحة ومبنية على الأدلة لكيفية أداء العقار أو الشركة حالياً — عبر الأقسام والعمليات والأصول." },
      { t: "التحول التشغيلي", d: "إعادة تصميم العمليات وسير العمل من الأساس، وإزالة عدم الكفاءة واستبدال العادات العشوائية بعمليات مدروسة وقابلة للتكرار." },
      { t: "تطوير الأنظمة", d: "بناء الأنظمة والإجراءات والتوثيق التي يحتاجها العمل ليعمل بشكل متسق — بغض النظر عن الأفراد الموجودين في كل وردية." },
      { t: "ذكاء الأداء", d: "لوحات متابعة وأنظمة تقارير ومؤشرات أداء وأدوات ذكاء أعمال تمنح الملاك والإدارة رؤية فورية للأداء." },
      { t: "خدمات استشارية", d: "دعم استراتيجي وتشغيلي لمجموعات الملاك التي تتنقل بين النمو وإعادة التموضع أو التطوير الجديد — بناءً على منهجية DOSI™." },
    ],
  },

  productsPage: {
    eyebrow: "منظومة DOSI™",
    title: "المنتجات والأطر",
    sub: "أدوات مصممة خصيصاً لتفعيل مرحلة \"راقب\" من DOSI™ — وتشكل الأساس لكل ما يليها.",
    list: [
      {
        t: "HCIS™", sub: "نظام ذكاء حالة الفندق",
        d: "منصة مصممة لتقييم ومراقبة وتحليل حالة الفندق من خلال عمليات تفتيش منظمة وذكاء تشغيلي. يمنح HCIS™ الملاك رؤية مستمرة ومبنية على الأدلة لحالة العقار — من الغرف والمناطق العامة إلى البنية التحتية الخلفية.",
        features: ["أطر تفتيش منظمة", "تقييم الحالة وتتبع الاتجاهات", "ترتيب أولويات الصيانة", "تقارير للملاك والإدارة"],
      },
      {
        t: "Asset Intelligence™", sub: "تحديد الأصول وتتبعها وإدارة دورة الحياة",
        d: "معظم شركات الضيافة ليس لديها سجل واضح للأصول التي تملكها، حالتها، أو موقعها في دورة حياتها. يُنشئ Asset Intelligence™ هذا السجل — ويبقيه محدّثاً.",
        features: ["تحديد الأصول وترقيمها بالكامل", "تحليل الحالة", "تخطيط دورة الحياة والاستبدال", "القضاء على عدم اليقين بشأن الأصول"],
      },
      {
        t: "Operations Control™", sub: "الرؤية التشغيلية ومراقبة الأداء",
        d: "منصة تمنح الملاك والإدارة رؤية فورية لأداء العمليات — تربط الفجوة بين النشاط اليومي على الأرض واتخاذ القرار الاستراتيجي في الأعلى.",
        features: ["لوحات متابعة تشغيلية فورية", "مراقبة الأداء عبر الأقسام", "تقارير دعم القرار", "مبني على أساس بيانات DOSI™"],
      },
      {
        t: "ابتكارات قادمة", sub: "قريباً",
        d: "تستمر دي.زد إيجيبت في تطوير أطر وتقنيات جديدة تحت مظلة DOSI™، لتوسيع المنهجية إلى مجالات جديدة من عمليات الضيافة وذكائها.",
        features: ["مبني على أساس DOSI™", "مدفوع باحتياجات المشاريع الفعلية", "يُعلن عنه عند الإطلاق"],
      },
    ],
  },

  industriesPage: {
    eyebrow: "أين نعمل",
    title: "القطاعات التي نخدمها",
    sub: "تعمل دي.زد إيجيبت عبر كامل طيف أعمال الضيافة والسياحة — أينما احتاجت العمليات إلى هيكلة وذكاء.",
    list: [
      { t: "الفنادق", d: "من العقارات البوتيكية إلى الفنادق الكبيرة، نضفي الهيكلة والذكاء على كل قسم — الاستقبال، التدبير المنزلي، الأطعمة والمشروبات، الصيانة، والإيرادات." },
      { t: "المنتجعات", d: "تتطلب عمليات المنتجعات متعددة المرافق تنسيقاً عبر أجزاء متحركة كثيرة. تخلق DOSI™ الأنظمة التي تبقيها متناغمة وخاضعة للمساءلة." },
      { t: "المخيمات", d: "للمخيمات البيئية والعقارات الصحراوية البوتيكية واقع تشغيلي فريد. نبني أنظمة تناسب حجمها دون أن تفقد طابعها." },
      { t: "شركات السياحة", d: "تكتسب شركات السياحة ووكالات السفر نفس الوضوح التشغيلي والتفكير المنهجي المطبق على تقديم خدماتها." },
      { t: "مشاريع الضيافة قيد التطوير", d: "دعم ما قبل الافتتاح والتطوير — بناء الأنظمة والهياكل وأطر الذكاء الصحيحة قبل اليوم الأول من التشغيل." },
    ],
  },

  projectsPage: {
    eyebrow: "سجلنا الحافل",
    title: "المشاريع",
    hospitalityTitle: "مشاريع الضيافة",
    tourismTitle: "مشاريع شركات السياحة",
    caseLabels: { challenge: "التحدي", approach: "النهج", solution: "الحل", results: "النتائج" },
    overview: "نظرة عامة على المشروع",
    hospitality: [
      {
        n: "فندق دهب ناو", rooms: "75 غرفة", loc: "دهب، جنوب سيناء",
        overview: "عقار من 75 غرفة احتاج إلى استلام تشغيلي كامل ونهج منظم للإيرادات والأداء.",
        challenge: "اعتمدت العمليات على معرفة الموظفين الفردية بدون إجراءات موثقة، مما أدى إلى تجربة ضيوف غير متسقة وأداء إيرادات غير متوقع.",
        approach: "تم تطبيق منهجية DOSI™ — بدءاً بمراجعة شاملة في مرحلة الاكتشاف عبر الأقسام، تلتها مرحلة المراقبة لجمع بيانات الإشغال والأسعار والحالة التشغيلية.",
        solution: "بناء إجراءات تشغيل قياسية عبر الاستقبال والتدبير المنزلي والأطعمة والمشروبات، إلى جانب إطار إدارة إيرادات منظم واستراتيجية توزيع عبر منصات الحجز.",
        results: "تحسن في اتساق الإشغال، مساءلة أوضح بين الأقسام، وإطار تشغيلي موثق يستمر الفريق في استخدامه.",
      },
      {
        n: "صنسيت دهب لاكشري", rooms: "40 غرفة", loc: "دهب، جنوب سيناء",
        overview: "فندق بوتيكي على البحر الأحمر احتاج إلى مراجعة تسويقية وإدارة توزيع منظمة.",
        challenge: "كانت أساسيات العقار القوية تتأثر بحضور إلكتروني غير متسق وإدارة أسعار غير منسقة عبر قنوات الحجز.",
        approach: "إجراء مراجعة في مرحلة المراقبة لقوائم منصات الحجز والأسعار والحضور الرقمي، مع مقارنة معيارية بعقارات مماثلة في المنطقة.",
        solution: "إعادة هيكلة توزيع منصات الحجز وتكافؤ الأسعار، تحديث الحضور الرقمي، وتقديم إطار استشاري لإدارة القنوات المستمرة.",
        results: "تموضع أكثر اتساقاً للأسعار عبر القنوات وصورة تشغيلية أوضح للملاك للمستقبل.",
      },
      {
        n: "بلايا لاكشري", rooms: "عقار بوتيكي", loc: "جنوب سيناء",
        overview: "عقار بوتيكي فاخر يهيئ نفسه للمرحلة التالية من النمو.",
        challenge: "مع نمو العقار، بدأت العمليات غير الرسمية التي كانت تعمل في الحجم الصغير في خلق عدم اتساق في تجربة الضيوف والتنسيق الداخلي.",
        approach: "تطبيق مرحلتي الاكتشاف والمراقبة لرسم خريطة العمليات الحالية مقابل طموحات نمو العقار.",
        solution: "تصميم سير عمل منظم وأطر مساءلة تناسب التموضع الفاخر للعقار ومرحلته التالية من النمو.",
        results: "أساس تشغيلي أوضح لدعم تجربة ضيوف متسقة مع نمو العقار.",
      },
      {
        n: "مخيم داهليانز", rooms: "30 غرفة", loc: "دهب، جنوب سيناء",
        overview: "مخيم بيئي فاخر احتاج إلى تطوير علامة تجارية كامل واستراتيجية نمو إشغال.",
        challenge: "كان للمخيم طابع قوي وجاذبية للضيوف لكنه افتقر إلى الأنظمة ووضوح العلامة التجارية اللازمة لتحويل تلك الجاذبية إلى إشغال متسق.",
        approach: "الجمع بين مراجعة العلامة التجارية والعمليات في مرحلة الاكتشاف وتحليل أنماط الإشغال ومصادر الضيوف في مرحلة المراقبة.",
        solution: "تطوير علامة تجارية كامل مقترن باستراتيجية نمو إشغال — مواءمة هوية المخيم مع أدائه التشغيلي.",
        results: "هوية علامة تجارية موحدة ونهج تشغيلي مصمم لتحويل طابع المخيم إلى نمو إشغال مستدام.",
      },
    ],
    tourism: [
      {
        n: "لايونز", logo: "blueLion",
        challenge: "احتاجت شركة سياحية إلى هيكل تشغيلي أوضح مع توسعها في عروض خدماتها.",
        approach: "تطبيق مرحلتي الاكتشاف والهيكلة لرسم خريطة العمليات الحالية وتصميم أطر المساءلة.",
        solution: "توثيق سير العمل وهياكل التقارير المناسبة لنموذج خدمة الشركة.",
        results: "مساءلة داخلية أوضح وأساس لتوسيع العمليات.",
      },
      {
        n: "سقراط", logo: "sokrat",
        challenge: "احتاجت مجموعة سقراط للسفر إلى نهج منظم لإدارة العمليات عبر خدماتها السياحية.",
        approach: "إجراء تقييم تشغيلي عبر مجالات الخدمة الأساسية للشركة.",
        solution: "بناء أطر تشغيلية متوافقة مع منهجية DOSI™.",
        results: "هيكل تشغيلي محسّن يدعم تقديم خدمة متسقة.",
      },
      {
        n: "المزينة ترافل", logo: "mezeina",
        challenge: "احتاجت رحلات المزينة إلى عمليات أوضح لإدارة عمليات الرحلات الصحراوية والسياحية.",
        approach: "تطبيق مراجعة في مرحلة الاكتشاف لعمليات الرحلات الحالية والخدمات اللوجستية.",
        solution: "هيكلة العمليات التشغيلية لتخطيط الرحلات والخدمات اللوجستية وتنسيق الضيوف.",
        results: "تقديم تشغيلي أكثر اتساقاً عبر عروض الرحلات.",
      },
    ],
  },

  insightsPage: {
    eyebrow: "مركز المعرفة",
    title: "رؤى",
    sub: "مقالات ودراسات حالة ورؤى تشغيلية من فريق دي.زد إيجيبت.",
    comingSoon: "المقالات قريباً",
    topics: [
      { t: "من الإكسل إلى الأنظمة", d: "لماذا تختفي الرؤية التشغيلية في جداول البيانات — وما الذي يجب بناؤه بدلاً منها." },
      { t: "الرؤية التشغيلية في الضيافة", d: "كيف تبدو الرؤية الحقيقية لملاك ومديري الفنادق، وكيفية تحقيقها." },
      { t: "ذكاء أصول الفندق", d: "لماذا لا تعرف معظم العقارات فعلياً ما تملكه — وتكلفة عدم اليقين هذا." },
      { t: "جاهزية ما قبل الافتتاح", d: "بناء الأنظمة والهياكل الصحيحة قبل اليوم الأول يغيّر كل ما يليه." },
      { t: "بناء المساءلة في الضيافة", d: "كيف تحوّل الملكية المنظمة للمهام والنتائج أداء الفريق." },
      { t: "تحسين أداء الضيافة", d: "نهج عملية لتحسين الأداء دون فقدان ما يميز العقار." },
      { t: "استراتيجيات التحول التشغيلي", d: "دروس من مشاريع تحول حقيقية عبر الفنادق والمنتجعات والمخيمات." },
    ],
  },

  aboutPage: {
    eyebrow: "من نحن",
    title: "عن دي.زد إيجيبت",
    intro: "دي.زد إيجيبت هي شركة عمليات وأنظمة وذكاء ضيافة تركز على تحويل الفنادق والمنتجعات والمخيمات وشركات السياحة ومشاريع الضيافة إلى عمليات قابلة للقياس والإدارة والتوسع.",
    intro2: "نجمع بين الخبرة التشغيلية وتطوير الأنظمة وذكاء الأعمال والتنفيذ لمساعدة شركات الضيافة على اكتساب الرؤية والتحكم والمساءلة والنمو المستدام.",
    visionTitle: "الرؤية",
    vision: "خلق عمليات ضيافة أكثر ذكاءً.",
    whyTitle: "لماذا دي.زد إيجيبت",
    why: [
      { t: "خبرة تشغيلية", d: "خبرة عملية في إدارة وتنمية عقارات الضيافة عبر جنوب سيناء." },
      { t: "التفكير المنهجي", d: "نبني أنظمة قابلة للتكرار، وليس حلولاً مؤقتة — مصممة لتدوم بعد أي فرد." },
      { t: "الذكاء والتحليلات", d: "تحوّل أطرنا الخاصة الواقع التشغيلي إلى بيانات قابلة للقياس وقابلة للتنفيذ." },
      { t: "تنفيذ على أرض الواقع", d: "لا نكتفي بالتوصية — نعمل جنباً إلى جنب مع الفرق لتنفيذ التغيير وترسيخه." },
      { t: "تركيز على الضيافة", d: "كل إطار ونظام ومنتج مصمم خصيصاً للفنادق والمنتجعات والمخيمات وشركات السياحة." },
    ],
    philosophyTitle: "الفلسفة الأساسية",
    philosophy: "تحويل أعمال الضيافة إلى عمليات قابلة للقياس والإدارة والتوسع.",
    positioningTitle: "التموضع النهائي للعلامة",
    positioning1: "دي.زد إيجيبت ليست شركة سفر.",
    positioning2: "دي.زد إيجيبت هي شركة عمليات وأنظمة وذكاء ضيافة تساعد الفنادق وشركات السياحة على اكتساب الرؤية، وبناء الأنظمة، وتحسين الأداء، وتنفيذ التحول من خلال منهجية DOSI™.",
  },

  contactPage: {
    eyebrow: "تواصل معنا",
    title: "اطلب استشارة",
    sub: "أخبرنا عن عملياتك والتحديات التي تواجهها — وسنتولى الباقي.",
    fields: {
      name: "الاسم", company: "الشركة", position: "المنصب",
      businessType: "نوع العمل", challenge: "التحدي الحالي",
      contactInfo: "معلومات التواصل (هاتف أو بريد إلكتروني)",
    },
    businessTypes: ["فندق", "منتجع", "مخيم", "شركة سياحة", "مشروع ضيافة قيد التطوير", "أخرى"],
    send: "إرسال الطلب",
    success: "شكراً لك — تم استلام طلبك. سنتواصل معك قريباً.",
    methodsTitle: "طرق أخرى للتواصل",
    methods: [
      { t: "واتساب", d: "أسئلة سريعة ومحادثة مباشرة." },
      { t: "البريد الإلكتروني", d: "للاستفسارات والعروض التفصيلية." },
      { t: "لينكدإن", d: "تواصل معنا بشكل احترافي." },
    ],
  },

  footer: {
    tagline: "عمليات وأنظمة وذكاء ضيافة — نحوّل الفنادق وشركات السياحة من خلال منهجية DOSI™.",
    copy: "© 2025 دي.زد إيجيبت. جميع الحقوق محفوظة.",
    columns: {
      company: "الشركة",
      method: "المنهجية والمنتجات",
      resources: "الموارد",
    },
  },
},
};



const NAV_ORDER = ["home", "dosi", "services", "products", "industries", "projects", "insights", "about", "contact"];

function Navbar({ lang, setLang, page, setPage, t }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const el = document.getElementById("app-scroll");
    if (!el) return;
    const fn = () => setScrolled(el.scrollTop > 60);
    el.addEventListener("scroll", fn);
    return () => el.removeEventListener("scroll", fn);
  }, []);

  const goTo = (p) => { setPage(p); setMenuOpen(false); };

  const navStyle = {
    position: "sticky", top: 0, zIndex: 100,
    background: scrolled ? "rgba(4,7,26,0.97)" : "rgba(4,7,26,0.4)",
    backdropFilter: "blur(12px)",
    borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
    transition: "all 0.4s ease", padding: "0 5%",
  };

  return (
    <nav style={navStyle}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 76, maxWidth: 1280, margin: "0 auto" }}>
        {/* Logo */}
        <div onClick={() => goTo("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <DZLogo size={48} />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
            <span style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: "1.05rem", color: "#fff", letterSpacing: "0.04em" }}>{t.brand}</span>
            <span style={{ fontSize: "0.6rem", color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.tagline}</span>
          </div>
        </div>

        {/* Desktop links */}
        <div className="dz-desktop-nav" style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {NAV_ORDER.map(k => (
            <button key={k} onClick={() => goTo(k)} style={{
              background: "none", border: "none", cursor: "pointer", padding: "6px 12px",
              fontSize: "0.76rem", letterSpacing: "0.05em", textTransform: "uppercase",
              color: page === k ? C.gold : "#c8d4e8",
              fontWeight: page === k ? 700 : 400,
              borderBottom: page === k ? `2px solid ${C.gold}` : "2px solid transparent",
              transition: "all 0.25s", whiteSpace: "nowrap",
            }}>{t.nav[k]}</button>
          ))}
          <button onClick={() => goTo("contact")} style={{
            marginLeft: 10, background: `linear-gradient(135deg,${C.gold},#e09010)`, border: "none",
            cursor: "pointer", padding: "9px 18px", borderRadius: 4, fontSize: "0.74rem", fontWeight: 700,
            color: C.navy, letterSpacing: "0.06em", textTransform: "uppercase",
            boxShadow: "0 4px 16px rgba(245,166,35,0.35)", whiteSpace: "nowrap",
          }}>{t.nav.cta}</button>
          <button onClick={() => setLang(lang === "en" ? "ar" : "en")} style={{
            marginLeft: 8, background: "rgba(245,166,35,0.1)", border: `1px solid ${C.borderHover}`,
            cursor: "pointer", padding: "6px 14px", borderRadius: 4, fontSize: "0.74rem", color: C.gold, fontWeight: 600,
          }}>{lang === "en" ? "عربي" : "EN"}</button>
        </div>

        {/* Mobile toggle */}
        <button className="dz-mobile-toggle" onClick={() => setMenuOpen(o => !o)} style={{
          display: "none", background: "none", border: `1px solid ${C.border}`, borderRadius: 4,
          width: 40, height: 40, cursor: "pointer", color: C.gold, fontSize: "1.2rem", alignItems: "center", justifyContent: "center",
        }}>{menuOpen ? "✕" : "☰"}</button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="dz-mobile-menu" style={{ display: "none", flexDirection: "column", paddingBottom: 20, gap: 4 }}>
          {NAV_ORDER.map(k => (
            <button key={k} onClick={() => goTo(k)} style={{
              background: page === k ? "rgba(245,166,35,0.08)" : "none", border: "none", cursor: "pointer",
              padding: "12px 8px", fontSize: "0.85rem", textAlign: lang === "ar" ? "right" : "left",
              color: page === k ? C.gold : "#c8d4e8", fontWeight: page === k ? 700 : 400, borderRadius: 4,
            }}>{t.nav[k]}</button>
          ))}
          <button onClick={() => goTo("contact")} style={{
            marginTop: 8, background: `linear-gradient(135deg,${C.gold},#e09010)`, border: "none",
            cursor: "pointer", padding: "12px", borderRadius: 4, fontSize: "0.8rem", fontWeight: 700,
            color: C.navy, letterSpacing: "0.06em", textTransform: "uppercase",
          }}>{t.nav.cta}</button>
          <button onClick={() => setLang(lang === "en" ? "ar" : "en")} style={{
            marginTop: 4, background: "rgba(245,166,35,0.1)", border: `1px solid ${C.borderHover}`,
            cursor: "pointer", padding: "10px", borderRadius: 4, fontSize: "0.8rem", color: C.gold, fontWeight: 600,
          }}>{lang === "en" ? "العربية" : "English"}</button>
        </div>
      )}

      <style>{`
        @media (max-width: 980px) {
          .dz-desktop-nav { display: none !important; }
          .dz-mobile-toggle { display: flex !important; }
          .dz-mobile-menu { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

function Footer({ t, setPage }) {
  const linkStyle = { background: "none", border: "none", cursor: "pointer", color: C.textMuted, fontSize: "0.85rem", padding: "4px 0", textAlign: "inherit", transition: "color 0.2s" };
  const colTitle = { color: "#fff", fontFamily: "Georgia,serif", fontSize: "0.95rem", marginBottom: 14, letterSpacing: "0.04em" };

  return (
    <footer style={{ background: "#020510", borderTop: `1px solid ${C.border}`, padding: "64px 5% 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }} className="dz-footer-grid">
          {/* Brand col */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <DZLogo size={48} />
              <div>
                <div style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff" }}>{t.brand}</div>
                <div style={{ fontSize: "0.62rem", color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.tagline}</div>
              </div>
            </div>
            <p style={{ color: C.textFaint, fontSize: "0.85rem", maxWidth: 320, lineHeight: 1.7, margin: 0 }}>{t.footer.tagline}</p>
          </div>
          {/* Company */}
          <div>
            <div style={colTitle}>{t.footer.columns.company}</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <button style={linkStyle} onClick={() => setPage("about")}>{t.nav.about}</button>
              <button style={linkStyle} onClick={() => setPage("projects")}>{t.nav.projects}</button>
              <button style={linkStyle} onClick={() => setPage("contact")}>{t.nav.contact}</button>
            </div>
          </div>
          {/* Method & Products */}
          <div>
            <div style={colTitle}>{t.footer.columns.method}</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <button style={linkStyle} onClick={() => setPage("dosi")}>{t.nav.dosi}</button>
              <button style={linkStyle} onClick={() => setPage("products")}>{t.nav.products}</button>
              <button style={linkStyle} onClick={() => setPage("services")}>{t.nav.services}</button>
            </div>
          </div>
          {/* Resources */}
          <div>
            <div style={colTitle}>{t.footer.columns.resources}</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <button style={linkStyle} onClick={() => setPage("industries")}>{t.nav.industries}</button>
              <button style={linkStyle} onClick={() => setPage("insights")}>{t.nav.insights}</button>
            </div>
          </div>
        </div>
        <div style={{ width: "100%", height: 1, background: `linear-gradient(90deg,transparent,${C.border},transparent)`, marginBottom: 24 }} />
        <p style={{ color: "#3a4a60", fontSize: "0.78rem", margin: 0, textAlign: "center" }}>{t.footer.copy}</p>
      </div>
      <style>{`
        @media (max-width: 800px) {
          .dz-footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

function WhatsAppFAB() {
  return (
    <a href="https://wa.me/201000000000" target="_blank" rel="noreferrer" style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 200, width: 56, height: 56, borderRadius: "50%",
      background: "#25d366", display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 4px 20px rgba(37,211,102,0.5)", textDecoration: "none",
    }}>
      <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "2px solid rgba(37,211,102,0.4)", animation: "wa-ring 2s ease-in-out infinite" }} />
      <WhatsAppIcon size={28} color="white" />
      <style>{`@keyframes wa-ring{0%,100%{transform:scale(1);opacity:0.8}50%{transform:scale(1.3);opacity:0}}`}</style>
    </a>
  );
}



// ── Hero ──────────────────────────────────────────────────────────
function Hero({ t, setPage }) {
  return (
    <section style={{ minHeight: "100vh", background: "linear-gradient(160deg, #04071a 0%, #0a1230 50%, #04071a 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "100px 5% 60px" }}>
      {/* Animated radar rings */}
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{ position: "absolute", borderRadius: "50%", border: `1px solid rgba(245,166,35,${0.04 + i * 0.03})`, width: `${380 + i * 180}px`, height: `${380 + i * 180}px`, top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: `pulse-ring ${4 + i * 1.5}s ease-in-out infinite`, animationDelay: `${i * 0.8}s` }} />
      ))}
      {/* Grid overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(245,166,35,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(245,166,35,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div style={{ maxWidth: 920, textAlign: "center", position: "relative", zIndex: 2 }}>
        {/* Logo */}
        <div style={{ marginBottom: 32, display: "inline-block", position: "relative" }}>
          <div style={{ position: "absolute", inset: -10, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,166,35,0.25) 0%, transparent 70%)", animation: "glow-pulse 2.5s ease-in-out infinite" }} />
          <div style={{ position: "relative" }}><DZLogo size={120} /></div>
        </div>

        {/* Eyebrow */}
        <div style={{ marginBottom: 24, opacity: 0, animation: "fade-up 0.8s ease forwards", animationDelay: "0.15s" }}>
          <span style={{ display: "inline-block", background: "rgba(245,166,35,0.1)", border: `1px solid ${C.borderHover}`, color: C.gold, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", padding: "7px 22px", borderRadius: 2 }}>{t.hero.eyebrow}</span>
        </div>

        {/* Headline */}
        <div style={{ opacity: 0, animation: "fade-up 0.8s ease forwards", animationDelay: "0.35s" }}>
          <h1 style={{ fontFamily: "Georgia,serif", fontWeight: 700, margin: "0 0 6px", lineHeight: 1.25, color: "#fff", fontSize: "clamp(1.6rem,4.2vw,2.6rem)" }}>{t.hero.h1}</h1>
        </div>
        <div style={{ opacity: 0, animation: "fade-up 0.8s ease forwards", animationDelay: "0.55s" }}>
          <h1 style={{ fontFamily: "Georgia,serif", fontWeight: 700, margin: "0 0 24px", lineHeight: 1.25, color: C.gold, fontSize: "clamp(1.8rem,5vw,3.1rem)" }}>{t.hero.h1Accent}</h1>
        </div>

        <p style={{ color: C.textMuted, fontSize: "1.05rem", lineHeight: 1.8, maxWidth: 700, margin: "0 auto 40px", opacity: 0, animation: "fade-up 0.8s ease forwards", animationDelay: "0.75s" }}>{t.hero.sub}</p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", opacity: 0, animation: "fade-up 0.8s ease forwards", animationDelay: "0.95s" }}>
          <PrimaryButton onClick={() => setPage("dosi")}>{t.hero.btn1}</PrimaryButton>
          <OutlineButton onClick={() => setPage("projects")}>{t.hero.btn2}</OutlineButton>
          <a href="https://wa.me/201000000000" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.4)", color: "#25d366", padding: "14px 28px", borderRadius: 4, fontSize: "0.9rem", fontWeight: 700, textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            <WhatsAppIcon size={18} />{t.hero.btn3}
          </a>
        </div>

        <div style={{ marginTop: 60, opacity: 0, animation: "fade-up 0.8s ease forwards", animationDelay: "1.2s" }}>
          <div style={{ width: 1, height: 50, background: `linear-gradient(${C.gold},transparent)`, margin: "0 auto", animation: "scroll-line 1.5s ease-in-out infinite" }} />
        </div>
      </div>

      <style>{`
        @keyframes fade-up { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:none} }
        @keyframes pulse-ring { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.5} 50%{transform:translate(-50%,-50%) scale(1.05);opacity:1} }
        @keyframes glow-pulse { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }
        @keyframes scroll-line { 0%{opacity:0;transform:scaleY(0);transform-origin:top} 50%{opacity:1;transform:scaleY(1)} 100%{opacity:0;transform:scaleY(1)} }
      `}</style>
    </section>
  );
}

// ── Industry Challenges ──────────────────────────────────────────
function Challenges({ t }) {
  return (
    <section style={{ padding: "96px 5%", background: "#050b20" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64, maxWidth: 640, margin: "0 auto 64px" }}>
            <SectionLabel>{t.eyebrow}</SectionLabel>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#fff", margin: 0 }}>{t.title}</h2>
            <p style={{ color: C.textMuted, marginTop: 16, lineHeight: 1.7 }}>{t.sub}</p>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 2 }}>
          {t.list.map((item, i) => (
            <FadeIn key={i} delay={i * 0.06}>
              <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid rgba(240,101,60,0.1)`, padding: "28px 24px", height: "100%", boxSizing: "border-box", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(240,101,60,0.04)"; e.currentTarget.style.borderColor = "rgba(240,101,60,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(240,101,60,0.1)"; }}>
                <div style={{ width: 28, height: 2, background: C.orange, marginBottom: 16, borderRadius: 2 }} />
                <h3 style={{ fontFamily: "Georgia,serif", fontSize: "1rem", color: "#fff", margin: "0 0 10px" }}>{item.t}</h3>
                <p style={{ color: C.textMuted, fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>{item.d}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── DOSI Preview (4 phase cards) ─────────────────────────────────
function DosiPreview({ t, setPage }) {
  return (
    <section style={{ padding: "96px 5%", background: "#04071a", position: "relative", overflow: "hidden" }}>
      {/* Connecting line motif */}
      <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${C.border},${C.border},transparent)`, opacity: 0.5 }} className="dz-dosi-line" />
      <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64, maxWidth: 640, margin: "0 auto 64px" }}>
            <SectionLabel>{t.eyebrow}</SectionLabel>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#fff", margin: 0 }}>{t.title}</h2>
            <p style={{ color: C.textMuted, marginTop: 16, lineHeight: 1.7 }}>{t.sub}</p>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24, marginBottom: 48 }}>
          {t.steps.map((s, i) => (
            <FadeIn key={i} delay={i * 0.12}>
              <HoverCard onClick={() => setPage("dosi")} style={{ padding: "36px 28px", textAlign: "center", height: "100%", boxSizing: "border-box", position: "relative" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(245,166,35,0.08)", border: `2px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontFamily: "Georgia,serif", fontSize: "1.5rem", fontWeight: 700, color: C.gold }}>{s.letter}</div>
                <h3 style={{ fontFamily: "Georgia,serif", fontSize: "1.1rem", color: "#fff", margin: "0 0 10px" }}>{s.t}</h3>
                <p style={{ color: C.textMuted, fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>{s.d}</p>
                {i < 3 && <div className="dz-dosi-arrow" style={{ position: "absolute", top: "50%", right: -16, transform: "translateY(-50%)", color: C.gold, fontSize: "1.2rem", zIndex: 2 }}>→</div>}
              </HoverCard>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.3}>
          <div style={{ textAlign: "center" }}>
            <OutlineButton onClick={() => setPage("dosi")}>{t.cta}</OutlineButton>
          </div>
        </FadeIn>
      </div>
      <style>{`
        @media (max-width: 980px) { .dz-dosi-arrow { display: none; } }
      `}</style>
    </section>
  );
}

// ── Industries strip ──────────────────────────────────────────────
function IndustriesStrip({ t, setPage }) {
  return (
    <section style={{ padding: "80px 5%", background: "#050b20", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionLabel>{t.eyebrow}</SectionLabel>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1.5rem,3.5vw,2.2rem)", color: "#fff", margin: 0 }}>{t.title}</h2>
          </div>
        </FadeIn>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {t.list.map((ind, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div onClick={() => setPage("industries")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 50, padding: "14px 26px", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.background = "rgba(245,166,35,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}>
                <IndustryIcon type={ind.icon} size={22} />
                <span style={{ color: "#c8d4e8", fontSize: "0.85rem", fontWeight: 500 }}>{ind.t}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Products preview ─────────────────────────────────────────────
function ProductsPreview({ t, setPage }) {
  return (
    <section style={{ padding: "96px 5%", background: "#04071a" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64, maxWidth: 640, margin: "0 auto 64px" }}>
            <SectionLabel>{t.eyebrow}</SectionLabel>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#fff", margin: 0 }}>{t.title}</h2>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 24 }}>
          {t.list.map((p, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <HoverCard onClick={() => setPage("products")} style={{ padding: "32px 28px", height: "100%", boxSizing: "border-box" }}>
                <div style={{ width: 36, height: 3, background: `linear-gradient(90deg,${C.teal},${C.gold})`, marginBottom: 18, borderRadius: 2 }} />
                <h3 style={{ fontFamily: "Georgia,serif", fontSize: "1.15rem", color: "#fff", margin: "0 0 4px" }}>{p.t}</h3>
                <div style={{ color: C.teal, fontSize: "0.72rem", letterSpacing: "0.06em", marginBottom: 12, textTransform: "uppercase" }}>{p.sub}</div>
                <p style={{ color: C.textMuted, fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>{p.d}</p>
              </HoverCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Featured projects strip ───────────────────────────────────────
function FeaturedProjects({ t, setPage }) {
  return (
    <section style={{ padding: "96px 5%", background: "#050b20" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <SectionLabel>{t.eyebrow}</SectionLabel>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#fff", margin: 0 }}>{t.title}</h2>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
          {t.list.map((name, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <HoverCard onClick={() => setPage("projects")} style={{ padding: "40px 24px", textAlign: "center" }}>
                <div style={{ fontFamily: "Georgia,serif", fontSize: "2.4rem", color: "rgba(245,166,35,0.18)", fontWeight: 700, marginBottom: 12 }}>0{i + 1}</div>
                <h3 style={{ fontFamily: "Georgia,serif", fontSize: "1.05rem", color: "#fff", margin: 0 }}>{name}</h3>
              </HoverCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA banner ─────────────────────────────────────────────────────
function CTABanner({ t, setPage }) {
  return (
    <section style={{ padding: "100px 5%", background: "linear-gradient(135deg,#0a1230,#04071a)", textAlign: "center", position: "relative", overflow: "hidden", borderTop: `1px solid ${C.border}` }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)" }} />
      <FadeIn>
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <div style={{ width: 60, height: 1, background: C.gold, margin: "0 auto 28px" }} />
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1.8rem,4.5vw,2.8rem)", color: "#fff", margin: "0 0 18px" }}>{t.title}</h2>
          <p style={{ color: C.textMuted, lineHeight: 1.8, marginBottom: 36 }}>{t.sub}</p>
          <PrimaryButton onClick={() => setPage("contact")}>{t.btn}</PrimaryButton>
          <div style={{ width: 60, height: 1, background: C.gold, margin: "28px auto 0" }} />
        </div>
      </FadeIn>
    </section>
  );
}



function DosiPage({ t }) {
  return (
    <div style={{ background: "#04071a" }}>
      {/* Header */}
      <section style={{ padding: "140px 5% 80px", background: "linear-gradient(160deg,#04071a 0%,#0a1230 100%)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <PageHeader eyebrow={t.eyebrow} title={t.title} />
          <FadeIn delay={0.15}>
            <p style={{ color: C.textMuted, lineHeight: 1.9, fontSize: "1.05rem", textAlign: "center" }}>{t.intro}</p>
          </FadeIn>
        </div>
      </section>

      {/* Phases */}
      {t.phases.map((phase, i) => (
        <section key={i} style={{ padding: "80px 5%", background: i % 2 === 0 ? "#050b20" : "#04071a", borderTop: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: i % 2 === 0 ? "1fr 1.4fr" : "1.4fr 1fr", gap: 48, alignItems: "center" }} className="dz-dosi-phase">
              {/* Letter / visual side */}
              <FadeIn dir={i % 2 === 0 ? "left" : "right"} className={i % 2 === 0 ? "" : "dz-order-2"}>
                <div style={{ textAlign: "center", position: "relative" }}>
                  <div style={{ width: 180, height: 180, borderRadius: "50%", border: `2px solid ${C.gold}`, background: "rgba(245,166,35,0.04)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", position: "relative" }}>
                    <div style={{ position: "absolute", inset: -16, borderRadius: "50%", border: `1px solid ${C.border}` }} />
                    <span style={{ fontFamily: "Georgia,serif", fontSize: "5rem", fontWeight: 700, color: C.gold }}>{phase.letter}</span>
                  </div>
                  <div style={{ marginTop: 20, color: C.teal, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700 }}>{phase.tag}</div>
                </div>
              </FadeIn>
              {/* Content side */}
              <FadeIn dir={i % 2 === 0 ? "right" : "left"} delay={0.1}>
                <div>
                  <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1.5rem,3.5vw,2.2rem)", color: "#fff", margin: "0 0 4px" }}>{phase.t}</h2>
                  <h3 style={{ fontFamily: "Georgia,serif", fontSize: "1.1rem", color: C.gold, margin: "0 0 18px", fontWeight: 400, fontStyle: "italic" }}>{phase.title}</h3>
                  <p style={{ color: C.textMuted, lineHeight: 1.8, marginBottom: 24 }}>{phase.d}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
                    {phase.points.map((pt, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, marginTop: 7, flexShrink: 0 }} />
                        <span style={{ color: "#c8d4e8", fontSize: "0.85rem", lineHeight: 1.6 }}>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      ))}

      {/* Outcomes */}
      <section style={{ padding: "96px 5%", background: "linear-gradient(135deg,#0a1230,#04071a)", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <SectionLabel>{t.outcomes.title}</SectionLabel>
          </FadeIn>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
            {t.outcomes.list.map((o, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div style={{ background: "rgba(245,166,35,0.06)", border: `1px solid ${C.borderHover}`, borderRadius: 50, padding: "14px 32px", color: C.gold, fontFamily: "Georgia,serif", fontSize: "1rem" }}>{o}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .dz-dosi-phase { grid-template-columns: 1fr !important; }
          .dz-order-2 { order: 2; }
        }
      `}</style>
    </div>
  );
}



// ════════════════════════════════════════════════════════════════
// Services Page
// ════════════════════════════════════════════════════════════════
function ServicesPage({ t }) {
  return (
    <div style={{ background: "#04071a" }}>
      <section style={{ padding: "140px 5% 96px", background: "linear-gradient(160deg,#04071a 0%,#0a1230 100%)" }}>
        <PageHeader eyebrow={t.eyebrow} title={t.title} sub={t.sub} />
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexDirection: "column", gap: 2 }}>
          {t.list.map((s, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 28, alignItems: "flex-start", background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, padding: "32px 32px", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,166,35,0.04)"; e.currentTarget.style.borderColor = C.borderHover; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = C.border; }}>
                <div style={{ fontFamily: "Georgia,serif", fontSize: "2.4rem", fontWeight: 700, color: "rgba(245,166,35,0.2)", lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <h3 style={{ fontFamily: "Georgia,serif", fontSize: "1.3rem", color: "#fff", margin: "0 0 10px" }}>{s.t}</h3>
                  <p style={{ color: C.textMuted, lineHeight: 1.8, margin: 0, maxWidth: 700 }}>{s.d}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Products Page
// ════════════════════════════════════════════════════════════════
function ProductsPage({ t }) {
  return (
    <div style={{ background: "#04071a" }}>
      <section style={{ padding: "140px 5% 96px", background: "linear-gradient(160deg,#04071a 0%,#0a1230 100%)" }}>
        <PageHeader eyebrow={t.eyebrow} title={t.title} sub={t.sub} />
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
          {t.list.map((p, i) => (
            <FadeIn key={i} delay={i * 0.1} dir={i % 2 === 0 ? "left" : "right"}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1.4fr" }} className="dz-product-card">
                {/* Visual side */}
                <div style={{ background: "linear-gradient(135deg,#0d1a40,#1a2d60)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 30%, rgba(245,166,35,0.12) 0%, transparent 50%)" }} />
                  <div style={{ width: 80, height: 80, borderRadius: "50%", border: `2px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, position: "relative" }}>
                    <div style={{ width: 40, height: 3, background: `linear-gradient(90deg,${C.teal},${C.gold})`, borderRadius: 2 }} />
                  </div>
                  <h3 style={{ fontFamily: "Georgia,serif", fontSize: "1.6rem", color: "#fff", margin: "0 0 6px", textAlign: "center", position: "relative" }}>{p.t}</h3>
                  <div style={{ color: C.teal, fontSize: "0.78rem", letterSpacing: "0.06em", textAlign: "center", textTransform: "uppercase", position: "relative" }}>{p.sub}</div>
                </div>
                {/* Content side */}
                <div style={{ padding: "36px 36px" }}>
                  <p style={{ color: C.textMuted, lineHeight: 1.8, marginBottom: 22 }}>{p.d}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
                    {p.features.map((f, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, marginTop: 7, flexShrink: 0 }} />
                        <span style={{ color: "#c8d4e8", fontSize: "0.85rem", lineHeight: 1.6 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
      <style>{`
        @media (max-width: 800px) {
          .dz-product-card { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Industries Page
// ════════════════════════════════════════════════════════════════
function IndustriesPage({ t }) {
  return (
    <div style={{ background: "#04071a" }}>
      <section style={{ padding: "140px 5% 96px", background: "linear-gradient(160deg,#04071a 0%,#0a1230 100%)" }}>
        <PageHeader eyebrow={t.eyebrow} title={t.title} sub={t.sub} />
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
          {t.list.map((ind, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <HoverCard style={{ padding: "36px 28px", height: "100%", boxSizing: "border-box" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(245,166,35,0.06)", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <IndustryIcon type={ind.icon || ["hotel","resort","camp","tourism","construction"][i]} size={26} />
                </div>
                <h3 style={{ fontFamily: "Georgia,serif", fontSize: "1.15rem", color: "#fff", margin: "0 0 12px" }}>{ind.t}</h3>
                <p style={{ color: C.textMuted, fontSize: "0.88rem", lineHeight: 1.8, margin: 0 }}>{ind.d}</p>
              </HoverCard>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}



// Partner logo placeholders - filled in at build time with base64 data
const PARTNER_LOGOS = {
  sokrat: "data:image/jpeg;base64,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",
  mezeina: "data:image/jpeg;base64,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",
  blueLion: "data:image/jpeg;base64,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",
};

const PARTNER_BG = { sokrat: "#3b1f08", mezeina: "#f5f0e8", blueLion: "#e8f0ff" };

function CaseLabel({ children, color = C.gold }) {
  return <span style={{ display: "inline-block", color, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6 }}>{children}</span>;
}

// ── Hospitality project card (expandable case study) ──────────────
function HospitalityCard({ p, t, lang, delay }) {
  const [open, setOpen] = useState(false);
  return (
    <FadeIn delay={delay}>
      <HoverCard style={{ overflow: "hidden" }}>
        <div onClick={() => setOpen(o => !o)} style={{ padding: "28px 28px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ fontFamily: "Georgia,serif", fontSize: "1.25rem", color: "#fff", margin: "0 0 6px" }}>{p.n}</h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <span style={{ background: "rgba(245,166,35,0.1)", border: `1px solid ${C.border}`, color: C.gold, fontSize: "0.7rem", fontWeight: 700, padding: "3px 12px", borderRadius: 2, letterSpacing: "0.06em" }}>{p.rooms}</span>
              <span style={{ color: C.teal, fontSize: "0.78rem", letterSpacing: "0.04em", alignSelf: "center" }}>{p.loc}</span>
            </div>
          </div>
          <div style={{ color: C.gold, fontSize: "1.4rem", transform: open ? "rotate(45deg)" : "none", transition: "transform 0.3s" }}>+</div>
        </div>
        <div style={{ maxHeight: open ? 1200 : 0, overflow: "hidden", transition: "max-height 0.5s ease" }}>
          <div style={{ padding: "0 28px 32px" }}>
            <div style={{ height: 1, background: C.border, marginBottom: 24 }} />
            <CaseLabel color={C.teal}>{t.overview}</CaseLabel>
            <p style={{ color: C.textMuted, lineHeight: 1.8, marginBottom: 20, fontSize: "0.9rem" }}>{p.overview}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
              <div>
                <CaseLabel color={C.orange}>{t.caseLabels.challenge}</CaseLabel>
                <p style={{ color: "#c8d4e8", lineHeight: 1.7, fontSize: "0.85rem", margin: 0 }}>{p.challenge}</p>
              </div>
              <div>
                <CaseLabel color={C.gold}>{t.caseLabels.approach}</CaseLabel>
                <p style={{ color: "#c8d4e8", lineHeight: 1.7, fontSize: "0.85rem", margin: 0 }}>{p.approach}</p>
              </div>
              <div>
                <CaseLabel color={C.goldBright}>{t.caseLabels.solution}</CaseLabel>
                <p style={{ color: "#c8d4e8", lineHeight: 1.7, fontSize: "0.85rem", margin: 0 }}>{p.solution}</p>
              </div>
              <div>
                <CaseLabel color={C.teal}>{t.caseLabels.results}</CaseLabel>
                <p style={{ color: "#c8d4e8", lineHeight: 1.7, fontSize: "0.85rem", margin: 0 }}>{p.results}</p>
              </div>
            </div>
          </div>
        </div>
      </HoverCard>
    </FadeIn>
  );
}

// ── Tourism business project card ──────────────────────────────────
function TourismCard({ p, t, delay }) {
  const [open, setOpen] = useState(false);
  const logo = PARTNER_LOGOS[p.logo];
  return (
    <FadeIn delay={delay}>
      <HoverCard style={{ overflow: "hidden" }}>
        <div onClick={() => setOpen(o => !o)} style={{ padding: "24px 28px", cursor: "pointer", display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", overflow: "hidden", background: PARTNER_BG[p.logo] || "#222", border: `2px solid ${C.border}`, flexShrink: 0 }}>
            <img src={logo} alt={p.n} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <h3 style={{ fontFamily: "Georgia,serif", fontSize: "1.1rem", color: "#fff", margin: 0, flex: 1 }}>{p.n}</h3>
          <div style={{ color: C.gold, fontSize: "1.4rem", transform: open ? "rotate(45deg)" : "none", transition: "transform 0.3s" }}>+</div>
        </div>
        <div style={{ maxHeight: open ? 800 : 0, overflow: "hidden", transition: "max-height 0.5s ease" }}>
          <div style={{ padding: "0 28px 28px" }}>
            <div style={{ height: 1, background: C.border, marginBottom: 20 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 18 }}>
              <div>
                <CaseLabel color={C.orange}>{t.caseLabels.challenge}</CaseLabel>
                <p style={{ color: "#c8d4e8", lineHeight: 1.7, fontSize: "0.85rem", margin: 0 }}>{p.challenge}</p>
              </div>
              <div>
                <CaseLabel color={C.gold}>{t.caseLabels.approach}</CaseLabel>
                <p style={{ color: "#c8d4e8", lineHeight: 1.7, fontSize: "0.85rem", margin: 0 }}>{p.approach}</p>
              </div>
              <div>
                <CaseLabel color={C.goldBright}>{t.caseLabels.solution}</CaseLabel>
                <p style={{ color: "#c8d4e8", lineHeight: 1.7, fontSize: "0.85rem", margin: 0 }}>{p.solution}</p>
              </div>
              <div>
                <CaseLabel color={C.teal}>{t.caseLabels.results}</CaseLabel>
                <p style={{ color: "#c8d4e8", lineHeight: 1.7, fontSize: "0.85rem", margin: 0 }}>{p.results}</p>
              </div>
            </div>
          </div>
        </div>
      </HoverCard>
    </FadeIn>
  );
}

// ════════════════════════════════════════════════════════════════
// Projects Page
// ════════════════════════════════════════════════════════════════
function ProjectsPage({ t, lang }) {
  return (
    <div style={{ background: "#04071a" }}>
      <section style={{ padding: "140px 5% 60px", background: "linear-gradient(160deg,#04071a 0%,#0a1230 100%)" }}>
        <PageHeader eyebrow={t.eyebrow} title={t.title} />
      </section>

      {/* Hospitality projects */}
      <section style={{ padding: "0 5% 96px", background: "linear-gradient(160deg,#04071a 0%,#0a1230 100%)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "1.6rem", color: "#fff", marginBottom: 28, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>{t.hospitalityTitle}</h2>
          </FadeIn>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {t.hospitality.map((p, i) => (
              <HospitalityCard key={i} p={p} t={t} lang={lang} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* Tourism business projects */}
      <section style={{ padding: "0 5% 100px", background: "linear-gradient(160deg,#04071a 0%,#0a1230 100%)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "1.6rem", color: "#fff", marginBottom: 28, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>{t.tourismTitle}</h2>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16, alignItems: "start" }}>
            {t.tourism.map((p, i) => (
              <TourismCard key={i} p={p} t={t} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}



// ════════════════════════════════════════════════════════════════
// Insights Page
// ════════════════════════════════════════════════════════════════
function InsightsPage({ t }) {
  return (
    <div style={{ background: "#04071a" }}>
      <section style={{ padding: "140px 5% 96px", background: "linear-gradient(160deg,#04071a 0%,#0a1230 100%)" }}>
        <PageHeader eyebrow={t.eyebrow} title={t.title} sub={t.sub} />
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <span style={{ display: "inline-block", background: "rgba(245,166,35,0.08)", border: `1px solid ${C.border}`, color: C.gold, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", padding: "8px 22px", borderRadius: 50 }}>{t.comingSoon}</span>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {t.topics.map((topic, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <HoverCard style={{ padding: "28px 26px", height: "100%", boxSizing: "border-box", opacity: 0.85 }}>
                  <div style={{ width: 32, height: 2, background: `linear-gradient(90deg,${C.teal},${C.gold})`, marginBottom: 16, borderRadius: 2 }} />
                  <h3 style={{ fontFamily: "Georgia,serif", fontSize: "1.05rem", color: "#fff", margin: "0 0 10px" }}>{topic.t}</h3>
                  <p style={{ color: C.textMuted, fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>{topic.d}</p>
                </HoverCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// About Page
// ════════════════════════════════════════════════════════════════
function AboutPage({ t }) {
  return (
    <div style={{ background: "#04071a" }}>
      {/* Intro */}
      <section style={{ padding: "140px 5% 80px", background: "linear-gradient(160deg,#04071a 0%,#0a1230 100%)", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ display: "inline-block", marginBottom: 24 }}><DZLogo size={88} /></div>
          </FadeIn>
          <PageHeader eyebrow={t.eyebrow} title={t.title} />
          <FadeIn delay={0.15}>
            <p style={{ color: C.textMuted, lineHeight: 1.9, fontSize: "1.05rem", marginBottom: 18 }}>{t.intro}</p>
            <p style={{ color: C.textMuted, lineHeight: 1.9, fontSize: "1.05rem" }}>{t.intro2}</p>
          </FadeIn>
        </div>
      </section>

      {/* Vision */}
      <section style={{ padding: "80px 5%", background: "#050b20", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, textAlign: "center" }}>
        <FadeIn>
          <SectionLabel>{t.visionTitle}</SectionLabel>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1.6rem,4vw,2.4rem)", color: C.gold, margin: 0, fontStyle: "italic" }}>{t.vision}</h2>
        </FadeIn>
      </section>

      {/* Why D.Z EGYPT */}
      <section style={{ padding: "96px 5%", background: "#04071a" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1.6rem,4vw,2.4rem)", color: "#fff", margin: 0 }}>{t.whyTitle}</h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
            {t.why.map((w, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <HoverCard style={{ padding: "30px 24px", height: "100%", boxSizing: "border-box" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, fontFamily: "Georgia,serif", color: C.gold, fontWeight: 700 }}>{i + 1}</div>
                  <h3 style={{ fontFamily: "Georgia,serif", fontSize: "1.05rem", color: "#fff", margin: "0 0 10px" }}>{w.t}</h3>
                  <p style={{ color: C.textMuted, fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>{w.d}</p>
                </HoverCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Core philosophy */}
      <section style={{ padding: "80px 5%", background: "#050b20", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
        <FadeIn>
          <SectionLabel>{t.philosophyTitle}</SectionLabel>
          <p style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1.3rem,3vw,1.8rem)", color: "#fff", maxWidth: 700, margin: "0 auto", lineHeight: 1.6 }}>{t.philosophy}</p>
        </FadeIn>
      </section>

      {/* Final positioning */}
      <section style={{ padding: "100px 5%", background: "linear-gradient(135deg,#0a1230,#04071a)", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
        <FadeIn>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <SectionLabel>{t.positioningTitle}</SectionLabel>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "1.3rem", color: C.orange, marginBottom: 20, fontStyle: "italic" }}>{t.positioning1}</p>
            <p style={{ color: C.textMuted, lineHeight: 1.9, fontSize: "1.05rem" }}>{t.positioning2}</p>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Contact Page
// ════════════════════════════════════════════════════════════════
function ContactPage({ t, lang }) {
  const [form, setForm] = useState({ name: "", company: "", position: "", businessType: "", challenge: "", contactInfo: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1300);
  };

  const inputStyle = { background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 4, padding: "12px 16px", color: "#fff", fontSize: "0.9rem", width: "100%", boxSizing: "border-box", outline: "none", fontFamily: "inherit" };

  const methodIcons = {
    WhatsApp: <WhatsAppIcon size={22} color={C.gold} />,
    "البريد الإلكتروني": <span style={{ fontSize: "1.3rem" }}>✉</span>,
    Email: <span style={{ fontSize: "1.3rem" }}>✉</span>,
    LinkedIn: <span style={{ fontSize: "1.2rem", fontWeight: 700, fontFamily: "Georgia,serif" }}>in</span>,
    "لينكدإن": <span style={{ fontSize: "1.2rem", fontWeight: 700, fontFamily: "Georgia,serif" }}>in</span>,
    "واتساب": <WhatsAppIcon size={22} color={C.gold} />,
  };

  return (
    <div style={{ background: "#04071a" }}>
      <section style={{ padding: "140px 5% 100px", background: "linear-gradient(160deg,#04071a 0%,#0a1230 100%)" }}>
        <PageHeader eyebrow={t.eyebrow} title={t.title} sub={t.sub} />

        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40 }} className="dz-contact-grid">
          {/* Form */}
          <FadeIn dir="left">
            {sent ? (
              <div style={{ textAlign: "center", background: "rgba(245,166,35,0.06)", border: `1px solid ${C.borderHover}`, borderRadius: 8, padding: "56px 32px" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 16, color: C.gold }}>✓</div>
                <p style={{ color: C.gold, fontSize: "1.1rem", fontFamily: "Georgia,serif", margin: 0 }}>{t.success}</p>
              </div>
            ) : (
              <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "36px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="dz-form-grid">
                  <input style={inputStyle} placeholder={t.fields.name} value={form.name} onChange={e => handle("name", e.target.value)} />
                  <input style={inputStyle} placeholder={t.fields.company} value={form.company} onChange={e => handle("company", e.target.value)} />
                  <input style={inputStyle} placeholder={t.fields.position} value={form.position} onChange={e => handle("position", e.target.value)} />
                  <select style={{ ...inputStyle, color: form.businessType ? "#fff" : "#8a9dc0" }} value={form.businessType} onChange={e => handle("businessType", e.target.value)}>
                    <option value="" disabled>{t.fields.businessType}</option>
                    {t.businessTypes.map(bt => <option key={bt} value={bt} style={{ color: "#000" }}>{bt}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <textarea rows={4} style={{ ...inputStyle, resize: "vertical" }} placeholder={t.fields.challenge} value={form.challenge} onChange={e => handle("challenge", e.target.value)} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <input style={inputStyle} placeholder={t.fields.contactInfo} value={form.contactInfo} onChange={e => handle("contactInfo", e.target.value)} />
                </div>
                <button onClick={submit} disabled={loading} style={{ width: "100%", background: `linear-gradient(135deg,${C.gold},#d4880e)`, border: "none", cursor: "pointer", padding: "15px", borderRadius: 4, fontSize: "0.9rem", fontWeight: 700, color: C.navy, letterSpacing: "0.08em", textTransform: "uppercase", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "..." : t.send}
                </button>
              </div>
            )}
          </FadeIn>

          {/* Other contact methods */}
          <FadeIn dir="right" delay={0.15}>
            <div>
              <h3 style={{ fontFamily: "Georgia,serif", fontSize: "1.1rem", color: "#fff", marginBottom: 20 }}>{t.methodsTitle}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {t.methods.map((m, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(245,166,35,0.08)", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: C.gold }}>
                      {methodIcons[m.t] || <span style={{ fontSize: "1.2rem" }}>•</span>}
                    </div>
                    <div>
                      <div style={{ color: "#fff", fontFamily: "Georgia,serif", fontSize: "1rem", marginBottom: 2 }}>{m.t}</div>
                      <div style={{ color: C.textMuted, fontSize: "0.8rem" }}>{m.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <style>{`
        @media (max-width: 800px) {
          .dz-contact-grid { grid-template-columns: 1fr !important; }
          .dz-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}



// ════════════════════════════════════════════════════════════════
// App
// ════════════════════════════════════════════════════════════════
export default function App() {
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState("home");
  const t = T[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const el = document.getElementById("app-scroll");
    if (el) el.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case "dosi":
        return <DosiPage t={t.dosiPage} />;
      case "services":
        return <ServicesPage t={t.servicesPage} />;
      case "products":
        return <ProductsPage t={t.productsPage} />;
      case "industries":
        return <IndustriesPage t={t.industriesPage} />;
      case "projects":
        return <ProjectsPage t={t.projectsPage} lang={lang} />;
      case "insights":
        return <InsightsPage t={t.insightsPage} />;
      case "about":
        return <AboutPage t={t.aboutPage} />;
      case "contact":
        return <ContactPage t={t.contactPage} lang={lang} />;
      default:
        return (
          <>
            <Hero t={t.home} setPage={setPage} />
            <Challenges t={t.home.challenges} />
            <DosiPreview t={t.home.dosi} setPage={setPage} />
            <IndustriesStrip t={t.home.industries} setPage={setPage} />
            <ProductsPreview t={t.home.products} setPage={setPage} />
            <FeaturedProjects t={t.home.featuredProjects} setPage={setPage} />
            <CTABanner t={t.home.cta} setPage={setPage} />
          </>
        );
    }
  };

  return (
    <div id="app-scroll" dir={dir} style={{ direction: dir, background: C.navy, fontFamily: lang === "ar" ? "'Segoe UI',Tahoma,sans-serif" : "system-ui,sans-serif", color: "#fff", minHeight: "100vh", maxHeight: "100vh", overflowY: "auto", overflowX: "hidden" }}>
      <Navbar lang={lang} setLang={setLang} page={page} setPage={setPage} t={t} />
      {renderPage()}
      <Footer t={t} setPage={setPage} />
      <WhatsAppFAB />
    </div>
  );
}
