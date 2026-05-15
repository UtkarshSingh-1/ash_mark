"use client"
// app/products/[slug]/product-page-client.tsx
// CLIENT COMPONENT — theme toggle, animations, all UI.
// Receives fully-serialized props from the server; never touches the DB.

import { useState } from "react"
import { Navbar }         from "@/components/layout/navbar"
import { Footer }         from "@/components/layout/footer"
import { ProductImages }  from "@/components/product/product-images"
import { ProductInfo }    from "@/components/product/product-info"
import { ProductTabs }    from "@/components/product/product-tabs"
import { RelatedProducts }from "@/components/product/related-products"
import { ReviewSection }  from "@/components/product/review-section"

/* ── Types ── */
interface SerializedProduct {
  id: string
  name: string
  description: string | null
  price: number
  comparePrice: number | null
  sizes: string[]
  colors: string[]
  stock: number
  featured: boolean
  trending: boolean
  category: { name: string }
  storyContent: string | null
  storyTitle: string | null
  storyImage: string
  storyImages: string[]
}

interface Props {
  product: SerializedProduct
  discountPercent: number | null
  images: string[]
  rawProductId: string
  categoryId: string
}

/* ─────────────────────────────────────────────
   THEME TOGGLE
───────────────────────────────────────────── */
function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: "dark" | "light"
  onToggle: () => void
}) {
  const dk = theme === "dark"
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle colour theme"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 14px",
        borderRadius: 999,
        border: dk
          ? "1px solid rgba(196,160,100,0.35)"
          : "1px solid rgba(139,110,60,0.35)",
        background: dk
          ? "rgba(196,160,100,0.08)"
          : "rgba(139,110,60,0.08)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        flexShrink: 0,
      }}
    >
      {/* Track */}
      <span
        style={{
          position: "relative",
          width: 36,
          height: 20,
          borderRadius: 999,
          background: dk ? "#1a1a1a" : "#e8dcc8",
          border: "1px solid rgba(196,160,100,0.3)",
          display: "inline-block",
          transition: "background 0.3s",
        }}
      >
        {/* Knob */}
        <span
          style={{
            position: "absolute",
            top: 2,
            left: dk ? 2 : 18,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#C4A064",
            transition: "left 0.25s cubic-bezier(.34,1.56,.64,1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 8,
          }}
        >
          {dk ? "◑" : "○"}
        </span>
      </span>

      <span
        style={{
          fontSize: 10,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "#C4A064",
          fontFamily: "Georgia, serif",
        }}
      >
        {dk ? "Dark" : "Light"}
      </span>
    </button>
  )
}

/* ─────────────────────────────────────────────
   SHARED SMALL COMPONENTS
───────────────────────────────────────────── */
function SectionDivider({ vars }: { vars: ReturnType<typeof makeVars> }) {
  return (
    <div className="pd-outer" style={{ marginTop: 64 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flex: 1, height: 1, background: vars.border, transition: "background 0.4s" }} />
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {[4, 6, 4].map((s, i) => (
            <span
              key={i}
              style={{
                width: s, height: s, borderRadius: "50%",
                background: vars.goldDim, display: "inline-block",
                transition: "background 0.4s",
              }}
            />
          ))}
        </div>
        <div style={{ flex: 1, height: 1, background: vars.border, transition: "background 0.4s" }} />
      </div>
    </div>
  )
}

function SectionLabel({
  label,
  heading,
  vars,
}: {
  label: string
  heading: string
  vars: ReturnType<typeof makeVars>
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{
        fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase",
        color: vars.gold, marginBottom: 6, transition: "color 0.4s",
      }}>
        {label}
      </p>
      <p
        className="pd-section-h"
        style={{ color: `${vars.text}e6`, transition: "color 0.4s" }}
      >
        {heading}
      </p>
    </div>
  )
}

/* ─────────────────────────────────────────────
   THEME VARS FACTORY
───────────────────────────────────────────── */
function makeVars(dk: boolean) {
  return {
    bg:         dk ? "#0A0A0A"                        : "#FAF7F2",
    bgCard:     dk ? "#111111"                        : "#FFFFFF",
    bgCard2:    dk ? "#0F0F0F"                        : "#F5F0E8",
    text:       dk ? "#F5F0E8"                        : "#1A1208",
    textMuted:  dk ? "#8A7A6A"                        : "#7A6A58",
    textSub:    dk ? "rgba(245,240,232,0.55)"         : "rgba(26,18,8,0.45)",
    gold:       "#C4A064",
    goldDim:    dk ? "rgba(196,160,100,0.4)"          : "rgba(139,110,60,0.5)",
    border:     dk ? "rgba(255,255,255,0.06)"         : "rgba(0,0,0,0.08)",
    borderGold: dk ? "rgba(196,160,100,0.3)"          : "rgba(139,110,60,0.3)",
    shadow:     dk ? "0 32px 80px rgba(0,0,0,0.6)"   : "0 24px 60px rgba(0,0,0,0.12)",
    navBg:      dk ? "rgba(10,10,10,0.92)"            : "rgba(250,247,242,0.92)",
    glow:       dk
      ? "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(196,160,100,0.15) 0%, transparent 70%)"
      : "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(196,160,100,0.10) 0%, transparent 70%)",
  }
}

