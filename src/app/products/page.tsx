import { Suspense } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductGrid } from "@/components/product/product-grid"
import { ProductFilters } from "@/components/product/product-filters"
import { ProductStoriesSection } from "@/components/product/product-stories-section"
import { Skeleton } from "@/components/ui/skeleton"
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
  const pick = (k: string) => Array.isArray(raw[k]) ? (raw[k] as string[])[0] : (raw[k] as string | undefined)
  const params: SearchParamsShape = {
    search: pick('search'),
    category: pick('category'),
    page: pick('page'),
    sort: pick('sort'),
    minPrice: pick('minPrice'),
    maxPrice: pick('maxPrice'),
    featured: pick('featured'),
    trending: pick('trending'),
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --cream: #faf8f4;
          --warm-white: #fff9f2;
          --sand: #e8ddd0;
          --terracotta: #c9714a;
          --terracotta-light: #e8906d;
          --ink: #1a1612;
          --ink-soft: #3d352d;
          --muted: #8c7b6e;
          --accent-gold: #c9a84c;
          --accent-sage: #7a9e7e;
          --surface: #f0ebe3;
          --shadow-warm: rgba(26,22,18,0.08);
          --radius-card: 18px;
          --radius-pill: 100px;
        }

        .products-page * {
          font-family: 'DM Sans', sans-serif;
          box-sizing: border-box;
        }

        /* === PAGE WRAPPER === */
        .products-page {
          background: var(--cream);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* === HERO AMBIENT === */
        .page-ambient {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .ambient-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
          animation: floatBlob 18s ease-in-out infinite;
        }
        .ambient-blob-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, #c9714a, #e8906d);
          top: -120px; right: -100px;
          animation-delay: 0s;
        }
        .ambient-blob-2 {
          width: 380px; height: 380px;
          background: radial-gradient(circle, #c9a84c, #f0d070);
          bottom: 20%; left: -80px;
          animation-delay: -7s;
        }
        .ambient-blob-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #7a9e7e, #a8c4aa);
          top: 55%; right: 10%;
          animation-delay: -13s;
        }
        @keyframes floatBlob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.05); }
          66% { transform: translate(-20px, 30px) scale(0.95); }
        }

        /* === STORIES WRAPPER === */
        .stories-wrapper {
          position: relative;
          z-index: 1;
        }
        .stories-wrapper::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 60px;
          background: linear-gradient(to bottom, transparent, var(--cream));
          pointer-events: none;
        }

        /* === MAIN CONTENT AREA === */
        .products-content {
          position: relative;
          z-index: 2;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px 80px;
        }

        /* === SECTION HEADER === */
        .section-header {
          padding: 32px 0 24px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .section-title-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .section-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--terracotta);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section-eyebrow::before {
          content: '';
          display: inline-block;
          width: 24px;
          height: 2px;
          background: var(--terracotta);
          border-radius: 2px;
        }
        .section-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(26px, 4vw, 40px);
          font-weight: 700;
          color: var(--ink);
          line-height: 1.15;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .section-count {
          font-size: 13px;
          color: var(--muted);
          font-weight: 400;
        }

        /* === LAYOUT CONTAINER === */
        .layout-container {
          display: flex;
          gap: 32px;
          align-items: flex-start;
        }

        /* === SIDEBAR === */
        .sidebar-wrapper {
          display: none;
          width: 280px;
          flex-shrink: 0;
          position: sticky;
          top: 24px;
          max-height: calc(100vh - 48px);
          overflow-y: auto;
        }
        .sidebar-wrapper::-webkit-scrollbar { width: 3px; }
        .sidebar-wrapper::-webkit-scrollbar-track { background: transparent; }
        .sidebar-wrapper::-webkit-scrollbar-thumb { background: var(--sand); border-radius: 10px; }

        .sidebar-card {
          background: #ffffff;
          border-radius: var(--radius-card);
          border: 1.5px solid var(--sand);
          padding: 24px;
          box-shadow: 0 4px 24px var(--shadow-warm);
          transition: box-shadow 0.3s ease;
          animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .sidebar-card:hover {
          box-shadow: 0 8px 40px rgba(26,22,18,0.12);
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .sidebar-label {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 600;
          color: var(--ink);
          margin: 0 0 16px;
          padding-bottom: 12px;
          border-bottom: 1.5px solid var(--sand);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sidebar-label svg {
          color: var(--terracotta);
        }

        /* === MOBILE FILTERS STRIP === */
        .mobile-filters-strip {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .mobile-filters-strip::-webkit-scrollbar { display: none; }

        .mobile-filter-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1.5px solid var(--sand);
          border-radius: var(--radius-pill);
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 500;
          color: var(--ink-soft);
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .mobile-filter-pill:hover {
          border-color: var(--terracotta);
          color: var(--terracotta);
          background: #fff5f0;
        }
        .mobile-filter-pill svg {
          width: 14px; height: 14px;
        }

        /* === GRID WRAPPER === */
        .grid-wrapper {
          flex: 1;
          min-width: 0;
        }

        /* === GRID TOOLBAR === */
        .grid-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .result-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--surface);
          border-radius: var(--radius-pill);
          padding: 6px 14px;
          font-size: 13px;
          color: var(--ink-soft);
          font-weight: 500;
          border: 1.5px solid var(--sand);
        }
        .result-dot {
          width: 6px; height: 6px;
          background: var(--accent-sage);
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }

        .view-toggle {
          display: flex;
          background: var(--surface);
          border: 1.5px solid var(--sand);
          border-radius: 10px;
          padding: 3px;
          gap: 2px;
        }
        .view-btn {
          width: 32px; height: 32px;
          border-radius: 7px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          transition: all 0.2s ease;
        }
        .view-btn.active {
          background: #fff;
          color: var(--terracotta);
          box-shadow: 0 2px 8px var(--shadow-warm);
        }
        .view-btn:hover:not(.active) {
          color: var(--ink-soft);
          background: rgba(255,255,255,0.5);
        }

        /* === GRID CONTAINER === */
        .grid-container {
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.1s;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* === SKELETON === */
        .skeleton-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 12px;
        }
        .skel {
          background: linear-gradient(90deg, var(--sand) 25%, #f5ede3 50%, var(--sand) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
          border-radius: 8px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }
        .skeleton-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: fadeUp 0.4s ease both;
        }
        .skeleton-card:nth-child(1) { animation-delay: 0.0s; }
        .skeleton-card:nth-child(2) { animation-delay: 0.05s; }
        .skeleton-card:nth-child(3) { animation-delay: 0.1s; }
        .skeleton-card:nth-child(4) { animation-delay: 0.15s; }
        .skeleton-card:nth-child(5) { animation-delay: 0.2s; }
        .skeleton-card:nth-child(6) { animation-delay: 0.25s; }
        .skeleton-card:nth-child(7) { animation-delay: 0.3s; }
        .skeleton-card:nth-child(8) { animation-delay: 0.35s; }
        .skeleton-card:nth-child(9) { animation-delay: 0.4s; }
        .skel-img {
          aspect-ratio: 1;
          border-radius: var(--radius-card);
        }
        .skel-tag {
          height: 11px;
          width: 45%;
          border-radius: 6px;
        }
        .skel-name {
          height: 15px;
          width: 80%;
          border-radius: 6px;
        }
        .skel-price {
          height: 20px;
          width: 40%;
          border-radius: 6px;
        }

        /* === STORIES SKELETON === */
        .stories-skeleton {
          width: 100%;
          height: 380px;
          background: linear-gradient(135deg, #f0ebe3 0%, #e8ddd0 50%, #f0ebe3 100%);
          animation: storiesPulse 2s ease-in-out infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 24px;
          overflow: hidden;
        }
        @keyframes storiesPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .story-skel-circle {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          flex-shrink: 0;
          animation: shimmer 1.6s ease-in-out infinite;
          background-size: 200% 100%;
          background-image: linear-gradient(90deg, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.3) 75%);
        }

        /* === DECORATIVE DIVIDER === */
        .decorative-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 8px 0 32px;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--sand), transparent);
        }
        .divider-motif {
          font-size: 14px;
          color: var(--sand);
          letter-spacing: 0.1em;
        }

        /* === FLOATING PILL (mobile filter button) === */
        .mobile-fab-strip {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 2px;
          scrollbar-width: none;
          margin-bottom: 20px;
        }
        .mobile-fab-strip::-webkit-scrollbar { display: none; }

        /* === RESPONSIVE === */
        @media (min-width: 768px) {
          .products-content {
            padding: 0 32px 80px;
          }
          .section-title {
            font-size: clamp(30px, 3vw, 40px);
          }
        }
        @media (min-width: 1024px) {
          .sidebar-wrapper {
            display: block;
          }
          .mobile-fab-strip {
            display: none;
          }
          .products-content {
            padding: 0 40px 100px;
          }
        }
        @media (max-width: 480px) {
          .section-header {
            padding: 24px 0 16px;
          }
          .products-content {
            padding: 0 16px 60px;
          }
          .grid-toolbar {
            margin-bottom: 16px;
          }
        }

        /* === SCROLL REVEAL === */
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal {
          animation: revealUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .reveal-1 { animation-delay: 0.05s; }
        .reveal-2 { animation-delay: 0.12s; }
        .reveal-3 { animation-delay: 0.19s; }
      `}</style>

      <div className="products-page">
        {/* Ambient background blobs */}
        <div className="page-ambient" aria-hidden="true">
          <div className="ambient-blob ambient-blob-1" />
          <div className="ambient-blob ambient-blob-2" />
          <div className="ambient-blob ambient-blob-3" />
        </div>

        <Navbar />

        <main>
          {/* Product Stories */}
          <div className="stories-wrapper">
            <Suspense fallback={
              <div className="stories-skeleton" aria-label="Loading stories">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="story-skel-circle" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            }>
              <ProductStoriesSection />
            </Suspense>
          </div>

          {/* Main content */}
          <div className="products-content">
            {/* Section Header */}
            <div className="section-header reveal reveal-1">
              <div className="section-title-group">
                <span className="section-eyebrow">Catalogue</span>
                <h1 className="section-title">Our Collection</h1>
              </div>
            </div>

            <div className="decorative-divider reveal reveal-2" aria-hidden="true">
              <div className="divider-line" />
              <span className="divider-motif">✦</span>
              <div className="divider-line" />
            </div>

            {/* Mobile filters strip */}
            <div className="mobile-fab-strip reveal reveal-3">
              <MobileFilters />
            </div>

            {/* Layout */}
            <div className="layout-container">
              {/* Desktop Sidebar */}
              <aside className="sidebar-wrapper" aria-label="Product filters">
                <div className="sidebar-card">
                  <p className="sidebar-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                    Refine
                  </p>
                  <ProductFilters />
                </div>
              </aside>

              {/* Product Grid */}
              <div className="grid-wrapper">
                <div className="grid-toolbar">
                  <div className="result-badge">
                    <span className="result-dot" aria-hidden="true" />
                    <span>Products</span>
                  </div>
                  <div className="view-toggle" role="group" aria-label="View mode">
                    <button className="view-btn active" aria-label="Grid view" aria-pressed="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                      </svg>
                    </button>
                    <button className="view-btn" aria-label="List view" aria-pressed="false">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="3" rx="1.5"/><rect x="3" y="10.5" width="18" height="3" rx="1.5"/><rect x="3" y="17" width="18" height="3" rx="1.5"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid-container">
                  <Suspense fallback={<ProductGridSkeleton />}>
                    <ProductGrid searchParams={params} />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

function ProductGridSkeleton() {
  return (
    <div>
      <div className="skeleton-toolbar">
        <div className="skel" style={{ height: 34, width: 140 }} />
        <div className="skel" style={{ height: 34, width: 90 }} />
      </div>
      <div className="skeleton-grid">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skel skel-img" />
            <div className="skel skel-tag" />
            <div className="skel skel-name" />
            <div className="skel skel-price" />
          </div>
        ))}
      </div>
    </div>
  )
}
