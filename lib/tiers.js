/**
 * Shared tier calculation utility — single source of truth for all pages.
 * Fixes the critical bug where the active tier was always showing tier 0.
 */

/**
 * Given a product and a member count, return:
 *  - activeTier: the tier currently unlocked (null if none unlocked yet)
 *  - nextTier: the next tier to unlock (null if max unlocked)
 *  - progress: 0–100 toward the next tier
 *  - savingsFromMRP: rupees saved vs MRP at active tier
 *  - ctaPrice: the price to show on the CTA button (lowest unlocked tier)
 */
export function computeTierState(product, memberCount) {
  const tiers = product.tiers; // sorted ascending by count

  let activeTier = null;
  let nextTier = tiers[0]; // first target
  let progress = 0;

  for (let i = 0; i < tiers.length; i++) {
    if (memberCount >= tiers[i].count) {
      activeTier = tiers[i];
      nextTier = tiers[i + 1] || null;
    }
  }

  if (!activeTier) {
    // Haven't hit any tier yet
    progress = (memberCount / nextTier.count) * 100;
  } else if (nextTier) {
    // Between two tiers — progress toward next
    const prevCount = activeTier.count;
    progress = (memberCount / nextTier.count) * 100;
  } else {
    // Max tier reached
    progress = 100;
  }

  const displayPrice = activeTier ? activeTier.price : product.mrp;
  const displayCashback = activeTier ? activeTier.cashback : 0;
  const savingsFromMRP = product.mrp - displayPrice;

  return { activeTier, nextTier, progress: Math.min(progress, 100), displayPrice, displayCashback, savingsFromMRP };
}
