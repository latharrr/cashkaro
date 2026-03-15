CampusDeal MVP — Hyperlocal Group Buying for CashKaro
The one-liner
Students on a campus unlock bulk discounts + CashKaro cashback when enough people from their hostel/college join the same product deal within a time window.

Core user flow (3 screens only)
Screen 1 — Feed
List of active group deals on your campus. Each card shows: product, current price tier, how many people have joined, and how many more are needed to hit the next discount. A countdown timer creates urgency.
Screen 2 — Deal detail
Tiered discount breakdown (10 → 25 → 50 people = progressively cheaper price + bigger cashback). Live member avatars from your campus. One CTA: "Lock my spot." Payment is held — only released when the group threshold is hit. If it doesn't hit, full refund.
Screen 3 — You're in
Confirmation + share link. The referral mechanic lives here: "Invite 2 hostel mates, get ₹50 bonus cashback." This is the growth loop — every buyer becomes a distributor.

What you actually need to build the MVP
Backend (minimal)

Products table: name, image, MRP, tier thresholds (10/25/50), price at each tier, cashback at each tier
Groups table: product_id, campus_id, member_count, status (forming / locked / expired), expiry_timestamp
Users table: name, campus, hostel, phone, cashback_wallet_balance
Joins table: user_id, group_id, payment_status, referral_code

No inventory management. No logistics. You fake the "bulk order placed" step for the MVP — just collect intent and payment hold.
Frontend
Mobile-first web app (not native). Next.js or plain React. Three pages as above. Share link is just campusdeal.in/deal/[group_id] — anyone who opens it sees how close the group is and a join CTA.
Payments
Razorpay with payment capture delay. Money is authorized but not captured until group_status flips to "locked." This is a real Razorpay feature called "late auth."
No-code alternative for week 1
Skip all of the above. Use a Google Form to collect interest, a WhatsApp group for coordination, and a Notion page as the "deal feed." Manually track joins in a sheet. Ship on day 3, not day 30. This is actually what Hrutvij means by "tell me what you built."

The growth mechanic (most important thing)
The product is a coordination problem. The referral loop solves it:

You join → you get a unique share link
Every person who joins through your link = ₹50 bonus cashback for you
The progress bar on the deal card is publicly visible — "34/50 joined, 16 more needed" creates social pressure
Group delivery to hostel gate means everyone knows it's happening — physical proof of concept in the real world

This is different from standard referral programs because the incentive is time-bound and tied to a specific product. It's not "share CashKaro," it's "help us hit 50 so we ALL save ₹400 each."

Metrics to track from day 1

Group fill rate: % of groups that hit their minimum threshold
Time to fill: how long it takes a group to go from 1 → minimum
Referral coefficient: average number of joins generated per existing member
Cashback redemption rate: are people actually using the wallet balance
Repeat purchase rate: does someone who joins one group come back for the next


What makes this defensible vs. just using Amazon bulk buy
CashKaro's existing merchant network means you get deals Amazon can't offer. The campus layer means delivery is frictionless (hostel gate, not door-to-door). And the social mechanic means acquisition cost approaches zero once a campus has 20+ active users — it self-propagates through hostels.