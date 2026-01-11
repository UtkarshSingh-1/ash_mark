import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Scale, AlertTriangle } from "lucide-react"

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-lg text-muted-foreground">
              Last updated: January 2025
            </p>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                Welcome to ASHMARK! These Terms of Service ("Terms") govern your use of our website and services. 
                By accessing or using our website, you agree to be bound by these Terms. If you do not agree to 
                these Terms, please do not use our services.
              </p>
            </CardContent>
          </Card>

          {/* Acceptance of Terms */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6 text-crimson-600" />
              Acceptance of Terms
            </h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  By accessing and using this website, you accept and agree to be bound by the terms and provision 
                  of this agreement. Additionally, when using this website's particular services, you shall be 
                  subject to any posted guidelines or rules applicable to such services.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• You must be at least 18 years old to use our services</li>
                  <li>• You are responsible for maintaining the confidentiality of your account</li>
                  <li>• You agree to provide accurate and complete information</li>
                  <li>• You are responsible for all activities that occur under your account</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Use of Website */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Use of Website</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Permitted Uses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Browse and purchase products for personal use</li>
                    <li>• Create and manage your account</li>
                    <li>• Contact our customer service team</li>
                    <li>• Leave reviews and feedback</li>
                    <li>• Subscribe to our newsletter</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Prohibited Uses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Use the website for any unlawful purpose</li>
                    <li>• Attempt to gain unauthorized access to our systems</li>
                    <li>• Interfere with the proper functioning of the website</li>
                    <li>• Use automated systems to access the website</li>
                    <li>• Copy or reproduce any content without permission</li>
                    <li>• Transmit viruses or malicious code</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Products and Orders */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Products and Orders</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• We strive to provide accurate product descriptions and images</li>
                    <li>• Colors may vary slightly due to monitor settings</li>
                    <li>• Product availability is subject to stock levels</li>
                    <li>• We reserve the right to modify product specifications</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• All orders are subject to acceptance and availability</li>
                    <li>• We reserve the right to refuse or cancel any order</li>
                    <li>• Prices are subject to change without notice</li>
                    <li>• Payment must be received before order processing</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing and Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• All prices are in Indian Rupees (INR)</li>
                    <li>• Prices include applicable taxes</li>
                    <li>• We accept major credit cards, debit cards, and UPI</li>
                    <li>• Payment is processed securely through Razorpay</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Returns and Refunds */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Returns and Refunds</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  Our return and refund policy is detailed in our Returns & Exchanges page. Key points include:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 30-day return window from delivery date</li>
                  <li>• Items must be unworn and in original condition</li>
                  <li>• Free return shipping within India</li>
                  <li>• Refunds processed to original payment method</li>
                  <li>• Custom or personalized items are non-returnable</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Intellectual Property */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Intellectual Property</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  All content on this website, including text, graphics, logos, images, and software, is the property 
                  of ASHMARK and is protected by copyright and other intellectual property laws.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• You may not reproduce or distribute our content without permission</li>
                  <li>• Our trademarks and logos are protected</li>
                  <li>• User-generated content remains your property</li>
                  <li>• We may use your content for marketing purposes with consent</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Limitation of Liability */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Scale className="h-6 w-6 text-crimson-600" />
              Limitation of Liability
            </h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  To the maximum extent permitted by law, ASHMARK shall not be liable for any indirect, incidental, 
                  special, consequential, or punitive damages, including but not limited to:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Loss of profits, data, or business opportunities</li>
                  <li>• Damages resulting from use or inability to use our services</li>
                  <li>• Damages resulting from unauthorized access to your account</li>
                  <li>• Damages resulting from third-party conduct or content</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Disclaimers */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-crimson-600" />
              Disclaimers
            </h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  Our website and services are provided "as is" without warranties of any kind. We disclaim all 
                  warranties, express or implied, including but not limited to:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Warranties of merchantability and fitness for a particular purpose</li>
                  <li>• Warranties regarding accuracy, reliability, or completeness of content</li>
                  <li>• Warranties that the website will be uninterrupted or error-free</li>
                  <li>• Warranties regarding security or freedom from viruses</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Indemnification */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Indemnification</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  You agree to indemnify and hold harmless ASHMARK and its officers, directors, employees, and agents 
                  from any claims, damages, losses, or expenses (including reasonable attorneys' fees) arising out of 
                  or relating to your use of our services or violation of these Terms.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Termination */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Termination</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  We may terminate or suspend your account and access to our services at any time, with or without 
                  cause, with or without notice, for any reason, including if you breach these Terms.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• You may terminate your account at any time</li>
                  <li>• Upon termination, your right to use our services ceases</li>
                  <li>• We may retain your information as required by law</li>
                  <li>• Provisions that by their nature should survive termination shall remain in effect</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Governing Law */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Governing Law</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  These Terms shall be governed by and construed in accordance with the laws of India. Any disputes 
                  arising out of or relating to these Terms or our services shall be subject to the exclusive 
                  jurisdiction of the courts in Mumbai, Maharashtra.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Changes to Terms */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Changes to Terms</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  We reserve the right to modify these Terms at any time. We will notify you of any material changes 
                  by posting the new Terms on this page and updating the "Last updated" date. Your continued use of 
                  our services after any such changes constitutes your acceptance of the new Terms.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Email:</strong> legal@ashmark.com</p>
                  <p><strong>Phone:</strong> +91 9876543210</p>
                </div>
                <div>
                  <p><strong>Address:</strong></p>
                  <p>123 Fashion Street<br />Mumbai, Maharashtra 400001<br />India</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}