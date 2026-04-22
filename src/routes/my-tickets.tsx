import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Calendar, Ticket as TicketIcon } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { getUser, getTickets, type Ticket } from "@/lib/auth";
import { formatIDR, getEventById } from "@/lib/mockData";

export const Route = createFileRoute("/my-tickets")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getUser()) {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({
    meta: [{ title: "My Tickets — TicketWave" }, { name: "description", content: "Tiket yang telah kamu beli." }],
  }),
  component: MyTicketsPage,
});

function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [active, setActive] = useState<Ticket | null>(null);
  const user = typeof window !== "undefined" ? getUser() : null;

  useEffect(() => {
    if (user) setTickets(getTickets(user.email));
  }, [user]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-4xl font-extrabold">MY <span className="text-primary text-glow">TICKETS</span></h1>
        <p className="mt-2 text-muted-foreground">{tickets.length} tiket aktif</p>

        {tickets.length === 0 ? (
          <div className="mt-12 grid place-items-center rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
            <TicketIcon className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-display text-xl font-bold">Belum ada tiket</p>
            <p className="mt-1 text-sm text-muted-foreground">Yuk eksplor event seru dan beli tiket pertamamu.</p>
            <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)]">
              Jelajahi Event
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tickets.map((t) => {
              const ev = getEventById(t.eventId);
              return (
                <button key={t.id} onClick={() => setActive(t)} className="group relative overflow-hidden rounded-2xl border border-border bg-card text-left transition-all hover:border-primary/60 hover:shadow-[var(--shadow-glow)]">
                  <div className="h-32 relative" style={{ background: ev?.poster }}>
                    <div className="absolute inset-0 bg-grid opacity-30 mix-blend-overlay" />
                    <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
                      {t.id}
                    </div>
                  </div>
                  <div className="relative p-4">
                    {/* Ticket notch */}
                    <div className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-background" />
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">{ev?.genre}</p>
                    <p className="font-display text-xl font-bold">{t.eventTitle}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" /> {t.date}
                      </div>
                      <div className="rounded-md bg-primary/15 px-2 py-1 text-xs font-bold text-primary">Kursi {t.seat}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {active && <ETicketModal ticket={active} onClose={() => setActive(null)} />}
    </>
  );
}

function ETicketModal({ ticket, onClose }: { ticket: Ticket; onClose: () => void }) {
  const ev = getEventById(ticket.eventId);
  const user = getUser();
  const qrValue = JSON.stringify({ id: ticket.id, seat: ticket.seat, ev: ticket.eventId, u: ticket.user });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-primary/50 bg-card shadow-[var(--shadow-glow)]">
        <button onClick={onClose} className="absolute right-3 top-3 z-10 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60">
          <X className="h-4 w-4" />
        </button>
        <div className="relative h-32" style={{ background: ev?.poster }}>
          <div className="absolute inset-0 bg-grid opacity-30 mix-blend-overlay" />
          <div className="absolute bottom-3 left-4 right-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">E-TICKET · {ticket.id}</p>
            <p className="font-display text-2xl font-extrabold text-white">{ticket.eventTitle}</p>
          </div>
        </div>

        {/* perforation */}
        <div className="relative flex">
          <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background" />
          <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background" />
          <div className="absolute left-4 right-4 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-border" />
        </div>

        <div className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Field k="Nama" v={user?.name ?? ""} />
            <Field k="Tanggal" v={ticket.date} />
            <Field k="Venue" v={ev?.venue ?? ""} />
            <Field k="Kursi" v={<span className="font-bold text-primary">{ticket.seat}</span>} />
          </div>

          <div className="grid place-items-center rounded-xl bg-white p-4">
            <QRCodeSVG value={qrValue} size={160} level="M" />
          </div>

          <div className="flex items-center justify-between border-t border-dashed border-border pt-4 text-sm">
            <span className="text-muted-foreground">Total Bayar</span>
            <span className="font-display text-lg font-bold text-primary">{formatIDR(ticket.price)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{k}</p>
      <p className="mt-0.5 truncate">{v}</p>
    </div>
  );
}
