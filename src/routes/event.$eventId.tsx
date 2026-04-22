import { createFileRoute, redirect, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Star, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ROWS, COLS, getSeatMap, seatPrice, formatIDR, getEventById, type SeatStatus, type EventItem } from "@/lib/mockData";
import { getUser } from "@/lib/auth";

export const Route = createFileRoute("/event/$eventId")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getUser()) {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({
    meta: [
      { title: `Detail Event — TicketWave` },
      { name: "description", content: `Pesan tiket konser di TicketWave.` },
    ],
  }),
  component: EventDetail,
});

function EventDetail() {
  const { eventId } = Route.useParams();
  const navigate = useNavigate();
  const [ev, setEv] = useState<EventItem | null>(null);
  const [seats, setSeats] = useState<Record<string, SeatStatus>>({});
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const found = getEventById(eventId);
    setEv(found ?? null);
    if (found) setSeats(getSeatMap(found.id));
  }, [eventId]);

  if (!ev) {
    return (
      <>
        <Navbar />
        <div className="grid min-h-[60vh] place-items-center">
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold">Event tidak ditemukan</h1>
            <Link to="/" className="mt-4 inline-block text-primary hover:underline">Kembali ke Explore</Link>
          </div>
        </div>
      </>
    );
  }

  const handlePick = (id: string) => {
    if (seats[id] !== "available") return;
    setSelected((prev) => (prev === id ? null : id));
  };

  const proceed = () => {
    if (!selected) return;
    const row = selected[0];
    const price = seatPrice(row, ev.priceFrom);
    sessionStorage.setItem("tw_checkout", JSON.stringify({ eventId: ev.id, seat: selected, price, expiresAt: Date.now() + 5 * 60 * 1000 }));
    navigate({ to: "/checkout" });
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Hero */}
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grid gap-6 md:grid-cols-[280px_1fr]">
            <div className="relative aspect-[4/5] md:aspect-auto" style={{ background: ev.poster }}>
              <div className="absolute inset-0 bg-grid opacity-30 mix-blend-overlay" />
              <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                <Star className="h-3 w-3 fill-primary text-primary" /> {ev.rating}
              </div>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{ev.genre}</p>
              <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">{ev.title}</h1>
              <p className="mt-1 text-lg text-muted-foreground">{ev.artist}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Info1 icon={<Calendar className="h-4 w-4" />} label="Tanggal" value={ev.date} />
                <Info1 icon={<MapPin className="h-4 w-4" />} label="Venue" value={ev.venue} />
              </div>
              <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">
                  Pilih kursi terbaikmu di peta di bawah. Sistem <span className="font-semibold text-foreground">Seat Locking</span> akan menahan kursimu selama 5 menit untuk menyelesaikan pembayaran.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Seat map */}
        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl font-bold">PETA KURSI</h2>
            <Legend />
          </div>

          <div className="mx-auto mt-8 max-w-2xl">
            <div className="relative mb-8 h-2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent">
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Stage</span>
            </div>

            <div className="space-y-2">
              {ROWS.map((row) => (
                <div key={row} className="flex items-center justify-center gap-2">
                  <span className="w-6 text-center text-xs font-bold text-muted-foreground">{row}</span>
                  <div className="flex flex-1 justify-center gap-1.5 sm:gap-2">
                    {Array.from({ length: COLS }, (_, i) => i + 1).map((c) => {
                      const id = `${row}${c}`;
                      const status = seats[id] ?? "available";
                      const isSel = selected === id;
                      return <Seat key={id} id={id} status={status} selected={isSel} onClick={() => handlePick(id)} />;
                    })}
                  </div>
                  <span className="w-6 text-center text-xs font-bold text-muted-foreground">{row}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action bar */}
          <div className="mt-8 flex flex-col items-stretch justify-between gap-3 rounded-xl border border-border bg-muted/40 p-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Kursi Dipilih</p>
              {selected ? (
                <p className="font-display text-xl font-bold">
                  {selected} <span className="text-primary">· {formatIDR(seatPrice(selected[0], ev.priceFrom))}</span>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada kursi dipilih</p>
              )}
            </div>
            <button
              disabled={!selected}
              onClick={proceed}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
            >
              Lanjut ke Pembayaran <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

function Info1({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-3">
      <span className="mt-0.5 text-primary">{icon}</span>
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function Seat({ status, selected, onClick, id }: { id: string; status: SeatStatus; selected: boolean; onClick: () => void }) {
  const base = "h-7 w-7 sm:h-8 sm:w-8 rounded-md text-[9px] sm:text-[10px] font-bold flex items-center justify-center transition-all";
  let cls = "";
  if (selected) cls = "bg-primary text-primary-foreground scale-110 shadow-[var(--shadow-glow)] ring-2 ring-primary";
  else if (status === "available") cls = "bg-success/20 text-success hover:bg-success/40 hover:scale-110 cursor-pointer border border-success/40";
  else if (status === "locked") cls = "bg-warning/20 text-warning/80 cursor-not-allowed border border-warning/30";
  else cls = "bg-danger/20 text-danger/80 cursor-not-allowed border border-danger/30";
  return (
    <button onClick={onClick} disabled={status !== "available"} className={`${base} ${cls}`} title={`${id} — ${status}`}>
      {id}
    </button>
  );
}

function Legend() {
  const items = [
    { label: "Available", cls: "bg-success/40 border-success/60" },
    { label: "Locked", cls: "bg-warning/40 border-warning/60" },
    { label: "Sold", cls: "bg-danger/40 border-danger/60" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-3">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded border ${it.cls}`} />
          <span className="text-xs text-muted-foreground">{it.label}</span>
        </div>
      ))}
    </div>
  );
}
