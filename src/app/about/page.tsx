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
              We're passionate about creating premium quality t-shirts that combine style, comfort, and sustainability. 
              Our journey began with a simple vision: to make fashion accessible without compromising on quality.
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
                  To provide high-quality, sustainable t-shirts that empower individuals to express their unique style 
                  while making a positive impact on the environment and communities we serve.
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
                  To become the leading sustainable fashion brand that sets new standards for quality, 
                  ethical production, and customer satisfaction in the t-shirt industry.
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
                    We use only the finest materials and maintain strict quality control to ensure every 
                    product meets our high standards.
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
                    Our customers are at the heart of everything we do. We listen, learn, and continuously 
                    improve based on your feedback.
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
                    We're committed to sustainable practices, from eco-friendly materials to ethical 
                    manufacturing processes.
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
                      ASHMARK was founded in 2020 by a team of fashion enthusiasts who were frustrated with the 
                      lack of quality and sustainability in the t-shirt market. We noticed that most brands 
                      either compromised on quality or charged exorbitant prices.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Our founders, with backgrounds in textile engineering and sustainable fashion, set out to 
                      create a brand that would bridge this gap. We spent months researching the best materials, 
                      working with ethical manufacturers, and perfecting our designs.
                    </p>
                    <p className="text-muted-foreground">
                      Today, ASHMARK has grown from a small startup to a trusted brand serving thousands of 
                      customers worldwide, all while maintaining our commitment to quality, sustainability, and 
                      customer satisfaction.
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
              We're a diverse team of designers, engineers, and customer service professionals 
              who are passionate about creating the best possible experience for our customers.
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