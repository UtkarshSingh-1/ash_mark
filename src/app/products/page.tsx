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
  const pick = (k: string) =>
    Array.isArray(raw[k]) ? (raw[k] as string[])[0] : (raw[k] as string | undefined)

  const params: SearchParamsShape = {
    search:   pick("search"),
    category: pick("category"),
    page:     pick("page"),
    sort:     pick("sort"),
    minPrice: pick("minPrice"),
    maxPrice: pick("maxPrice"),
    featured: pick("featured"),
    trending: pick("trending"),
  }

  return (
    <>
      {/* ── Keyframe + responsive CSS injected once at the top ── */}
      <style>{`
        /* ── Page entrance ── */
        @keyframes pp-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Stories section ── */
        @keyframes pp-stories-in {
          from { opacity: 0; transform: translateY(-12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }

        /* ── Sidebar glide ── */
        @keyframes pp-sidebar-in {
          from { opacity: 0; transform: translateX(-18px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* ── Grid stagger ── */
        @keyframes pp-grid-in {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }

        /* ── Mobile filter bounce ── */
        @keyframes pp-filter-pop {
          0%   { transform: scale(0.92); opacity: 0; }
          60%  { transform: scale(1.04); }
          100% { transform: scale(1);    opacity: 1; }
        }

        /* ── Skeleton shimmer ── */
        @keyframes pp-shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }

        /* ─── Applied classes ─── */
        .pp-page-wrapper {
          animation: pp-fade-up 0.5s cubic-bezier(.22,1,.36,1) both;
        }

        .pp-stories-wrapper {
          animation: pp-stories-in 0.55s cubic-bezier(.22,1,.36,1) 0.1s both;
        }

        .pp-mobile-filter {
          animation: pp-filter-pop 0.4s cubic-bezier(.34,1.56,.64,1) 0.2s both;
        }

        .pp-sidebar {
          animation: pp-sidebar-in 0.5s cubic-bezier(.22,1,.36,1) 0.25s both;
        }

        .pp-grid {
          animation: pp-grid-in 0.55s cubic-bezier(.22,1,.36,1) 0.35s both;
        }

        /* ── Shimmer skeleton ── */
        .pp-skeleton-shimmer {
          background: linear-gradient(
            90deg,
            #e5e7eb 25%,
            #f3f4f6 50%,
            #e5e7eb 75%
          );
          background-size: 800px 100%;
          animation: pp-shimmer 1.6s infinite linear;
        }

        /* ── Stories: horizontal scroll without scrollbar on mobile ── */
        .pp-stories-wrapper {
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .pp-stories-wrapper::-webkit-scrollbar { display: none; }

        /* ── Responsive content layout ── */
        @media (max-width: 1023px) {
          .pp-content-row {
            flex-direction: column !important;
          }
          .pp-sidebar {
            display: none !important;
          }
        }

        /* ── Tighter padding on phones ── */
        @media (max-width: 639px) {
          .pp-outer-pad {
            padding-left: 12px !important;
            padding-right: 12px !important;
            padding-top: 16px !important;
            padding-bottom: 16px !important;
          }
        }
      `}</style>

      <Navbar />

      <main className="pp-page-wrapper min-h-screen">

        {/* ── Stories (full-width, horizontal scroll on mobile) ── */}
        <div className="pp-stories-wrapper overflow-x-auto w-full">
          <Suspense fallback={
            <div className="h-40 sm:h-56 md:h-72 lg:h-96 pp-skeleton-shimmer" />
          }>
            <ProductStoriesSection />
          </Suspense>
        </div>

        {/* ── Main container ── */}
        <div className="pp-outer-pad max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-5 sm:py-8">

          {/* ── Mobile filter toggle — only visible < lg ── */}
          <div className="pp-mobile-filter lg:hidden mb-4 sm:mb-6">
            <MobileFilters />
          </div>

          {/* ── Row: sidebar + grid ── */}
          <div className="pp-content-row flex flex-col lg:flex-row gap-5 sm:gap-6 lg:gap-8">

            {/* Desktop sidebar */}
            <aside
              className="pp-sidebar hidden lg:block lg:w-1/4 xl:w-[22%] shrink-0"
              aria-label="Product filters"
            >
              <ProductFilters />
            </aside>

            {/* Product grid */}
            <section
              className="pp-grid w-full lg:w-3/4 xl:w-[78%] min-w-0"
              aria-label="Product listings"
            >
              <Suspense fallback={<ProductGridSkeleton />}>
                <ProductGrid searchParams={params} />
              </Suspense>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

/* ─────────────────────────────────────────────
   SKELETON  – shimmer + staggered card reveals
───────────────────────────────────────────── */
function ProductGridSkeleton() {
  return (
    <div className="space-y-5 sm:space-y-6">

      {/* Header row */}
      <div className="flex justify-between items-center gap-3">
        <Skeleton className="h-7 sm:h-8 w-32 sm:w-48 rounded-lg pp-skeleton-shimmer" />
        <Skeleton className="h-9 sm:h-10 w-24 sm:w-32 rounded-lg pp-skeleton-shimmer" />
      </div>

      {/* Cards — 2 cols on mobile, 3 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="space-y-2 sm:space-y-3"
            style={{
              opacity: 0,
              animation: `pp-grid-in 0.4s cubic-bezier(.22,1,.36,1) ${i * 55}ms both`,
            }}
          >
            <Skeleton className="aspect-square w-full rounded-xl pp-skeleton-shimmer" />
            <Skeleton className="h-3 sm:h-4 w-3/4 rounded pp-skeleton-shimmer" />
            <Skeleton className="h-5 sm:h-6 w-1/2 rounded pp-skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  )
}
