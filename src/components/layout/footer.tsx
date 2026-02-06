import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";

export function Footer() {
  return (
    <footer className="bg-muted py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-bold text-crimson-600 mb-4">
              ASHMARK
            </div>
            <p className="text-muted-foreground mb-4">
              Premium quality t-shirts with unique designs. Style meets comfort
              at ASHMARK.
            </p>

            <div className="flex space-x-2">
              {/* Facebook - Coming Soon */}
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Button variant="ghost" size="sm">
                      <Facebook className="h-4 w-4" />
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Content
                    side="bottom"
                    className="text-xs bg-black text-white px-2 py-1 rounded"
                  >
                    Coming Soon
                  </Tooltip.Content>
                </Tooltip.Root>
              </Tooltip.Provider>

              {/* Instagram - link will be added later */}
              <Button variant="ghost" size="sm">
                <Instagram className="h-4 w-4" />
              </Button>

              {/* Twitter - Coming Soon */}
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Button variant="ghost" size="sm">
                      <Twitter className="h-4 w-4" />
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Content
                    side="bottom"
                    className="text-xs bg-black text-white px-2 py-1 rounded"
                  >
                    Coming Soon
                  </Tooltip.Content>
                </Tooltip.Root>
              </Tooltip.Provider>

              {/* YouTube - link will be added later */}
              <Button variant="ghost" size="sm">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-foreground">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/returns" className="hover:text-foreground">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-foreground">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to get notified about new arrivals and exclusive offers.
            </p>
            <div className="flex space-x-2">
              <Input placeholder="Your email" className="flex-1" />
              <Button className="bg-crimson-600 hover:bg-crimson-700">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <hr className="my-8 border-border" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground">
            © 2025 ASHMARK. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
