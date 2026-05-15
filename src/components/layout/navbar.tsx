"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, ShoppingCart, User, Search, Heart, X } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  const navigation = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "Our Products", href: "/products", icon: "✨" },
  ];

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(196, 160, 100, 0.3), 0 0 40px rgba(196, 160, 100, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(196, 160, 100, 0.5), 0 0 60px rgba(196, 160, 100, 0.2);
          }
        }

        @keyframes iconPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes cartBounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }

        .navbar-container {
          animation: slideDown 0.6s ease-out;
        }

        .navbar-glass {
          background: linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(20, 20, 20, 0.9) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(196, 160, 100, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(196, 160, 100, 0.1);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .navbar-glass.scrolled {
          border-color: rgba(196, 160, 100, 0.3);
          box-shadow: 0 12px 48px rgba(196, 160, 100, 0.1), 0 0 40px rgba(196, 160, 100, 0.05);
        }

        .nav-item {
          position: relative;
          font-weight: 500;
          letter-spacing: 0.8px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          background: linear-gradient(135deg, #F5F0E8 0%, #C4A064 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          opacity: 0.9;
        }

        .nav-item:hover {
          opacity: 1;
          transform: translateY(-2px);
        }

        .nav-item::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #C4A064, #F5F0E8);
          transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .nav-item:hover::after {
          width: 100%;
        }

        .icon-button {
          position: relative;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(196, 160, 100, 0.1) 0%, rgba(196, 160, 100, 0.05) 100%);
          border: 1px solid rgba(196, 160, 100, 0.2);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          color: #C4A064;
          overflow: hidden;
        }

        .icon-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(196, 160, 100, 0.2), transparent);
          transition: left 0.5s;
        }

        .icon-button:hover {
          background: linear-gradient(135deg, rgba(196, 160, 100, 0.2) 0%, rgba(196, 160, 100, 0.1) 100%);
          border-color: rgba(196, 160, 100, 0.4);
          box-shadow: 0 0 20px rgba(196, 160, 100, 0.2), inset 0 0 20px rgba(196, 160, 100, 0.05);
          transform: translateY(-2px);
        }

        .icon-button:hover::before {
          left: 100%;
        }

        .icon-button svg {
          animation: float 3s ease-in-out infinite;
        }

        .icon-button:hover svg {
          animation: float 1.5s ease-in-out infinite;
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: linear-gradient(135deg, #C4A064 0%, #E8C547 100%);
          color: #0A0A0A;
          font-weight: 700;
          font-size: 11px;
          min-width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #0A0A0A;
          animation: cartBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 12px rgba(196, 160, 100, 0.4);
        }

        .search-container {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          border: 1px solid rgba(196, 160, 100, 0.2);
          background: linear-gradient(135deg, rgba(196, 160, 100, 0.05) 0%, rgba(196, 160, 100, 0.02) 100%);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .search-container:focus-within {
          border-color: rgba(196, 160, 100, 0.5);
          background: linear-gradient(135deg, rgba(196, 160, 100, 0.1) 0%, rgba(196, 160, 100, 0.05) 100%);
          box-shadow: 0 0 25px rgba(196, 160, 100, 0.15);
        }

        .search-container input {
          background: transparent;
          color: #F5F0E8;
          border: none;
          outline: none;
          font-size: 14px;
          letter-spacing: 0.5px;
        }

        .search-container input::placeholder {
          color: rgba(196, 160, 100, 0.4);
        }

        .search-icon {
          color: #C4A064;
          opacity: 0.7;
        }

        .logo-glow {
          animation: glow 3s ease-in-out infinite;
          filter: drop-shadow(0 0 8px rgba(196, 160, 100, 0.3));
        }

        .mobile-menu-content {
          background: linear-gradient(135deg, #0A0A0A 0%, #151515 100%);
        }

        .mobile-section-title {
          color: #C4A064;
          font-weight: 600;
          letter-spacing: 1.2px;
          font-size: 11px;
          text-transform: uppercase;
          opacity: 0.9;
        }

        .mobile-menu-item {
          position: relative;
          padding: 12px 16px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(196, 160, 100, 0.05) 0%, rgba(196, 160, 100, 0.01) 100%);
          border: 1px solid rgba(196, 160, 100, 0.1);
          color: #F5F0E8;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-weight: 500;
          letter-spacing: 0.5px;
          cursor: pointer;
        }

        .mobile-menu-item:hover {
          background: linear-gradient(135deg, rgba(196, 160, 100, 0.15) 0%, rgba(196, 160, 100, 0.08) 100%);
          border-color: rgba(196, 160, 100, 0.3);
          transform: translateX(6px);
          box-shadow: 0 0 15px rgba(196, 160, 100, 0.1);
        }

        .menu-icon {
          transition: transform 0.3s ease;
        }

        .sheet-trigger:active .menu-icon {
          transform: rotate(90deg);
        }
      `}</style>

      <header className="navbar-container sticky top-0 z-50 w-full">
        <div className="navbar-glass">
          <nav className="flex h-20 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
            {/* LOGO */}
            <Link href="/" className="flex items-center">
              <div className="logo-glow">
                <Image
                  src="/logo.png"
                  alt="Ashmark Logo"
                  width={48}
                  height={48}
                  className="object-contain filter brightness-110"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 ml-10">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onMouseEnter={() => setActiveHover(item.name)}
                  onMouseLeave={() => setActiveHover(null)}
                  className="nav-item text-sm whitespace-nowrap flex items-center"
                >
                  <span className="text-base mr-1">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>

            {/* RIGHT SIDE: Icons & Search */}
            <div className="flex items-center gap-3">
              {/* Desktop Search */}
              <div className="hidden lg:flex items-center">
                <form onSubmit={handleSearch} className="search-container px-4 py-2 w-80 flex items-center gap-2">
                  <Search className="search-icon h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>

              {/* Wishlist Icon */}
              <Link href="/wishlist">
                <button className="icon-button">
                  <Heart className="h-5 w-5" />
                </button>
              </Link>

              {/* Cart Icon */}
              <Link href="/cart">
                <button className="icon-button relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <div className="cart-badge">
                      {cartCount > 9 ? "9+" : cartCount}
                    </div>
                  )}
                </button>
              </Link>

              {/* User Menu */}
              {session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="icon-button">
                      <User className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] border border-[rgba(196,160,100,0.3)] shadow-2xl"
                  >
                    <DropdownMenuLabel className="text-[#C4A064] font-semibold">
                      ✨ My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[rgba(196,160,100,0.1)]" />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="text-[#F5F0E8] hover:text-[#C4A064] cursor-pointer">
                        👤 Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="text-[#F5F0E8] hover:text-[#C4A064] cursor-pointer">
                        📦 Orders
                      </Link>
                    </DropdownMenuItem>
                    {session.user.role === "ADMIN" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="text-[#C4A064] hover:text-[#F5F0E8] cursor-pointer">
                          ⚙️ Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-[rgba(196,160,100,0.1)]" />
                    <DropdownMenuItem 
                      onClick={() => signOut()}
                      className="text-[#e87070] hover:text-[#ff8888] cursor-pointer"
                    >
                      🚪 Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button 
                  onClick={() => signIn()}
                  className="icon-button hidden sm:flex"
                >
                  <User className="h-5 w-5 mr-1" />
                </button>
              )}

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <button className="icon-button md:hidden sheet-trigger">
                    <Menu className="menu-icon h-5 w-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-96 p-0 border-l border-[rgba(196,160,100,0.2)]">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="mobile-menu-content h-full flex flex-col">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between p-6 border-b border-[rgba(196,160,100,0.15)]">
                      <div className="flex items-center gap-3">
                        <Image
                          src="/logo.png"
                          alt="Ashmark"
                          width={36}
                          height={36}
                          className="object-contain filter brightness-110"
                        />
                        <span className="text-[#C4A064] font-bold text-lg">ASHMARK</span>
                      </div>
                    </div>

                    {/* Mobile Search */}
                    <div className="p-6 border-b border-[rgba(196,160,100,0.15)]">
                      <form onSubmit={handleSearch} className="search-container px-4 py-3 flex items-center gap-2">
                        <Search className="search-icon h-4 w-4" />
                        <Input
                          type="search"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="search-input w-full"
                        />
                      </form>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                      {/* Navigation */}
                      <div className="space-y-3">
                        <h3 className="mobile-section-title">Navigation</h3>
                        <div className="space-y-2">
                          {navigation.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="mobile-menu-item block"
                            >
                              <span className="text-lg mr-2">{item.icon}</span>
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Account */}
                      <div className="space-y-3">
                        <h3 className="mobile-section-title">Account</h3>
                        {session?.user ? (
                          <div className="space-y-2">
                            <Link href="/profile" className="mobile-menu-item block">
                              👤 Profile
                            </Link>
                            <Link href="/orders" className="mobile-menu-item block">
                              📦 Orders
                            </Link>
                            {session.user.role === "ADMIN" && (
                              <Link href="/admin" className="mobile-menu-item block">
                                ⚙️ Admin Dashboard
                              </Link>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => signIn()}
                            className="mobile-menu-item block w-full text-left bg-gradient-to-r from-[#C4A064] to-[#E8C547] text-[#0A0A0A] font-bold hover:shadow-lg"
                          >
                            🔐 Login Now
                          </button>
                        )}
                      </div>

                      {/* Quick Links */}
                      <div className="space-y-3">
                        <h3 className="mobile-section-title">Quick Links</h3>
                        <div className="space-y-2">
                          <Link href="/wishlist" className="mobile-menu-item block">
                            ❤️ Wishlist
                          </Link>
                          <Link href="/cart" className="mobile-menu-item block">
                            🛒 Cart
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Logout Button */}
                    {session?.user && (
                      <div className="p-6 border-t border-[rgba(196,160,100,0.15)]">
                        <button
                          onClick={() => signOut()}
                          className="w-full py-3 rounded-xl border-2 border-[#e87070] text-[#e87070] font-bold hover:bg-[rgba(232,112,112,0.1)] transition-all duration-300"
                        >
                          🚪 Logout
                        </button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
