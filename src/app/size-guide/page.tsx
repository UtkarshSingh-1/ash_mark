import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, Clock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ReturnsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Returns & Exchanges</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Not satisfied with your purchase? No problem! We offer easy returns and exchanges 
              within 30 days of delivery.
            </p>
          </div>

          {/* Return Policy */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Return Policy</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-crimson-600" />
                    30-Day Window
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You have 30 days from the delivery date to initiate a return or exchange.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-crimson-600" />
                    Easy Process
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Start your return online in just a few clicks. No need to call customer service.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RotateCcw className="h-5 w-5 text-crimson-600" />
                    Free Returns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We provide free return shipping for all returns within India.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Return Conditions */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Return Conditions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    What We Accept
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Items in original condition with tags attached</li>
                    <li>• Unworn and unwashed items</li>
                    <li>• Original packaging included</li>
                    <li>• Items purchased within 30 days</li>
                    <li>• Defective or damaged items</li>
                    <li>• Wrong size or color exchanges</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    What We Don't Accept
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Items worn or washed</li>
                    <li>• Items without original tags</li>
                    <li>• Items damaged by customer</li>
                    <li>• Items returned after 30 days</li>
                    <li>• Custom or personalized items</li>
                    <li>• Items with strong odors or stains</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How to Return */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">How to Return</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">1. Start Return</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-12 h-12 bg-crimson-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-crimson-600 font-bold">1</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Log into your account and go to your order history
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">2. Select Items</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-12 h-12 bg-crimson-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-crimson-600 font-bold">2</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Choose the items you want to return and reason
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">3. Print Label</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-12 h-12 bg-crimson-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-crimson-600 font-bold">3</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Print the prepaid return label we provide
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">4. Ship Back</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-12 h-12 bg-crimson-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-crimson-600 font-bold">4</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Package items and drop off at any courier location
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Refund Process */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Refund Process</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4">Processing Time</h3>
                    <p className="text-sm text-muted-foreground">
                      Once we receive your return, we'll process it within 2-3 business days.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Refund Method</h3>
                    <p className="text-sm text-muted-foreground">
                      Refunds are issued to the original payment method used for the purchase.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Refund Timeline</h3>
                    <p className="text-sm text-muted-foreground">
                      Credit card refunds take 5-10 business days, UPI refunds take 2-3 business days.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Exchange Process */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Exchange Process</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Size Exchange</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Need a different size? We'll send you the new size and you can return the old one.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Free size exchanges within 30 days</li>
                    <li>• We'll ship the new size immediately</li>
                    <li>• Return the old size using our prepaid label</li>
                    <li>• No additional charges for size exchanges</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Color Exchange</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Want a different color? We'll help you exchange it for the color you prefer.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Color exchanges subject to availability</li>
                    <li>• We'll notify you if the color is out of stock</li>
                    <li>• You can choose a refund if color isn't available</li>
                    <li>• Free shipping for color exchanges</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Support */}
          <div className="text-center">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Need Help with Your Return?</h2>
                <p className="text-muted-foreground mb-6">
                  Our customer service team is here to help with any questions about returns or exchanges.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button className="bg-crimson-600 hover:bg-crimson-700">
                      Contact Support
                    </Button>
                  </Link>
                  <Link href="/orders">
                    <Button variant="outline">
                      View Orders
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}