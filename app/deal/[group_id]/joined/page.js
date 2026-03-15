"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getGroupById } from "../../../../lib/data";
import { computeTierState } from "../../../../lib/tiers";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const REFERRAL_CODE = "DEMO50";
const SHARE_URL = "campusdeal.in/deal/";

function ConfettiPiece({ style }) {
  return <div style={{ position: "absolute", width: "8px", height: "8px", borderRadius: "2px", ...style, animation: `confettiFall ${1.5 + Math.random()}s ease-in forwards` }} />;
}

export default function GroupJoined() {
  const { group_id } = useParams();
  const [group, setGroup] = useState(null);
  const [copied, setCopied] = useState(false);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (!group_id) return;
    const data = getGroupById(group_id);
    setGroup(data);

    // Generate confetti pieces on mount
    const pieces = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${-20 - Math.random() * 40}px`,
      background: ["#ef4444","#f59e0b","#22c55e","#3b82f6","#a855f7","#ec4899"][i % 6],
      transform: `rotate(${Math.random() * 360}deg)`,
      animationDelay: `${Math.random() * 0.8}s`,
    }));
    setConfetti(pieces);
  }, [group_id]);

  // Post-Join Product Tour
  useEffect(() => {
    if (!group || localStorage.getItem("campusdeal_postjoin_tour_completed")) return;
    
    // Wait for confetti and initial render (e.g. 2.5 seconds)
    const timer = setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        allowClose: true,
        doneBtnText: "Done",
        nextBtnText: "Next &rarr;",
        prevBtnText: "&larr; Prev",
        onDestroyStarted: () => {
          localStorage.setItem("campusdeal_postjoin_tour_completed", "true");
          driverObj.destroy();
        },
        steps: [
          {
            element: "#tour-postjoin-status",
            popover: {
              title: "Spot Locked! ✅",
              description: "You've successfully joined the deal. Your price is locked in, but wait... it can get even better!",
              side: "bottom",
              align: "start"
            }
          },
          {
            element: "#tour-postjoin-tier",
            popover: {
              title: "Unlock Bigger Discounts 💸",
              description: "This shows how many more people need to join for the price to drop to the next tier for everyone.",
              side: "top",
              align: "start"
            }
          },
          {
            element: "#tour-postjoin-share",
            popover: {
              title: "Share & Earn! 🎁",
              description: "Share this link in your hostel groups. The more people join, the cheaper it gets. Plus, you get ₹50 cashback for every referral!",
              side: "top",
              align: "start"
            }
          }
        ]
      });

      driverObj.drive();
    }, 2500);

    return () => clearTimeout(timer);
  }, [group]);

  if (!group) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>✓</div>
        <p>Loading…</p>
      </div>
    </div>
  );

  const { product, member_count } = group;

  // The user is now member_count + 1
  const joinedCount = member_count + 1;
  const { activeTier, nextTier, progress, displayPrice, displayCashback } = computeTierState(product, joinedCount);

  const maxSaved = product.mrp - product.tiers[product.tiers.length - 1].price;
  const nextTierPrice = nextTier?.price;
  const nextTierCount = nextTier?.count;
  const remaining = nextTierCount ? nextTierCount - joinedCount : 0;

  const shareLink = `${SHARE_URL}${group_id}?ref=${REFERRAL_CODE}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>

      {/* Confetti */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 999, overflow: "hidden" }}>
        {confetti.map(p => (
          <ConfettiPiece key={p.id} style={{ left: p.left, top: p.top, background: p.background, transform: p.transform, animationDelay: p.animationDelay }} />
        ))}
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, paddingBottom: "140px" }}>

        {/* Top success zone */}
        <div style={{ padding: "56px 24px 32px", textAlign: "center", background: "linear-gradient(to bottom, rgba(34,197,94,0.08), transparent)" }}>
          {/* Animated check */}
          <div style={{ width: "96px", height: "96px", borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "44px", color: "white", boxShadow: "0 12px 40px rgba(34,197,94,0.4)", animation: "popIn 0.6s cubic-bezier(0.175,0.885,0.32,1.275) forwards" }}>
            ✓
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "white", lineHeight: 1.25, marginBottom: "10px" }}>Spot locked! 🎉</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: 1.55, maxWidth: "300px", margin: "0 auto" }}>
            ₹<strong style={{ color: "white" }}>{displayPrice}</strong> is on hold on your card. You&apos;ll only be charged when the deal activates.
          </p>
        </div>

        <div style={{ padding: "0 20px" }}>

          {/* Tier achieved card */}
          <div id="tour-postjoin-status" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "18px", padding: "20px", marginBottom: "20px" }}>
            <div style={{ fontSize: "12px", fontWeight: "800", color: "var(--text-muted)", letterSpacing: "1.5px", marginBottom: "12px" }}>YOUR DEAL</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "14px", color: "var(--text-muted)", margin: "0 0 4px", textDecoration: "line-through" }}>₹{product.mrp} MRP</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span style={{ fontSize: "32px", fontWeight: "800", color: "white" }}>₹{displayPrice}</span>
                  {displayCashback > 0 && <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--success)", background: "rgba(34,197,94,0.1)", padding: "3px 8px", borderRadius: "6px" }}>+₹{displayCashback} CB</span>}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>{joinedCount} members</div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--success)" }}>
                  {activeTier ? `Tier ${product.tiers.indexOf(activeTier) + 1} unlocked ✓` : "Forming group"}
                </div>
              </div>
            </div>
          </div>

          {/* Viral loop — share card */}
          {nextTier && (
            <div id="tour-postjoin-tier" style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.04))", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "18px", padding: "20px", marginBottom: "20px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: "-30px", top: "-30px", width: "120px", height: "120px", background: "var(--primary)", filter: "blur(60px)", opacity: 0.15 }} />

              <div style={{ display: "inline-block", background: "rgba(239,68,68,0.15)", color: "var(--primary)", fontSize: "11px", fontWeight: "800", letterSpacing: "1.5px", padding: "4px 10px", borderRadius: "20px", marginBottom: "14px" }}>
                UNLOCK NEXT TIER
              </div>

              <h2 style={{ fontSize: "20px", fontWeight: "800", color: "white", lineHeight: 1.3, marginBottom: "10px" }}>
                Get everyone to ₹{nextTierPrice} 🚀
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.5, marginBottom: "18px" }}>
                <strong style={{ color: "white" }}>{remaining} more</strong> hostel mates need to join for everyone&apos;s price to drop.
              </p>

              {/* Progress */}
              <div style={{ marginBottom: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "700", marginBottom: "8px" }}>
                  <span style={{ color: "white" }}>{joinedCount} joined</span>
                  <span style={{ color: "var(--primary)" }}>{remaining} more needed</span>
                </div>
                <div style={{ height: "10px", background: "rgba(255,255,255,0.08)", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#dc2626,#f87171)", borderRadius: "10px" }} />
                </div>
              </div>

              {/* Referral incentive */}
              <div style={{ background: "rgba(0,0,0,0.3)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "14px", padding: "14px", display: "flex", gap: "14px", alignItems: "center" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg,#eab308,#ca8a04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0, boxShadow: "0 4px 14px rgba(202,138,4,0.3)" }}>💸</div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "800", color: "white", marginBottom: "3px" }}>₹50 per referral</div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.4 }}>Every hostel mate who joins via your link earns you ₹50 CashKaro credit.</div>
                </div>
              </div>
            </div>
          )}

          {/* Your referral link */}
          <div id="tour-postjoin-share" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px", marginBottom: "20px" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", marginBottom: "10px" }}>YOUR REFERRAL LINK</div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", color: "white", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {shareLink}
              </div>
              <button onClick={handleCopy} style={{ flexShrink: 0, padding: "10px 16px", borderRadius: "10px", background: copied ? "var(--success)" : "var(--primary)", color: "white", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer", transition: "background 0.3s" }}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* How it works */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "16px", fontWeight: "800", color: "white", marginBottom: "14px" }}>How sharing works</div>
            {[
              { step: "1", text: "Share your link to LPU hostel WhatsApp groups" },
              { step: "2", text: "Friends join via your link, group gets bigger" },
              { step: "3", text: "₹50 bonus cashback lands in your wallet per join" },
            ].map((item) => (
              <div key={item.step} style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "14px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--primary)", color: "white", fontSize: "13px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.step}</div>
                <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.5, marginTop: "4px" }}>{item.text}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Sticky bottom actions */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "480px", padding: "14px 20px 28px", background: "rgba(9,9,11,0.92)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border)", zIndex: 200, display: "flex", flexDirection: "column", gap: "10px" }}>
        <button onClick={handleCopy} style={{ width: "100%", padding: "18px", borderRadius: "14px", fontSize: "16px", fontWeight: "800", background: copied ? "var(--success)" : "linear-gradient(135deg,#ef4444,#dc2626)", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 4px 20px rgba(239,68,68,0.3)", transition: "background 0.3s" }}>
          {copied ? <><span>📋</span> Link Copied!</> : <><span>📲</span> Share to WhatsApp</>}
        </button>
        <Link href="/" style={{ width: "100%" }}>
          <button style={{ width: "100%", padding: "15px", borderRadius: "14px", fontSize: "15px", fontWeight: "700", background: "var(--surface-hover)", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "pointer" }}>
            Back to Feed
          </button>
        </Link>
      </div>

      <style jsx global>{`
        @keyframes popIn {
          0%{transform:scale(0);opacity:0}
          60%{transform:scale(1.12);opacity:1}
          100%{transform:scale(1);opacity:1}
        }
        @keyframes confettiFall {
          0%{transform:translateY(0) rotate(0deg);opacity:1}
          100%{transform:translateY(600px) rotate(720deg);opacity:0}
        }
      `}</style>
    </div>
  );
}
