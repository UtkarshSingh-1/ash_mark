"use client"

import { Suspense, useState, useEffect, useRef } from "react"

// ============================================================
// TYPES
// ============================================================
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

// ============================================================
// MOCK DATA
// ============================================================
const CATEGORIES = ["All", "Electronics", "Fashion", "Home", "Beauty", "Sports"]
const SORT_OPTIONS = ["Trending", "Price: Low", "Price: High", "Newest", "Rating"]

const STORIES = [
  { id: 1, label: "New In", emoji: "✦", color: "#FF6B6B" },
  { id: 2, label: "Trending", emoji: "↑", color: "#FFD93D" },
  { id: 3, label: "Sale", emoji: "%", color: "#6BCB77" },
  { id: 4, label: "Premium", emoji: "◆", color: "#4D96FF" },
  { id: 5, label: "Local", emoji: "◎", color: "#FF922B" },
  { id: 6, label: "Eco", emoji: "❋", color: "#51CF66" },
]

const PRODUCTS = [
  { id: 1, name: "Arc Lamp Pro", price: 12999, originalPrice: 18999, rating: 4.8, reviews: 2341, category: "Home", badge: "Trending", color: "#FF6B6B", emoji: "💡" },
  { id: 2, name: "Wave Runner X", price: 8499, originalPrice: null, rating: 4.9, reviews: 891, category: "Sports", badge: "New", color: "#4D96FF", emoji: "🏄" },
  { id: 3, name: "Silk Glide Serum", price: 2299, originalPrice: 3499, rating: 4.7, reviews: 5622, category: "Beauty", badge: "Sale", color: "#FF922B", emoji: "✨" },
  { id: 4, name: "Nomad Backpack", price: 4999, originalPrice: null, rating: 4.6, reviews: 1204, category: "Fashion", badge: null, color: "#6BCB77", emoji: "🎒" },
  { id: 5, name: "Pulse Earbuds", price: 6799, originalPrice: 9999, rating: 4.9, reviews: 8901, category: "Electronics", badge: "Hot", color: "#9775FA", emoji: "🎧" },
  { id: 6, name: "Cloud Pillow Set", price: 3199, originalPrice: null, rating: 4.5, reviews: 432, category: "Home", badge: null, color: "#FFD93D", emoji: "🌙" },
  { id: 7, name: "Zen Yoga Mat", price: 1899, originalPrice: 2799, rating: 4.8, reviews: 3210, category: "Sports", badge: "Sale", color: "#51CF66", emoji: "🧘" },
  { id: 8, name: "Frost Watch", price: 15999, originalPrice: null, rating: 4.9, reviews: 678, category: "Fashion", badge: "Premium", color: "#339AF0", emoji: "⌚" },
  { id: 9, name: "Nova Desk Light", price: 5499, originalPrice: 6999, rating: 4.7, reviews: 1567, category: "Electronics", badge: "Trending", color: "#F06595", emoji: "🔆" },
]

