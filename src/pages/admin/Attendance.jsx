import { useMemo, useState } from "react";
import {
  Download,
  Search,
  ClipboardCheck,
  Users,
  CalendarDays,
  Clock3,
  ChevronDown,
} from "lucide-react";

import { useApp } from "../../context/AppContext";

export default function Attendance() {
  const { data } = useApp();

  const [q, setQ] = useState("");
  const [project, setProject] = useState("all");

  /* -------------------------------------------------------------------------- */
  /* Filter attendance                                                          */
  /* -------------------------------------------------------------------------- */

  const rows = useMemo(
    () =>
      data.attendance.filter((a) => {
        const w = data.users.find((u) => u.id === a.workerId);

        return (
          (!q ||
            w?.name?.toLowerCase().includes(q.toLowerCase()) ||
            w?.phone?.includes(q) ||
            a.work?.toLowerCase().includes(q.toLowerCase()) ||
            a.notes?.toLowerCase().includes(q.toLowerCase())) &&
          (project === "all" || a.projectId === project)
        );
      }),
    [data, q, project]
  );

  /* -------------------------------------------------------------------------- */
  /* Group attendance by date                                                   */
  /* -------------------------------------------------------------------------- */

  const groupedAttendance = useMemo(() => {
    const groups = {};

    rows.forEach((attendance) => {
      const date = attendance.date || "Unknown Date";

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(attendance);
    });

    return Object.entries(groups).sort(([dateA], [dateB]) => {
      if (dateA === "Unknown Date") return 1;
      if (dateB === "Unknown Date") return -1;

      return dateB.localeCompare(dateA);
    });
  }, [rows]);

  /* -------------------------------------------------------------------------- */
  /* Format date                                                                */
  /* -------------------------------------------------------------------------- */

  const formatDate = (date) => {
    if (!date || date === "Unknown Date") {
      return "Unknown Date";
    }

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getDayName = (date) => {
    if (!date || date === "Unknown Date") {
      return "";
    }

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toLocaleDateString("en-IN", {
      weekday: "long",
    });
  };

  /* -------------------------------------------------------------------------- */
  /* Export CSV                                                                 */
  /* -------------------------------------------------------------------------- */

  const exportCsv = () => {
    const head =
      "Worker,Phone,Plot,Date,Check In,Check Out,Work,Notes\n";

    const body = rows
      .map((a) => {
        const w = data.users.find((u) => u.id === a.workerId);
        const p = data.projects.find((x) => x.id === a.projectId);

        return [
          w?.name,
          w?.phone,
          p?.name,
          a.date,
          a.checkIn,
          a.checkOut,
          a.work,
          a.notes,
        ]
          .map((x) => `"${String(x || "").replaceAll('"', '""')}"`)
          .join(",");
      })
      .join("\n");

    const blob = new Blob([head + body], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");

    el.href = url;
    el.download = "attendance.csv";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* -------------------------------------------------------------------- */}
      {/* Page Header                                                          */}
      {/* -------------------------------------------------------------------- */}

      <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-[#17251B] via-[#263A28] to-[#3F5130] p-5 shadow-lg sm:p-6">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-amber-300/20 bg-amber-400/10 text-amber-300 shadow-inner">
              <ClipboardCheck size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Labour Attendance
              </h1>

              <p className="mt-1 text-sm text-emerald-100/75">
                Attendance grouped by day with complete work details.
              </p>
            </div>
          </div>

          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300/30 bg-amber-400 px-4 py-2.5 text-sm font-semibold text-[#17251B] shadow-md transition hover:bg-amber-300 hover:shadow-lg"
            onClick={exportCsv}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Decorative bottom line */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Summary                                                               */}
      {/* -------------------------------------------------------------------- */}

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={ClipboardCheck}
          label="Records Found"
          value={rows.length}
          tone="emerald"
        />

        <SummaryCard
          icon={Users}
          label="Workers"
          value={
            new Set(
              rows.map((item) => item.workerId).filter(Boolean)
            ).size
          }
          tone="amber"
        />

        <SummaryCard
          icon={CalendarDays}
          label="Attendance Days"
          value={groupedAttendance.length}
          tone="lime"
        />
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Filters                                                               */}
      {/* -------------------------------------------------------------------- */}

      <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-800">
            <Search size={16} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-[#17251B]">
              Attendance Records
            </h2>

            <p className="text-xs text-slate-500">
              Search and filter submitted work details.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-3 text-emerald-700"
            />

            <input
              className="input border-slate-200 bg-slate-50/70 pl-10 transition focus:border-emerald-500 focus:ring-emerald-500"
              placeholder="Search worker or work..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          {/* Project filter */}
          <select
            className="input border-slate-200 bg-slate-50/70 transition focus:border-emerald-500 focus:ring-emerald-500 sm:w-64"
            value={project}
            onChange={(e) => setProject(e.target.value)}
          >
            <option value="all">All plots</option>

            {data.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Attendance By Date                                                    */}
      {/* -------------------------------------------------------------------- */}

      <div className="space-y-5">
        {groupedAttendance.map(([date, dayRows]) => (
          <AttendanceDaySection
            key={date}
            date={date}
            rows={dayRows}
            data={data}
            formatDate={formatDate}
            getDayName={getDayName}
          />
        ))}

        {/* Empty State */}
        {!rows.length && (
          <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-700 via-lime-500 to-amber-400" />

            <div className="p-10 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                <ClipboardCheck size={22} />
              </div>

              <h3 className="mt-3 font-semibold text-[#17251B]">
                No attendance records
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                No attendance records match your current search or filter.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Attendance Day Section                                                     */
/* ========================================================================== */

function AttendanceDaySection({
  date,
  rows,
  data,
  formatDate,
  getDayName,
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
      {/* Top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-700 via-lime-500 to-amber-400" />

      {/* Date Header */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50/70 via-white to-amber-50/40 px-5 py-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-emerald-100 bg-white text-emerald-700 shadow-sm">
              <CalendarDays size={20} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-[#17251B]">
                  {formatDate(date)}
                </h2>

                {getDayName(date) && (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                    {getDayName(date)}
                  </span>
                )}
              </div>

              <p className="mt-0.5 text-xs text-slate-500">
                Daily attendance and work records
              </p>
            </div>
          </div>

          {/* Day count */}
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
            <Users size={14} />

            {rows.length}{" "}
            {rows.length === 1 ? "Worker" : "Workers"}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead className="bg-[#F4F7F2] text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-5 py-3.5">Worker</th>
              <th>Plot</th>
              <th>Date</th>
              <th>In</th>
              <th>Out</th>
              <th>Work</th>
              <th>Notes</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((a) => {
              const w = data.users.find(
                (u) => u.id === a.workerId
              );

              const p = data.projects.find(
                (x) => x.id === a.projectId
              );

              return (
                <tr
                  key={a.id}
                  className="transition hover:bg-emerald-50/40"
                >
                  {/* Worker */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-emerald-100 bg-emerald-50 font-bold text-emerald-800">
                        {w?.name?.charAt(0)?.toUpperCase() || "W"}
                      </div>

                      <div>
                        <b className="font-semibold text-[#17251B]">
                          {w?.name || "Unknown Worker"}
                        </b>

                        <div className="mt-0.5 text-xs text-slate-500">
                          {w?.phone || "-"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Plot */}
                  <td>
                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {p?.name || "-"}
                    </span>
                  </td>

                  {/* Date */}
                  <td>
                    <span className="font-medium text-slate-700">
                      {a.date || "-"}
                    </span>
                  </td>

                  {/* Check In */}
                  <td>
                    <span className="inline-flex rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                      {a.checkIn || "-"}
                    </span>
                  </td>

                  {/* Check Out */}
                  <td>
                    {a.checkOut ? (
                      <span className="inline-flex rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                        {a.checkOut}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>

                  {/* Work */}
                  <td>
                    <span className="font-medium text-slate-700">
                      {a.work || "-"}
                    </span>
                  </td>

                  {/* Notes */}
                  <td className="max-w-[220px]">
                    <span className="text-slate-500">
                      {a.notes || "-"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ========================================================================== */
/* Summary Card                                                               */
/* ========================================================================== */

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone = "emerald",
}) {
  const tones = {
    emerald: {
      icon:
        "bg-emerald-50 text-emerald-800 border-emerald-100",
      value: "text-emerald-900",
    },

    amber: {
      icon:
        "bg-amber-50 text-amber-800 border-amber-100",
      value: "text-amber-900",
    },

    lime: {
      icon:
        "bg-lime-50 text-lime-800 border-lime-100",
      value: "text-lime-900",
    },
  };

  const current = tones[tone] || tones.emerald;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-emerald-50/70 blur-2xl transition group-hover:bg-amber-50/70" />

      <div className="relative flex items-center gap-4">
        <div
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${current.icon}`}
        >
          <Icon size={19} />
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {label}
          </p>

          <p
            className={`mt-1 text-2xl font-bold tracking-tight ${current.value}`}
          >
            {value}
          </p>
        </div>
      </div>

      <div className="relative mt-4 h-1 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-emerald-600 to-amber-400 transition-all duration-500 group-hover:w-2/3" />
      </div>
    </div>
  );
}