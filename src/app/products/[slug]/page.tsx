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

  const discountPercent =
    serializedProduct.comparePrice
      ? Math.round(
          ((serializedProduct.comparePrice - serializedProduct.price) /
            serializedProduct.comparePrice) *
            100
        )
      : null

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#0A0A0A",
        color: "#F5F0E8",
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      {/* Ambient top glow — purely decorative */}
      <div
        aria-hidden="true"
        style={{
          pointerEvents: "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "clamp(200px, 50vh, 420px)",
          zIndex: 0,
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(196,160,100,0.15) 0%, transparent 70%)",
        }}
      />

      <Navbar />

      <main style={{ position: "relative", zIndex: 10 }}>

        {/* ════════ HERO SECTION ════════ */}
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 pt-3 sm:pt-6 md:pt-10">

          {/* Breadcrumb — display only */}
          <nav
            aria-label="Breadcrumb"
            className="mb-4 sm:mb-6 flex flex-wrap items-center gap-1 sm:gap-2"
            style={{
              fontSize: "clamp(8px, 2.5vw, 11px)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#8A7A6A",
            }}
          >
            <span className="hidden sm:inline">Home</span>
            <span style={{ opacity: 0.4 }} className="hidden sm:inline">╱</span>
            <span className="hidden sm:inline">{serializedProduct.category.name}</span>
            <span style={{ opacity: 0.4 }} className="hidden sm:inline">╱</span>
            <span
              className="truncate max-w-[120px] sm:max-w-xs"
              style={{ color: "#F5F0E8", opacity: 0.55 }}
            >
              {serializedProduct.name}
            </span>
            <span className="sm:hidden text-xs opacity-75">
              {serializedProduct.category.name}
            </span>
          </nav>

          {/* Two-column layout — stacks on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-14 xl:gap-20 items-start">

            {/* LEFT — Images */}
            <div style={{ position: "relative" }}>
              {/* Decorative corner lines — no interaction, hidden on mobile */}
              <div
                aria-hidden="true"
                className="hidden lg:block"
                style={{
                  position: "absolute",
                  top: -14,
                  left: -14,
                  width: 52,
                  height: 52,
                  borderTop: "1px solid rgba(196,160,100,0.3)",
                  borderLeft: "1px solid rgba(196,160,100,0.3)",
                  pointerEvents: "none",
                  zIndex: 10,
                }}
              />
              <div
                aria-hidden="true"
                className="hidden lg:block"
                style={{
                  position: "absolute",
                  bottom: -14,
                  right: -14,
                  width: 52,
                  height: 52,
                  borderBottom: "1px solid rgba(196,160,100,0.3)",
                  borderRight: "1px solid rgba(196,160,100,0.3)",
                  pointerEvents: "none",
                  zIndex: 10,
                }}
              />

              <div
                style={{
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 16px 40px sm:0 32px 80px rgba(0,0,0,0.6)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <ProductImages images={images} name={serializedProduct.name} />
              </div>

              {/* Floating badges — display only */}
              <div
                style={{
                  position: "absolute",
                  top: "clamp(12px, 3vw, 16px)",
                  left: "clamp(12px, 3vw, 16px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "clamp(6px, 2vw, 8px)",
                  zIndex: 20,
                }}
              >
                {serializedProduct.featured && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: "#C4A064",
                      color: "#0A0A0A",
                      fontSize: "clamp(8px, 2vw, 10px)",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    ★ Featured
                  </span>
                )}
                {serializedProduct.trending && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: "#1A1A1A",
                      border: "1px solid rgba(196,160,100,0.5)",
                      color: "#C4A064",
                      fontSize: "clamp(8px, 2vw, 10px)",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    ↑ Trending
                  </span>
                )}
                {serializedProduct.comparePrice && (
                  <span
                    style={{
                      background: "#8B1A1A",
                      color: "#fff",
                      fontSize: "clamp(8px, 2vw, 10px)",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Sale
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT — Info */}
            <div
              className="lg:sticky lg:top-24"
              style={{ display: "flex", flexDirection: "column" }}
            >
              {/* Category pill — display only */}
              <div style={{ marginBottom: "clamp(12px, 3vw, 16px)" }}>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "clamp(8px, 2vw, 10px)",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "#C4A064",
                    border: "1px solid rgba(196,160,100,0.4)",
                    padding: "4px 10px",
                    borderRadius: 2,
                  }}
                >
                  {serializedProduct.category.name}
                </span>
              </div>

              {/* Product name — display only */}
              <h1
                className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl"
                style={{
                  fontWeight: 300,
                  lineHeight: 1.12,
                  letterSpacing: "-0.01em",
                  color: "#F5F0E8",
                  marginBottom: "clamp(16px, 3vw, 20px)",
                }}
              >
                {serializedProduct.name}
              </h1>

              {/* Gold divider — display only */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(8px, 2vw, 12px)",
                  marginBottom: "clamp(16px, 3vw, 24px)",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background:
                      "linear-gradient(to right, rgba(196,160,100,0.6), transparent)",
                  }}
                />
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "rgba(196,160,100,0.5)",
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background:
                      "linear-gradient(to left, rgba(196,160,100,0.6), transparent)",
                  }}
                />
              </div>

              {/* Pricing — display only */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "clamp(8px, 2vw, 12px)",
                  marginBottom: "clamp(24px, 4vw, 32px)",
                  flexWrap: "wrap",
                }}
              >
                <span
                  className="text-3xl sm:text-4xl md:text-5xl"
                  style={{
                    fontWeight: 300,
                    color: "#C4A064",
                    letterSpacing: "-0.02em",
                  }}
                >
                  ₹{serializedProduct.price.toLocaleString("en-IN")}
                </span>
                {serializedProduct.comparePrice && (
                  <>
                    <span
                      style={{
                        fontSize: "clamp(14px, 3vw, 20px)",
                        color: "#6A5A4A",
                        textDecoration: "line-through",
                        marginBottom: 4,
                      }}
                    >
                      ₹{serializedProduct.comparePrice.toLocaleString("en-IN")}
                    </span>
                    <span
                      style={{
                        fontSize: "clamp(9px, 2vw, 11px)",
                        color: "#e87070",
                        background: "rgba(139,26,26,0.18)",
                        border: "1px solid rgba(139,26,26,0.35)",
                        padding: "3px 8px",
                        borderRadius: 2,
                        marginBottom: 4,
                        letterSpacing: "0.06em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {discountPercent}% off
                    </span>
                  </>
                )}
              </div>

              {/* ── ProductInfo: completely untouched, no wrapper overrides ── */}
              <ProductInfo product={serializedProduct} />

              {/* Low-stock indicator — display only */}
              {serializedProduct.stock > 0 && serializedProduct.stock <= 10 && (
                <div
                  style={{
                    marginTop: "clamp(12px, 3vw, 16px)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: "clamp(11px, 2.5vw, 12px)",
                    color: "#C4956A",
                    letterSpacing: "0.04em",
                  }}
                >
                  <span
                    className="animate-pulse"
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#C4956A",
                      flexShrink: 0,
                      display: "inline-block",
                    }}
                  />
                  Only {serializedProduct.stock} left in stock
                </div>
              )}

              {/* Trust signals — display only */}
              <div
                style={{
                  marginTop: "clamp(20px, 4vw, 28px)",
                  paddingTop: "clamp(16px, 3vw, 24px)",
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
                  gap: "clamp(8px, 3vw, 12px)",
                  textAlign: "center",
                }}
              >
                {[
                  { icon: "🚚", label: "Free Delivery", sub: "Orders over ₹999" },
                  { icon: "↩", label: "Easy Returns", sub: "Within 30 days" },
                  { icon: "✦", label: "Authentic", sub: "100% genuine" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "clamp(3px, 1vw, 4px)",
                      minWidth: 0,
                    }}
                  >
                    <span style={{ fontSize: "clamp(16px, 4vw, 20px)" }}>{item.icon}</span>
                    <span
                      style={{
                        fontSize: "clamp(8px, 2vw, 9px)",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(245,240,232,0.8)",
                        fontWeight: 600,
                        lineHeight: 1.2,
                      }}
                    >
                      {item.label}
                    </span>
                    <span style={{ fontSize: "clamp(8px, 2vw, 10px)", color: "#6A5A4A", lineHeight: 1.2 }}>{item.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════ SECTION DIVIDER ════════ */}
        <div
          className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10"
          style={{ marginTop: "clamp(48px, 8vw, 80px)", marginBottom: 8 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "rgba(196,160,100,0.35)",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "rgba(196,160,100,0.35)",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "rgba(196,160,100,0.35)",
                  display: "inline-block",
                }}
              />
            </div>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>
        </div>

        {/* ════════ PRODUCT TABS ════════ */}
        <section
          className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10"
          style={{ marginTop: "clamp(36px, 6vw, 48px)" }}
        >
          <div style={{ marginBottom: "clamp(20px, 4vw, 28px)" }}>
            <p
              style={{
                fontSize: "clamp(8px, 2vw, 10px)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#C4A064",
                marginBottom: "clamp(4px, 1vw, 6px)",
              }}
            >
              Details
            </p>
            <p
              className="text-xl sm:text-2xl md:text-3xl"
              style={{
                fontWeight: 300,
                color: "rgba(245,240,232,0.9)",
                letterSpacing: "-0.01em",
              }}
            >
              Product Information
            </p>
          </div>
          <div
            style={{
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 4px 20px sm:0 8px 40px rgba(0,0,0,0.4)",
            }}
          >
            <ProductTabs product={serializedProduct} />
          </div>
        </section>

        {/* ════════ REVIEWS ════════ */}
        <section
          className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10"
          style={{ marginTop: "clamp(48px, 8vw, 80px)" }}
        >
          <div style={{ marginBottom: "clamp(20px, 4vw, 28px)" }}>
            <p
              style={{
                fontSize: "clamp(8px, 2vw, 10px)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#C4A064",
                marginBottom: "clamp(4px, 1vw, 6px)",
              }}
            >
              Reviews
            </p>
            <p
              className="text-xl sm:text-2xl md:text-3xl"
              style={{
                fontWeight: 300,
                color: "rgba(245,240,232,0.9)",
                letterSpacing: "-0.01em",
              }}
            >
              What Our Customers Say
            </p>
          </div>
          <div
            style={{
              background: "#0F0F0F",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 4px 20px sm:0 8px 40px rgba(0,0,0,0.35)",
            }}
          >
            <ReviewSection productId={product.id} />
          </div>
        </section>

        {/* ════════ RELATED PRODUCTS ════════ */}
        <section
          className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10"
          style={{ marginTop: "clamp(48px, 8vw, 80px)", marginBottom: "clamp(60px, 10vw, 100px)" }}
        >
          <div style={{ marginBottom: "clamp(24px, 4vw, 36px)" }}>
            <p
              style={{
                fontSize: "clamp(8px, 2vw, 10px)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#C4A064",
                marginBottom: "clamp(4px, 1vw, 6px)",
              }}
            >
              Discover More
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "clamp(12px, 3vw, 16px)",
                flexWrap: "wrap",
              }}
            >
              <p
                className="text-xl sm:text-2xl md:text-3xl"
                style={{
                  fontWeight: 300,
                  color: "rgba(245,240,232,0.9)",
                  letterSpacing: "-0.01em",
                }}
              >
                You May Also Like
              </p>
              <div
                style={{
                  flex: 1,
                  minWidth: 40,
                  maxWidth: 200,
                  height: 1,
                  background:
                    "linear-gradient(to right, rgba(196,160,100,0.4), transparent)",
                  alignSelf: "center",
                }}
              />
            </div>
          </div>

          <RelatedProducts
            categoryId={product.categoryId}
            currentProductId={product.id}
          />
        </section>

      </main>

      <Footer />
    </div>
  )
}
