import { Link, NavLink, useNavigate, Outlet } from "react-router-dom";
import {
  Building2,
  ClipboardCheck,
  HardHat,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Users,
  X,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Layout() {
  const { currentUser, logout } = useApp();
  const [open, setOpen] = useState(false);

  const nav = useNavigate();

  /* =========================================================
     ADMIN NAVIGATION
  ========================================================= */

  const adminLinks = [
    ["/admin", "Dashboard", LayoutDashboard, false],
    ["/admin/projects", "Projects", Building2, false],
    ["/admin/materials", "Materials", Package, false],

    // Opens in NEW browser tab
    ["/admin/attendance", "Attendance", ClipboardCheck, true],
    ["/admin/workers", "Labour", Users, true],
  ];

  /* =========================================================
     WORKER NAVIGATION
  ========================================================= */

  const workerLinks = [
    ["/worker", "My Attendance", ClipboardCheck, false],
  ];

  const links =
    currentUser?.role === "admin"
      ? adminLinks
      : workerLinks;

  /* =========================================================
     LOGOUT
  ========================================================= */

  const signOut = () => {
    logout();
    nav("/login");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-[#F4F7F2] via-[#FAFAF7] to-[#F3F5F0]">

      {/* =====================================================
          BACKGROUND DECORATIONS
      ====================================================== */}

      <div className="pointer-events-none fixed left-[-120px] top-24 -z-10 h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl" />

      <div className="pointer-events-none fixed right-[-120px] bottom-0 -z-10 h-80 w-80 rounded-full bg-amber-200/20 blur-3xl" />

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-white/95 shadow-sm backdrop-blur-xl">

        {/* ===================================================
            MAIN NAVBAR
        ==================================================== */}

        <div className="relative flex w-full items-center justify-between px-3 py-3 sm:px-5 lg:px-7">

          {/* =================================================
              BRAND
          ================================================== */}

          <Link
            to={
              currentUser?.role === "admin"
                ? "/admin"
                : "/worker"
            }
            className="group flex items-center gap-3"
          >

            {/* Logo */}

            <div className="relative">

              {/* Logo Glow */}

              <div className="absolute -inset-2 rounded-[22px] bg-emerald-400/15 blur-lg transition duration-500 group-hover:bg-amber-400/20" />

              {/* Logo Box */}

              <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#17251B] via-[#263A28] to-[#3F5130] text-white shadow-lg shadow-emerald-900/20 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl group-hover:shadow-emerald-900/25">

                {/* Decorative Circle */}

                <div className="absolute -right-3 -top-3 h-8 w-8 rounded-full bg-amber-400/20" />

                <div className="absolute -bottom-4 -left-3 h-9 w-9 rounded-full bg-emerald-300/10" />

                {/* Construction Icon */}

                <div className="relative z-10 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm">

                  <HardHat
                    size={22}
                    strokeWidth={2.5}
                    className="text-amber-300"
                  />

                </div>

              </div>

              {/* Status Dot */}

              <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-amber-400 shadow-sm" />

            </div>

            {/* Brand Text */}

            <div className="leading-tight">

              <div className="flex items-center gap-1.5">

                <span className="text-lg font-extrabold tracking-tight text-[#17251B]">
                  BuildTrack
                </span>

                <Sparkles
                  size={13}
                  className="text-amber-500"
                />

              </div>

              <div className="mt-0.5 text-[10px] font-bold tracking-[0.14em] text-emerald-700/70 sm:text-[11px]">
                CONTRACTOR MANAGEMENT
              </div>

            </div>

          </Link>

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================== */}

          <button
            type="button"
            aria-label="Toggle navigation"
            className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm transition duration-200 hover:bg-emerald-100 hover:text-emerald-950 lg:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================== */}

          <nav className="hidden items-center gap-1.5 lg:flex">

            {links.map(
              ([to, label, Icon, newTab]) => (
                <NavItem
                  key={to}
                  to={to}
                  label={label}
                  Icon={Icon}
                  newTab={newTab}
                />
              )
            )}

            {/* Divider */}

            <div className="mx-2 h-8 w-px bg-gradient-to-b from-transparent via-emerald-200 to-transparent" />

            {/* Logout */}

            <button
              type="button"
              onClick={signOut}
              className="group inline-flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-2.5 text-sm font-bold text-orange-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-100 hover:text-orange-800 hover:shadow-md"
            >

              <LogOut
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />

              Logout

            </button>

          </nav>

        </div>

        {/* =====================================================
            CURVED NAVBAR LINE
        ====================================================== */}

        <div className="relative h-2 overflow-hidden">

          <div className="absolute left-0 right-0 top-[4px] h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />

          <div className="absolute -left-10 top-[-17px] h-8 w-44 rounded-full border-b-2 border-emerald-500/35" />

          <div className="absolute left-[18%] top-[-17px] h-8 w-44 rounded-full border-b-2 border-amber-400/40" />

          <div className="absolute left-[42%] top-[-17px] h-8 w-44 rounded-full border-b-2 border-emerald-500/30" />

          <div className="absolute right-[18%] top-[-17px] h-8 w-44 rounded-full border-b-2 border-amber-400/35" />

          <div className="absolute -right-10 top-[-17px] h-8 w-44 rounded-full border-b-2 border-emerald-500/30" />

        </div>

        {/* =====================================================
            MOBILE NAVIGATION
        ====================================================== */}

        {open && (
          <div className="border-t border-emerald-100 bg-gradient-to-b from-white to-emerald-50/60 px-3 py-4 shadow-lg sm:px-5 lg:hidden">

            {/* Mobile Navigation Header */}

            <div className="mb-3 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-3">

              <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#17251B] to-[#3F5130] text-white shadow-sm">

                <ShieldCheck
                  size={17}
                  className="text-amber-300"
                />

              </div>

              <div>

                <p className="text-xs font-extrabold text-[#263A28]">
                  Navigation
                </p>

                <p className="text-[10px] font-medium text-emerald-700/70">
                  Manage your workspace
                </p>

              </div>

            </div>

            {/* Mobile Links */}

            <nav className="grid gap-1.5">

              {links.map(
                ([to, label, Icon, newTab]) => (
                  <NavItem
                    key={to}
                    to={to}
                    label={label}
                    Icon={Icon}
                    newTab={newTab}
                    onClick={() => setOpen(false)}
                    mobile
                  />
                )
              )}

            </nav>

            {/* Mobile Logout */}

            <button
              type="button"
              onClick={signOut}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700 shadow-sm transition duration-200 hover:bg-orange-100 hover:text-orange-800"
            >

              <LogOut size={17} />

              Logout

            </button>

          </div>
        )}

      </header>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="relative w-full px-3 py-5 sm:px-5 sm:py-6 lg:px-7 lg:py-7">

        {/* Background Glow */}

        <div className="pointer-events-none fixed left-0 top-32 -z-10 h-72 w-72 rounded-full bg-emerald-200/15 blur-3xl" />

        <div className="pointer-events-none fixed right-0 bottom-10 -z-10 h-80 w-80 rounded-full bg-amber-200/15 blur-3xl" />

        {/* Page Content */}

        <Outlet />

      </main>

    </div>
  );
}


