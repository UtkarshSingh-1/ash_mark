"use client"

import { Suspense, useState, useEffect, useRef } from "react"

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface SearchParamsShape {
  search?: string
  category?: string
  page?: string
  sort?: string
  minPrice?: string
  maxPrice?: string
  featured?: string
  trending?: string
}

/* ─────────────────────────────────────────────
   MOCK DATA  (replace with your real sources)
───────────────────────────────────────────── */
const CATEGORIES = ["All", "Electronics", "Fashion", "Home", "Beauty", "Sports", "Books"]

const STORIES = [
  { id: 1, label: "New Drops", emoji: "✦", color: "#FF6B35" },
  { id: 2, label: "Trending", emoji: "◈", color: "#8B5CF6" },
  { id: 3, label: "Flash Sale", emoji: "⚡", color: "#EC4899" },
  { id: 4, label: "Editors Pick", emoji: "◉", color: "#10B981" },
  { id: 5, label: "Limited Ed.", emoji: "◆", color: "#F59E0B" },
  { id: 6, label: "Featured", emoji: "★", color: "#3B82F6" },
]

const PRODUCTS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: [
    "Obsidian Wireless Pro",
    "Velvet Noir Jacket",
    "Lumina Desk Lamp",
    "Aurora Skincare Set",
    "Phantom Running Shoes",
    "Kodex Mechanical Watch",
    "Silk Cloud Pillow",
    "Neo Espresso Maker",
    "Storm Hiking Boots",
    "Prism Sunglasses",
    "Zenith Yoga Mat",
    "Echo Smart Speaker",
  ][i],
  price: [129, 299, 89, 179, 219, 449, 59, 199, 159, 149, 49, 249][i],
  category: CATEGORIES[Math.floor(Math.random() * (CATEGORIES.length - 1)) + 1],
  badge: ["NEW", "SALE", null, "HOT", null, "LIMITED", null, "SALE", "NEW", null, "HOT", null][i],
  rating: (3.8 + Math.random() * 1.2).toFixed(1),
  reviews: Math.floor(40 + Math.random() * 500),
  hue: [210, 280, 30, 340, 150, 25, 200, 190, 270, 55, 160, 300][i],
}))

/* ─────────────────────────────────────────────
   HOOK – intersection observer for reveal
───────────────────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

/* ─────────────────────────────────────────────
   STORY PILL
───────────────────────────────────────────── */
function StoryPill({ story, active, onClick }: { story: typeof STORIES[0]; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        "--accent": story.color,
        border: active ? `2px solid ${story.color}` : "2px solid transparent",
        boxShadow: active ? `0 0 18px ${story.color}55` : "none",
      } as React.CSSProperties}
      className="story-pill flex flex-col items-center gap-2 group cursor-pointer select-none"
    >
      <div
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
        style={{
          background: active
            ? `linear-gradient(135deg, ${story.color}cc, ${story.color}44)`
            : "rgba(255,255,255,0.06)",
          border: `1px solid ${story.color}44`,
        }}
      >
        {story.emoji}
      </div>
      <span
        className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase transition-colors duration-300"
        style={{ color: active ? story.color : "#8899aa" }}
      >
        {story.label}
      </span>
    </button>
  )
}

