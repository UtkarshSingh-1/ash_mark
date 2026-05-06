"use client"

import { Suspense, useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductGrid } from "@/components/product/product-grid"
import { ProductFilters } from "@/components/product/product-filters"
import { ProductStoriesSection } from "@/components/product/product-stories-section"
import { MobileFilters } from "@/components/product/mobile-filters"

interface SearchParamsShape {
  search?: string
  category?: string
  page?: string
  sort?: string
  minPrice?: string
  maxPrice?: string
  featured?: string
  trending?: string
}

/* ─── Theme Toggle FAB ─── */
function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        position: "fixed",
        bottom: "28px",
        right: "28px",
        zIndex: 9999,
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px",
        transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease",
        background: dark
          ? "linear-gradient(135deg,#fbbf24,#f59e0b)"
          : "linear-gradient(135deg,#312e81,#4c1d95)",
        boxShadow: dark
          ? "0 0 0 5px rgba(251,191,36,0.2),0 8px 32px rgba(245,158,11,0.5)"
          : "0 0 0 5px rgba(76,29,149,0.2),0 8px 32px rgba(49,46,129,0.6)",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.13) rotate(18deg)" }}
      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1) rotate(0deg)" }}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  )
}

/* ─── Marquee ─── */
function MarqueeStrip({ dark }: { dark: boolean }) {
  const items = ["NEW ARRIVALS","✦","TRENDING NOW","✦","FRESH DROPS","✦","CURATED PICKS","✦","HOT DEALS","✦","SALE IS LIVE","✦"]
  return (
    <div style={{
      overflow: "hidden",
      background: dark ? "#0d0920" : "#1e1b4b",
      padding: "10px 0",
      position: "relative",
      zIndex: 10,
    }}>
      <div style={{
        display: "flex",
        gap: "36px",
        animation: "marquee 22s linear infinite",
        whiteSpace: "nowrap",
        width: "max-content",
      }}>
        {[...items,...items].map((t,i) => (
          <span key={i} style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: i % 2 === 1 ? "#a78bfa" : "rgba(240,230,255,0.85)",
          }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

/* ─── Ambient Background ─── */
function AnimatedBg({ dark }: { dark: boolean }) {
  return (
    <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden" }}>
      <div style={{
        position:"absolute",width:"720px",height:"720px",borderRadius:"50%",
        top:"-200px",right:"-150px",
        background: dark
          ? "radial-gradient(circle,rgba(139,92,246,0.22) 0%,transparent 70%)"
          : "radial-gradient(circle,rgba(167,139,250,0.13) 0%,transparent 70%)",
        animation:"orbFloat1 20s ease-in-out infinite",
        filter:"blur(2px)",
      }}/>
      <div style={{
        position:"absolute",width:"520px",height:"520px",borderRadius:"50%",
        bottom:"8%",left:"-80px",
        background: dark
          ? "radial-gradient(circle,rgba(236,72,153,0.18) 0%,transparent 70%)"
          : "radial-gradient(circle,rgba(236,72,153,0.09) 0%,transparent 70%)",
        animation:"orbFloat2 26s ease-in-out infinite",
        filter:"blur(2px)",
      }}/>
      <div style={{
        position:"absolute",width:"420px",height:"420px",borderRadius:"50%",
        top:"48%",right:"4%",
        background: dark
          ? "radial-gradient(circle,rgba(6,182,212,0.13) 0%,transparent 70%)"
          : "radial-gradient(circle,rgba(6,182,212,0.07) 0%,transparent 70%)",
        animation:"orbFloat3 18s ease-in-out infinite",
        filter:"blur(2px)",
      }}/>
      {/* Grid overlay */}
      <div style={{
        position:"absolute",inset:0,
        backgroundImage: dark
          ? "linear-gradient(rgba(139,92,246,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.045) 1px,transparent 1px)"
          : "linear-gradient(rgba(139,92,246,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.03) 1px,transparent 1px)",
        backgroundSize:"64px 64px",
      }}/>
    </div>
  )
}

/* ─── Sidebar Card ─── */
function SidebarCard({ dark, children }: { dark:boolean; children:React.ReactNode }) {
  return (
    <div style={{
      background: dark ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.82)",
      backdropFilter:"blur(24px)",
      WebkitBackdropFilter:"blur(24px)",
      border: dark ? "1px solid rgba(139,92,246,0.22)" : "1px solid rgba(139,92,246,0.18)",
      borderRadius:"22px",
      padding:"24px",
      boxShadow: dark
        ? "0 8px 48px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.05)"
        : "0 8px 48px rgba(139,92,246,0.1),inset 0 1px 0 rgba(255,255,255,0.9)",
      animation:"slideInSidebar 0.6s cubic-bezier(0.16,1,0.3,1) both",
      transition:"box-shadow 0.35s ease,border-color 0.35s ease",
    }}>
      <div style={{
        display:"flex",alignItems:"center",gap:"10px",
        marginBottom:"20px",paddingBottom:"16px",
        borderBottom: dark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(139,92,246,0.1)",
      }}>
        <span style={{fontSize:"16px"}}>🎛️</span>
        <span style={{
          fontFamily:"'Syne',sans-serif",
          fontSize:"12px",fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",
          color: dark ? "#c4b5fd" : "#6d28d9",
        }}>Filters</span>
      </div>
      {children}
    </div>
  )
}

/* ─── Promo Card ─── */
function PromoCard({ dark }: { dark:boolean }) {
  return (
    <div style={{
      marginTop:"16px",borderRadius:"20px",padding:"22px",
      background: dark
        ? "linear-gradient(135deg,rgba(139,92,246,0.28),rgba(236,72,153,0.18))"
        : "linear-gradient(135deg,rgba(139,92,246,0.13),rgba(236,72,153,0.08))",
      border: dark ? "1px solid rgba(139,92,246,0.28)" : "1px solid rgba(139,92,246,0.18)",
      animation:"slideInSidebar 0.65s cubic-bezier(0.16,1,0.3,1) 0.08s both",
    }}>
      <div style={{fontSize:"26px",marginBottom:"9px"}}>🎁</div>
      <div style={{
        fontFamily:"'Syne',sans-serif",fontSize:"14px",fontWeight:700,
        color: dark ? "#ede9fe" : "#4c1d95",marginBottom:"5px",
      }}>Free Shipping</div>
      <div style={{
        fontSize:"12px",lineHeight:1.55,
        color: dark ? "rgba(237,233,254,0.6)" : "rgba(76,29,149,0.55)",
      }}>On all orders above ₹999. Limited time!</div>
    </div>
  )
}

/* ─── Section Header ─── */
function SectionHeader({ dark }: { dark:boolean }) {
  return (
    <div style={{padding:"40px 0 0",animation:"fadeSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) both"}}>
      {/* Eyebrow */}
      <div style={{
        display:"inline-flex",alignItems:"center",gap:"8px",
        background: dark ? "rgba(139,92,246,0.16)" : "rgba(139,92,246,0.09)",
        border: dark ? "1px solid rgba(139,92,246,0.32)" : "1px solid rgba(139,92,246,0.22)",
        borderRadius:"100px",padding:"5px 14px",marginBottom:"18px",
      }}>
        <span style={{
          width:"6px",height:"6px",borderRadius:"50%",background:"#8b5cf6",
          display:"inline-block",animation:"pulseDot 2s ease-in-out infinite",
        }}/>
        <span style={{
          fontSize:"10px",fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",
          color: dark ? "#c4b5fd" : "#6d28d9",
        }}>Catalogue</span>
      </div>

      {/* Title */}
      <h1 style={{
        fontFamily:"'Syne','Space Grotesk',sans-serif",
        fontSize:"clamp(34px,5.5vw,64px)",
        fontWeight:800,lineHeight:1.03,letterSpacing:"-0.03em",margin:"0 0 10px",
        background: dark
          ? "linear-gradient(135deg,#f5f3ff 0%,#c4b5fd 45%,#f9a8d4 100%)"
          : "linear-gradient(135deg,#1e1b4b 0%,#5b21b6 50%,#9333ea 100%)",
        WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
      }}>
        Our Collection
      </h1>

      {/* Divider */}
      <div style={{display:"flex",alignItems:"center",gap:"14px",margin:"22px 0 32px"}}>
        <div style={{
          flex:1,height:"2px",borderRadius:"2px",
          background: dark
            ? "linear-gradient(to right,rgba(139,92,246,0.7),rgba(236,72,153,0.5),transparent)"
            : "linear-gradient(to right,rgba(109,40,217,0.4),rgba(236,72,153,0.3),transparent)",
        }}/>
        <span style={{fontSize:"18px",animation:"spin 12s linear infinite",display:"inline-block"}}>✦</span>
        <div style={{
          flex:1,height:"2px",borderRadius:"2px",
          background: dark
            ? "linear-gradient(to left,rgba(139,92,246,0.7),rgba(236,72,153,0.5),transparent)"
            : "linear-gradient(to left,rgba(109,40,217,0.4),rgba(236,72,153,0.3),transparent)",
        }}/>
      </div>
    </div>
  )
}

/* ─── Toolbar ─── */
function GridToolbar({ dark }: { dark:boolean }) {
  return (
    <div style={{
      display:"flex",alignItems:"center",justifyContent:"space-between",
      gap:"12px",marginBottom:"24px",flexWrap:"wrap",
      animation:"fadeSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s both",
    }}>
      <div style={{
        display:"inline-flex",alignItems:"center",gap:"8px",
        background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)",
        backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",
        border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(139,92,246,0.18)",
        borderRadius:"100px",padding:"7px 16px",
      }}>
        <span style={{
          width:"7px",height:"7px",borderRadius:"50%",background:"#10b981",
          display:"inline-block",animation:"pulseDot 2.2s ease-in-out infinite",
        }}/>
        <span style={{
          fontSize:"13px",fontWeight:600,
          color: dark ? "rgba(255,255,255,0.75)" : "#374151",
        }}>All Products</span>
      </div>

      <div style={{
        display:"flex",
        background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)",
        backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",
        border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(139,92,246,0.18)",
        borderRadius:"12px",padding:"4px",gap:"3px",
      }}>
        {[
          {icon:"▦",label:"Grid view"},
          {icon:"≡",label:"List view"},
        ].map((btn,i) => (
          <button key={i} aria-label={btn.label} style={{
            width:"34px",height:"34px",borderRadius:"8px",border:"none",cursor:"pointer",
            background: i===0
              ? dark ? "rgba(139,92,246,0.3)" : "rgba(109,40,217,0.12)"
              : "transparent",
            color: i===0
              ? dark ? "#c4b5fd" : "#6d28d9"
              : dark ? "rgba(255,255,255,0.4)" : "#9ca3af",
            fontSize:"14px",
            display:"flex",alignItems:"center",justifyContent:"center",
            transition:"all 0.2s ease",
          }}>{btn.icon}</button>
        ))}
      </div>
    </div>
  )
}

/* ─── Skeleton ─── */
function ProductGridSkeleton({ dark }: { dark:boolean }) {
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"24px",gap:"12px"}}>
        {[{w:"150px"},{w:"90px"}].map((s,i) => (
          <div key={i} style={{
            height:"36px",width:s.w,borderRadius:i===0?"100px":"12px",
            background: dark ? "rgba(139,92,246,0.12)" : "rgba(109,40,217,0.07)",
            backgroundImage: dark
              ? "linear-gradient(90deg,rgba(139,92,246,0.08) 25%,rgba(139,92,246,0.2) 50%,rgba(139,92,246,0.08) 75%)"
              : "linear-gradient(90deg,rgba(109,40,217,0.05) 25%,rgba(109,40,217,0.12) 50%,rgba(109,40,217,0.05) 75%)",
            backgroundSize:"200% 100%",
            animation:`shimmer 1.6s ease-in-out ${i*0.1}s infinite`,
          }}/>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"20px"}}>
        {Array.from({length:9}).map((_,i) => (
          <div key={i} style={{
            display:"flex",flexDirection:"column",gap:"12px",
            animation:`fadeSlideUp 0.5s ease ${i*0.06}s both`,
          }}>
            <div style={{
              aspectRatio:"1",borderRadius:"18px",
              backgroundImage: dark
                ? "linear-gradient(90deg,rgba(139,92,246,0.1) 25%,rgba(139,92,246,0.2) 50%,rgba(139,92,246,0.1) 75%)"
                : "linear-gradient(90deg,rgba(109,40,217,0.05) 25%,rgba(109,40,217,0.1) 50%,rgba(109,40,217,0.05) 75%)",
              backgroundSize:"200% 100%",
              animation:`shimmer 1.6s ease-in-out ${i*0.07}s infinite`,
            }}/>
            {[{w:"45%"},{w:"75%"},{w:"38%",h:"20px"}].map((bar,j) => (
              <div key={j} style={{
                height:bar.h||"13px",width:bar.w,borderRadius:"6px",
                backgroundImage: dark
                  ? "linear-gradient(90deg,rgba(255,255,255,0.05) 25%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0.05) 75%)"
                  : "linear-gradient(90deg,rgba(0,0,0,0.04) 25%,rgba(0,0,0,0.08) 50%,rgba(0,0,0,0.04) 75%)",
                backgroundSize:"200% 100%",
                animation:`shimmer 1.6s ease-in-out ${i*0.07+j*0.1}s infinite`,
              }}/>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Stories Skeleton ─── */
function StoriesSkeleton({ dark }: { dark:boolean }) {
  return (
    <div style={{
      width:"100%",height:"340px",display:"flex",alignItems:"center",
      justifyContent:"center",gap:"20px",padding:"24px",
      background: dark
        ? "linear-gradient(135deg,rgba(139,92,246,0.07),rgba(236,72,153,0.04))"
        : "linear-gradient(135deg,rgba(139,92,246,0.04),rgba(236,72,153,0.02))",
    }}>
      {Array.from({length:5}).map((_,i) => (
        <div key={i} style={{
          flexShrink:0,display:"flex",flexDirection:"column",
          alignItems:"center",gap:"10px",
          animation:`fadeSlideUp 0.5s ease ${i*0.1}s both`,
        }}>
          <div style={{
            width:"70px",height:"70px",borderRadius:"50%",
            backgroundImage: dark
              ? "linear-gradient(90deg,rgba(139,92,246,0.12) 25%,rgba(139,92,246,0.25) 50%,rgba(139,92,246,0.12) 75%)"
              : "linear-gradient(90deg,rgba(109,40,217,0.06) 25%,rgba(109,40,217,0.12) 50%,rgba(109,40,217,0.06) 75%)",
            backgroundSize:"200% 100%",
            animation:`shimmer 1.6s ease-in-out ${i*0.12}s infinite`,
            border: dark ? "2px solid rgba(139,92,246,0.22)" : "2px solid rgba(109,40,217,0.12)",
          }}/>
          <div style={{
            width:"54px",height:"10px",borderRadius:"6px",
            backgroundImage: dark
              ? "linear-gradient(90deg,rgba(255,255,255,0.05) 25%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0.05) 75%)"
              : "linear-gradient(90deg,rgba(0,0,0,0.04) 25%,rgba(0,0,0,0.08) 50%,rgba(0,0,0,0.04) 75%)",
            backgroundSize:"200% 100%",
            animation:`shimmer 1.6s ease-in-out ${i*0.12+0.1}s infinite`,
          }}/>
        </div>
      ))}
    </div>
  )
}

/* ─── Filter Chip ─── */
function FilterChip({ dark, emoji, label }: { dark:boolean; emoji:string; label:string }) {
  return (
    <div style={{
      display:"inline-flex",alignItems:"center",gap:"6px",
      background: dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.88)",
      backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",
      border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(139,92,246,0.18)",
      borderRadius:"100px",padding:"6px 14px",
      fontSize:"12px",fontWeight:600,letterSpacing:"0.04em",
      color: dark ? "rgba(255,255,255,0.72)" : "#4b5563",
      whiteSpace:"nowrap",flexShrink:0,cursor:"pointer",
      transition:"transform 0.22s ease,box-shadow 0.22s ease,background 0.22s ease",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform="translateY(-2px)"
        e.currentTarget.style.background= dark ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.1)"
        e.currentTarget.style.boxShadow= dark ? "0 8px 24px rgba(139,92,246,0.25)" : "0 8px 24px rgba(139,92,246,0.15)"
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform="translateY(0)"
        e.currentTarget.style.background= dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.88)"
        e.currentTarget.style.boxShadow="none"
      }}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </div>
  )
}

/* ─── Page ─── */
export default function ProductsPage(
  props: { searchParams: Promise<Record<string, string | string[] | undefined>> }
) {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [params, setParams] = useState<SearchParamsShape>({})

  useEffect(() => {
    setMounted(true)
    setDark(window.matchMedia("(prefers-color-scheme: dark)").matches)
    Promise.resolve(props.searchParams).then(raw => {
      const pick = (k: string) => Array.isArray(raw[k]) ? (raw[k] as string[])[0] : (raw[k] as string | undefined)
      setParams({
        search: pick("search"), category: pick("category"),
        page: pick("page"), sort: pick("sort"),
        minPrice: pick("minPrice"), maxPrice: pick("maxPrice"),
        featured: pick("featured"), trending: pick("trending"),
      })
    })
  }, [])

  if (!mounted) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Space Grotesk',sans-serif;transition:background 0.5s ease;}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes orbFloat1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(40px,-50px) scale(1.06)}66%{transform:translate(-25px,35px) scale(0.94)}}
        @keyframes orbFloat2{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-35px,45px) scale(1.08)}70%{transform:translate(30px,-20px) scale(0.96)}}
        @keyframes orbFloat3{0%,100%{transform:translate(0,0) scale(1)}25%{transform:translate(20px,30px) scale(0.92)}75%{transform:translate(-20px,-25px) scale(1.04)}}
        @keyframes fadeSlideUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideInSidebar{from{opacity:0;transform:translateX(-22px)}to{opacity:1;transform:translateX(0)}}
        @keyframes pulseDot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.55);opacity:0.45}}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .strip-scroll{scrollbar-width:none;}
        .strip-scroll::-webkit-scrollbar{display:none;}
        .sidebar-scroll::-webkit-scrollbar{width:3px;}
        .sidebar-scroll::-webkit-scrollbar-track{background:transparent;}
        .sidebar-scroll::-webkit-scrollbar-thumb{background:rgba(139,92,246,0.3);border-radius:10px;}
        @media(max-width:480px){.pg-pad{padding:0 16px 60px!important;}}
        @media(min-width:768px){.pg-pad{padding:0 32px 80px!important;}}
        @media(min-width:1024px){.sidebar-d{display:block!important;}.mob-strip{display:none!important;}.pg-pad{padding:0 48px 100px!important;}}
      `}</style>

      {/* Root */}
      <div style={{
        background: dark
          ? "linear-gradient(160deg,#080514 0%,#0d0a1e 50%,#050312 100%)"
          : "linear-gradient(160deg,#faf9ff 0%,#f0eeff 50%,#fdf4ff 100%)",
        minHeight:"100vh",transition:"background 0.5s ease",position:"relative",
      }}>
        <AnimatedBg dark={dark}/>

        <div style={{position:"relative",zIndex:1}}>
          <Navbar/>
          <MarqueeStrip dark={dark}/>

          <main>
            {/* Stories */}
            <div style={{position:"relative"}}>
              <Suspense fallback={<StoriesSkeleton dark={dark}/>}>
                <ProductStoriesSection/>
              </Suspense>
              <div style={{
                position:"absolute",bottom:0,left:0,right:0,height:"80px",pointerEvents:"none",
                background: dark
                  ? "linear-gradient(to bottom,transparent,#0d0a1e)"
                  : "linear-gradient(to bottom,transparent,#f0eeff)",
              }}/>
            </div>

            {/* Content */}
            <div className="pg-pad" style={{maxWidth:"1440px",margin:"0 auto",padding:"0 24px 80px"}}>
              <SectionHeader dark={dark}/>

              {/* Mobile filter strip */}
              <div
                className="mob-strip strip-scroll"
                style={{
                  display:"flex",gap:"10px",overflowX:"auto",
                  paddingBottom:"4px",marginBottom:"24px",
                  animation:"fadeSlideUp 0.6s ease 0.2s both",
                }}
              >
                <MobileFilters/>
                {[["🔥","Trending"],["⚡","New Drops"],["💎","Premium"],["🏷️","Sale"]].map(([emoji,label]) => (
                  <FilterChip key={label} dark={dark} emoji={emoji} label={label}/>
                ))}
              </div>

              {/* Two-col layout */}
              <div style={{display:"flex",gap:"28px",alignItems:"flex-start"}}>
                {/* Sidebar (desktop only) */}
                <aside
                  className="sidebar-d sidebar-scroll"
                  style={{
                    display:"none",
                    width:"272px",flexShrink:0,
                    position:"sticky",top:"24px",
                    maxHeight:"calc(100vh - 48px)",overflowY:"auto",
                  }}
                >
                  <SidebarCard dark={dark}>
                    <ProductFilters/>
                  </SidebarCard>
                  <PromoCard dark={dark}/>
                </aside>

                {/* Grid */}
                <div style={{flex:1,minWidth:0}}>
                  <GridToolbar dark={dark}/>
                  <div style={{animation:"fadeSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both"}}>
                    <Suspense fallback={<ProductGridSkeleton dark={dark}/>}>
                      <ProductGrid searchParams={params}/>
                    </Suspense>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <Footer/>
        </div>

        <ThemeToggle dark={dark} onToggle={() => setDark(d => !d)}/>
      </div>
    </>
  )
}