// ============================================================
// ANIMATIONS (injected as style tag)
// ============================================================
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Satoshi:wght@300;400;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0A0A0B;
    --surface: #111113;
    --surface2: #1A1A1E;
    --border: rgba(255,255,255,0.07);
    --border-hover: rgba(255,255,255,0.15);
    --text: #FAFAFA;
    --text-muted: rgba(255,255,255,0.45);
    --text-mid: rgba(255,255,255,0.7);
    --accent: #FF6B6B;
    --radius-sm: 10px;
    --radius-md: 16px;
    --radius-lg: 24px;
    --radius-xl: 32px;
    --ease: cubic-bezier(0.23, 1, 0.32, 1);
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Satoshi', -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes pulse-ring {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(1.6); opacity: 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
  @keyframes spin-slow {
    to { transform: rotate(360deg); }
  }
  @keyframes slide-in-right {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .animate-fade-up { animation: fadeUp 0.6s var(--ease) both; }
  .animate-fade-in { animation: fadeIn 0.4s var(--ease) both; }

  .skeleton {
    background: linear-gradient(90deg, var(--surface2) 25%, rgba(255,255,255,0.05) 50%, var(--surface2) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: var(--radius-sm);
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

  /* Story rings */
  .story-ring {
    background: conic-gradient(from 0deg, #FF6B6B, #FFD93D, #4D96FF, #6BCB77, #FF6B6B);
    padding: 2.5px;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.3s var(--ease);
  }
  .story-ring:hover { transform: scale(1.08); }
  .story-ring:active { transform: scale(0.96); }
  .story-inner {
    background: var(--bg);
    border-radius: 50%;
    padding: 2px;
  }

  /* Product card */
  .product-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.4s var(--ease), border-color 0.3s ease, box-shadow 0.4s var(--ease);
    position: relative;
  }
  .product-card:hover {
    transform: translateY(-6px);
    border-color: var(--border-hover);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }
  .product-card:hover .card-glow { opacity: 1; }
  .product-card:hover .quick-add { opacity: 1; transform: translateY(0); }
  .product-card:hover .card-img-wrap img { transform: scale(1.05); }

  .card-glow {
    position: absolute;
    inset: 0;
    border-radius: var(--radius-lg);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
    z-index: 0;
  }

  .card-img-wrap {
    overflow: hidden;
    border-radius: var(--radius-md) var(--radius-md) 0 0;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    position: relative;
  }
  .card-img-wrap img { transition: transform 0.5s var(--ease); }

  .quick-add {
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.3s ease, transform 0.3s var(--ease);
  }

  /* Filter pill */
  .filter-pill {
    padding: 8px 18px;
    border-radius: 50px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-muted);
    font-family: 'Satoshi', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .filter-pill:hover { border-color: var(--border-hover); color: var(--text-mid); }
  .filter-pill.active {
    background: var(--text);
    color: var(--bg);
    border-color: var(--text);
  }

  /* Wishlist btn */
  .wish-btn {
    width: 36px; height: 36px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: rgba(0,0,0,0.4);
    color: var(--text-muted);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(8px);
    font-size: 15px;
  }
  .wish-btn:hover { border-color: #FF6B6B; color: #FF6B6B; transform: scale(1.1); }
  .wish-btn.active { background: #FF6B6B; color: white; border-color: #FF6B6B; }

  /* Mobile drawer */
  .drawer-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    z-index: 50;
    animation: fadeIn 0.2s ease;
  }
  .drawer {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: var(--surface);
    border-radius: 28px 28px 0 0;
    border-top: 1px solid var(--border);
    z-index: 51;
    max-height: 80vh;
    overflow-y: auto;
    animation: slide-in-right 0.3s var(--ease);
    animation-name: drawer-up;
  }
  @keyframes drawer-up {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  /* Nav */
  .nav-glass {
    backdrop-filter: blur(20px);
    background: rgba(10,10,11,0.8);
    border-bottom: 1px solid var(--border);
  }

  /* Search */
  .search-input {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 50px;
    color: var(--text);
    font-family: 'Satoshi', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.25s, box-shadow 0.25s;
    padding: 10px 16px 10px 42px;
    width: 100%;
  }
  .search-input:focus {
    border-color: rgba(255,255,255,0.25);
    box-shadow: 0 0 0 3px rgba(255,255,255,0.05);
  }
  .search-input::placeholder { color: var(--text-muted); }

  /* Sort select */
  .sort-select {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 50px;
    color: var(--text);
    font-family: 'Satoshi', sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 8px 36px 8px 14px;
    outline: none;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
  }
  .sort-select option { background: #1A1A1E; }

  /* Range input */
  input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    height: 3px;
    border-radius: 3px;
    background: var(--surface2);
    outline: none;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px; height: 16px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  }

  /* Stars */
  .stars { color: #FFD93D; font-size: 12px; letter-spacing: 1px; }

  /* Badge */
  .badge {
    font-size: 10px;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 50px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  /* Glow orbs background */
  .bg-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
  }

  /* Add to cart btn */
  .add-btn {
    background: white;
    color: #0A0A0B;
    border: none;
    border-radius: 50px;
    font-family: 'Satoshi', sans-serif;
    font-size: 13px;
    font-weight: 700;
    padding: 10px 20px;
    cursor: pointer;
    transition: transform 0.2s ease, opacity 0.2s ease;
    width: 100%;
    letter-spacing: 0.2px;
  }
  .add-btn:hover { opacity: 0.9; transform: scale(0.98); }
  .add-btn:active { transform: scale(0.95); }

  /* Toast */
  .toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(0);
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 50px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 500;
    z-index: 100;
    animation: toast-in 0.4s var(--ease), toast-out 0.4s var(--ease) 1.8s both;
    white-space: nowrap;
  }
  @keyframes toast-in {
    from { transform: translateX(-50%) translateY(20px); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
  }
  @keyframes toast-out {
    to { transform: translateX(-50%) translateY(20px); opacity: 0; }
  }

  /* Responsive grid */
  .product-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  @media (max-width: 1024px) {
    .product-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 640px) {
    .product-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .product-card:hover { transform: none; }
  }

  /* Desktop sidebar */
  .sidebar { display: block; }
  @media (max-width: 1023px) {
    .sidebar { display: none; }
  }

  /* Mobile filter bar */
  .mobile-filter-bar { display: none; }
  @media (max-width: 1023px) {
    .mobile-filter-bar { display: flex; }
  }

  .layout-row {
    display: flex;
    gap: 28px;
    align-items: flex-start;
  }

  @media (max-width: 1023px) {
    .layout-row { flex-direction: column; }
  }
`

// ============================================================
// COMPONENTS
// ============================================================

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  return (
    <span className="stars">
      {"★".repeat(full)}
      {hasHalf ? "½" : ""}
      {"☆".repeat(5 - full - (hasHalf ? 1 : 0))}
    </span>
  )
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2300)
    return () => clearTimeout(t)
  }, [onDone])
  return <div className="toast">✓ {message}</div>
}

function StoryBubble({ story, index }: { story: typeof STORIES[0]; index: number }) {
  const [viewed, setViewed] = useState(false)
  return (
    <div
      className="animate-fade-up"
      style={{
        animationDelay: `${index * 60}ms`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        flexShrink: 0,
      }}
    >
      <div
        className="story-ring"
        style={{ opacity: viewed ? 0.5 : 1 }}
        onClick={() => setViewed(true)}
      >
        <div className="story-inner">
          <div style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, ${story.color}33, ${story.color}11)`,
            border: `1px solid ${story.color}33`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
          }}>
            {story.emoji}
          </div>
        </div>
      </div>
      <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>
        {story.label}
      </span>
    </div>
  )
}

function ProductCard({
  product,
  index,
  onAddToCart,
}: {
  product: typeof PRODUCTS[0]
  index: number
  onAddToCart: (name: string) => void
}) {
  const [wished, setWished] = useState(false)

  const badgeColor: Record<string, string> = {
    Trending: "#FF6B6B",
    New: "#4D96FF",
    Sale: "#6BCB77",
    Hot: "#FFD93D",
    Premium: "#9775FA",
  }

  return (
    <div
      className="product-card animate-fade-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Glow */}
      <div
        className="card-glow"
        style={{ background: `radial-gradient(circle at 50% 0%, ${product.color}18, transparent 70%)` }}
      />

      {/* Image area */}
      <div
        className="card-img-wrap"
        style={{
          background: `radial-gradient(circle at 40% 40%, ${product.color}22, ${product.color}08)`,
          minHeight: 160,
        }}
      >
        <span style={{ animation: "float 3s ease-in-out infinite", animationDelay: `${index * 200}ms` }}>
          {product.emoji}
        </span>

        {/* Top badges row */}
        <div style={{
          position: "absolute",
          top: 10, left: 10, right: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          zIndex: 2,
        }}>
          {product.badge ? (
            <span
              className="badge"
              style={{
                background: `${badgeColor[product.badge]}22`,
                color: badgeColor[product.badge],
                border: `1px solid ${badgeColor[product.badge]}44`,
              }}
            >
              {product.badge}
            </span>
          ) : <span />}

          <button
            className={`wish-btn ${wished ? "active" : ""}`}
            onClick={(e) => { e.stopPropagation(); setWished(!wished) }}
            aria-label="Wishlist"
          >
            {wished ? "♥" : "♡"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 14px 12px", position: "relative", zIndex: 1 }}>
        <p style={{
          fontSize: 13,
          fontWeight: 700,
          color: "var(--text)",
          marginBottom: 4,
          lineHeight: 1.3,
          fontFamily: "'Satoshi', sans-serif",
        }}>
          {product.name}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <StarRating rating={product.rating} />
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
            ({(product.reviews / 1000).toFixed(1)}k)
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.originalPrice && (
            <span style={{
              fontSize: 12,
              color: "var(--text-muted)",
              textDecoration: "line-through",
            }}>
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
          {product.originalPrice && (
            <span style={{ fontSize: 11, color: "#6BCB77", fontWeight: 600 }}>
              {Math.round((1 - product.price / product.originalPrice) * 100)}% off
            </span>
          )}
        </div>

        <button
          className="add-btn quick-add"
          onClick={() => onAddToCart(product.name)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

function Sidebar({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
}: {
  selectedCategory: string
  setSelectedCategory: (c: string) => void
  priceRange: number
  setPriceRange: (v: number) => void
}) {
  return (
    <aside className="sidebar" style={{ width: 220, flexShrink: 0, position: "sticky", top: 88 }}>
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: 20,
      }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 14 }}>
          Category
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? "rgba(255,255,255,0.08)" : "transparent",
                border: "none",
                borderRadius: 10,
                padding: "9px 12px",
                textAlign: "left",
                color: selectedCategory === cat ? "var(--text)" : "var(--text-muted)",
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 14,
                fontWeight: selectedCategory === cat ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {cat}
              {selectedCategory === cat && (
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "white", display: "inline-block" }} />
              )}
            </button>
          ))}
        </div>

        <div style={{ borderTop: "1px solid var(--border)", margin: "18px 0" }} />

        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 14 }}>
          Max Price
        </p>
        <div style={{ marginBottom: 8 }}>
          <input
            type="range"
            min={500}
            max={20000}
            step={500}
            value={priceRange}
            onChange={e => setPriceRange(Number(e.target.value))}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>₹500</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
              ₹{priceRange.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", margin: "18px 0" }} />

        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 12 }}>
          Rating
        </p>
        {[4.5, 4.0, 3.5].map(r => (
          <button
            key={r}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 13,
              cursor: "pointer",
              padding: "5px 0",
              display: "flex",
              alignItems: "center",
              gap: 6,
              width: "100%",
            }}
          >
            <span style={{ color: "#FFD93D" }}>{"★".repeat(Math.floor(r))}</span>
            <span>& up</span>
          </button>
        ))}
      </div>
    </aside>
  )
}

