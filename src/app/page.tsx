"use client";
import Script from "next/script";
import { useEffect, useCallback, useRef, useState } from "react";
import React from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PromoMarquee } from "@/components/layout/promo-marquee";

export default function AshMark() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Prefetch product routes immediately so navigation is instant
  useEffect(() => {
    router.prefetch("/products");
    router.prefetch("/wishlist");
    router.prefetch("/cart");
  }, [router]);

  useEffect(() => {
    const updateTime = () => {
      const el = document.getElementById("time");
      if (!el) return;
      const now = new Date();
      el.textContent = `IST ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);

    // Fallback hide preloader
    const preloaderFallback = setTimeout(() => {
      const preloader = document.getElementById("preloader");
      if (preloader && !preloader.classList.contains("hidden")) {
        preloader.classList.add("hidden");
      }
    }, 3000);

    return () => {
      clearInterval(clockInterval);
      clearTimeout(preloaderFallback);
    };
  }, []);

  // Drawer open/close with body scroll lock
  const openCart = useCallback(() => {
    setDrawerOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeCart = useCallback(() => {
    setDrawerOpen(false);
    document.body.style.overflow = "";
  }, []);

  // Mobile menu toggle with body scroll lock
  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => {
      const next = !prev;
      document.body.style.overflow = next ? "hidden" : "";
      return next;
    });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    document.body.style.overflow = "";
  }, []);

  // ESC key closes drawer and menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCart();
        closeMenu();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeCart, closeMenu]);

  // Sync drawerOpen/menuOpen states with DOM classes for script.js compatibility
  useEffect(() => {
    const drawer = document.getElementById("drawer");
    const overlay = document.getElementById("drawerOverlay");
    if (drawer) drawer.classList.toggle("open", drawerOpen);
    if (overlay) overlay.classList.toggle("open", drawerOpen);
  }, [drawerOpen]);

  useEffect(() => {
    const mobileMenu = document.getElementById("mobileMenu");
    const menuToggle = document.getElementById("menuToggle");
    if (mobileMenu) mobileMenu.classList.toggle("open", menuOpen);
    if (menuToggle) menuToggle.classList.toggle("open", menuOpen);
  }, [menuOpen]);

  const products = [
    { n: "01", slug: "crane",        name: "The Chronicle of", ital: "FUTURE",        detail: "Silk thread on organic cotton",        price: "₹1,499",  stock: "12 LEFT", img: "product1.webp", alt: "The Golden Crane Embroidered Shirt" },
    { n: "02", slug: "bloom",        name: "Thought behind",   ital: "FALLING BLOOM",        detail: "Hand-stitched florals, charcoal cotton", price: "₹1,399",  stock: "23 LEFT", img: "product2.webp", alt: "Midnight Bloom Shirt" },
    { n: "03", slug: "cartographer", name: "The Tale of",        ital: "Dominant Female", detail: "Map-line embroidery, ivory linen",      price: "₹899", stock: "07 LEFT", img: "product3.webp", alt: "The Cartographer Shirt" },
    { n: "04", slug: "verse",        name: "The Narrative of",      ital: "WRATH",        detail: "Olive thread poetry, sand cotton",     price: "₹1,400",  stock: "31 LEFT", img: "product4.webp", alt: "Olive Verse Shirt" },
    { n: "05", slug: "horizon",       name: "The Tale of",        ital: "Dominant Male",      detail: "Sun-rust gradient stitching",          price: "₹899",  stock: "18 LEFT", img: "product5.webp", alt: "Rust Horizon Shirt" },
  ];

  const dropItems = [
    { n: "01", name: "Crane",   count: 12, pct: "30%", w: 0.30 },
    { n: "02", name: "Bloom",   count: 23, pct: "57%", w: 0.57 },
    { n: "03", name: "Carto.",  count: 7,  pct: "17%", w: 0.17 },
    { n: "04", name: "Verse",   count: 31, pct: "77%", w: 0.77 },
    { n: "05", name: "Horizon", count: 18, pct: "45%", w: 0.45 },
  ];

  const processRows = [
    { n: "01", title: "Selection",  desc: "We source organic cotton from small farms in Gujarat. Each meter is hand-inspected for weave consistency and softness. Only one in three meters meets our standard.", meta: <>02 WEEKS<br />GUJARAT</> },
    { n: "02", title: "Embroidery", desc: "Master artisans hand-stitch each design over 60–80 hours. Silk and cotton threads are dyed in small batches using traditional methods. No two pieces are identical.", meta: <>06 WEEKS<br /></> },
    { n: "03", title: "Finishing",  desc: "Each garment is hand-washed in soft water, sun-dried, and pressed. We sign the inside hem with the artisan's name and the date the piece was completed.", meta: <>02 WEEKS<br />STUDIO</> },
  ];

  const introWords = [
    "A ", "house ", "devoted ", "to ", "the ",
    { em: "vanishing " }, { em: "art " },
    "of ", "hand ", "embroidery — ", "where ", "every ",
    "stitch ", "is ", "a ", "signature, ", "and ",
    "no ", "two ", "are ", "alike.",
  ];

  // Navigate to /products with slug as query param so ProductCard can highlight it
  // Once you create /app/products/[slug]/page.tsx, change this back to:
  //   router.push(`/products/${p.slug}`)
  const handleProductClick = (slug: string) => {
    router.push(`/products?slug=${slug}`);
  };

  return (
    <>
      <Script src="/script.js" strategy="afterInteractive" />
      
      {/* NAV */}
      <nav id="nav">
        <Link href="/" className="logo magnetic">
          <span className="logo-mark">
            <img src="logo.webp" alt="Ash Mark" />
          </span>
          <span>Ash Mark</span>
        </Link>
        <div className="nav-center">
          <Link href="#collection">Collection</Link>
          <Link href="#story">Story</Link>
          <Link href="#process">Process</Link>
          <Link href="#drop">Drop</Link>
        </div>
        <div className="nav-right">
          {/* Wishlist */}
          <button
            className="icon-btn magnetic"
            aria-label="Wishlist"
            data-cursor="liked"
            onClick={() => router.push("/wishlist")}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="icon-btn theme-toggle magnetic" id="themeToggle" aria-label="Toggle theme" type="button">
            <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
            </svg>
            <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="login-btn magnetic" data-cursor="login" onClick={() => signIn()} aria-label="Login" type="button">
            Login
          </button>
          {/* Cart opens the drawer via React state */}
          <button
            className="cart-pill magnetic"
            id="cartBtn"
            onClick={openCart}
            aria-label="View cart"
            type="button"
          >
            <span className="dot" />
            <span className="cart-label">Cart (0)</span>
          </button>
          {/* Hamburger — controlled by React state */}
          <button
            className={`menu-toggle${menuOpen ? " open" : ""}`}
            id="menuToggle"
            aria-label="Menu"
            type="button"
            onClick={toggleMenu}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className="noise" />
      <div className="theme-ripple" id="themeRipple" />
      <div className="scroll-progress" id="scrollProgress" />
      <br /><br /><br />
      <PromoMarquee />

      {/* CURSOR */}
      <div className="cursor-ring" id="cursorRing" />
      <div className="cursor-dot" id="cursorDot" />

      {/* PRELOADER */}
      <div className="preloader" id="preloader">
        <h1 className="preloader-mark">
          <span><i>Ash</i></span>
          <span><i>Mark.</i></span>
        </h1>
        <p className="preloader-tagline">
          <span className="tagline-inner"><em>Born</em> from Fire</span>
        </p>
        <div className="preloader-bar" />
        <div className="preloader-bottom">
          <span>EST. MATHURA — 2024</span>
          <span id="preCount">000</span>
        </div>
      </div>

      {/* FLOATING INFO */}
      <div className="f-info">
        <span>ASH MARK©</span>
        <span>VOL.I — MMXXV</span>
      </div>
      <div className="f-time" id="time">IST 00:00</div>

      {/* WHATSAPP FLOATING BUTTON */}
      <a
        href="https://whatsapp.com/channel/0029Va4xxxxxxxxxxx"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Join our WhatsApp Channel for updates"
      >
        <span className="whatsapp-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </span>
        <span className="whatsapp-label">Join for Updates</span>
      </a>

      {/* MOBILE MENU — controlled by React state */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`} id="mobileMenu">
        <ul>
          <li><Link href="#collection" onClick={closeMenu}><span>Collection</span><span className="num">01</span></Link></li>
          <li><Link href="#story" onClick={closeMenu}><span>Story</span><span className="num">02</span></Link></li>
          <li><Link href="#process" onClick={closeMenu}><span>Process</span><span className="num">03</span></Link></li>
          <li><Link href="#drop" onClick={closeMenu}><span>Drop</span><span className="num">04</span></Link></li>
        </ul>
        {/* Mobile menu action buttons */}
        <div className="mobile-menu-actions">
          <button
            className="mobile-action-btn"
            onClick={() => { signIn(); closeMenu(); }}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Login
          </button>
          <button
            className="mobile-action-btn mobile-action-btn--cart"
            onClick={() => { closeMenu(); openCart(); }}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Cart (0)
          </button>
          <button
            className="mobile-action-btn"
            onClick={() => { router.push("/wishlist"); closeMenu(); }}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Wishlist
          </button>
        </div>
        <div className="mobile-menu-foot">
          <span>JAIPUR — 2025</span>
          <span>VOL. I</span>
        </div>
      </div>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-bg" id="heroBg" />
        <div className="hero-grain" />
        <div className="hero-overlay" />

        <div className="hero-marquee">
          <div className="marquee-track">
            {["Hand Embroidered","·","Lyon, France","·","Edition 001","·","5 Pieces Only","·","40 Hours Per Garment","·",
              "Hand Embroidered","·","Lyon, France","·","Edition 001","·","5 Pieces Only","·","40 Hours Per Garment","·"]
              .map((s, i) => <span key={i}>{s}</span>)}
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-meta">
            <span className="hero-num">N°001</span>
            <span className="hero-line" />
            <span className="hero-loc">Studio · Lyon</span>
          </div>
          <h1 className="hero-title">
            <span className="line"><span className="line-inner">Not Printed.</span></span>
            <span className="line"><span className="line-inner"><em>Crafted.</em></span></span>
          </h1>
          <div className="hero-bottom">
            <Link href="/products" className="btn magnetic" data-cursor="explore" style={{ fontSize: 16 }}>
              <span>Explore Collection</span>
              <span className="arrow">↗</span>
            </Link>
          </div>
        </div>

        <div className="hero-corner tl"><span>EDITION</span><span>001 / 005</span></div>
        <div className="hero-corner tr"><span>SS · 25</span><span>VOL. I</span></div>
        <div className="hero-corner bl"><span>—</span><span>Scroll</span></div>
        <div className="hero-corner br"><span>48.8566° N</span><span>2.3522° E</span></div>
      </section>

      {/* INTRO */}
      <section className="intro">
        <div className="intro-inner">
          <p className="intro-text">
            {introWords.map((w, i) =>
              typeof w === "string"
                ? <span key={i} className="reveal-word">{w}</span>
                : <span key={i} className="reveal-word"><em>{w.em}</em></span>
            )}
          </p>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {[0, 1].map((n) => (
            <span key={n}>
              Handcrafted <span className="star">✦</span>{" "}
              <span className="ital">Embroidery</span>{" "}
              <span className="star">✦</span> Slow Fashion{" "}
              <span className="star">✦</span>{" "}
              <span className="ital">Storytelling</span>{" "}
              <span className="star">✦</span> Embroidery{" "}
              <span className="ital">Perfect Oversized fit</span>{" "}
              <span className="star">✦</span>
              <span className="ital">Box Packaging</span>{" "}
              <span className="star">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stats-inner">
          {[
            { num: <>72<sup>hrs</sup></>, label: "Per Garment" },
            { num: <em>05</em>,          label: "Unique Designs" },
            { num: "200",                label: "Total Pieces" },
            { num: <em>00</em>,          label: "Restocks Ever" },
          ].map((s, i) => (
            <div key={i} className="stat-cell reveal">
              <span className="num">{s.num}</span>
              <span className="label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* COLLECTION */}
      <section className="collection" id="collection">
        <div className="sec-head">
          <div className="left">
            <span className="sec-eyebrow">— The Collection / 005</span>
            <h2 className="sec-title">Threads of <span className="ital">patience.</span></h2>
          </div>
          <p className="sec-desc reveal">
            Each garment passes through three pairs of hands and ten weeks of patient work. The result is not a t-shirt. It is a small piece of slow time, made wearable.
          </p>
        </div>

        <div className="products-wrap">
          <div className="products" id="products">
            {products.map((p) => (
              <article key={p.n} className="product reveal" data-cursor="View">
                <div className="product-frame">
                  <div className="p-tag">
                    <span>{p.n} / 05</span>
                    <span className="stock">{p.stock}</span>
                  </div>
                  <div className="p-quick">
                    <span>Add to Selection</span>
                    <span className="price">{p.price}</span>
                  </div>
                  <div
                    className="product-img-inner"
                    onClick={() => handleProductClick(p.slug)}
                    style={{ cursor: "pointer" }}
                  >
                    <img src={p.img} alt={p.alt} loading="lazy" />
                  </div>
                </div>
                <div className="product-info">
                  <div>
                    <div className="p-num">№ {p.n} — {p.slug.toUpperCase()}</div>
                    <h3 className="p-name">{p.name} <span className="ital">{p.ital}</span></h3>
                    <p className="p-detail">{p.detail}</p>
                  </div>
                  <button
                    className="p-cta"
                    aria-label={`View ${p.name} ${p.ital}`}
                    onClick={() => handleProductClick(p.slug)}
                    type="button"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="products-controls">
            <span className="p-counter">
              <span className="cur" id="pCur">01</span>
              <span className="total"> / 05</span>
            </span>
            <div className="p-progress"><div className="p-progress-fill" id="pProgress" /></div>
            <div className="p-arrows">
              <button className="arrow-btn magnetic" id="prevBtn" aria-label="Previous" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" />
                </svg>
              </button>
              <button className="arrow-btn magnetic" id="nextBtn" aria-label="Next" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* EDITORIAL / STORY */}
      <section className="editorial" id="story">
        <div className="editorial-grid">
          <div className="editorial-img reveal">
            <span className="editorial-img-num">FIG. 01 — STUDIO</span>
            <span className="editorial-img-cap">&ldquo;The hands remember what machines forget.&rdquo;</span>
          </div>
          <div className="editorial-text">
            <span className="sec-eyebrow reveal" style={{ marginBottom: 28 }}>— Philosophy / 001</span>
            <h2 className="reveal">
              We don&apos;t <span className="ital">print</span> stories.<br />
              We <span className="ital">stitch</span> them.
            </h2>
            <p className="reveal">
              In a world racing toward the next thing, we move slowly. Every piece in this collection took longer to make than most clothes will ever be worn. That is the point.
            </p>
            <p className="reveal">
              Our embroidery is done by hand, by artisans whose families have been stitching for generations.{" "}
              <strong>No automation. No shortcuts.</strong> Just thread, fabric, and the patience of three pairs of hands.
            </p>
            <blockquote className="editorial-quote reveal">
              When you wear something made slowly, you wear time itself — folded into every stitch.
            </blockquote>
          </div>
        </div>
      </section>

      {/* MASSIVE TEXT */}
      <section className="massive">
        <h2 className="massive-text reveal">
          <span className="reveal-line"><span>Made <span className="ital">slowly,</span></span></span>
          <span className="reveal-line"><span><span className="outline">worn forever.</span></span></span>
        </h2>
      </section>

      {/* PROCESS */}
      <section className="process" id="process">
        <div className="sec-head">
          <div className="left">
            <span className="sec-eyebrow">— The Process / 003 stages</span>
            <h2 className="sec-title">From thread<br />to <span className="ital">heirloom.</span></h2>
          </div>
          <p className="sec-desc reveal">
            Ten weeks. Three artisans. One garment. Each piece passes through cotton selection, embroidery, and finishing — every stage done entirely by hand.
          </p>
        </div>

        <div className="process-list">
          {processRows.map((r) => (
            <div key={r.n} className="process-row reveal" data-cursor={r.n}>
              <div className="p-num">{r.n}</div>
              <h3 className="p-title"><span className="ital">{r.title}</span></h3>
              <p className="p-desc">{r.desc}</p>
              <div className="p-meta">{r.meta}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DROP */}
      <section className="drop" id="drop">
        <div className="sec-head">
          <div className="left">
            <span className="sec-eyebrow">— The Drop / Vol.I</span>
            <h2 className="sec-title">200 pieces.<br /><span className="ital">No restocks.</span></h2>
          </div>
          <p className="sec-desc reveal">
            When they&apos;re gone, they&apos;re gone. Each design is limited to 40 pieces. Once Vol. I sells out, we begin work on Vol. II — a new collection with new stories.
          </p>
        </div>

        <div className="drop-grid">
          {dropItems.map((d) => (
            <div key={d.n} className="drop-cell reveal" style={{ "--w": d.w } as React.CSSProperties}>
              <span className="name">№{d.n} <span className="ital">{d.name}</span></span>
              <span className="num" data-count={d.count}>00</span>
              <div className="bar"><div className="bar-fill" /></div>
              <div className="meta"><span>OF 40</span><span>{d.pct}</span></div>
            </div>
          ))}
        </div>

        <div className="drop-cta">
          <Link href="/products" className="btn magnetic">
            <span>Reserve Your Piece</span>
            <span className="arrow">↗</span>
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <span className="sec-eyebrow test-eyebrow">— Press &amp; Editorial</span>
        <p className="test-quote reveal">
          &ldquo;Wearing an Ash Mark piece feels like wearing{" "}
          <span className="ital">time itself</span> — slow, deliberate, and entirely{" "}
          <span className="ital">irreplaceable.</span>&rdquo;
        </p>
        <span className="test-cite reveal">
          VOGUE INDIA — <strong>EDITOR&apos;S PICK 2025</strong>
        </span>
      </section>

      {/* FOOTER */}
      <footer>
        <h2 className="f-massive">
          Ash{" "}
          <span className="ital">Mark</span>
          <img src="logo.webp" alt="Ash Mark logo" />
        </h2>

        <div className="f-grid">
          <div className="f-brand">
            <h3>Whispers of the <span className="ital">drop.</span></h3>
            <p>Crafted in Jaipur. Worn worldwide. Subscribe to receive quiet announcements of the next collection.</p>
            <form
              className="newsletter"
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.querySelector("input") as HTMLInputElement;
                if (input) { input.value = ""; input.placeholder = "Welcome ✦"; }
              }}
            >
              <input type="email" placeholder="your@email.com" required />
              <button type="submit" aria-label="Subscribe">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" />
                </svg>
              </button>
            </form>
          </div>
          <div className="f-col">
            <h4>Shop</h4>
            <ul>
              <li><Link href="/products">Collection</Link></li>
              <li><Link href="/products#sizing">Sizing</Link></li>
              <li><Link href="/products#care">Care</Link></li>
              <li><Link href="/products#shipping">Shipping</Link></li>
            </ul>
          </div>
          <div className="f-col">
            <h4>Story</h4>
            <ul>
              <li><Link href="#story">Philosophy</Link></li>
              <li><Link href="#process">Artisans</Link></li>
              <li><Link href="#process">Process</Link></li>
              <li><Link href="#story">Journal</Link></li>
            </ul>
          </div>
          <div className="f-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="https://instagram.com/ashmark" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="mailto:hello@ashmark.in">Email</a></li>
              <li><Link href="#story">Studio</Link></li>
              <li><Link href="#story">Press</Link></li>
            </ul>
          </div>
        </div>

        <div className="f-bottom">
          <span>© MMXXV ASH MARK — ALL THREADS RESERVED</span>
          <div className="socials">
            <a href="https://instagram.com/ashmark" target="_blank" rel="noopener noreferrer">IG</a>
            <a href="https://pinterest.com/ashmark" target="_blank" rel="noopener noreferrer">PIN</a>
            <a href="https://vimeo.com/ashmark" target="_blank" rel="noopener noreferrer">VIM</a>
          </div>
          <span>MADE SLOWLY, WITH INTENTION</span>
        </div>
      </footer>

      {/* CART DRAWER — fully React-controlled */}
      <div
        className={`drawer-overlay${drawerOpen ? " open" : ""}`}
        id="drawerOverlay"
        onClick={closeCart}
      />
      <div className={`drawer${drawerOpen ? " open" : ""}`} id="drawer">
        <div className="drawer-header">
          <h3>Your <span className="ital">Selection</span></h3>
          <button
            className="drawer-close"
            id="drawerClose"
            aria-label="Close cart"
            type="button"
            onClick={closeCart}
          >
            ✕
          </button>
        </div>
        <div className="drawer-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h4>Empty for now</h4>
          <p>Begin with a piece from Vol. I</p>
        </div>
      </div>
    </>
  );
}
