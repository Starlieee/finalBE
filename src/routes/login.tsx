import { createFileRoute, redirect, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { setUser, getUser } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && getUser()) {
      throw redirect({ to: "/" });
    }
  },
  head: () => ({
    meta: [
      { title: "Masuk — TicketWave" },
      { name: "description", content: "Platform tiket konser tercepat dan teraman dengan seat locking real-time." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPwd, setShowPwd] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Email dan password wajib diisi.");
    if (password.length < 6) return setError("Password minimal 6 karakter.");
    if (tab === "register" && !name) return setError("Nama wajib diisi.");
    const finalName = tab === "register" ? name : email.split("@")[0];
    setUser({ name: finalName, email });
    navigate({ to: "/" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <FloatingDecor />
      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-16">
        {/* Left hero */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="font-display text-2xl font-bold tracking-tight">
              TICKET<span className="text-primary text-glow">WAVE</span>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              LIVE NOW
            </div>
            <h1 className="mt-8 font-display text-5xl font-extrabold leading-[0.95] sm:text-6xl lg:text-7xl">
              DAPATKAN<br />KURSI<br />
              <span className="text-primary text-glow">TERBAIK</span>
            </h1>
            <p className="mt-6 max-w-md text-muted-foreground">
              Platform tiket konser paling cepat dan aman. Sistem{" "}
              <span className="font-semibold text-foreground">Seat Locking</span> real-time kami memastikan tidak ada double-booking.
            </p>
          </div>
          <div className="mt-10 flex gap-8">
            <Stat value="12K+" label="Tiket Terjual" />
            <Stat value="48+" label="Event Aktif" />
            <Stat value="99%" label="Uptime" />
          </div>
          <p className="mt-10 text-xs text-muted-foreground">© 2026 TicketWave. All rights reserved.</p>
        </div>

        {/* Right form card */}
        <div className="flex items-center">
          <div className="w-full rounded-2xl border border-border bg-card/80 p-6 shadow-[var(--shadow-card)] backdrop-blur-xl sm:p-8">
            <div className="font-display text-sm font-bold tracking-tight">
              TICKET<span className="text-primary">WAVE</span>
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              {tab === "login" ? "SELAMAT DATANG" : "BUAT AKUN BARU"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {tab === "login" ? "Masuk untuk melanjutkan ke platform." : "Daftar untuk mulai war tiket."}
            </p>

            <div className="mt-6 grid grid-cols-2 rounded-xl bg-muted p-1">
              {(["login", "register"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-lg py-2.5 text-sm font-semibold transition-all ${
                    tab === t ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "login" ? "Masuk" : "Daftar"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {tab === "register" && (
                <Field label="NAMA" icon={<User className="h-4 w-4" />}>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" className="w-full bg-transparent outline-none placeholder:text-muted-foreground/60" />
                </Field>
              )}
              <Field label="EMAIL" icon={<Mail className="h-4 w-4" />}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" className="w-full bg-transparent outline-none placeholder:text-muted-foreground/60" />
              </Field>
              <Field label="PASSWORD" icon={<Lock className="h-4 w-4" />}>
                <input type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-transparent outline-none placeholder:text-muted-foreground/60" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-muted-foreground hover:text-foreground">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </Field>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button type="submit" className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.01] active:scale-[0.99]">
                {tab === "login" ? "Masuk" : "Daftar"} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <div className="relative my-2 text-center text-xs text-muted-foreground">
                <span className="bg-card px-3 relative z-10">atau</span>
                <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-border" />
              </div>

              <p className="text-center text-sm text-muted-foreground">
                {tab === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
                <button type="button" onClick={() => setTab(tab === "login" ? "register" : "login")} className="font-bold text-primary hover:underline">
                  {tab === "login" ? "Daftar Sekarang" : "Masuk"}
                </button>
              </p>
              <p className="text-center text-xs text-muted-foreground">
                Pengelola platform?{" "}
                <Link to="/admin/login" className="font-bold text-primary hover:underline">Masuk sebagai Admin</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-bold">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold tracking-widest text-muted-foreground">{label}</label>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-input/40 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
        <span className="text-primary">{icon}</span>
        {children}
      </div>
    </div>
  );
}

function FloatingDecor() {
  const items = [
    { e: "🎟️", x: "12%", y: "28%", r: "-12deg" },
    { e: "🥤", x: "52%", y: "8%", r: "8deg" },
    { e: "🍿", x: "8%", y: "18%", r: "-6deg" },
    { e: "🎫", x: "78%", y: "22%", r: "16deg" },
    { e: "🍺", x: "92%", y: "52%", r: "-10deg" },
    { e: "🎟️", x: "62%", y: "78%", r: "10deg" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {items.map((it, i) => (
        <span key={i} className="absolute text-3xl opacity-60" style={{ left: it.x, top: it.y, transform: `rotate(${it.r})` }}>
          {it.e}
        </span>
      ))}
    </div>
  );
}