function MobileFilterDrawer({ onClose, selectedCategory, setSelectedCategory }: {
  onClose: () => void
  selectedCategory: string
  setSelectedCategory: (c: string) => void
}) {
  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        <div style={{ padding: "20px 20px 32px" }}>
          <div style={{
            width: 36, height: 4,
            background: "var(--border-hover)",
            borderRadius: 4,
            margin: "0 auto 20px",
          }} />
          <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Filters</p>

          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 12 }}>
            Category
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`filter-pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => { setSelectedCategory(cat); onClose() }}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            style={{
              width: "100%",
              background: "white",
              color: "#0A0A0B",
              border: "none",
              borderRadius: 50,
              padding: 14,
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              marginTop: 8,
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  )
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("Trending")
  const [search, setSearch] = useState("")
  const [priceRange, setPriceRange] = useState(20000)
  const [showDrawer, setShowDrawer] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [cartCount, setCartCount] = useState(0)

  const handleAddToCart = (name: string) => {
    setCartCount(c => c + 1)
    setToast(`${name} added!`)
  }

  const filteredProducts = PRODUCTS.filter(p => {
    const matchCat = selectedCategory === "All" || p.category === selectedCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchPrice = p.price <= priceRange
    return matchCat && matchSearch && matchPrice
  })

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />

      {/* Background orbs */}
      <div className="bg-orb" style={{ width: 400, height: 400, background: "rgba(255,107,107,0.06)", top: -100, right: -100 }} />
      <div className="bg-orb" style={{ width: 300, height: 300, background: "rgba(77,150,255,0.06)", top: 300, left: -80 }} />

      {/* NAVBAR */}
      <nav className="nav-glass" style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        padding: "0 20px",
      }}>
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 16,
          height: 60,
        }}>
          {/* Logo */}
          <div style={{
            fontFamily: "'Clash Display', 'Satoshi', sans-serif",
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: -0.5,
            flexShrink: 0,
            background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.5) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            NOVA
          </div>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: 420, position: "relative" }}>
            <span style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              fontSize: 14,
              pointerEvents: "none",
            }}>
              ⌕
            </span>
            <input
              className="search-input"
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Nav actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" }}>
            <button style={{
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: "50%",
              width: 38, height: 38,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: 16,
            }}>
              ♡
            </button>
            <button
              onClick={() => cartCount > 0 && setToast("Cart opened!")}
              style={{
                background: cartCount > 0 ? "white" : "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: 50,
                padding: "8px 14px",
                display: "flex", alignItems: "center", gap: 6,
                color: cartCount > 0 ? "#0A0A0B" : "var(--text-muted)",
                cursor: "pointer",
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                transition: "all 0.3s ease",
              }}
            >
              ⊡ {cartCount > 0 && <span style={{
                background: "#FF6B6B",
                color: "white",
                borderRadius: 50,
                width: 18, height: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700,
              }}>{cartCount}</span>}
              {cartCount === 0 ? "Cart" : cartCount}
            </button>
          </div>
        </div>
      </nav>

      <main style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
        {/* STORIES */}
        <section style={{
          borderBottom: "1px solid var(--border)",
          padding: "20px 0",
          background: "linear-gradient(180deg, rgba(255,107,107,0.04) 0%, transparent 100%)",
        }}>
          <div style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            gap: 20,
            overflowX: "auto",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}>
            {STORIES.map((story, i) => (
              <StoryBubble key={story.id} story={story} index={i} />
            ))}
          </div>
        </section>

        {/* CATEGORY PILLS (mobile) */}
        <div className="mobile-filter-bar" style={{
          padding: "14px 20px",
          gap: 8,
          overflowX: "auto",
          scrollbarWidth: "none",
          borderBottom: "1px solid var(--border)",
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-pill ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 20px 60px" }}>
          {/* Top bar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}>
            <div>
              <h1 style={{
                fontFamily: "'Clash Display', 'Satoshi', sans-serif",
                fontWeight: 700,
                fontSize: 24,
                letterSpacing: -0.5,
                lineHeight: 1.2,
              }}>
                {selectedCategory === "All" ? "All Products" : selectedCategory}
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                {filteredProducts.length} items
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Mobile filter btn */}
              <button
                className="filter-pill mobile-filter-bar"
                onClick={() => setShowDrawer(true)}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                ≡ Filter
              </button>

              <select
                className="sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Layout */}
          <div className="layout-row">
            {/* Sidebar */}
            <Sidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />

            {/* Grid */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {filteredProducts.length === 0 ? (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 300,
                  gap: 12,
                  animation: "fadeUp 0.4s ease both",
                }}>
                  <span style={{ fontSize: 48 }}>🔍</span>
                  <p style={{ fontSize: 16, fontWeight: 600 }}>No products found</p>
                  <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Try adjusting your filters</p>
                  <button
                    className="filter-pill"
                    onClick={() => { setSelectedCategory("All"); setSearch(""); setPriceRange(20000) }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="product-grid">
                  {filteredProducts.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={i}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile drawer */}
      {showDrawer && (
        <MobileFilterDrawer
          onClose={() => setShowDrawer(false)}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  )
}
