"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, ShoppingCart, User, Search, Heart } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/cart-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export function Navbar() {
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Our Products", href: "/products" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Ashmark Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <div className="text-2xl font-bold text-crimson-600">ASHMARK</div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE: search bar + icons */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Desktop search bar (visible on md+) */}
          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearch} className="flex items-center">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-64 mr-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Wishlist */}
          <Button variant="ghost" size="sm" asChild className="h-9 w-9 p-0">
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="sm" asChild className="relative h-9 w-9 p-0">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartCount}
                </Badge>
              )}
            </Link>
          </Button>

          {/* User Menu */}
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">Orders</Link>
                </DropdownMenuItem>
                {session.user.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => signIn()} variant="ghost" size="sm" className="h-9">
              <User className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden h-9 w-9 p-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-96">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                  <Image
                    src="/logo.png"
                    alt="Ashmark Logo"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <div className="text-lg font-bold text-crimson-600">ASHMARK</div>
                </div>

                <div className="flex flex-col space-y-6 flex-1">
                  {/* Mobile Search */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Search
                    </h3>
                    <form onSubmit={handleSearch} className="relative">
                      <Input
                        type="search"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </form>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Navigation
                    </h3>
                    <div className="space-y-1">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Mobile User Actions */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Account
                    </h3>
                    {session?.user ? (
                      <div className="space-y-1">
                        <Link
                          href="/profile"
                          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          Profile
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          Orders
                        </Link>
                        {session.user.role === "ADMIN" && (
                          <Link
                            href="/admin"
                            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
                          >
                            Admin Dashboard
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Button
                          onClick={() => signIn()}
                          className="w-full justify-start bg-crimson-600 hover:bg-crimson-700"
                        >
                          Login
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Logout Button (if logged in) */}
                  {session?.user && (
                    <div className="pt-4 border-t">
                      <Button
                        onClick={() => signOut()}
                        variant="outline"
                        className="w-full"
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}