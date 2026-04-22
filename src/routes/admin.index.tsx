import { createFileRoute, redirect, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  LayoutDashboard, Mic2, Armchair, ShoppingBag, FileBarChart, Settings,
  Bell, Plus, Ticket as TicketIcon, Wallet, Lock, LogOut, Clock, ArrowRight,
} from "lucide-react";
import { getAdmin, adminLogout } from "@/lib/auth";
import { EVENTS, formatIDR } from "@/lib/mockData";

export const Route = createFileRoute("/admin/")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getAdmin()) {
      throw redirect({ to: "/admin/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "Dashboard Admin — TicketWave" },
      { name: "description", content: "Panel admin TicketWave: kelola event, kursi, pesanan, dan laporan." },
    ],
  }),
  component: AdminDashboard,
});

type NavKey = "dashboard" | "events" | "seats" | "orders" | "reports" | "settings";

function AdminDashboard() {
  const navigate = useNavigate();
  const admin = getAdmin();
  const [active, setActive] = useState<NavKey>("dashboard");

  const handleLogout = () => {
    adminLogout();
    navigate({ to: "/admin/login" });
  };

  const now = useMemo(() => {
    const d = new Date();
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${days[d.getDay()]}, ${pad(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()} · ${pad(d.getHours())}.${pad(d.getMinutes())}`;
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/60 lg:flex">
        <div className="px-6 py-6">
          <div className="font-display text-xl font-extrabold tracking-tight">
            TICKET<span className="text-primary text-glow">WAVE</span>
          </div>
          <div className="mt-1 text-[11px] font-bold tracking-[0.25em] text-muted-foreground">ADMIN PANEL</div>
        </div>

        <nav className="flex-1 space-y-6 px-3">
          <NavSection title="OVERVIEW">
            <NavItem icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" active={active === "dashboard"} onClick={() => setActive("dashboard")} />
          </NavSection>
          <NavSection title="MANAJEMEN">
            <NavItem icon={<Mic2 className="h-4 w-4" />} label="Kelola Event" badge={7} active={active === "events"} onClick={() => setActive("events")} />
            <NavItem icon={<Armchair className="h-4 w-4" />} label="Status Kursi" active={active === "seats"} onClick={() => setActive("seats")} />
            <NavItem icon={<ShoppingBag className="h-4 w-4" />} label="Pesanan" badge={3} active={active === "orders"} onClick={() => setActive("orders")} />
          </NavSection>
          <NavSection title="LAPORAN">
            <NavItem icon={<FileBarChart className="h-4 w-4" />} label="Laporan Penjualan" active={active === "reports"} onClick={() => setActive("reports")} />
          </NavSection>
          <NavSection title="SISTEM">
            <NavItem icon={<Settings className="h-4 w-4" />} label="Pengaturan" active={active === "settings"} onClick={() => setActive("settings")} />
          </NavSection>
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {admin?.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{admin?.name}</p>
              <p className="text-[10px] font-bold tracking-widest text-primary">{admin?.role}</p>
            </div>
            <button onClick={handleLogout} title="Logout" className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              DASHBOARD <span className="text-primary">ADMIN</span>
            </h1>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground sm:flex">
                <Clock className="h-4 w-4 text-primary" /> {now}
              </div>
              <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card hover:bg-accent">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] hover:scale-[1.02] transition-transform">
                <Plus className="h-4 w-4" /> Tambah Event
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="TOTAL TIKET TERJUAL" value="12K+" trend="+18% vs bulan lalu" trendColor="text-[color:var(--success)]" accent="var(--primary)" icon={<TicketIcon className="h-6 w-6" />} />
            <StatCard title="PENDAPATAN" value={<><span className="text-primary">Rp</span>48M</>} trend="+24% vs bulan lalu" trendColor="text-[color:var(--success)]" accent="var(--success)" icon={<Wallet className="h-6 w-6" />} />
            <StatCard title="EVENT AKTIF" value="48" trend="+4 event baru pekan ini" trendColor="text-[color:var(--success)]" accent="#60a5fa" icon={<Mic2 className="h-6 w-6" />} />
            <StatCard title="KURSI LOCKED AKTIF" value="127" trend="Real-time — pembaruan otomatis" trendColor="text-destructive" accent="var(--destructive)" icon={<Lock className="h-6 w-6" />} />
          </div>

          {/* Middle row */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel title="AKTIVITAS TERBARU" icon={<Clock className="h-4 w-4 text-primary" />} action={<button className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-accent">Lihat Semua</button>}>
              <ul className="space-y-4">
                <Activity dot="var(--success)" time="5 mnt" text={<>Tiket <b className="text-primary">Neon Dynasty</b> B-07 berhasil terjual ke Andi S.</>} />
                <Activity dot="var(--warning)" time="8 mnt" text={<>User <b className="text-primary">user_3341</b> mengunci kursi <b className="text-primary">C-09</b> Frozen Horizon</>} />
                <Activity dot="var(--destructive)" time="45 mnt" text={<>Transaksi <b className="text-primary">TW-00417</b> gagal — timeout pembayaran</>} />
                <Activity dot="#60a5fa" time="1 j" text={<>Event baru <b className="text-primary">Solar Bloom</b> ditambahkan oleh admin</>} />
                <Activity dot="oklch(0.65 0.02 85)" time="2 j" text={<>Lock kursi <b className="text-primary">A-03</b> kedaluwarsa, dikembalikan</>} />
              </ul>
            </Panel>

            <Panel title="STATUS KURSI GLOBAL" icon={<Armchair className="h-4 w-4 text-primary" />} action={<button className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-accent">Detail</button>}>
              <div className="flex items-center gap-8">
                <DonutChart percent={76} />
                <div className="flex-1 space-y-3 text-sm">
                  <LegendRow color="var(--destructive)" label="Terjual" value="9,240" />
                  <LegendRow color="var(--warning)" label="Locked" value="127" />
                  <LegendRow color="var(--success)" label="Tersedia" value="2,833" />
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xs font-bold tracking-widest text-muted-foreground">PENJUALAN 7 HARI</p>
                <MiniBars data={[40, 65, 48, 80, 55, 72, 90]} />
              </div>
            </Panel>
          </div>

          {/* Popular events */}
          <div className="mt-8 flex items-end justify-between">
            <h2 className="font-display text-xl font-extrabold">
              EVENT <span className="text-primary">TERPOPULER</span>
            </h2>
            <Link to="/" className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent">
              Lihat Semua <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 text-left">Event</th>
                  <th className="px-5 py-3 text-left">Tanggal</th>
                  <th className="px-5 py-3 text-left">Venue</th>
                  <th className="px-5 py-3 text-right">Harga Mulai</th>
                  <th className="px-5 py-3 text-right">Rating</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {EVENTS.slice(0, 5).map((ev) => (
                  <tr key={ev.id} className="border-t border-border/60 hover:bg-accent/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="h-9 w-9 rounded-md" style={{ background: ev.poster }} />
                        <div>
                          <div className="font-semibold">{ev.title}</div>
                          <div className="text-xs text-muted-foreground">{ev.artist} · {ev.genre}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{ev.date}</td>
                    <td className="px-5 py-3 text-muted-foreground">{ev.venue}</td>
                    <td className="px-5 py-3 text-right font-semibold text-primary">{formatIDR(ev.priceFrom)}</td>
                    <td className="px-5 py-3 text-right">⭐ {ev.rating}</td>
                    <td className="px-5 py-3 text-right">
                      <Link to="/event/$eventId" params={{ eventId: ev.id }} className="text-xs font-bold text-primary hover:underline">Kelola →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">© 2026 TicketWave Admin Panel</p>
        </div>
      </main>
    </div>
  );
}

function NavSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.25em] text-muted-foreground">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function NavItem({ icon, label, active, badge, onClick }: { icon: React.ReactNode; label: string; active?: boolean; badge?: number; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${active ? "bg-primary/15 text-primary font-semibold ring-1 ring-primary/30" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}>
      <span className={active ? "text-primary" : ""}>{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && (
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">{badge}</span>
      )}
    </button>
  );
}

function StatCard({ title, value, trend, trendColor, accent, icon }: { title: string; value: React.ReactNode; trend: string; trendColor: string; accent: string; icon: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground">{title}</p>
        <span className="text-muted-foreground/60">{icon}</span>
      </div>
      <div className="mt-3 font-display text-4xl font-extrabold tracking-tight">{value}</div>
      <p className={`mt-3 text-xs ${trendColor}`}>↑ {trend}</p>
    </div>
  );
}

function Panel({ title, icon, action, children }: { title: string; icon: React.ReactNode; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-display text-sm font-extrabold tracking-widest">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Activity({ dot, time, text }: { dot: string; time: string; text: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: dot }} />
      <p className="flex-1 text-sm">{text}</p>
      <span className="shrink-0 text-xs text-muted-foreground">{time}</span>
    </li>
  );
}

function LegendRow({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function DonutChart({ percent }: { percent: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const sold = (9240 / (9240 + 127 + 2833)) * c;
  const locked = (127 / (9240 + 127 + 2833)) * c;
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--success)" strokeWidth="12" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--destructive)" strokeWidth="12" strokeDasharray={`${sold} ${c}`} />
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--warning)" strokeWidth="12" strokeDasharray={`${locked} ${c}`} strokeDashoffset={-sold} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-2xl font-extrabold">{percent}%</div>
        <div className="text-[10px] font-bold tracking-widest text-muted-foreground">Terisi</div>
      </div>
    </div>
  );
}

function MiniBars({ data }: { data: number[] }) {
  const labels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const max = Math.max(...data);
  return (
    <div className="mt-3">
      <div className="flex h-20 items-end gap-2">
        {data.map((v, i) => (
          <div key={i} className="flex-1 rounded-t bg-primary/70 transition-all hover:bg-primary" style={{ height: `${(v / max) * 100}%` }} />
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        {labels.map((l) => <div key={l} className="flex-1 text-center text-[10px] text-muted-foreground">{l}</div>)}
      </div>
    </div>
  );
}
