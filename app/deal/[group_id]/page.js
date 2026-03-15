"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getGroupById } from "../../../lib/data";
import { computeTierState } from "../../../lib/tiers";

// ── Mini countdown for the action bar ────────────────────────────────────────
function MiniCountdown({ expiry }) {
  const [text, setText] = useState("");
  useEffect(() => {
    const tick = () => {
      const diff = expiry - Date.now();
      if (diff <= 0) { setText("Expired"); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setText(`${h}h ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s left`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiry]);
  return <span>{text}</span>;
}

// ── Main Deal Detail Page ─────────────────────────────────────────────────────
export default function DealDetail() {
  const { group_id } = useParams();
  const router = useRouter();
  const [group, setGroup] = useState(null);
  const [lockState, setLockState] = useState("idle"); // idle | loading | done

  useEffect(() => {
    if (group_id) setGroup(getGroupById(group_id));
  }, [group_id]);

  if (!group) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚡</div>
          <p>Loading deal…</p>
        </div>
      </div>
    );
  }

  const { product, members, member_count, expiry_timestamp } = group;
  const { activeTier, nextTier, progress, displayPrice, displayCashback, savingsFromMRP } = computeTierState(product, member_count);
  const maxPct = Math.round((1 - product.tiers[product.tiers.length - 1].price / product.mrp) * 100);

  const handleLock = () => {
    if (lockState !== "idle") return;
    setLockState("loading");
    setTimeout(() => {
      setLockState("done");
      setTimeout(() => router.push(`/deal/${group_id}/joined`), 600);
    }, 1600);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", paddingBottom: "110px" }}>

      {/* ── Hero Image ── */}
      <div style={{ height: "380px", position: "relative", backgroundImage: `url(${product.image})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, var(--background) 100%)" }} />

        {/* Back button */}
        <Link href="/" style={{ position: "absolute", top: 18, left: 18, zIndex: 10 }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "18px" }}>←</div>
        </Link>

        {/* Discount badge */}
        <div style={{ position: "absolute", top: 20, right: 18, background: "var(--primary)", color: "white", fontSize: "12px", fontWeight: "800", padding: "5px 12px", borderRadius: "20px", boxShadow: "0 4px 14px rgba(239,68,68,0.45)", zIndex: 10 }}>
          {maxPct}% OFF MAX
        </div>
      </div>

      {/* ── Product Info Card ── */}
      <div style={{ margin: "-56px 20px 0", borderRadius: "20px", background: "var(--surface)", border: "1px solid var(--border)", padding: "22px", boxShadow: "0 16px 48px rgba(0,0,0,0.6)", position: "relative", zIndex: 20, marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", lineHeight: 1.25, color: "white", marginBottom: "12px" }}>{product.name}</h1>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <span style={{ fontSize: "28px", fontWeight: "800", color: "white" }}>₹{displayPrice}</span>
          <span style={{ fontSize: "15px", color: "var(--text-muted)", textDecoration: "line-through" }}>₹{product.mrp}</span>
          {displayCashback > 0 && <span style={{ marginLeft: "auto", fontSize: "13px", fontWeight: "700", color: "var(--success)", background: "rgba(34,197,94,0.12)", padding: "4px 10px", borderRadius: "8px" }}>+₹{displayCashback} cashback</span>}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "white" }}>₹{savingsFromMRP}</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>saved now</div>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "white" }}>{member_count}</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>joined</div>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#f59e0b" }}><MiniCountdown expiry={expiry_timestamp} /></div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>remaining</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>

        {/* ── Tier Breakdown ── */}
        <h3 style={{ fontSize: "18px", fontWeight: "800", color: "white", marginBottom: "16px" }}>How low can it go? 👇</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
          {product.tiers.map((tier, i) => {
            const isActive = activeTier?.count === tier.count;
            const isPast = activeTier && tier.count < activeTier.count;
            const isFuture = !activeTier ? true : tier.count > activeTier.count;
            const thisNextTier = nextTier?.count === tier.count;

            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "16px", padding: "18px 16px",
                borderRadius: "16px", position: "relative", overflow: "hidden",
                background: isActive ? "rgba(239,68,68,0.08)" : "var(--surface)",
                border: isActive ? "1px solid rgba(239,68,68,0.45)" : thisNextTier ? "1px dashed rgba(255,255,255,0.15)" : "1px solid var(--border)",
                opacity: isFuture && !thisNextTier ? 0.55 : 1,
              }}>
                {isActive && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", background: "var(--primary)" }} />}
                
                {/* Icon */}
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "15px", color: "white", background: isActive ? "var(--primary)" : isPast ? "var(--success)" : "var(--surface-hover)" }}>
                  {isPast ? "✓" : tier.count}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "800", fontSize: "15px", color: "white", marginBottom: "3px" }}>
                    {tier.count} buyers
                    {isActive && <span style={{ marginLeft: "8px", background: "var(--primary)", color: "white", fontSize: "10px", fontWeight: "800", padding: "2px 7px", borderRadius: "4px", verticalAlign: "middle" }}>CURRENT</span>}
                    {thisNextTier && !isActive && <span style={{ marginLeft: "8px", background: "rgba(255,255,255,0.1)", color: "var(--text-muted)", fontSize: "10px", fontWeight: "700", padding: "2px 7px", borderRadius: "4px", verticalAlign: "middle" }}>NEXT</span>}
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: isActive ? "var(--primary)" : isPast ? "var(--success)" : "var(--text-muted)" }}>
                    +₹{tier.cashback} cashback
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "22px", fontWeight: "800", color: isActive ? "white" : "var(--text-muted)" }}>₹{tier.price}</div>
                  {!isActive && !isPast && <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>₹{product.mrp - tier.price} off</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Progress toward next tier ── */}
        {nextTier && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px", marginBottom: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}>
              <span style={{ color: "white" }}>{member_count} joined</span>
              <span style={{ color: "var(--primary)" }}>{nextTier.count - member_count} more to unlock ₹{nextTier.price}</span>
            </div>
            <div style={{ height: "10px", background: "rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#dc2626,#f87171)", borderRadius: "10px", transition: "width 1s ease" }} />
            </div>
            <p style={{ marginTop: "10px", fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5 }}>
              If {nextTier.count - member_count} more people join, everyone saves an extra <strong style={{ color: "white" }}>₹{displayPrice - nextTier.price}</strong> per item.
            </p>
          </div>
        )}

        {/* ── Members ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "white", margin: 0 }}>Who&apos;s in? 👥</h3>
          <span style={{ background: "rgba(34,197,94,0.1)", color: "var(--success)", fontSize: "13px", fontWeight: "700", padding: "5px 12px", borderRadius: "20px" }}>{member_count} locked in</span>
        </div>

        <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "16px", scrollbarWidth: "none", marginBottom: "24px" }}>
          {/* You slot */}
          <div onClick={handleLock} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", cursor: "pointer", flexShrink: 0 }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: "2px dashed var(--primary)", background: "rgba(239,68,68,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: "var(--primary)", animation: "pulse 2s infinite" }}>YOU?</div>
            <span style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "600" }}>Join</span>
          </div>

          {members.map((m, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "800", color: "white", border: "3px solid var(--background)", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>{m.avatar}</div>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>{m.name}</span>
            </div>
          ))}
        </div>

        {/* ── Trust block ── */}
        <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "14px", padding: "18px", marginBottom: "28px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
          <span style={{ fontSize: "26px", flexShrink: 0 }}>🛡️</span>
          <div>
            <div style={{ fontWeight: "800", color: "var(--success)", fontSize: "15px", marginBottom: "5px" }}>Zero Risk Payment Hold</div>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.55, margin: 0 }}>
              Your card is only <strong style={{ color: "white" }}>authorized</strong>, not charged — until the group threshold is met. If the deal expires without hitting the target, the hold automatically drops. No manual refunds needed.
            </p>
          </div>
        </div>

        {/* ── Delivery ── */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "30px" }}>
          {[
            { icon: "📦", label: "Hostel Gate Delivery", sub: "No courier required" },
            { icon: "⚡", label: "24h Dispatch", sub: "Once group locks" },
          ].map((item, i) => (
            <div key={i} style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "14px", textAlign: "center" }}>
              <div style={{ fontSize: "22px", marginBottom: "6px" }}>{item.icon}</div>
              <div style={{ fontWeight: "700", fontSize: "13px", color: "white" }}>{item.label}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "3px" }}>{item.sub}</div>
            </div>
          ))}
        </div>

      </div>

      {/* ── Sticky CTA ── */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "480px",
        padding: "16px 20px 28px", background: "rgba(9,9,11,0.92)", backdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border)", zIndex: 200
      }}>
        <button
          onClick={handleLock}
          disabled={lockState !== "idle"}
          style={{
            width: "100%", padding: "18px", borderRadius: "16px", fontSize: "17px", fontWeight: "800",
            cursor: lockState === "idle" ? "pointer" : "not-allowed",
            background: lockState === "done" ? "var(--success)" : "linear-gradient(135deg,#ef4444,#dc2626)",
            color: "white", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: "0 4px 20px rgba(239,68,68,0.4)", transition: "all 0.3s"
          }}
        >
          {lockState === "idle" && <>
            <span>Lock my spot 🔒</span>
            <span style={{ background: "rgba(255,255,255,0.2)", padding: "5px 12px", borderRadius: "10px", fontSize: "15px", fontWeight: "800" }}>₹{displayPrice}</span>
          </>}
          {lockState === "loading" && <span style={{ margin: "0 auto", animation: "pulse 1s infinite" }}>Authorizing payment hold…</span>}
          {lockState === "done" && <span style={{ margin: "0 auto" }}>✓ Spot secured!</span>}
        </button>
      </div>

      <style jsx global>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
}
