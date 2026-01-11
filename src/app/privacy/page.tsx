import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, Database } from "lucide-react"

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              Last updated: January 2025
            </p>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                At ASHMARK, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit 
                our website or make a purchase from us.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Database className="h-6 w-6 text-crimson-600" />
              Information We Collect
            </h2>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Name and contact information (email address, phone number)</li>
                    <li>• Shipping and billing addresses</li>
                    <li>• Payment information (processed securely through Razorpay)</li>
                    <li>• Account credentials and preferences</li>
                    <li>• Communication preferences</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Website usage data and analytics</li>
                    <li>• Device information and IP address</li>
                    <li>• Browser type and version</li>
                    <li>• Pages visited and time spent on our site</li>
                    <li>• Referring website information</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Purchase history and order details</li>
                    <li>• Product preferences and wishlist items</li>
                    <li>• Return and exchange information</li>
                    <li>• Customer service interactions</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Eye className="h-6 w-6 text-crimson-600" />
              How We Use Your Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Process and fulfill your orders</li>
                    <li>• Send order confirmations and updates</li>
                    <li>• Handle returns and exchanges</li>
                    <li>• Provide customer support</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Communication</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Send marketing emails (with your consent)</li>
                    <li>• Respond to your inquiries</li>
                    <li>• Send important account updates</li>
                    <li>• Provide order status updates</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Website Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Analyze website usage patterns</li>
                    <li>• Improve user experience</li>
                    <li>• Develop new features and products</li>
                    <li>• Conduct market research</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Legal Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Comply with legal obligations</li>
                    <li>• Prevent fraud and abuse</li>
                    <li>• Protect our rights and interests</li>
                    <li>• Enforce our terms of service</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Information Sharing */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Lock className="h-6 w-6 text-crimson-600" />
              Information Sharing
            </h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information 
                  only in the following circumstances:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our website, processing payments, and delivering orders</li>
                  <li>• <strong>Legal Requirements:</strong> When required by law or to protect our rights, property, or safety</li>
                  <li>• <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li>• <strong>Consent:</strong> When you have given us explicit consent to share your information</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Data Security */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Shield className="h-6 w-6 text-crimson-600" />
              Data Security
            </h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  We implement appropriate security measures to protect your personal information against unauthorized access, 
                  alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• SSL encryption for data transmission</li>
                  <li>• Secure payment processing through Razorpay</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Limited access to personal information</li>
                  <li>• Employee training on data protection</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Your Rights */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Your Rights</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li>• <strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li>• <strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li>• <strong>Portability:</strong> Request transfer of your data to another service</li>
                  <li>• <strong>Objection:</strong> Object to processing of your personal information</li>
                  <li>• <strong>Withdrawal:</strong> Withdraw consent for marketing communications</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Cookies */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Cookies and Tracking</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  We use cookies and similar tracking technologies to enhance your browsing experience and analyze website traffic. 
                  You can control cookie settings through your browser preferences.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-semibold mb-2">Essential Cookies</h3>
                    <p className="text-muted-foreground">Required for website functionality and security</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Analytics Cookies</h3>
                    <p className="text-muted-foreground">Help us understand how visitors use our website</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Email:</strong> privacy@ashmark.com</p>
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

          {/* Policy Updates */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Policy Updates</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy 
                Policy periodically for any changes.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}