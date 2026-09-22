import { Link } from "react-router-dom";
import {
  Building2,
  ClipboardCheck,
  Package,
  Users,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  MapPin,
  UserCheck,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import StatCard from "../../components/StatCard";

export default function Dashboard() {
  const { data } = useApp();

  const activeProjects = data.projects.filter(
    (p) => p.status !== "Completed"
  ).length;

  const presentToday = data.attendance.filter(
    (a) => a.date === new Date().toISOString().slice(0, 10)
  ).length;

  const lowMaterials = data.materials.filter(
    (m) =>
      Number(m.remaining) <= Math.max(1, Number(m.quantity) * 0.2)
  );

  const activeLabourers = data.users.filter(
    (u) => u.role === "labour" && u.active
  ).length;

  /* ================================================================
     OPEN ATTENDANCE / LABOUR IN A NEW BROWSER TAB
     ================================================================ */

  const openNewTab = (path) => {
    const url = `${window.location.origin}${path}`;

    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F4F7F2] via-[#FAFAF7] to-[#F3F5F0]">
      <div className="w-full py-2 sm:py-3 lg:py-4">

        {/* ================================================================
            HEADER
            ================================================================ */}

        <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#17251B] via-[#263A28] to-[#3F5130] p-4 text-white shadow-2xl sm:p-6 lg:p-8">

          <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl sm:h-96 sm:w-96" />

          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-lime-300/10 blur-3xl sm:h-[28rem] sm:w-[28rem]" />

          <div className="pointer-events-none absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-amber-300/10 blur-3xl sm:h-56 sm:w-56" />

          <div className="relative flex flex-col justify-between gap-5 sm:gap-6 lg:flex-row lg:items-center">

            <div className="min-w-0">

              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-200">

                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/10 shadow-lg backdrop-blur sm:h-10 sm:w-10">
                  <Building2 size={17} />
                </span>

                <span>Admin Dashboard</span>

              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Construction Overview
              </h1>

              <p className="mt-2 max-w-2xl text-xs leading-5 text-emerald-100 sm:text-sm sm:leading-6 lg:text-base">
                Monitor construction plots, labour attendance,
                materials and project progress from one place.
              </p>

            </div>

            <Link
              to="/admin/projects"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200/40 bg-amber-400 px-4 py-2.5 text-sm font-extrabold text-[#17251B] shadow-lg transition duration-200 hover:-translate-y-1 hover:bg-amber-300 hover:shadow-xl sm:w-fit sm:px-5 sm:py-3"
            >
              Manage Projects

              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>

          </div>

          <div className="-mx-1 mt-6 overflow-x-auto pb-1 sm:mt-8">

            <div className="grid min-w-[570px] grid-cols-3 gap-3 px-1">

              <SummaryCard
                icon={TrendingUp}
                label="Active Projects"
                value={activeProjects}
              />

              <SummaryCard
                icon={UserCheck}
                label="Labour Present"
                value={presentToday}
              />

              <SummaryCard
                icon={Package}
                label="Material Items"
                value={data.materials.length}
              />

            </div>

          </div>

        </div>

        {/* ================================================================
            STAT CARDS
            ================================================================ */}

        <div className="mt-4 overflow-x-auto pb-1 sm:mt-5">

          <div className="grid min-w-[760px] grid-cols-4 gap-4">

            <div className="rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-green-500 p-[1px] shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

              <div className="h-full rounded-2xl bg-white">

                <StatCard
                  icon={Building2}
                  label="Active Plots"
                  value={activeProjects}
                  hint={`${data.projects.length} total projects`}
                />

              </div>

            </div>

            <div className="rounded-2xl bg-gradient-to-br from-orange-700 via-orange-600 to-amber-400 p-[1px] shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

              <div className="h-full rounded-2xl bg-white">

                <StatCard
                  icon={Users}
                  label="Labourers"
                  value={activeLabourers}
                  hint="Active labour accounts"
                />

              </div>

            </div>

            <div className="rounded-2xl bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-400 p-[1px] shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

              <div className="h-full rounded-2xl bg-white">

                <StatCard
                  icon={ClipboardCheck}
                  label="Attendance Today"
                  value={presentToday}
                  hint="Submitted attendance records"
                />

              </div>

            </div>

            <div className="rounded-2xl bg-gradient-to-br from-yellow-600 via-amber-500 to-orange-400 p-[1px] shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

              <div className="h-full rounded-2xl bg-white">

                <StatCard
                  icon={Package}
                  label="Material Items"
                  value={data.materials.length}
                  hint="Tracked material entries"
                />

              </div>

            </div>

          </div>

        </div>

        {/* ================================================================
            MAIN CONTENT
            ================================================================ */}

        <div className="mt-4 grid gap-5 sm:mt-5 lg:grid-cols-3">

          {/* ============================================================
              PROJECT MONITORING
              ============================================================ */}

          <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200 lg:col-span-2">

            <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-lime-50 p-4 sm:p-5 lg:p-6">

              <div className="flex items-center justify-between gap-3">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-700 to-green-500 text-white shadow-lg sm:h-11 sm:w-11">
                    <Building2 size={19} />
                  </div>

                  <div className="min-w-0">

                    <h2 className="truncate font-extrabold text-slate-900">
                      Project Monitoring
                    </h2>

                    <p className="mt-0.5 text-xs font-medium text-slate-500">
                      Track each construction plot
                    </p>

                  </div>

                </div>

                <Link
                  to="/admin/projects"
                  className="group inline-flex shrink-0 items-center gap-1 text-xs font-bold text-emerald-700 transition hover:text-emerald-900 sm:text-sm"
                >
                  View all

                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

              </div>

            </div>

            <div className="divide-y divide-slate-100">

              {data.projects.map((p) => {

                const workers = p.workerIds?.length || 0;

                const used = data.materials
                  .filter((m) => m.projectId === p.id)
                  .reduce(
                    (s, m) => s + Number(m.used || 0),
                    0
                  );

                return (
                  <Link
                    to={`/admin/projects/${p.id}`}
                    key={p.id}
                    className="group block p-4 transition duration-200 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-white sm:p-5 lg:p-6"
                  >

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                      <div className="min-w-0">

                        <div className="flex items-center gap-2">

                          <h3 className="truncate font-extrabold text-slate-900 transition group-hover:text-emerald-700">
                            {p.name}
                          </h3>

                          {p.status === "Completed" && (
                            <CheckCircle2
                              size={17}
                              className="shrink-0 text-emerald-500"
                            />
                          )}

                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">

                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {p.location}
                          </span>

                          <span className="text-slate-300">
                            •
                          </span>

                          <span>{p.client}</span>

                        </div>

                      </div>

                      <span className="w-fit shrink-0 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-lime-50 px-3 py-1.5 text-xs font-extrabold text-emerald-800 shadow-sm">
                        {p.stage}
                      </span>

                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:grid-cols-4 sm:gap-3">

                      <Mini
                        label="Workers"
                        value={workers}
                      />

                      <Mini
                        label="Target"
                        value={p.targetWorkers}
                      />

                      <Mini
                        label="Materials Used"
                        value={used}
                      />

                      <Mini
                        label="Status"
                        value={p.status}
                      />

                    </div>

                  </Link>
                );
              })}

              {!data.projects.length && (
                <div className="p-8 text-center sm:p-10">

                  <Building2
                    size={36}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 font-bold text-slate-700">
                    No projects available
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Create your first construction project.
                  </p>

                </div>
              )}

            </div>

          </div>

          {/* ============================================================
              RIGHT SIDEBAR
              ============================================================ */}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">

            {/* MATERIAL ALERTS */}

            <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">

              <div className="border-b border-slate-200 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 p-4 sm:p-5">

                <div className="flex items-center gap-3">

                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-orange-600 to-amber-500 text-white shadow-md sm:h-11 sm:w-11">
                    <AlertTriangle size={19} />
                  </div>

                  <div>

                    <h2 className="font-extrabold text-slate-900">
                      Material Alerts
                    </h2>

                    <p className="text-xs font-medium text-slate-500">
                      Low-stock materials
                    </p>

                  </div>

                </div>

              </div>

              <div className="p-4 sm:p-5">

                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-slate-600">

                  Items at or below{" "}

                  <span className="font-extrabold text-orange-700">
                    20% remaining
                  </span>
                  .

                </div>

                <div className="space-y-3">

                  {lowMaterials.length ? (
                    lowMaterials.map((m) => (
                      <div
                        key={m.id}
                        className="flex gap-3 rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-3 transition hover:-translate-y-0.5 hover:shadow-md sm:p-4"
                      >

                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-orange-100 text-orange-600">
                          <AlertTriangle size={18} />
                        </div>

                        <div className="min-w-0">

                          <div className="truncate text-sm font-extrabold text-slate-800">
                            {m.name}
                          </div>

                          <div className="mt-1 text-xs font-semibold text-slate-600">
                            {m.remaining} {m.unit} remaining
                          </div>

                        </div>

                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-center">

                      <CheckCircle2
                        size={28}
                        className="mx-auto text-emerald-500"
                      />

                      <p className="mt-2 text-sm font-extrabold text-emerald-700">
                        All materials are healthy
                      </p>

                      <p className="mt-1 text-xs text-emerald-600">
                        No low-stock alerts right now.
                      </p>

                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* ============================================================
                QUICK ACTIONS
                ============================================================ */}

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#17251B] via-[#263A28] to-[#3F5130] p-4 text-white shadow-2xl sm:p-6">

              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-300/10 blur-3xl" />

              <div className="relative flex items-center gap-3">

                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/10 shadow-lg backdrop-blur sm:h-11 sm:w-11">
                  <ClipboardCheck size={19} />
                </div>

                <div>

                  <h2 className="font-extrabold">
                    Quick Actions
                  </h2>

                  <p className="text-xs font-medium text-emerald-200">
                    Manage your construction data
                  </p>

                </div>

              </div>

              <div className="relative mt-4 grid gap-2.5 sm:mt-5">

                {/* PROJECTS - SAME TAB */}

                <ActionLink
                  to="/admin/projects"
                  label="Projects"
                />

                {/* MATERIALS - SAME TAB */}

                <ActionLink
                  to="/admin/materials"
                  label="Materials"
                />

                {/* ======================================================
                    ATTENDANCE - NEW BROWSER TAB
                    ====================================================== */}

                <button
                  type="button"
                  onClick={() =>
                    openNewTab("/admin/attendance")
                  }
                  className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/10 px-3.5 py-3 text-left text-sm font-bold text-white shadow-sm backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-amber-300/30 hover:bg-amber-400 hover:text-[#17251B] hover:shadow-lg sm:px-4"
                >
                  <span>Attendance</span>

                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </button>

                {/* ======================================================
                    LABOUR ACCOUNTS - NEW BROWSER TAB
                    ====================================================== */}

                <button
                  type="button"
                  onClick={() =>
                    openNewTab("/admin/workers")
                  }
                  className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/10 px-3.5 py-3 text-left text-sm font-bold text-white shadow-sm backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-amber-300/30 hover:bg-amber-400 hover:text-[#17251B] hover:shadow-lg sm:px-4"
                >
                  <span>Labour Accounts</span>

                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

/* ==========================================================================
   SUMMARY CARD
   ========================================================================== */

function SummaryCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/10 p-3 shadow-lg backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/15 hover:shadow-xl">

      <div className="flex items-center gap-2 text-emerald-200">

        <Icon
          size={16}
          className="shrink-0 transition-transform duration-300 group-hover:scale-110 sm:size-[17px]"
        />

        <span className="truncate text-[10px] font-bold uppercase tracking-wide sm:text-xs">
          {label}
        </span>

      </div>

      <p className="mt-1.5 text-xl font-extrabold text-white sm:mt-2 sm:text-2xl">
        {value}
      </p>

    </div>
  );
}

/* ==========================================================================
   MINI CARD
   ========================================================================== */

function Mini({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-emerald-50/50 p-2.5 transition duration-200 group-hover:border-emerald-100 group-hover:shadow-sm sm:p-3">

      <div className="truncate text-[10px] font-bold uppercase tracking-wide text-slate-500 sm:text-[11px]">
        {label}
      </div>

      <div className="mt-1 truncate text-xs font-extrabold text-[#263A28] sm:text-sm">
        {value}
      </div>

    </div>
  );
}

/* ==========================================================================
   SAME TAB ACTION
   ========================================================================== */

function ActionLink({
  to,
  label,
}) {
  const className =
    "group flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/10 px-3.5 py-3 text-left text-sm font-bold text-white shadow-sm backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-amber-300/30 hover:bg-amber-400 hover:text-[#17251B] hover:shadow-lg sm:px-4";

  return (
    <Link
      to={to}
      className={className}
    >
      <span>{label}</span>

      <ArrowRight
        size={16}
        className="transition-transform duration-200 group-hover:translate-x-1"
      />
    </Link>
  );
}