export type User = { name: string; email: string };

const KEY = "tw_user";

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(u: User) {
  localStorage.setItem(KEY, JSON.stringify(u));
  // Simulated JWT cookie
  document.cookie = `tw_jwt=mock.${btoa(u.email)}.token; path=/; max-age=86400`;
}

export function logout() {
  localStorage.removeItem(KEY);
  document.cookie = "tw_jwt=; path=/; max-age=0";
}

export type Ticket = {
  id: string;
  eventId: string;
  eventTitle: string;
  seat: string;
  price: number;
  date: string;
  purchasedAt: string;
  user: string;
};

const TKEY = "tw_tickets";

export function getTickets(email: string): Ticket[] {
  try {
    const raw = localStorage.getItem(TKEY);
    const all: Ticket[] = raw ? JSON.parse(raw) : [];
    return all.filter((t) => t.user === email);
  } catch {
    return [];
  }
}

export function addTicket(t: Ticket) {
  const raw = localStorage.getItem(TKEY);
  const all: Ticket[] = raw ? JSON.parse(raw) : [];
  all.push(t);
  localStorage.setItem(TKEY, JSON.stringify(all));
}
