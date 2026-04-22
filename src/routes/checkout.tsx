import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Clock, AlertTriangle, Wallet, Building2, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { EVENTS, formatIDR } from "@/lib/mockData";
import { getUser, addTicket } from "@/lib/auth";

type CheckoutData = { eventId: string; seat: string; price: number; expiresAt: number };

export const Route = createFileRoute("/checkout")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getUser()) {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({
    meta: [{ title: "Checkout — TicketWave" }, { name: "description", content: "Selesaikan pembayaran sebelum waktu habis." }],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<CheckoutData | null>(null);
  const [now, setNow] = useState(Date.now());
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("tw_checkout");
    if (!raw) {
      navigate({ to: "/" });
      return;
    }
    setData(JSON.parse(raw));
  }, [navigate]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  const remaining = data ? Math.max(0, data.expiresAt - now) : 0;
  const expired = data && remaining === 0 && !paid;

  useEffect(() => {
    if (expired) {
      const t = setTimeout(() => {
        sessionStorage.removeItem("tw_checkout");
        alert("Waktu habis, kursi dilepas.");
        navigate({ to: "/event/$eventId", params: { eventId: data!.eventId } });
      }, 600);
      return () => clearTimeout(t);
    }
  }, [expired, data, navigate]);

  const ev = useMemo(() => (data ? getEventById(data.eventId) : null), [data]);

  if (!data || !ev) return null;

  const mm = String(Math.floor(remaining / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");
  const pct = (remaining / (5 * 60 * 1000)) * 100;

  const handlePay = (method: string) => {
    if (paying || paid) return;
    setPaying(true);
    setTimeout(() => {
      const user = getUser()!;
      const ticket = {
        id: "TW-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        eventId: ev.id,
        eventTitle: ev.title,
        seat: data.seat,
        price: data.price,
        date: ev.date,
        purchasedAt: new Date().toISOString(),
        user: user.email,
      };
      addTicket(ticket);
      sessionStorage.removeItem("tw_checkout");
      setPaid(true);
      setTimeout(() => navigate({ to: "/my-tickets" }), 1500);
    }, 1200);
  };

  if (paid) {
    return (
      <>
        <Navbar />
        <main className="grid min-h-[70vh] place-items-center px-4">
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
            <h1 className="mt-4 font-display text-3xl font-bold">Pembayaran Berhasil</h1>
            <p className="mt-2 text-muted-foreground">Mengarahkan ke My Tickets…</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl font-extrabold">CHECKOUT</h1>
        <p className="mt-1 text-sm text-muted-foreground">Selesaikan pembayaran sebelum waktu habis.</p>

        {/* Timer */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-primary/40 bg-card p-6 shadow-[var(--shadow-glow)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-primary" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sisa waktu</p>
                <p className="font-display text-5xl font-extrabold tabular-nums text-primary text-glow sm:text-6xl">
                  {mm}:{ss}
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning sm:flex">
              <AlertTriangle className="h-4 w-4" /> Kursi akan dilepas otomatis
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
        </section>

        {/* Summary */}
        <section className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold">RINGKASAN PESANAN</h2>
            <div className="mt-4 flex gap-4">
              <div className="h-24 w-20 shrink-0 rounded-lg" style={{ background: ev.poster }} />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-primary">{ev.genre}</p>
                <p className="font-display text-xl font-bold">{ev.title}</p>
                <p className="text-sm text-muted-foreground">{ev.artist} · {ev.date}</p>
                <p className="text-xs text-muted-foreground">{ev.venue}</p>
              </div>
            </div>
            <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
              <Row k="Nomor Kursi" v={<span className="font-bold text-primary">{data.seat}</span>} />
              <Row k="Tier" v={data.seat[0] <= "B" ? "VIP" : data.seat[0] <= "D" ? "Premium" : "Regular"} />
              <Row k="Harga Tiket" v={formatIDR(data.price)} />
              <Row k="Biaya Layanan" v={formatIDR(0)} />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm uppercase tracking-widest text-muted-foreground">Total</span>
              <span className="font-display text-2xl font-bold text-primary">{formatIDR(data.price)}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold">METODE PEMBAYARAN</h2>
            <div className="mt-4 space-y-3">
              <PayBtn icon={<Building2 className="h-5 w-5" />} label="Bayar Pakai VA" sub="Virtual Account" onClick={() => handlePay("va")} loading={paying} />
              <PayBtn icon={<Wallet className="h-5 w-5" />} label="Bayar Pakai E-Wallet" sub="GoPay · OVO · Dana" onClick={() => handlePay("ewallet")} loading={paying} />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Ini adalah simulasi pembayaran untuk demo presentasi.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span>{v}</span>
    </div>
  );
}

function PayBtn({ icon, label, sub, onClick, loading }: { icon: React.ReactNode; label: string; sub: string; onClick: () => void; loading: boolean }) {
  return (
    <button onClick={onClick} disabled={loading} className="group flex w-full items-center gap-3 rounded-xl border border-border bg-muted/40 p-4 text-left transition-all hover:border-primary/60 hover:bg-muted disabled:opacity-60">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">{icon}</span>
      <div className="flex-1">
        <p className="font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      {loading ? <span className="text-xs text-muted-foreground">Memproses…</span> : <span className="text-primary opacity-0 transition group-hover:opacity-100">→</span>}
    </button>
  );
}
