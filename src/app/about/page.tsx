import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Award, Users, Target } from "lucide-react"

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">About ASHMARK</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              ASHMARK was born from the belief that clothing should leave a lasting mark — not chase fleeting trends.
              We create intentional streetwear built to exist beyond eras, seasons, and hype cycles. Clean silhouettes,
              structured proportions, and premium craftsmanship come together to form garments that age with character
              instead of wearing out with time.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-crimson-600" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our mission is to create high-quality, timeless streetwear that empowers individuals to express identity
                  through subtlety, substance, and craft. We reject fast-fashion, trend-based design and instead build pieces
                  with intention, precision, and durability — garments that feel relevant in the past, present, and future.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-crimson-600" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our vision is to redefine modern streetwear through timeless forms, ethical production, and meticulous
                  detail work — with embroidery and texture serving as our visual language. We aim to become a brand that
                  stands out permanently, not loudly, and inspires individuals to create their own lane.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-crimson-600" />
                    Quality First
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Premium materials selected for durability, comfort, and longevity. Construction focused
                    on wearability and endurance. Every piece is built to age with character, not fall apart with time.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-crimson-600" />
                    Customer-Centric
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    ASHMARK is made for individuals who value substance over noise and refuse to blend into the crowd.
                    We listen, adapt, and continually refine our craft based on real-world feedback and community culture.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-crimson-600" />
                    Sustainability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We prioritize ethical production, responsible sourcing, and sustainable materials. True longevity is
                    sustainable — pieces designed to last reduce waste, consumption, and environmental impact over time.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Story */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Our Story</h2>
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-muted-foreground mb-4">
                      ASHMARK began in 2020 as a response to a fashion industry that prioritized speed over substance.
                      Our founders — with backgrounds in textile engineering and modern streetwear — saw a gap:
                      clothing that looked good, but lacked purpose, longevity, or identity.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      We set out to change that by designing intentionally. Embroidery became our signature —
                      not decoration, but identity. Every cut, seam, and proportion is deliberate, unhurried, and precise.
                      This is how pieces become timeless instead of trendy.
                    </p>
                    <p className="text-muted-foreground">
                      Today, ASHMARK has evolved from a small passion project into a global community,
                      yet our philosophy remains the same: Style fades. Identity doesn’t.
                      This is intentional streetwear, made to leave a mark.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-crimson-600 mb-2">10K+</div>
                <div className="text-muted-foreground">Happy Customers</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-crimson-600 mb-2">50+</div>
                <div className="text-muted-foreground">Unique Designs</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-crimson-600 mb-2">100%</div>
                <div className="text-muted-foreground">Sustainable Materials</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-crimson-600 mb-2">4.9★</div>
                <div className="text-muted-foreground">Customer Rating</div>
              </CardContent>
            </Card>
          </div>

          {/* Team */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-8">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              A diverse group of designers, engineers, and creators united by a shared goal:
              to build clothing with identity, integrity, and intention.
            </p>
            <Badge variant="outline" className="text-sm">
              Join Our Team
            </Badge>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