/* ─────────────────────────────────────────────
   MAIN CLIENT COMPONENT
───────────────────────────────────────────── */
export function ProductPageClient({
  product: p,
  discountPercent,
  images,
  rawProductId,
  categoryId,
}: Props) {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const dk   = theme === "dark"
  const vars = makeVars(dk)

  return (
    <div
      data-theme={theme}
      style={{
        minHeight: "100vh",
        background: vars.bg,
        color: vars.text,
        fontFamily: "Georgia, 'Times New Roman', serif",
        transition: "background 0.4s ease, color 0.4s ease",
      }}
    >
      {/* ── CSS: keyframes + responsive rules ── */}
      <style>{`
        @keyframes pd-fade-up {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pd-fade-in {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes pd-slide-left {
          from { opacity:0; transform:translateX(-20px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes pd-slide-right {
          from { opacity:0; transform:translateX(20px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes pd-pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%     { opacity:0.5; transform:scale(0.7); }
        }

        .pd-page         { animation: pd-fade-in    0.45s ease both; }
        .pd-img-col      { animation: pd-slide-left  0.55s cubic-bezier(.22,1,.36,1) 0.1s  both; }
        .pd-info-col     { animation: pd-slide-right 0.55s cubic-bezier(.22,1,.36,1) 0.15s both; }
        .pd-breadcrumb   { animation: pd-fade-up     0.4s  ease 0.05s both; }
        .pd-tabs-wrap    { animation: pd-fade-up     0.5s  ease 0.2s  both; }
        .pd-reviews-wrap { animation: pd-fade-up     0.5s  ease 0.25s both; }
        .pd-related-wrap { animation: pd-fade-up     0.5s  ease 0.3s  both; }
        .pd-pulse        { animation: pd-pulse-dot   2s ease-in-out infinite; }

        /* Hero grid: single col on mobile, 2-col on ≥ lg */
        .pd-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
        }
        @media (min-width:1024px) {
          .pd-hero-grid { grid-template-columns:1fr 1fr; gap:56px; align-items:start; }
        }
        @media (min-width:1280px) {
          .pd-hero-grid { gap:80px; }
        }

        /* Trust grid */
        .pd-trust-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 8px;
          text-align: center;
        }
        @media (max-width:380px) {
          .pd-trust-grid { grid-template-columns:1fr; text-align:left; }
          .pd-trust-item { flex-direction:row !important; gap:10px !important; }
        }

        /* Price row */
        .pd-price-row {
          display: flex;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 10px;
        }

        /* Badges */
        .pd-badges {
          position: absolute;
          top:12px; left:12px;
          display: flex; flex-direction:column; gap:6px;
          z-index: 20;
        }
        @media (max-width:639px) { .pd-badges { top:8px; left:8px; } }

        /* Corner deco: desktop only */
        .pd-corner-tl, .pd-corner-br { display:none; }
        @media (min-width:1024px) {
          .pd-corner-tl, .pd-corner-br { display:block; }
        }

        /* Sticky info: desktop only */
        @media (min-width:1024px) {
          .pd-info-sticky { position:sticky; top:96px; }
        }

        /* Breadcrumb truncation */
        .pd-crumb-name {
          max-width:120px; overflow:hidden;
          text-overflow:ellipsis; white-space:nowrap;
        }
        @media (min-width:480px) { .pd-crumb-name { max-width:200px; } }
        @media (min-width:768px) { .pd-crumb-name { max-width:320px; } }

        /* Fluid type */
        .pd-section-h      { font-size:clamp(22px,5vw,30px); font-weight:300; letter-spacing:-0.01em; }
        .pd-product-title  { font-size:clamp(26px,6vw,48px); font-weight:300; line-height:1.12; letter-spacing:-0.01em; }
        .pd-price-main     { font-size:clamp(30px,7vw,48px); font-weight:300; letter-spacing:-0.02em; }

        /* Page padding */
        .pd-outer {
          max-width:1280px;
          margin-left:auto; margin-right:auto;
          padding-left:16px; padding-right:16px;
        }
        @media (min-width:640px)  { .pd-outer { padding-left:24px;  padding-right:24px;  } }
        @media (min-width:1024px) { .pd-outer { padding-left:40px;  padding-right:40px;  } }

        /* Theme bar */
        .pd-theme-bar {
          display:flex; justify-content:flex-end; align-items:center;
          padding:8px 16px;
          border-bottom:1px solid;
          position:sticky; top:0; z-index:60;
          transition:background 0.4s, border-color 0.4s;
        }
        @media (min-width:640px)  { .pd-theme-bar { padding:8px 24px; } }
        @media (min-width:1024px) { .pd-theme-bar { padding:8px 40px; } }
      `}</style>

      {/* ── THEME BAR ── */}
      <div
        className="pd-theme-bar"
        style={{
          background: vars.navBg,
          borderColor: vars.border,
          backdropFilter: "blur(16px)",
        }}
      >
        <ThemeToggle
          theme={theme}
          onToggle={() => setTheme(dk ? "light" : "dark")}
        />
      </div>

      {/* ── AMBIENT GLOW ── */}
      <div
        aria-hidden="true"
        style={{
          pointerEvents: "none",
          position: "fixed",
          top: 0, left: 0, right: 0,
          height: 420, zIndex: 0,
          background: vars.glow,
          transition: "background 0.4s",
        }}
      />

      <Navbar />

      <main className="pd-page" style={{ position: "relative", zIndex: 10 }}>

        {/* ══ HERO ══ */}
        <section className="pd-outer" style={{ paddingTop: 20 }}>

          {/* Breadcrumb */}
          <nav
            className="pd-breadcrumb"
            aria-label="Breadcrumb"
            style={{
              marginBottom: 20,
              display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6,
              fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
              color: vars.textMuted,
            }}
          >
            <span>Home</span>
            <span style={{ opacity: 0.4 }}>╱</span>
            <span>{p.category.name}</span>
            <span style={{ opacity: 0.4 }}>╱</span>
            <span className="pd-crumb-name" style={{ color: vars.textSub }}>{p.name}</span>
          </nav>

          {/* Two-column hero */}
          <div className="pd-hero-grid">

            {/* LEFT — Images */}
            <div className="pd-img-col" style={{ position: "relative" }}>
              <div
                className="pd-corner-tl"
                aria-hidden="true"
                style={{
                  position: "absolute", top: -14, left: -14,
                  width: 52, height: 52,
                  borderTop:  `1px solid ${vars.borderGold}`,
                  borderLeft: `1px solid ${vars.borderGold}`,
                  pointerEvents: "none", zIndex: 10,
                  transition: "border-color 0.4s",
                }}
              />
              <div
                className="pd-corner-br"
                aria-hidden="true"
                style={{
                  position: "absolute", bottom: -14, right: -14,
                  width: 52, height: 52,
                  borderBottom: `1px solid ${vars.borderGold}`,
                  borderRight:  `1px solid ${vars.borderGold}`,
                  pointerEvents: "none", zIndex: 10,
                  transition: "border-color 0.4s",
                }}
              />

              <div style={{
                borderRadius: 4, overflow: "hidden",
                boxShadow: vars.shadow,
                border: `1px solid ${vars.border}`,
                transition: "box-shadow 0.4s, border-color 0.4s",
              }}>
                <ProductImages images={images} name={p.name} />
              </div>

              {/* Badges */}
              <div className="pd-badges">
                {p.featured && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: vars.gold, color: "#0A0A0A",
                    fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
                    fontWeight: 700, padding: "5px 10px", borderRadius: 2,
                  }}>★ Featured</span>
                )}
                {p.trending && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: dk ? "#1A1A1A" : "#F5EDD8",
                    border: `1px solid ${vars.borderGold}`,
                    color: vars.gold,
                    fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
                    fontWeight: 700, padding: "5px 10px", borderRadius: 2,
                    transition: "background 0.4s, border-color 0.4s",
                  }}>↑ Trending</span>
                )}
                {p.comparePrice && (
                  <span style={{
                    background: "#8B1A1A", color: "#fff",
                    fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase",
                    fontWeight: 700, padding: "5px 10px", borderRadius: 2,
                  }}>Sale</span>
                )}
              </div>
            </div>

            {/* RIGHT — Info */}
            <div
              className="pd-info-col pd-info-sticky"
              style={{ display: "flex", flexDirection: "column" }}
            >
              {/* Category pill */}
              <div style={{ marginBottom: 14 }}>
                <span style={{
                  display: "inline-block",
                  fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase",
                  color: vars.gold,
                  border: `1px solid ${vars.borderGold}`,
                  padding: "4px 12px", borderRadius: 2,
                  transition: "border-color 0.4s, color 0.4s",
                }}>
                  {p.category.name}
                </span>
              </div>

              {/* Product name */}
              <h1
                className="pd-product-title"
                style={{ color: vars.text, marginBottom: 18, transition: "color 0.4s" }}
              >
                {p.name}
              </h1>

              {/* Gold divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${vars.goldDim}, transparent)`, transition: "background 0.4s" }} />
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: vars.goldDim, flexShrink: 0, transition: "background 0.4s" }} />
                <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, ${vars.goldDim}, transparent)`, transition: "background 0.4s" }} />
              </div>

              {/* Pricing */}
              <div className="pd-price-row" style={{ marginBottom: 28 }}>
                <span className="pd-price-main" style={{ color: vars.gold, transition: "color 0.4s" }}>
                  ₹{p.price.toLocaleString("en-IN")}
                </span>
                {p.comparePrice && (
                  <>
                    <span style={{
                      fontSize: 18, color: vars.textMuted,
                      textDecoration: "line-through", marginBottom: 2,
                      transition: "color 0.4s",
                    }}>
                      ₹{p.comparePrice.toLocaleString("en-IN")}
                    </span>
                    <span style={{
                      fontSize: 10, color: "#e87070",
                      background: "rgba(139,26,26,0.18)",
                      border: "1px solid rgba(139,26,26,0.35)",
                      padding: "2px 8px", borderRadius: 2,
                      letterSpacing: "0.06em", marginBottom: 2,
                    }}>
                      {discountPercent}% off
                    </span>
                  </>
                )}
              </div>

              {/* ProductInfo — completely untouched */}
              <ProductInfo product={p} />

              {/* Low stock */}
              {p.stock > 0 && p.stock <= 10 && (
                <div style={{
                  marginTop: 14,
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 12, color: "#C4956A", letterSpacing: "0.04em",
                }}>
                  <span
                    className="pd-pulse"
                    style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "#C4956A", flexShrink: 0, display: "inline-block",
                    }}
                  />
                  Only {p.stock} left in stock
                </div>
              )}

              {/* Trust signals */}
              <div style={{
                marginTop: 24, paddingTop: 20,
                borderTop: `1px solid ${vars.border}`,
                transition: "border-color 0.4s",
              }}>
                <div className="pd-trust-grid">
                  {[
                    { icon: "🚚", label: "Free Delivery", sub: "Orders over ₹999" },
                    { icon: "↩", label: "Easy Returns",   sub: "Within 30 days" },
                    { icon: "✦", label: "Authentic",      sub: "100% genuine" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="pd-trust-item"
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}
                    >
                      <span style={{ fontSize: 18 }}>{item.icon}</span>
                      <span style={{
                        fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase",
                        color: vars.text, fontWeight: 600, transition: "color 0.4s",
                      }}>{item.label}</span>
                      <span style={{ fontSize: 10, color: vars.textMuted, transition: "color 0.4s" }}>
                        {item.sub}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider vars={vars} />

        {/* ══ PRODUCT TABS ══ */}
        <section className="pd-tabs-wrap pd-outer" style={{ marginTop: 40 }}>
          <SectionLabel label="Details" heading="Product Information" vars={vars} />
          <div style={{
            background: vars.bgCard,
            border: `1px solid ${vars.border}`,
            borderRadius: 4, overflow: "hidden",
            boxShadow: dk ? "0 8px 40px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.07)",
            transition: "background 0.4s, border-color 0.4s, box-shadow 0.4s",
          }}>
            <ProductTabs product={p} />
          </div>
        </section>

        {/* ══ REVIEWS ══ */}
        <section className="pd-reviews-wrap pd-outer" style={{ marginTop: 72 }}>
          <SectionLabel label="Reviews" heading="What Our Customers Say" vars={vars} />
          <div style={{
            background: vars.bgCard2,
            border: `1px solid ${vars.border}`,
            borderRadius: 4, overflow: "hidden",
            boxShadow: dk ? "0 8px 40px rgba(0,0,0,0.35)" : "0 4px 20px rgba(0,0,0,0.06)",
            transition: "background 0.4s, border-color 0.4s, box-shadow 0.4s",
          }}>
            <ReviewSection productId={rawProductId} />
          </div>
        </section>

        {/* ══ RELATED PRODUCTS ══ */}
        <section className="pd-related-wrap pd-outer" style={{ marginTop: 72, marginBottom: 80 }}>
          <div style={{ marginBottom: 32 }}>
            <p style={{
              fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase",
              color: vars.gold, marginBottom: 6, transition: "color 0.4s",
            }}>Discover More</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
              <p
                className="pd-section-h"
                style={{ color: `${vars.text}e6`, transition: "color 0.4s" }}
              >
                You May Also Like
              </p>
              <div style={{
                flex: 1, minWidth: 40, maxWidth: 180, height: 1, alignSelf: "center",
                background: `linear-gradient(to right, ${vars.goldDim}, transparent)`,
                transition: "background 0.4s",
              }} />
            </div>
          </div>
          <RelatedProducts categoryId={categoryId} currentProductId={rawProductId} />
        </section>

      </main>

      <Footer />
    </div>
  )
}