/* =========================================================
   NAVIGATION ITEM
========================================================= */

function NavItem({
  to,
  label,
  Icon,
  onClick,
  mobile = false,
  newTab = false,
}) {
  const sizeClass = mobile
    ? "w-full px-4 py-3.5"
    : "px-3.5 py-2.5";

  /* =======================================================
     NEW TAB NAVIGATION
     Attendance + Labour
  ======================================================= */

  if (newTab) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        title={`${label} - Opens in new tab`}
        className={`
          group relative flex items-center gap-2.5 rounded-xl
          border border-amber-200/70
          bg-gradient-to-r
          from-amber-50
          via-yellow-50
          to-emerald-50
          text-sm font-bold
          text-emerald-800
          shadow-sm
          shadow-amber-900/5
          transition-all
          duration-200
          ${sizeClass}

          hover:-translate-y-0.5
          hover:border-amber-300
          hover:from-amber-100
          hover:via-yellow-100
          hover:to-emerald-100
          hover:text-emerald-950
          hover:shadow-md
          hover:shadow-amber-900/10

          focus:outline-none
          focus:ring-2
          focus:ring-amber-300/60
        `}
      >

        <NavContent
          Icon={Icon}
          label={label}
          mobile={mobile}
          isActive={false}
          newTab={true}
        />

      </a>
    );
  }

  /* =======================================================
     NORMAL SAME-TAB NAVIGATION
  ======================================================= */

  return (
    <NavLink
      onClick={onClick}
      to={to}
      end={to === "/admin"}
      className={({ isActive }) => `
        group relative flex items-center gap-2.5 rounded-xl
        text-sm font-bold
        transition-all
        duration-200
        ${sizeClass}

        ${
          isActive
            ? `
              bg-gradient-to-r
              from-[#17251B]
              via-[#263A28]
              to-[#3F5130]
              text-white
              shadow-md
              shadow-emerald-900/20
              hover:shadow-lg
            `
            : `
              text-slate-600
              hover:bg-emerald-50
              hover:text-emerald-800
            `
        }

        focus:outline-none
        focus:ring-2
        focus:ring-emerald-300/50
      `}
    >

      {({ isActive }) => (
        <NavContent
          Icon={Icon}
          label={label}
          mobile={mobile}
          isActive={isActive}
          newTab={false}
        />
      )}

    </NavLink>
  );
}


/* =========================================================
   NAVIGATION CONTENT
========================================================= */

function NavContent({
  Icon,
  label,
  mobile,
  isActive,
  newTab = false,
}) {
  return (
    <>
      {/* =================================================
          ACTIVE TOP HIGHLIGHT
      ================================================== */}

      {isActive && (
        <span className="absolute left-3 right-3 top-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
      )}

      {/* =================================================
          ICON
      ================================================== */}

      <span
        className={`
          relative
          grid
          place-items-center
          rounded-lg
          transition-all
          duration-200

          ${mobile ? "h-9 w-9" : "h-7 w-7"}

          ${
            isActive
              ? "bg-white/10 text-amber-300"
              : newTab
                ? `
                  bg-gradient-to-br
                  from-amber-100
                  to-emerald-100
                  text-emerald-700
                  shadow-sm
                  group-hover:scale-105
                  group-hover:rotate-1
                `
                : `
                  bg-slate-100
                  text-slate-500
                  group-hover:bg-emerald-100
                  group-hover:text-emerald-700
                `
          }
        `}
      >

        <Icon
          size={mobile ? 18 : 16}
          strokeWidth={2.2}
        />

        {/* =================================================
            NEW TAB ARROW
        ================================================== */}

        {newTab && !mobile && (
          <span className="absolute -right-1.5 -top-1.5 grid h-3.5 w-3.5 place-items-center rounded-full border border-white bg-amber-400 text-[8px] font-black text-emerald-950 shadow-sm">
            ↗
          </span>
        )}

      </span>

      {/* =================================================
          LABEL
      ================================================== */}

      <span className="flex-1">
        {label}
      </span>

      {/* =================================================
          NEW BADGE
      ================================================== */}

      {newTab && (
        <span className="ml-auto rounded-md border border-amber-200 bg-white/70 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-amber-700 shadow-sm">
          New
        </span>
      )}

      {/* =================================================
          ACTIVE INDICATOR
      ================================================== */}

      {isActive && (
        <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-sm shadow-amber-300/50" />
      )}

    </>
  );
}