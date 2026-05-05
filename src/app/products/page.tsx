import { Suspense } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductGrid } from "@/components/product/product-grid"
import { ProductFilters } from "@/components/product/product-filters"
import { ProductStoriesSection } from "@/components/product/product-stories-section"
import { MobileFilters } from "@/components/product/mobile-filters"

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

export default async function ProductsPage(
  props: { searchParams: Promise<Record<string, string | string[] | undefined>> }
) {
  const raw = await props.searchParams
  const pick = (k: string) =>
    Array.isArray(raw[k]) ? (raw[k] as string[])[0] : (raw[k] as string | undefined)

  const params: SearchParamsShape = {
    search: pick("search"),
    category: pick("category"),
    page: pick("page"),
    sort: pick("sort"),
    minPrice: pick("minPrice"),
    maxPrice: pick("maxPrice"),
    featured: pick("featured"),
    trending: pick("trending"),
  }

  return (
    <>
      {/* ── Google Fonts: Cormorant Garamond + DM Sans ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── Reset & Base ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ink:        #0e0d0b;
          --paper:      #f5f2ec;
          --cream:      #ede8df;
          --warm-mid:   #c8bfb0;
          --gold:       #b89a6a;
          --gold-light: #d4b88a;
          --charcoal:   #2a2825;
          --ash:        #6b6560;
          --red-accent: #8b2e2e;
          --font-display: 'Cormorant Garamond', Georgia, serif;
          --font-body:    'DM Sans', system-ui, sans-serif;
          --ease-expo:    cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ── Page wrapper ── */
        .am-products-page {
          background: var(--paper);
          min-height: 100vh;
          font-family: var(--font-body);
          color: var(--ink);
        }

        /* ────────────────────────────────
           STORIES SECTION WRAPPER
        ──────────────────────────────── */
        .stories-shell {
          background: var(--ink);
          overflow: hidden;
        }

        /* ────────────────────────────────
           PAGE MASTHEAD
        ──────────────────────────────── */
        .am-masthead {
          border-bottom: 1px solid var(--warm-mid);
          background: var(--paper);
          padding: 0 clamp(1.25rem, 5vw, 4rem);
        }

        .am-masthead-inner {
          max-width: 1440px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: end;
          padding: 3rem 0 1.5rem;
          gap: 1rem;
        }

        .am-masthead-meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .am-masthead-eyebrow {
          font-family: var(--font-body);
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ash);
        }

        .am-masthead-sub {
          font-family: var(--font-body);
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          color: var(--warm-mid);
        }

        .am-masthead-title {
          font-family: var(--font-display);
          font-size: clamp(3rem, 7vw, 6.5rem);
          font-weight: 300;
          line-height: 0.9;
          letter-spacing: -0.02em;
          text-align: center;
          color: var(--ink);
        }

        .am-masthead-title em {
          font-style: italic;
          color: var(--gold);
        }

        .am-masthead-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .am-masthead-count {
          font-family: var(--font-display);
          font-size: 0.8rem;
          font-style: italic;
          color: var(--ash);
        }

        .am-masthead-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--warm-mid), transparent);
          margin-top: 1.5rem;
        }

        /* Breadcrumb */
        .am-breadcrumb {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0.85rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ash);
        }

        .am-breadcrumb a {
          color: var(--ash);
          text-decoration: none;
          transition: color 0.2s;
        }

        .am-breadcrumb a:hover { color: var(--ink); }

        .am-breadcrumb-sep {
          color: var(--warm-mid);
          font-size: 0.6rem;
        }

        .am-breadcrumb-cur { color: var(--ink); }

        /* ────────────────────────────────
           MAIN CONTENT LAYOUT
        ──────────────────────────────── */
        .am-content {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 clamp(1.25rem, 5vw, 4rem) 5rem;
        }

        /* ── Mobile filter bar ── */
        .am-mobile-bar {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0 1.5rem;
          border-bottom: 1px solid var(--cream);
          margin-bottom: 1.5rem;
        }

        .am-mobile-bar-label {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-style: italic;
          color: var(--ash);
        }

        /* ── Two-column layout ── */
        .am-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 3.5rem;
          padding-top: 2.5rem;
          align-items: start;
        }

        /* ────────────────────────────────
           SIDEBAR
        ──────────────────────────────── */
        .am-sidebar {
          position: sticky;
          top: 90px;
        }

        .am-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--cream);
        }

        .am-sidebar-title {
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ash);
        }

        .am-sidebar-clear {
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gold);
          cursor: pointer;
          border: none;
          background: none;
          font-family: var(--font-body);
          transition: opacity 0.2s;
        }

        .am-sidebar-clear:hover { opacity: 0.7; }

        /* Sidebar ornament */
        .am-sidebar-ornament {
          font-family: var(--font-display);
          font-size: 4.5rem;
          font-weight: 300;
          font-style: italic;
          color: var(--cream);
          line-height: 1;
          letter-spacing: -0.04em;
          margin-bottom: 2rem;
          user-select: none;
        }

        /* Filters inner (your existing component will render here) */
        .am-filters-wrap {
          font-family: var(--font-body);
          font-size: 0.8rem;
        }

        /* ── Collection note card ── */
        .am-sidebar-note {
          margin-top: 2.5rem;
          background: var(--ink);
          color: var(--cream);
          padding: 1.5rem 1.25rem;
          position: relative;
          overflow: hidden;
        }

        .am-sidebar-note::before {
          content: '✦';
          position: absolute;
          top: -0.5rem;
          right: 1rem;
          font-size: 5rem;
          color: var(--gold);
          opacity: 0.08;
          line-height: 1;
        }

        .am-sidebar-note-eyebrow {
          font-size: 0.6rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold);
          display: block;
          margin-bottom: 0.6rem;
        }

        .am-sidebar-note-text {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-style: italic;
          line-height: 1.5;
          color: var(--paper);
        }

        .am-sidebar-note-meta {
          margin-top: 1rem;
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--warm-mid);
        }

        /* ────────────────────────────────
           PRODUCT AREA HEADER
        ──────────────────────────────── */
        .am-grid-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--cream);
          gap: 1rem;
          flex-wrap: wrap;
        }

        .am-grid-header-left {
          display: flex;
          align-items: baseline;
          gap: 1rem;
        }

        .am-grid-header-title {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 300;
          font-style: italic;
          color: var(--ink);
          letter-spacing: -0.01em;
        }

        .am-grid-header-count {
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ash);
        }

        /* Sort dropdown styling shell */
        .am-sort-shell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ash);
        }

        /* ────────────────────────────────
           SKELETON
        ──────────────────────────────── */
        .am-skeleton-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem 1.25rem;
        }

        .am-skeleton-card {
          animation: am-pulse 1.6s ease-in-out infinite;
        }

        .am-skeleton-img {
          aspect-ratio: 3/4;
          background: var(--cream);
          margin-bottom: 0.75rem;
        }

        .am-skeleton-line {
          height: 0.65rem;
          background: var(--cream);
          margin-bottom: 0.4rem;
          border-radius: 2px;
        }

        .am-skeleton-line.short { width: 55%; }
        .am-skeleton-line.med   { width: 75%; }

        @keyframes am-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }

        /* ────────────────────────────────
           DIVIDER ORNAMENT
        ──────────────────────────────── */
        .am-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 2rem 0;
          color: var(--warm-mid);
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .am-divider::before,
        .am-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--cream);
        }

        /* ────────────────────────────────
           RESPONSIVE
        ──────────────────────────────── */
        @media (max-width: 1024px) {
          .am-layout {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .am-sidebar {
            display: none;
          }

          .am-mobile-bar {
            display: flex;
          }

          .am-masthead-inner {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 2rem 0 1.25rem;
          }

          .am-masthead-meta,
          .am-masthead-right {
            display: none;
          }

          .am-masthead-title {
            font-size: clamp(2.8rem, 12vw, 5rem);
          }

          .am-skeleton-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .am-skeleton-grid {
            grid-template-columns: 1fr;
          }

          .am-grid-header {
            flex-direction: column;
            gap: 0.75rem;
          }

          .am-content {
            padding-bottom: 3rem;
          }
        }

        /* ────────────────────────────────
           PAGE ENTRY ANIMATION
        ──────────────────────────────── */
        .am-masthead-title,
        .am-masthead-meta,
        .am-masthead-right {
          animation: am-fade-up 0.9s var(--ease-expo) both;
        }

        .am-masthead-title  { animation-delay: 0.05s; }
        .am-masthead-meta   { animation-delay: 0.15s; }
        .am-masthead-right  { animation-delay: 0.2s; }

        .am-layout {
          animation: am-fade-up 0.8s var(--ease-expo) 0.25s both;
        }

        @keyframes am-fade-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="am-products-page">
        <Navbar />

        {/* ── Stories / Hero reel ── */}
        <div className="stories-shell">
          <Suspense fallback={<div style={{ height: "380px", background: "#0e0d0b" }} />}>
            <ProductStoriesSection />
          </Suspense>
        </div>

        {/* ── Masthead ── */}
        <header className="am-masthead">
          <nav className="am-breadcrumb">
            <a href="/">Home</a>
            <span className="am-breadcrumb-sep">✦</span>
            <span className="am-breadcrumb-cur">Collection</span>
          </nav>
          <div className="am-masthead-divider" />
          <div className="am-masthead-inner">
            <div className="am-masthead-meta">
              <span className="am-masthead-eyebrow">— Vol. I · MMXXV</span>
              <span className="am-masthead-sub">Jaipur, India</span>
            </div>
            <h1 className="am-masthead-title">
              The <em>Collection</em>
            </h1>
            <div className="am-masthead-right">
              <span className="am-masthead-eyebrow">Edition 001 / 005</span>
              <span className="am-masthead-count">200 pieces total</span>
            </div>
          </div>
          <div className="am-masthead-divider" />
        </header>

        {/* ── Main ── */}
        <main>
          <div className="am-content">

            {/* Mobile filter bar */}
            <div className="am-mobile-bar">
              <span className="am-mobile-bar-label">Browse pieces</span>
              <MobileFilters />
            </div>

            <div className="am-layout">

              {/* ── Sidebar ── */}
              <aside className="am-sidebar">
                <div className="am-sidebar-header">
                  <span className="am-sidebar-title">Refine</span>
                  <button className="am-sidebar-clear">Clear all</button>
                </div>

                <div className="am-sidebar-ornament">✦</div>

                <div className="am-filters-wrap">
                  <ProductFilters />
                </div>

                <div className="am-sidebar-note">
                  <span className="am-sidebar-note-eyebrow">— Craft Note</span>
                  <p className="am-sidebar-note-text">
                    Each piece is hand-stitched over 60–80 hours. No two are identical.
                  </p>
                  <p className="am-sidebar-note-meta">No restocks. Ever.</p>
                </div>
              </aside>

              {/* ── Product grid ── */}
              <div>
                <div className="am-grid-header">
                  <div className="am-grid-header-left">
                    <span className="am-grid-header-title">All Pieces</span>
                    <span className="am-grid-header-count">005 designs</span>
                  </div>
                  <div className="am-sort-shell">
                    <span>Sort —</span>
                    {/* Your existing sort UI renders inside ProductGrid */}
                  </div>
                </div>

                <Suspense fallback={<ProductGridSkeleton />}>
                  <ProductGrid searchParams={params} />
                </Suspense>

                <div className="am-divider">Vol. I · Hand Embroidered · No Restocks</div>
              </div>

            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

/* ────────────────────────────────
   SKELETON FALLBACK
──────────────────────────────── */
function ProductGridSkeleton() {
  return (
    <div className="am-skeleton-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="am-skeleton-card"
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <div className="am-skeleton-img" />
          <div className="am-skeleton-line short" />
          <div className="am-skeleton-line med" />
          <div className="am-skeleton-line short" style={{ width: "40%" }} />
        </div>
      ))}
    </div>
  )
}
