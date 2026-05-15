import { notFound } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductImages } from "@/components/product/product-images"
import { ProductInfo } from "@/components/product/product-info"
import { ProductTabs } from "@/components/product/product-tabs"
import { RelatedProducts } from "@/components/product/related-products"
import { ReviewSection } from "@/components/product/review-section"
import { prisma } from "@/lib/db"
import { jsonToStringArray } from "@/lib/utils"

// ⬇️ Prevent build-time DB calls
export const dynamic = "force-dynamic"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  })

  if (!product) {
    return notFound()
  }

  // Extract arrays
  const images = jsonToStringArray(product.images)
  const sizes = jsonToStringArray(product.sizes) as string[]
  const colors = jsonToStringArray(product.colors) as string[]
  const storyImages = jsonToStringArray(product.storyImages) as string[]

  // Serialized product (avoid Prisma Decimals)
  const serializedProduct = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    sizes,
    colors,
    stock: product.stock,
    featured: product.featured,
    trending: product.trending,
    category: {
      name: product.category.name,
    },
    storyContent: product.storyContent,
    storyTitle: product.storyTitle,
    storyImage: storyImages[0] ?? images[0],
    storyImages,
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] font-['Cormorant_Garamond',_Georgia,_serif]">
      {/* ── Ambient top glow ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 h-[420px] z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(196,160,100,0.18) 0%, transparent 70%)",
        }}
      />

      <Navbar />

      <main className="relative z-10">
        {/* ════════════════════════════════════════
            HERO PRODUCT SECTION
        ════════════════════════════════════════ */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-0 md:pt-10">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 md:mb-8 flex items-center gap-2 text-[11px] sm:text-xs tracking-[0.18em] uppercase text-[#8A7A6A]"
          >
            <span className="hover:text-[#C4A064] transition-colors cursor-pointer">
              Home
            </span>
            <span className="opacity-40">╱</span>
            <span className="hover:text-[#C4A064] transition-colors cursor-pointer">
              {serializedProduct.category.name}
            </span>
            <span className="opacity-40">╱</span>
            <span className="text-[#F5F0E8] opacity-60 truncate max-w-[140px] sm:max-w-none">
              {serializedProduct.name}
            </span>
          </nav>

          {/* Two-column product grid */}
          <div className="grid lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] gap-8 lg:gap-14 xl:gap-20 items-start">

            {/* ── LEFT: Images ── */}
            <div className="relative">
              {/* Decorative corner accent */}
              <div
                aria-hidden="true"
                className="hidden lg:block absolute -top-4 -left-4 w-16 h-16 border-t border-l border-[#C4A064]/30 pointer-events-none z-10"
              />
              <div
                aria-hidden="true"
                className="hidden lg:block absolute -bottom-4 -right-4 w-16 h-16 border-b border-r border-[#C4A064]/30 pointer-events-none z-10"
              />

              <div className="rounded-[2px] overflow-hidden ring-1 ring-white/5 shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
                <ProductImages images={images} name={serializedProduct.name} />
              </div>

              {/* Floating badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                {serializedProduct.featured && (
                  <span className="inline-flex items-center gap-1.5 bg-[#C4A064] text-[#0A0A0A] text-[10px] tracking-[0.2em] uppercase font-semibold px-3 py-1.5 rounded-[2px] shadow-lg">
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 12 12">
                      <path d="M6 0l1.5 4.5H12l-3.75 2.7L9.75 12 6 9.3 2.25 12l1.5-4.8L0 4.5h4.5z" />
                    </svg>
                    Featured
                  </span>
                )}
                {serializedProduct.trending && (
                  <span className="inline-flex items-center gap-1.5 bg-[#1A1A1A] border border-[#C4A064]/50 text-[#C4A064] text-[10px] tracking-[0.2em] uppercase font-semibold px-3 py-1.5 rounded-[2px] shadow-lg">
                    ↑ Trending
                  </span>
                )}
                {serializedProduct.comparePrice && (
                  <span className="inline-flex items-center gap-1.5 bg-[#8B1A1A] text-white text-[10px] tracking-[0.16em] uppercase font-semibold px-3 py-1.5 rounded-[2px] shadow-lg">
                    Sale
                  </span>
                )}
              </div>
            </div>

            {/* ── RIGHT: Info ── */}
            <div className="lg:sticky lg:top-[88px] flex flex-col">
              {/* Category pill */}
              <div className="mb-4">
                <span className="inline-block text-[10px] tracking-[0.28em] uppercase text-[#C4A064] border border-[#C4A064]/40 px-3 py-1 rounded-[2px]">
                  {serializedProduct.category.name}
                </span>
              </div>

              {/* Product name */}
              <h1 className="text-3xl sm:text-4xl xl:text-[42px] leading-[1.12] tracking-[-0.01em] text-[#F5F0E8] mb-5 font-light">
                {serializedProduct.name}
              </h1>

              {/* Divider rule */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-[#C4A064]/60 to-transparent" />
                <svg
                  className="w-3 h-3 text-[#C4A064]/60 flex-shrink-0"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                >
                  <circle cx="6" cy="6" r="2" />
                </svg>
                <div className="h-px flex-1 bg-gradient-to-l from-[#C4A064]/60 to-transparent" />
              </div>

              {/* Pricing */}
              <div className="flex items-end gap-3 mb-8">
                <span className="text-[32px] sm:text-[36px] font-light tracking-tight text-[#C4A064]">
                  ₹{serializedProduct.price.toLocaleString("en-IN")}
                </span>
                {serializedProduct.comparePrice && (
                  <>
                    <span className="text-xl text-[#6A5A4A] line-through mb-1">
                      ₹{serializedProduct.comparePrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-[#8B1A1A] bg-[#8B1A1A]/15 border border-[#8B1A1A]/30 px-2 py-0.5 rounded-[2px] mb-1.5 tracking-wide">
                      {Math.round(
                        ((serializedProduct.comparePrice - serializedProduct.price) /
                          serializedProduct.comparePrice) *
                          100
                      )}
                      % off
                    </span>
                  </>
                )}
              </div>

              {/* Product Info Component */}
              <div className="[&_button]:rounded-[2px] [&_select]:rounded-[2px] [&_input]:rounded-[2px]
                [&_button[type='submit']]:bg-[#C4A064] [&_button[type='submit']]:text-[#0A0A0A]
                [&_button[type='submit']]:tracking-[0.14em] [&_button[type='submit']]:uppercase
                [&_button[type='submit']]:text-xs [&_button[type='submit']]:font-semibold
                [&_button[type='submit']]:transition-all [&_button[type='submit']]:duration-200
                [&_button[type='submit']]:hover:bg-[#D4B074] [&_button[type='submit']]:shadow-[0_4px_24px_rgba(196,160,100,0.3)]
                [&_button[type='submit']]:hover:shadow-[0_6px_32px_rgba(196,160,100,0.45)]">
                <ProductInfo product={serializedProduct} />
              </div>

              {/* Stock indicator */}
              {serializedProduct.stock > 0 && serializedProduct.stock <= 10 && (
                <div className="mt-4 flex items-center gap-2 text-xs text-[#C4956A] tracking-wide">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C4956A] animate-pulse" />
                  Only {serializedProduct.stock} left in stock
                </div>
              )}

              {/* Trust signals */}
              <div className="mt-8 pt-6 border-t border-white/[0.07] grid grid-cols-3 gap-3 text-center">
                {[
                  { icon: "🚚", label: "Free Delivery", sub: "Orders over ₹999" },
                  { icon: "↩", label: "Easy Returns", sub: "Within 30 days" },
                  { icon: "✦", label: "Authentic", sub: "100% genuine" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-1">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[10px] tracking-[0.12em] uppercase text-[#F5F0E8]/80 font-medium">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-[#6A5A4A]">{item.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            DECORATIVE SECTION BREAK
        ════════════════════════════════════════ */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mt-16 md:mt-24 mb-2">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/[0.07]" />
            <div className="flex gap-2 items-center text-[#C4A064]/40">
              <span className="w-1 h-1 rounded-full bg-current" />
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span className="w-1 h-1 rounded-full bg-current" />
            </div>
            <div className="h-px flex-1 bg-white/[0.07]" />
          </div>
        </div>

        {/* ════════════════════════════════════════
            PRODUCT DETAILS TABS
        ════════════════════════════════════════ */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mt-10 md:mt-14">
          <div className="mb-8">
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#C4A064] mb-2">
              Details
            </h2>
            <p className="text-2xl sm:text-3xl font-light text-[#F5F0E8]/90 tracking-[-0.01em]">
              Product Information
            </p>
          </div>

          <div className="bg-[#111111] ring-1 ring-white/[0.06] rounded-[2px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
            <ProductTabs product={serializedProduct} />
          </div>
        </section>

        {/* ════════════════════════════════════════
            REVIEWS SECTION
        ════════════════════════════════════════ */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mt-16 md:mt-24">
          <div className="mb-8">
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#C4A064] mb-2">
              Reviews
            </h2>
            <p className="text-2xl sm:text-3xl font-light text-[#F5F0E8]/90 tracking-[-0.01em]">
              What Our Customers Say
            </p>
          </div>

          <div className="bg-[#0F0F0F] ring-1 ring-white/[0.05] rounded-[2px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
            <ReviewSection productId={product.id} />
          </div>
        </section>

        {/* ════════════════════════════════════════
            RELATED PRODUCTS
        ════════════════════════════════════════ */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mt-16 md:mt-24 mb-20 md:mb-28">
          <div className="mb-10">
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#C4A064] mb-2">
              Discover More
            </h2>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <p className="text-2xl sm:text-3xl font-light text-[#F5F0E8]/90 tracking-[-0.01em]">
                You May Also Like
              </p>
              <div className="h-px flex-1 min-w-[40px] max-w-[200px] bg-gradient-to-r from-[#C4A064]/40 to-transparent self-center" />
            </div>
          </div>

          <RelatedProducts
            categoryId={product.categoryId}
            currentProductId={product.id}
          />
        </section>
      </main>

      <Footer />

      {/* Global styles scoped to this page */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0A0A0A; }
        ::-webkit-scrollbar-thumb { background: #3A3028; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #C4A064; }

        /* Selection */
        ::selection { background: rgba(196,160,100,0.28); color: #F5F0E8; }

        /* Smooth scroll */
        html { scroll-behavior: smooth; }

        /* Override common Tailwind reset conflicts */
        .min-h-screen { min-height: 100svh; }
      `}</style>
    </div>
  )
}