/* ─────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────── */
function ProductCard({ product, index }: { product: typeof PRODUCTS[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const [liked, setLiked] = useState(false)
  const { ref, visible } = useReveal()

  return (
    <div
      ref={ref}
      className="product-card group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.96)",
        transition: `opacity 0.5s ease ${index * 70}ms, transform 0.5s cubic-bezier(.22,1,.36,1) ${index * 70}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Gradient image placeholder */}
      <div
        className="aspect-[4/5] relative overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 30% 30%, hsl(${product.hue},70%,60%), hsl(${product.hue + 40},60%,30%))`,
        }}
      >
        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)",
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Badge */}
        {product.badge && (
          <span
            className="absolute top-3 left-3 text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full z-10"
            style={{
              background: product.badge === "SALE" ? "#FF3D6B" : product.badge === "NEW" ? "#10B981" : product.badge === "HOT" ? "#F59E0B" : "#8B5CF6",
              color: "#fff",
              letterSpacing: "0.1em",
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked) }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center z-10 transition-all duration-300"
          style={{
            background: liked ? "#FF3D6B" : "rgba(0,0,0,0.3)",
            backdropFilter: "blur(8px)",
            transform: liked ? "scale(1.2)" : "scale(1)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "#fff" : "none"} stroke="#fff" strokeWidth="2.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Quick add – slides up on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3 transition-all duration-400"
          style={{
            transform: hovered ? "translateY(0)" : "translateY(100%)",
            opacity: hovered ? 1 : 0,
          }}
        >
          <button
            className="w-full py-2.5 rounded-xl font-bold text-sm tracking-wider transition-all duration-200 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.92)",
              color: "#111",
              backdropFilter: "blur(12px)",
            }}
          >
            Quick Add +
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase mb-0.5" style={{ color: "#5566aa" }}>
              {product.category}
            </p>
            <h3 className="text-sm sm:text-base font-bold leading-snug" style={{ color: "#eef2ff" }}>
              {product.name}
            </h3>
          </div>
          <span
            className="text-base sm:text-lg font-black shrink-0"
            style={{ color: "#fff", letterSpacing: "-0.03em" }}
          >
            ${product.price}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill={s <= Math.round(parseFloat(product.rating)) ? "#F59E0B" : "#334"}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span className="text-[10px]" style={{ color: "#556" }}>
            ({product.reviews})
          </span>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   FILTER SIDEBAR
───────────────────────────────────────────── */
function FilterSidebar() {
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (cat: string) =>
    setSelected((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat])

  return (
    <aside className="filter-sidebar sticky top-24 rounded-2xl p-5 sm:p-6 space-y-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center justify-between">
        <h2 className="font-black text-base tracking-widest uppercase" style={{ color: "#eef" }}>Filters</h2>
        <button className="text-xs font-semibold tracking-wider" style={{ color: "#8866ff" }} onClick={() => { setSelected([]); setPriceRange([0, 500]) }}>
          Reset
        </button>
      </div>

      {/* Categories */}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#556" }}>Category</p>
        <div className="space-y-2">
          {CATEGORIES.slice(1).map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => toggle(cat)}
                className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200"
                style={{
                  borderColor: selected.includes(cat) ? "#8866ff" : "#334",
                  background: selected.includes(cat) ? "#8866ff" : "transparent",
                }}
              >
                {selected.includes(cat) && (
                  <svg width="10" height="10" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
                )}
              </div>
              <span className="text-sm font-medium transition-colors" style={{ color: selected.includes(cat) ? "#eef" : "#778" }}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#556" }}>Price Range</p>
        <div className="flex justify-between text-sm font-bold mb-3" style={{ color: "#eef" }}>
          <span>${priceRange[0]}</span><span>${priceRange[1]}</span>
        </div>
        <input
          type="range" min={0} max={500} value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
          className="w-full accent-purple-500"
          style={{ accentColor: "#8866ff" }}
        />
      </div>

      {/* Sort */}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#556" }}>Sort By</p>
        <div className="space-y-2">
          {["Newest", "Price: Low–High", "Price: High–Low", "Top Rated"].map((opt) => (
            <button key={opt} className="w-full text-left text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white/5"
              style={{ color: "#99aacc" }}>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

/* ─────────────────────────────────────────────
   MARQUEE BAR
───────────────────────────────────────────── */
function MarqueeBar() {
  const items = ["FREE SHIPPING OVER $99", "NEW COLLECTION 2026", "MEMBERS GET 20% OFF", "FLASH SALE ENDS MIDNIGHT", "CURATED BY EXPERTS"]
  return (
    <div className="overflow-hidden py-2.5 border-y" style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(136,102,255,0.08)" }}>
      <div className="marquee-track flex gap-16 whitespace-nowrap">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="text-[10px] font-black tracking-[0.2em] uppercase inline-flex items-center gap-4" style={{ color: "#8866ff" }}>
            {t} <span style={{ color: "#ff6b35" }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function ProductsPage(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: { searchParams?: Promise<Record<string, string | string[] | undefined>> }
) {
  const [activeStory, setActiveStory] = useState(0)
  const [search, setSearch] = useState("")
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const filtered = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {/* ── Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #080c18;
          color: #eef2ff;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        h1, h2, h3, .font-display { font-family: 'Syne', sans-serif; }

        /* Noise texture overlay */
        body::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 0;
        }

        /* Aurora background blobs */
        .aurora {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none; z-index: 0; overflow: hidden;
        }
        .aurora-blob {
          position: absolute; border-radius: 50%;
          filter: blur(120px); opacity: 0.18;
          animation: floatBlob 18s ease-in-out infinite alternate;
        }
        @keyframes floatBlob {
          0%   { transform: translate(0,0) scale(1); }
          100% { transform: translate(40px, 30px) scale(1.1); }
        }

        /* Marquee */
        .marquee-track { animation: marquee 28s linear infinite; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        /* Story pill */
        .story-pill { background: transparent; border: none; padding: 4px 8px; border-radius: 16px; transition: transform .2s; }
        .story-pill:hover { transform: translateY(-4px); }

        /* Product card */
        .product-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          transition: box-shadow .3s, border-color .3s, transform .3s;
        }
        .product-card:hover {
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          border-color: rgba(255,255,255,0.14);
          transform: translateY(-6px);
        }

        /* Page fade in */
        .page-wrapper {
          opacity: 0; transform: translateY(16px);
          animation: pageFadeIn .6s cubic-bezier(.22,1,.36,1) .1s forwards;
        }
        @keyframes pageFadeIn { to { opacity: 1; transform: translateY(0); } }

        /* Floating search bar */
        .search-bar {
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          transition: border-color .3s, box-shadow .3s;
        }
        .search-bar:focus-within {
          border-color: #8866ff;
          box-shadow: 0 0 0 4px rgba(136,102,255,0.15);
        }

        /* Mobile drawer */
        .mobile-drawer {
          position: fixed; inset: 0; z-index: 50;
          display: flex;
        }
        .mobile-drawer-backdrop {
          position: absolute; inset: 0; background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
        }
        .mobile-drawer-panel {
          position: relative; margin-left: auto;
          width: min(80vw, 320px);
          background: #0f1628;
          border-left: 1px solid rgba(255,255,255,0.08);
          height: 100%; overflow-y: auto;
          padding: 24px 20px;
          transform: translateX(100%);
          animation: slideDrawer .35s cubic-bezier(.22,1,.36,1) forwards;
        }
        @keyframes slideDrawer { to { transform: translateX(0); } }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0e1a; }
        ::-webkit-scrollbar-thumb { background: #2a2f4a; border-radius: 3px; }

        /* Category pills */
        .cat-pill {
          padding: 6px 16px; border-radius: 999px; font-size: 12px;
          font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
          border: 1.5px solid transparent;
          cursor: pointer; transition: all .25s; white-space: nowrap;
          background: rgba(255,255,255,0.05);
          color: #7788aa;
        }
        .cat-pill.active, .cat-pill:hover {
          border-color: #8866ff;
          background: rgba(136,102,255,0.15);
          color: #eef;
        }

        /* ── Responsive helpers ── */
        @media (max-width: 640px) {
          .product-card:hover { transform: none; }
        }
      `}</style>

      {/* Aurora blobs */}
      <div className="aurora">
        <div className="aurora-blob" style={{ width: 600, height: 600, top: "-10%", left: "-10%", background: "#8866ff", animationDelay: "0s" }} />
        <div className="aurora-blob" style={{ width: 500, height: 500, top: "40%", right: "-15%", background: "#ff6b35", animationDelay: "-6s" }} />
        <div className="aurora-blob" style={{ width: 400, height: 400, bottom: "0", left: "30%", background: "#3b82f6", animationDelay: "-12s" }} />
      </div>

      <div className="page-wrapper relative z-10 min-h-screen">

        {/* ── NAVBAR ── */}
        <nav className="sticky top-0 z-40 px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between"
          style={{ background: "rgba(8,12,24,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-base font-black" style={{ background: "linear-gradient(135deg,#8866ff,#ff6b35)" }}>✦</div>
            <span className="font-display text-xl font-black tracking-tight" style={{ color: "#eef" }}>LUMINA</span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            {["Shop", "Drops", "Stories", "About"].map((l) => (
              <a key={l} href="#" className="text-sm font-medium transition-colors hover:text-white" style={{ color: "#8899bb" }}>{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/10" style={{ color: "#8899bb" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </button>
            <div className="w-8 h-8 rounded-full" style={{ background: "linear-gradient(135deg,#8866ff,#3b82f6)" }} />
          </div>
        </nav>

        {/* ── MARQUEE ── */}
        <MarqueeBar />

        {/* ── HERO BANNER ── */}
        <section className="relative px-4 sm:px-6 lg:px-10 py-12 sm:py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase"
              style={{ background: "rgba(136,102,255,0.2)", color: "#bb99ff", border: "1px solid rgba(136,102,255,0.3)" }}>
              Spring / Summer 2026
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight mb-6"
              style={{ color: "#eef2ff" }}>
              Shop the<br />
              <span style={{ background: "linear-gradient(90deg,#8866ff,#ff6b35,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Future
              </span>
            </h1>
            <p className="text-base sm:text-lg max-w-xl" style={{ color: "#7788aa" }}>
              Curated drops, limited editions, and everyday essentials — all in one place.
            </p>
          </div>
        </section>

        {/* ── STORIES SCROLL ── */}
        <section className="px-4 sm:px-6 lg:px-10 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
              {STORIES.map((s, i) => (
                <StoryPill key={s.id} story={s} active={activeStory === i} onClick={() => setActiveStory(i)} />
              ))}
            </div>
          </div>
        </section>

        {/* ── SEARCH + CATEGORY STRIP ── */}
        <section className="px-4 sm:px-6 lg:px-10 pb-8">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Search */}
            <div className="search-bar flex items-center px-4 sm:px-5 py-3 gap-3 max-w-xl">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7788aa" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: "#eef", caretColor: "#8866ff" }}
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-xs" style={{ color: "#556" }}>✕</button>
              )}
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {CATEGORIES.map((c) => (
                <button key={c} className="cat-pill active shrink-0">{c}</button>
              ))}
            </div>
          </div>
        </section>

        {/* ── MAIN CONTENT ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-20">

          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-6 flex items-center justify-between">
            <p className="text-sm font-medium" style={{ color: "#7788aa" }}>{filtered.length} products</p>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#eef" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              Filters
            </button>
          </div>

          <div className="flex gap-8">
            {/* Desktop sidebar */}
            <div className="hidden lg:block w-64 shrink-0">
              <FilterSidebar />
            </div>

            {/* Grid */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-medium" style={{ color: "#7788aa" }}>
                  Showing <span style={{ color: "#eef", fontWeight: 700 }}>{filtered.length}</span> products
                </p>
                <select className="text-sm font-medium px-3 py-1.5 rounded-lg outline-none cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#eef" }}>
                  <option>Newest First</option>
                  <option>Price: Low–High</option>
                  <option>Price: High–Low</option>
                  <option>Top Rated</option>
                </select>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-24">
                  <div className="text-6xl mb-4">✦</div>
                  <p className="text-lg font-bold" style={{ color: "#eef" }}>No products found</p>
                  <p className="text-sm mt-1" style={{ color: "#556" }}>Try a different search term</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                  {filtered.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              )}

              {/* Load more */}
              {filtered.length > 0 && (
                <div className="mt-12 text-center">
                  <button
                    className="px-8 py-3 rounded-full font-bold text-sm tracking-wider transition-all duration-300 active:scale-95 hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg,#8866ff,#6644cc)",
                      color: "#fff",
                      boxShadow: "0 4px 24px rgba(136,102,255,0.35)",
                    }}
                  >
                    Load More Products
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="px-4 sm:px-6 lg:px-10 py-10 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center text-sm font-black" style={{ background: "linear-gradient(135deg,#8866ff,#ff6b35)" }}>✦</div>
              <span className="font-display font-black text-lg tracking-tight" style={{ color: "#eef" }}>LUMINA</span>
            </div>
            <p className="text-xs" style={{ color: "#445" }}>© 2026 Lumina. All rights reserved.</p>
            <div className="flex gap-4">
              {["Privacy", "Terms", "Contact"].map((l) => (
                <a key={l} href="#" className="text-xs font-medium transition-colors hover:text-white" style={{ color: "#556" }}>{l}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>

      {/* ── MOBILE FILTER DRAWER ── */}
      {mobileFiltersOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-backdrop" onClick={() => setMobileFiltersOpen(false)} />
          <div className="mobile-drawer-panel">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-black text-lg tracking-widest uppercase" style={{ color: "#eef" }}>Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.08)", color: "#eef" }}>✕</button>
            </div>
            <FilterSidebar />
          </div>
        </div>
      )}
    </>
  )
}
