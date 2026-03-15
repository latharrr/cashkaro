export const products = [
  {
    id: "p1",
    name: "Boat Airdopes 141",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=60",
    mrp: 1499,
    tiers: [
      { count: 10, price: 1299, cashback: 50 },
      { count: 25, price: 1099, cashback: 100 },
      { count: 50, price: 899, cashback: 200 }
    ]
  },
  {
    id: "p2",
    name: "Milton Thermosteel 1L",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=60",
    mrp: 999,
    tiers: [
      { count: 10, price: 849, cashback: 30 },
      { count: 25, price: 749, cashback: 60 },
      { count: 50, price: 599, cashback: 120 }
    ]
  },
  {
    id: "p3",
    name: "Maggie 12-Pack (Masala)",
    image: "https://images.unsplash.com/photo-1612929633738-8fe01f7c8166?w=800&auto=format&fit=crop&q=60",
    mrp: 168,
    tiers: [
      { count: 15, price: 150, cashback: 10 },
      { count: 30, price: 140, cashback: 15 },
      { count: 100, price: 120, cashback: 25 }
    ]
  },
  {
    id: "p4",
    name: "Noise ColorFit Pulse 2",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=60",
    mrp: 1999,
    tiers: [
      { count: 5, price: 1799, cashback: 100 },
      { count: 20, price: 1499, cashback: 200 },
      { count: 40, price: 1199, cashback: 300 }
    ]
  },
  {
    id: "p5",
    name: "Syska 10000mAh Powerbank",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=60",
    mrp: 1199,
    tiers: [
      { count: 10, price: 899, cashback: 50 },
      { count: 25, price: 749, cashback: 75 },
      { count: 50, price: 599, cashback: 150 }
    ]
  }
];

export const groups = [
  {
    id: "g1",
    product_id: "p1",
    campus_id: "lpu",
    member_count: 34,
    status: "forming",
    expiry_timestamp: Date.now() + 1000 * 60 * 60 * 5, // 5 hours from now
    members: [
      { name: "Rahul", avatar: "R", color: "#ef4444" },
      { name: "Sneha", avatar: "S", color: "#3b82f6" },
      { name: "Amit", avatar: "A", color: "#10b981" }
    ]
  },
  {
    id: "g2",
    product_id: "p2",
    campus_id: "lpu",
    member_count: 8,
    status: "forming",
    expiry_timestamp: Date.now() + 1000 * 60 * 60 * 12, // 12 hours from now
    members: [
      { name: "Priya", avatar: "P", color: "#8b5cf6" },
      { name: "Vikram", avatar: "V", color: "#f59e0b" }
    ]
  },
  {
    id: "g3",
    product_id: "p3",
    campus_id: "lpu",
    member_count: 89,
    status: "forming",
    expiry_timestamp: Date.now() + 1000 * 60 * 60 * 2, // 2 hours from now
    members: [
      { name: "Karan", avatar: "K", color: "#eab308" },
      { name: "Neha", avatar: "N", color: "#ec4899" },
      { name: "Rajat", avatar: "R", color: "#06b6d4" }
    ]
  },
  {
    id: "g4",
    product_id: "p4",
    campus_id: "lpu",
    member_count: 18,
    status: "forming",
    expiry_timestamp: Date.now() + 1000 * 60 * 60 * 24, // 24 hours from now
    members: [
      { name: "Aditya", avatar: "A", color: "#f97316" },
      { name: "Megha", avatar: "M", color: "#8b5cf6" }
    ]
  },
  {
    id: "g5",
    product_id: "p5",
    campus_id: "lpu",
    member_count: 48,
    status: "forming",
    expiry_timestamp: Date.now() + 1000 * 60 * 30, // 30 mins from now
    members: [
      { name: "Varun", avatar: "V", color: "#14b8a6" },
      { name: "Anjali", avatar: "A", color: "#d946ef" },
      { name: "Sahil", avatar: "S", color: "#f43f5e" }
    ]
  }
];

export const users = [
  {
    id: "u1",
    name: "Demo User",
    campus: "LPU",
    hostel: "BH-1",
    phone: "9876543210",
    cashback_wallet_balance: 150
  }
];

// Helper functions for mock data
export function getGroupsWithProducts() {
  return groups.map(group => {
    const product = products.find(p => p.id === group.product_id);
    return { ...group, product };
  });
}

export function getGroupById(id) {
  const group = groups.find(g => g.id === id);
  if (!group) return null;
  const product = products.find(p => p.id === group.product_id);
  return { ...group, product };
}
