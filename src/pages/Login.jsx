import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
HardHat,
LockKeyhole,
Phone,
ShieldCheck,
Building2,
Users,
Package,
ArrowRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Login() {
const { currentUser, login } = useApp();
const nav = useNavigate();
const location = useLocation();

const [phone, setPhone] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

if (currentUser) {
return (
<Navigate
to={currentUser.role === "admin" ? "/admin" : "/worker"}
replace
/>
);
}

const submit = (e) => {
e.preventDefault();
setError("");


const result = login(phone.trim(), password);

if (result.ok) {
  nav(
    location.state?.from ||
      (result.role === "admin" ? "/admin" : "/worker"),
    { replace: true }
  );
} else {
  setError(result.message);
}


};

return ( <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#17251B] via-[#263A28] to-[#3F5130] p-4 sm:p-6">
{/* Background Decorations */} <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" /> <div className="pointer-events-none absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-amber-400/10 blur-3xl" /> <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-lime-300/5 blur-3xl" />


  {/* Decorative Construction Lines */}
  <div className="pointer-events-none absolute left-0 right-0 top-10 hidden opacity-20 sm:block">
    <div className="mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
  </div>

  <div className="pointer-events-none absolute bottom-10 left-0 right-0 hidden opacity-20 sm:block">
    <div className="mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
  </div>

  {/* Main Card */}
  <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
    {/* Left Branding Panel */}
    <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#17251B] via-[#263A28] to-[#3F5130] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
      {/* Decorative Glows */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

      {/* Top Branding */}
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="relative grid h-12 w-12 place-items-center rounded-2xl border border-amber-300/20 bg-amber-400/10 text-amber-300 shadow-inner">
            <HardHat size={25} />

            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
          </div>

          <div>
            <b className="block text-xl tracking-tight">
              BuildTrack
            </b>

            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/70">
              Contractor Management
            </span>
          </div>
        </div>

        {/* Main Message */}
        <div className="mt-20">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-emerald-100">
            <ShieldCheck size={14} />
            Construction Operations
          </div>

          <h1 className="max-w-xl text-4xl font-bold leading-[1.12] tracking-tight xl:text-5xl">
            Manage every plot, worker and material from one place.
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-7 text-emerald-50/70">
            A simple workforce and construction monitoring system for
            contractors working across multiple sites.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
          <FeatureCard
            icon={Building2}
            title="Plots"
          />

          <FeatureCard
            icon={Users}
            title="Workers"
          />

          <FeatureCard
            icon={Package}
            title="Materials"
          />
        </div>
      </div>

      {/* Bottom Info */}
      <div className="relative mt-10 flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-emerald-100/70">
          <ShieldCheck size={14} />
          Role-based access
        </span>

        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-emerald-100/70">
          Local data storage
        </span>
      </div>

      {/* Decorative Loop Line */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 overflow-hidden opacity-40">
        <div className="absolute -bottom-20 left-1/4 h-40 w-96 rounded-[50%] border border-emerald-300/30" />
        <div className="absolute -bottom-24 left-1/3 h-40 w-96 rounded-[50%] border border-amber-300/20" />
      </div>
    </div>

    {/* Right Login Panel */}
    <div className="relative bg-white p-6 sm:p-10 lg:p-12">
      {/* Mobile Branding */}
      <div className="mb-8 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#17251B] to-[#3F5130] text-amber-300 shadow-md">
            <HardHat size={22} />
          </div>

          <div>
            <b className="block text-xl tracking-tight text-[#17251B]">
              BuildTrack
            </b>

            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Contractor Management
            </p>
          </div>
        </div>
      </div>

      {/* Login Heading */}
      <div>
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
          <LockKeyhole size={20} />
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-[#17251B]">
          Welcome back
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Sign in using your phone number and password to continue.
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={submit} className="mt-8 space-y-5">
        {/* Phone */}
        <div>
          <label className="label">Phone Number</label>

          <div className="relative">
            <Phone
              className="absolute left-3.5 top-3 text-emerald-700"
              size={18}
            />

            <input
              className="input border-slate-200 bg-slate-50/60 pl-11 transition focus:border-emerald-500 focus:bg-white focus:ring-emerald-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              autoComplete="tel"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="label">Password</label>

          <div className="relative">
            <LockKeyhole
              className="absolute left-3.5 top-3 text-emerald-700"
              size={18}
            />

            <input
              type="password"
              className="input border-slate-200 bg-slate-50/60 pl-11 transition focus:border-emerald-500 focus:bg-white focus:ring-emerald-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-3 text-sm text-red-700">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Sign In */}
        <button
          type="submit"
          className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#263A28] to-[#3F5130] px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:from-[#17251B] hover:to-[#263A28] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Sign In
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </form>

      {/* Demo Credentials */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-lime-50">
        <div className="border-b border-amber-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-amber-700" />

            <p className="text-xs font-bold uppercase tracking-wider text-[#263A28]">
              Demo Credentials
            </p>
          </div>
        </div>

        <div className="space-y-2.5 p-4 text-xs text-slate-600">
          <div className="rounded-xl border border-white/80 bg-white/70 p-3">
            <b className="text-[#17251B]">Demo admin</b>

            <div className="mt-1 font-mono text-slate-600">
              9999999999 / admin123
            </div>
          </div>

          <div className="rounded-xl border border-white/80 bg-white/70 p-3">
            <b className="text-[#17251B]">Demo worker</b>

            <div className="mt-1 font-mono text-slate-600">
              9876543210 / worker123
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-center text-[11px] text-slate-400">
        BuildTrack · Contractor Management System
      </p>
    </div>
  </div>
</div>


);
}

/* -------------------------------------------------------------------------- */
/* Feature Card                                                               */
/* -------------------------------------------------------------------------- */

function FeatureCard({ icon: Icon, title }) {
return ( <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm"> <div className="mb-2 grid h-8 w-8 place-items-center rounded-lg bg-amber-400/10 text-amber-300"> <Icon size={16} /> </div>


  <p className="text-xs font-semibold text-white/80">
    {title}
  </p>
</div>


);
}
