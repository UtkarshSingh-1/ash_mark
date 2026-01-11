import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle, Search } from "lucide-react"

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our products, shipping, returns, and more.
            </p>
          </div>

          {/* Search */}
          <div className="mb-12">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search FAQs..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-crimson-500"
              />
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {/* Orders & Shipping */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-crimson-600" />
                Orders & Shipping
              </h2>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How long does shipping take?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Standard shipping takes 3-5 business days within India. Express shipping takes 1-2 business days. 
                      We also offer same-day delivery in Mumbai for an additional charge.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Do you ship internationally?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Currently, we only ship within India. We're working on expanding our shipping to international 
                      destinations soon. Sign up for our newsletter to be notified when international shipping becomes available.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How can I track my order?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Once your order ships, you'll receive a tracking number via email. You can also track your order 
                      by logging into your account and going to the "Orders" section.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Can I change my order after it's placed?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      If your order hasn't been processed yet, you can contact our customer service team to make changes. 
                      Once the order is in processing or shipped, changes cannot be made.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Returns & Exchanges */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-crimson-600" />
                Returns & Exchanges
              </h2>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What is your return policy?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      We offer a 30-day return policy for unworn items with tags attached. Items must be in original 
                      condition and packaging. We provide free return shipping within India.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How do I return an item?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Log into your account, go to your order history, and click "Return Item" next to the order. 
                      Follow the instructions to print a prepaid return label and send the item back to us.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Can I exchange for a different size?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Yes! We offer free size exchanges within 30 days. We'll send you the new size immediately 
                      and you can return the old size using our prepaid return label.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How long does it take to process a return?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Once we receive your return, we'll process it within 2-3 business days. Refunds are issued 
                      to your original payment method and may take 5-10 business days to appear on your statement.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Products */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-crimson-600" />
                Products
              </h2>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What materials do you use?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      We use 100% organic cotton for all our t-shirts. Our materials are sustainably sourced and 
                      certified by global standards for quality and environmental responsibility.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How do I choose the right size?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Check our size guide for detailed measurements. If you're between sizes, we recommend sizing up 
                      for a more relaxed fit or sizing down for a more fitted look.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Do you offer plus sizes?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Currently, we offer sizes XS to XXL. We're working on expanding our size range to include 
                      plus sizes. Sign up for our newsletter to be notified when new sizes become available.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How should I care for my t-shirts?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Machine wash cold with like colors, use gentle cycle, and tumble dry low heat. Turn inside out 
                      before washing and avoid bleach. Iron on low heat if needed.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Account & Payment */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-crimson-600" />
                Account & Payment
              </h2>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. 
                      All payments are processed securely through Razorpay.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Is my payment information secure?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Yes, we use industry-standard encryption and security measures to protect your payment information. 
                      We never store your card details on our servers.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Can I create an account without making a purchase?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Yes, you can create an account anytime by clicking "Sign Up" in the top right corner. 
                      Having an account makes it easier to track orders and manage your information.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How do I update my account information?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Log into your account and go to "Profile" to update your personal information, shipping addresses, 
                      and payment methods.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-16 text-center">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Still Have Questions?</h2>
                <p className="text-muted-foreground mb-6">
                  Can't find the answer you're looking for? Our customer service team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/contact" className="inline-block">
                    <Button className="bg-crimson-600 hover:bg-crimson-700">
                      Contact Support
                    </Button>
                  </a>
                  <a href="/size-guide" className="inline-block">
                    <Button variant="outline">
                      Size Guide
                    </Button>
                  </a>
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