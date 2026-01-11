import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Star } from "lucide-react";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/product/product-card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PromoMarquee } from "@/components/layout/promo-marquee";

export default async function HomePage() {
  let featuredProducts: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    images: string[];
    featured: boolean;
    trending: boolean;
    category: { name: string };
  }> = [];
  let trendingProducts: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    images: string[];
    featured: boolean;
    trending: boolean;
    category: { name: string };
  }> = [];
  try {
    const [featuredRaw, trendingRaw] = await Promise.all([
      prisma.product.findMany({
        where: { featured: true },
        take: 4,
        include: { category: true },
      }),
      prisma.product.findMany({
        where: { trending: true },
        take: 4,
        include: { category: true },
      }),
    ]);

    const serialize = (p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      images: Array.isArray(p.images) ? p.images.filter((item: unknown): item is string => typeof item === 'string') : [],
      featured: p.featured,
      trending: p.trending,
      category: { name: p.category.name },
    });

    featuredProducts = featuredRaw.map(serialize);
    trendingProducts = trendingRaw.map(serialize);

    // If no featured products, get any products for recommended section
    if (featuredProducts.length === 0) {
      const anyFeatured = await prisma.product.findMany({
        take: 4,
        include: { category: true },
        orderBy: { createdAt: "desc" },
      });
      featuredProducts = anyFeatured.map(serialize);
    }

    // If no trending products, get any products for trending section
    if (trendingProducts.length === 0) {
      const anyTrending = await prisma.product.findMany({
        take: 4,
        include: { category: true },
        orderBy: { createdAt: "desc" },
      });
      trendingProducts = anyTrending.map(serialize);
    }
  } catch (e) {
    console.error("Database error:", e);
    // If the database is unreachable, render the page without products
  }

  return (
    <>
      <Navbar />
      <PromoMarquee />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-start overflow-hidden">
          <video autoPlay muted loop className="absolute inset-0 hero-video">
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-left text-white max-w-4xl px-8 md:px-24 flex flex-col items-start justify-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-[62px] relative -top-[12px]">
              ASHMARK
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 relative top-[12px]">
              Premium T-Shirts. Unique Designs. Unmatched Quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-crimson-600 hover:bg-crimson-700"
                asChild
              >
                <Link href="/products">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black"
                asChild
              >
                <Link href="/products">
                  Explore Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Recommended Products Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Recommended For You
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Handpicked premium t-shirts designed for style and comfort
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild>
                <Link href="/products">View All Products</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Trending Section */}
        <section className="py-16 px-4 bg-muted/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trending Now
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Most selling products loved by our customers
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          </div>
        </section>



        {/* Testimonials Section */}
        <section className="py-16 px-4 bg-muted/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Our Customers Say
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Real reviews from satisfied customers
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Rahul Sharma",
                  rating: 5,
                  review:
                    "Amazing quality t-shirts! The fabric is so comfortable and the designs are unique. Highly recommended!",
                  verified: true,
                },
                {
                  name: "Priya Patel",
                  rating: 5,
                  review:
                    "Love shopping at ASHMARK. Fast delivery and excellent customer service. Will definitely order again!",
                  verified: true,
                },
                {
                  name: "Amit Kumar",
                  rating: 5,
                  review:
                    "Best t-shirt collection I've seen. The fit is perfect and colors remain vibrant even after multiple washes.",
                  verified: true,
                },
              ].map((testimonial, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: testimonial.rating }).map(
                          (_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          )
                        )}
                      </div>
                      {testimonial.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">
                      {testimonial.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {testimonial.review}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
