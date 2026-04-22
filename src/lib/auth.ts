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

// ============== ADMIN AUTH ==============
export type Admin = { name: string; email: string; role: "SUPER ADMIN" | "ADMIN" };
const AKEY = "tw_admin";

// Hardcoded credentials (demo only — frontend simulation)
export const ADMIN_CREDENTIALS = [
  { email: "admin@ticketwave.id", password: "admin123", name: "Admin TicketWave", role: "SUPER ADMIN" as const },
  { email: "staff@ticketwave.id", password: "staff123", name: "Staff TicketWave", role: "ADMIN" as const },
];

export function getAdmin(): Admin | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AKEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAdmin(a: Admin) {
  localStorage.setItem(AKEY, JSON.stringify(a));
  document.cookie = `tw_admin_jwt=mock.${btoa(a.email)}.adm; path=/; max-age=86400`;
}

export function adminLogout() {
  localStorage.removeItem(AKEY);
  document.cookie = "tw_admin_jwt=; path=/; max-age=0";
}

export function loginAdmin(email: string, password: string): Admin | null {
  const found = ADMIN_CREDENTIALS.find((a) => a.email === email && a.password === password);
  if (!found) return null;
  const admin: Admin = { name: found.name, email: found.email, role: found.role };
  setAdmin(admin);
  return admin;
}
