import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import Image from "next/image"
import { MapPin, Clock, Phone, Mail } from "lucide-react"

export default function StorePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Our Store</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Visit us at our physical location and experience our premium collection in person
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-crimson-600" />
                    ASHMARK Flagship Store
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <address className="not-italic text-muted-foreground">
                    <p>123 Fashion Street</p>
                    <p>Mumbai, Maharashtra 400001</p>
                    <p>India</p>
                  </address>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Mon-Sat: 10:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Sunday: 11:00 AM - 6:00 PM</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>+91 9876543210</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>store@ashmark.com</span>
                  </div>
                  
                  <Button asChild className="mt-4">
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Directions
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="h-96 rounded-lg overflow-hidden relative">
              <Image
                src="/map.png"
                alt="ASHMARK Store Location"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Why Visit Our Store?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Try Before You Buy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Experience the premium quality and perfect fit of our t-shirts before making a purchase.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Expert Styling</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get personalized styling advice from our fashion experts to find the perfect look.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Exclusive Collections</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Discover limited edition designs and exclusive collections available only in-store.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}