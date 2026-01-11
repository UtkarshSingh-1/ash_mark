import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, Clock, Send } from "lucide-react"

export default function SupportPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Customer Support</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're here to help! Get in touch with our support team for any questions or issues you may have.
            </p>
          </div>

          {/* Support Options */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-crimson-600" />
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Call us for immediate assistance with your order or account.
                </p>
                <div className="text-center">
                  <p className="font-medium mb-2">+91 9876543210</p>
                  <p className="text-sm text-muted-foreground">Mon-Fri: 9 AM - 6 PM IST</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-crimson-600" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Send us an email and we'll respond within 24 hours.
                </p>
                <div className="text-center">
                  <p className="font-medium mb-2">support@ashmark.com</p>
                  <p className="text-sm text-muted-foreground">24/7 Email Support</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Support Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                          First Name
                        </label>
                        <Input id="firstName" placeholder="John" />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                          Last Name
                        </label>
                        <Input id="lastName" placeholder="Doe" />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>

                    <div>
                      <label htmlFor="orderNumber" className="block text-sm font-medium mb-2">
                        Order Number (Optional)
                      </label>
                      <Input id="orderNumber" placeholder="Order #123456" />
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium mb-2">
                        Category
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="order">Order Issues</SelectItem>
                          <SelectItem value="shipping">Shipping & Delivery</SelectItem>
                          <SelectItem value="returns">Returns & Exchanges</SelectItem>
                          <SelectItem value="product">Product Questions</SelectItem>
                          <SelectItem value="account">Account Issues</SelectItem>
                          <SelectItem value="payment">Payment Issues</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject
                      </label>
                      <Input id="subject" placeholder="Brief description of your issue" />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message
                      </label>
                      <Textarea 
                        id="message" 
                        placeholder="Please provide as much detail as possible about your issue..."
                        className="min-h-[120px]"
                      />
                    </div>
                    
                    <Button className="w-full bg-crimson-600 hover:bg-crimson-700">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Support Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-crimson-600" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM IST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM IST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <p className="text-xs text-muted-foreground">
                        <strong>Note:</strong> Email support is available 24/7. We'll respond within 24 hours.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Help</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <a href="/faq" className="block p-3 border border-border rounded-md hover:bg-muted transition-colors">
                      <div className="font-medium">Frequently Asked Questions</div>
                      <div className="text-sm text-muted-foreground">Find answers to common questions</div>
                    </a>
                    <a href="/size-guide" className="block p-3 border border-border rounded-md hover:bg-muted transition-colors">
                      <div className="font-medium">Size Guide</div>
                      <div className="text-sm text-muted-foreground">Find your perfect fit</div>
                    </a>
                    <a href="/shipping" className="block p-3 border border-border rounded-md hover:bg-muted transition-colors">
                      <div className="font-medium">Shipping Information</div>
                      <div className="text-sm text-muted-foreground">Delivery times and options</div>
                    </a>
                    <a href="/returns" className="block p-3 border border-border rounded-md hover:bg-muted transition-colors">
                      <div className="font-medium">Returns & Exchanges</div>
                      <div className="text-sm text-muted-foreground">Return policy and process</div>
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Before You Contact Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Check your order status in your account</p>
                    <p>• Review our FAQ section</p>
                    <p>• Have your order number ready</p>
                    <p>• Describe your issue in detail</p>
                    <p>• Include any relevant screenshots</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Response Times */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Response Times</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Phone Support</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-crimson-600 mb-2">Immediate</div>
                  <p className="text-sm text-muted-foreground">
                    Speak directly with our support team
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Email Support</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-crimson-600 mb-2">24 Hours</div>
                  <p className="text-sm text-muted-foreground">
                    We'll respond to your email within 24 hours
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