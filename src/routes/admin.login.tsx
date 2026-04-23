import { createFileRoute, redirect, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { getAdmin, loginAdmin } from "@/lib/auth";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && getAdmin()) {
      throw redirect({ to: "/admin" });
    }
  },
  head: () => ({
    meta: [
      { title: "Admin Login — TicketWave" },
      { name: "description", content: "Admin panel access for TicketWave platform." },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const admin = loginAdmin(email.trim(), password);
    if (!admin) return setError("Email atau password admin salah.");
    navigate({ to: "/admin" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

      <div className="relative w-full max-w-md rounded-2xl border border-primary/30 bg-card/80 p-8 shadow-[var(--shadow-card)] backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/40">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="font-display text-sm font-bold tracking-widest text-muted-foreground">TICKETWAVE</div>
            <div className="font-display text-xl font-extrabold tracking-tight">ADMIN PANEL</div>
          </div>
        </div>

        <h1 className="font-display text-3xl font-extrabold">MASUK ADMIN</h1>
        <p className="mt-1 text-sm text-muted-foreground">Akses khusus pengelola platform.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="EMAIL ADMIN" icon={<Mail className="h-4 w-4" />}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email " className="w-full bg-transparent outline-none placeholder:text-muted-foreground/60" />
          </Field>
          <Field label="PASSWORD" icon={<Lock className="h-4 w-4" />}>
            <input type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-transparent outline-none placeholder:text-muted-foreground/60" />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-muted-foreground hover:text-foreground">
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </Field>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button type="submit" className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.01]">
            Login <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </form>

        <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4 text-xs">
          <p className="font-bold tracking-widest text-muted-foreground">DEMO CREDENTIALS</p>
          <p className="mt-2"><span className="text-muted-foreground">Email:</span> <span className="font-mono text-primary">pokoknyaadmin@gmail.com</span></p>
          <p><span className="text-muted-foreground">Password:</span> <span className="font-mono text-primary">admin123</span></p>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Bukan admin? <Link to="/login" className="font-bold text-primary hover:underline">Masuk sebagai user</Link>
        </p>
      </div>
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
