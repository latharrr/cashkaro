"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getGroupsWithProducts } from "../lib/data";
import { computeTierState } from "../lib/tiers";

// ── Countdown Timer ──────────────────────────────────────────────────────────
function Countdown({ expiry }) {
  const [parts, setParts] = useState({ h: 0, m: 0, s: 0, urgent: false });

  useEffect(() => {
    const tick = () => {
      const diff = expiry - Date.now();
      if (diff <= 0) { setParts({ h: 0, m: 0, s: 0, urgent: true }); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1000);
      setParts({ h, m, s, urgent: diff < 30 * 60_000 });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiry]);

  const color = parts.urgent ? "#ef4444" : "#f59e0b";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(0,0,0,0.55)", border: `1px solid ${color}33`, padding: "5px 10px", borderRadius: "10px", backdropFilter: "blur(6px)" }}>
      <span style={{ fontSize: "13px" }}>⏰</span>
      <span style={{ fontWeight: "700", fontSize: "13px", fontVariantNumeric: "tabular-nums", color }}>
        {String(parts.h).padStart(2, "0")}:{String(parts.m).padStart(2, "0")}:{String(parts.s).padStart(2, "0")}
      </span>
    </div>
  );
}

// ── Deal Card ────────────────────────────────────────────────────────────────
function DealCard({ group }) {
  const { product, members, member_count, id, expiry_timestamp } = group;
  const { activeTier, nextTier, progress, displayPrice, displayCashback } = computeTierState(product, member_count);

  const savePct = Math.round((1 - displayPrice / product.mrp) * 100);

  return (
    <Link href={`/deal/${id}`} style={{ display: "block", textDecoration: "none" }}>
      <article style={{
        background: "var(--surface)", borderRadius: "20px", overflow: "hidden",
        border: "1px solid var(--border)", transition: "transform 0.15s ease, box-shadow 0.15s ease"
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.6)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
      >
        {/* Image with overlays */}
        <div style={{ height: "220px", backgroundImage: `url(${product.image})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
          {/* Gradient */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)" }} />

          {/* Badge */}
          {savePct > 0 && (
            <div style={{ position: "absolute", top: 14, left: 14, background: "var(--primary)", color: "white", fontWeight: "800", fontSize: "12px", padding: "4px 10px", borderRadius: "20px" }}>
              {savePct}% OFF
            </div>
          )}

          {/* Countdown */}
          <div style={{ position: "absolute", top: 12, right: 12 }}>
            <Countdown expiry={expiry_timestamp} />
          </div>

          {/* Title + avatar stack */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "white", lineHeight: 1.25, maxWidth: "65%", margin: 0 }}>
              {product.name}
            </h2>
            {/* Avatar stack */}
            <div style={{ display: "flex", alignItems: "center" }}>
              {members.slice(0, 3).map((m, i) => (
                <div key={i} style={{
                  width: "30px", height: "30px", borderRadius: "50%", background: m.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: "800", color: "white",
                  border: "2px solid var(--surface)", marginLeft: i > 0 ? "-8px" : 0, zIndex: 3 - i
                }}>{m.avatar}</div>
              ))}
              {member_count > 3 && (
                <div style={{
                  width: "30px", height: "30px", borderRadius: "50%", background: "var(--surface-hover)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", fontWeight: "700", color: "white",
                  border: "2px solid var(--surface)", marginLeft: "-8px"
                }}>+{member_count - 3}</div>
              )}
            </div>
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: "16px" }}>
          {/* Price row */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "14px" }}>
            <span style={{ fontSize: "26px", fontWeight: "800", color: "white" }}>₹{displayPrice}</span>
            <span style={{ fontSize: "14px", color: "var(--text-muted)", textDecoration: "line-through" }}>₹{product.mrp}</span>
            {displayCashback > 0 && (
              <span style={{ marginLeft: "auto", fontSize: "13px", fontWeight: "700", color: "var(--success)", background: "rgba(34,197,94,0.1)", padding: "3px 8px", borderRadius: "6px" }}>+₹{displayCashback} CB</span>
            )}
          </div>

          {/* Progress */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
              <span style={{ color: "white" }}>{member_count} joined</span>
              {nextTier
                ? <span style={{ color: "var(--text-muted)" }}>{nextTier.count - member_count} more → ₹{nextTier.price}</span>
                : <span style={{ color: "var(--success)" }}>🏆 Max discount!</span>}
            </div>
            <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "6px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#dc2626,#f87171)", borderRadius: "6px", transition: "width 1s ease" }} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "12px", fontWeight: "700", color: "var(--primary)", fontSize: "15px" }}>
            Join Group Deal →
          </div>
        </div>
      </article>
    </Link>
  );
}

// ── Main Feed Page ───────────────────────────────────────────────────────────
export default function Feed() {
  const allGroups = getGroupsWithProducts();
  const [activeTab, setActiveTab] = useState("All");
  const categories = ["All", "Electronics", "Groceries", "Hostel Needs"];

  // Live ticking member counts (simulates social activity)
  const [liveCounts, setLiveCounts] = useState({});
  useEffect(() => {
    const id = setInterval(() => {
      const randomGroup = allGroups[Math.floor(Math.random() * allGroups.length)];
      if (Math.random() > 0.7) {
        setLiveCounts(prev => ({
          ...prev,
          [randomGroup.id]: (prev[randomGroup.id] || 0) + 1,
        }));
      }
    }, 4000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groups = allGroups.map(g => ({
    ...g,
    member_count: g.member_count + (liveCounts[g.id] || 0),
  }));

  // Stats bar
  const totalJoined = groups.reduce((s, g) => s + g.member_count, 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      {/* Sticky Top Nav */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100, padding: "14px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(9,9,11,0.85)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "38px", height: "38px", background: "linear-gradient(135deg,#ef4444,#dc2626)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 4px 12px rgba(239,68,68,0.35)" }}>⚡</div>
          <div>
            <div style={{ fontSize: "17px", fontWeight: "800", lineHeight: 1.2 }}>CampusDeal</div>
            <div style={{ fontSize: "11px", color: "var(--primary)", fontWeight: "600" }}>LPU Campus · Live</div>
          </div>
        </div>

        {/* Live badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", padding: "5px 10px", borderRadius: "20px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--success)", animation: "blink 1.5s infinite" }} />
            <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--success)" }}>{totalJoined} active</span>
          </div>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--surface-hover)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "13px", border: "1px solid var(--border)" }}>DU</div>
        </div>
      </header>

      {/* Hero Banner */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ background: "linear-gradient(135deg,#18181b,#27272a)", border: "1px solid var(--border)", borderRadius: "18px", padding: "22px", position: "relative", overflow: "hidden", marginBottom: "6px" }}>
          <div style={{ position: "absolute", right: "-30px", top: "-30px", width: "140px", height: "140px", background: "var(--primary)", filter: "blur(60px)", opacity: 0.15 }} />
          <div style={{ position: "absolute", left: "-20px", bottom: "-20px", width: "100px", height: "100px", background: "#3b82f6", filter: "blur(50px)", opacity: 0.1 }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--primary)", letterSpacing: "2px", marginBottom: "8px" }}>CASHKARO × CAMPUS</div>
            <h1 style={{ fontSize: "22px", fontWeight: "800", lineHeight: 1.3, color: "white", marginBottom: "8px" }}>Group up. Save big.<br />Only for LPU 🏫</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.5 }}>Join active deals with your hostel mates and unlock bulk discounts + CashKaro cashback.</p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: "10px", overflowX: "auto", padding: "16px 20px", scrollbarWidth: "none" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveTab(cat)} style={{
            padding: "9px 18px", borderRadius: "22px", fontSize: "13px", fontWeight: "700",
            whiteSpace: "nowrap", cursor: "pointer", border: "none", transition: "all 0.2s",
            background: activeTab === cat ? "var(--primary)" : "var(--surface-hover)",
            color: activeTab === cat ? "white" : "var(--text-muted)",
            boxShadow: activeTab === cat ? "0 4px 14px rgba(239,68,68,0.35)" : "none"
          }}>{cat}</button>
        ))}
      </div>

      {/* Section Label */}
      <div style={{ padding: "0 20px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "17px", fontWeight: "800", color: "white" }}>Trending Deals 🔥</span>
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{groups.length} active</span>
      </div>

      {/* Deal cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "0 20px 100px" }}>
        {groups.map(g => <DealCard key={g.id} group={g} />)}
      </div>

      <style jsx global>{`
        @keyframes blink {
          0%,100%{opacity:1} 50%{opacity:0.3}
        }
      `}</style>
    </div>
  );
}
