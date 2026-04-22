export type EventItem = {
  id: string;
  title: string;
  artist: string;
  genre: string;
  date: string;
  venue: string;
  priceFrom: number;
  rating: number;
  poster: string; // gradient css
  accent: string;
};

export const EVENTS: EventItem[] = [
  { id: "neon-dynasty", title: "Neon Dynasty", artist: "Kage Riku", genre: "Cyberpunk", date: "12 Jun 2026", venue: "GBK Senayan, Jakarta", priceFrom: 750000, rating: 9.4, poster: "linear-gradient(135deg,#0ea5e9,#a855f7,#ec4899)", accent: "#22d3ee" },
  { id: "frozen-horizon", title: "Frozen Horizon", artist: "Aurora Kirana", genre: "Synthwave", date: "28 Jun 2026", venue: "ICE BSD, Tangerang", priceFrom: 500000, rating: 9.1, poster: "linear-gradient(135deg,#1e40af,#7dd3fc,#f0abfc)", accent: "#7dd3fc" },
  { id: "solar-bloom", title: "Solar Bloom", artist: "Mira Sun", genre: "Indie Pop", date: "05 Jul 2026", venue: "Istora Senayan", priceFrom: 450000, rating: 8.9, poster: "linear-gradient(135deg,#f97316,#eab308,#fb7185)", accent: "#fbbf24" },
  { id: "midnight-drift", title: "Midnight Drift", artist: "Reza Velvet", genre: "Alt Rock", date: "19 Jul 2026", venue: "JIExpo Kemayoran", priceFrom: 600000, rating: 9.0, poster: "linear-gradient(135deg,#0f172a,#dc2626,#fbbf24)", accent: "#dc2626" },
  { id: "echo-garden", title: "Echo Garden", artist: "Lila Sora", genre: "Dream Pop", date: "02 Aug 2026", venue: "Lapangan Banteng", priceFrom: 350000, rating: 8.6, poster: "linear-gradient(135deg,#10b981,#06b6d4,#8b5cf6)", accent: "#10b981" },
  { id: "voltage-nights", title: "Voltage Nights", artist: "DJ Kairo", genre: "EDM", date: "16 Aug 2026", venue: "Allianz Stadium", priceFrom: 850000, rating: 9.3, poster: "linear-gradient(135deg,#7c3aed,#ec4899,#f59e0b)", accent: "#a855f7" },
];

export const ROWS = ["A", "B", "C", "D", "E", "F"];
export const COLS = 10;

export type SeatStatus = "available" | "locked" | "sold";

// Deterministic seat status per event so reload doesn't change dramatically
export function getSeatMap(eventId: string): Record<string, SeatStatus> {
  const map: Record<string, SeatStatus> = {};
  let seed = 0;
  for (let i = 0; i < eventId.length; i++) seed = (seed * 31 + eventId.charCodeAt(i)) % 1000;
  ROWS.forEach((r, ri) => {
    for (let c = 1; c <= COLS; c++) {
      const v = (seed + ri * 13 + c * 7) % 10;
      let s: SeatStatus = "available";
      if (v < 2) s = "sold";
      else if (v < 3) s = "locked";
      map[`${r}${c}`] = s;
    }
  });
  // Apply user-locked seats from localStorage (other simulated users)
  return map;
}

export function seatPrice(row: string, basePrice: number): number {
  const tier = row <= "B" ? 2 : row <= "D" ? 1.4 : 1;
  return Math.round(basePrice * tier);
}

export function formatIDR(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}
