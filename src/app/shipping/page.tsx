import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Clock, MapPin, Package, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ShippingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fast, reliable shipping across India. We make sure your orders reach you safely and on time.
            </p>
          </div>

          {/* Shipping Options */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Shipping Options</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-crimson-600" />
                    Standard Shipping
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">3-5 business days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">₹100 (Free on orders above ₹1000)</span>
                    </div>
                    <Badge variant="outline">Most Popular</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-crimson-600" />
                    Express Shipping
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">1-2 business days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">₹250</span>
                    </div>
                    <Badge variant="outline">Fast Delivery</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-crimson-600" />
                    Same Day Delivery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Same day (Mumbai only)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">₹500</span>
                    </div>
                    <Badge variant="outline">Limited Areas</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Delivery Areas */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Delivery Areas</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-crimson-600" />
                    Major Cities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Mumbai</div>
                    <div>• Delhi</div>
                    <div>• Bangalore</div>
                    <div>• Chennai</div>
                    <div>• Kolkata</div>
                    <div>• Hyderabad</div>
                    <div>• Pune</div>
                    <div>• Ahmedabad</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-crimson-600" />
                    Tier 2 Cities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Jaipur</div>
                    <div>• Lucknow</div>
                    <div>• Indore</div>
                    <div>• Bhopal</div>
                    <div>• Coimbatore</div>
                    <div>• Kochi</div>
                    <div>• Chandigarh</div>
                    <div>• And more...</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Order Processing */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Order Processing</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Order Placed</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-12 h-12 bg-crimson-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-crimson-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your order is received and confirmed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Processing</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-12 h-12 bg-crimson-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-6 w-6 text-crimson-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We prepare your order for shipment
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Shipped</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-12 h-12 bg-crimson-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-6 w-6 text-crimson-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your order is on its way to you
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Delivered</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-12 h-12 bg-crimson-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-crimson-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your order has been delivered
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Important Information */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Important Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Times</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Orders placed before 2 PM are processed the same day</li>
                    <li>• Orders placed after 2 PM are processed the next business day</li>
                    <li>• Delivery times exclude weekends and public holidays</li>
                    <li>• We'll send you tracking information once your order ships</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Delivery Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Someone must be available to receive the package</li>
                    <li>• Valid ID may be required for delivery</li>
                    <li>• We cannot deliver to P.O. Boxes</li>
                    <li>• Delivery address cannot be changed after shipment</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tracking */}
          <div className="text-center">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Track Your Order</h2>
                <p className="text-muted-foreground mb-6">
                  Once your order ships, you'll receive a tracking number via email. 
                  You can also track your order in your account dashboard.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/orders">
                    <button className="px-6 py-2 bg-crimson-600 text-white rounded-md hover:bg-crimson-700 transition-colors">
                      Track Order
                    </button>
                  </Link>
                  <Link href="/contact">
                    <button className="px-6 py-2 border border-crimson-600 text-crimson-600 rounded-md hover:bg-crimson-50 transition-colors">
                      Need Help?
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}