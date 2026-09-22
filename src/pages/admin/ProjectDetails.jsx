import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardCheck,
  Package,
  Users,
  CalendarDays,
  UserRound,
  Clock3,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function ProjectDetails() {
  const { id } = useParams();
  const { data } = useApp();

  const p = (data.projects || []).find(
    (x) => x.id === id
  );

  if (!p) {
    return (
      <div className="card p-8">
        <p>Project not found.</p>

        <Link
          className="mt-2 inline-block underline"
          to="/admin/projects"
        >
          Back
        </Link>
      </div>
    );
  }

  /* =====================================================
     PROJECT WORKERS
  ===================================================== */

  const workers = (data.users || []).filter((user) =>
    p.workerIds?.includes(user.id)
  );

  /* =====================================================
     PROJECT MATERIALS
  ===================================================== */

  const mats = (data.materials || []).filter(
    (material) => material.projectId === p.id
  );

  /* =====================================================
     PROJECT ATTENDANCE
  ===================================================== */

  const ats = (data.attendance || []).filter(
    (attendance) => attendance.projectId === p.id
  );

  /* =====================================================
     MATERIAL USAGE / WORKER TRANSACTIONS

     These records are created when a worker
     takes material from WorkerHome.
  ===================================================== */

  const materialUsage = (
    data.materialUsage || []
  ).filter(
    (usage) => usage.projectId === p.id
  );

  /* =====================================================
     MATERIAL USAGE TOTALS
  ===================================================== */

  const totalTransactions =
    materialUsage.length;

  const totalTakenQuantity =
    materialUsage.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );

  return (
    <div>

      {/* =================================================
          BACK
      ================================================= */}

      <Link
        to="/admin/projects"
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600"
      >
        <ArrowLeft size={16} />
        All Projects
      </Link>

      {/* =================================================
          PROJECT HEADER
      ================================================= */}

      <div className="card overflow-hidden">

        <div className="bg-slate-900 p-6 text-white">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">

            <div>

              <div className="text-sm text-slate-300">
                {p.location} • {p.client}
              </div>

              <h1 className="mt-1 text-3xl font-bold">
                {p.name}
              </h1>

              <p className="mt-3 max-w-2xl text-slate-300">
                {p.description}
              </p>

            </div>

            <span className="w-fit rounded-full bg-white/10 px-3 py-1.5 text-sm">
              {p.stage}
            </span>

          </div>

        </div>

        {/* =================================================
            PROJECT METRICS
        ================================================= */}

        <div className="grid gap-4 p-5 sm:grid-cols-4">

          <Metric
            icon={Users}
            label="Assigned Workers"
            value={workers.length}
          />

          <Metric
            icon={ClipboardCheck}
            label="Attendance Records"
            value={ats.length}
          />

          <Metric
            icon={Package}
            label="Material Items"
            value={mats.length}
          />

          <Metric
            icon={CalendarDays}
            label="Status"
            value={p.status}
          />

        </div>

      </div>

      {/* =================================================
          WORKERS + MATERIALS
      ================================================= */}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        {/* =================================================
            WORKERS
        ================================================= */}

        <section className="card">

          <div className="border-b p-5">

            <h2 className="font-bold">
              Workers on this plot
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Workers currently assigned to this project.
            </p>

          </div>

          <div className="divide-y">

            {workers.length ? (

              workers.map((worker) => (

                <div
                  className="flex items-center justify-between p-4"
                  key={worker.id}
                >

                  <div className="flex items-center gap-3">

                    <div className="grid h-10 w-10 place-items-center rounded-full bg-[#0B2A4A] text-sm font-bold text-white">
                      {worker.name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div>

                      <b className="text-sm">
                        {worker.name}
                      </b>

                      <p className="muted">
                        {worker.phone}
                      </p>

                    </div>

                  </div>

                  <span
                    className={`text-xs font-semibold ${
                      worker.active
                        ? "text-emerald-700"
                        : "text-red-600"
                    }`}
                  >
                    {worker.active
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>

              ))

            ) : (

              <Empty />

            )}

          </div>

        </section>

        {/* =================================================
            MATERIAL USAGE
        ================================================= */}

        <section className="card">

          <div className="border-b p-5">

            <h2 className="font-bold">
              Material Usage
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Current material stock for this plot.
            </p>

          </div>

          <div className="divide-y">

            {mats.length ? (

              mats.map((material) => {

                const total =
                  Number(
                    material.quantity || 0
                  );

                const used =
                  Number(
                    material.used || 0
                  );

                const remaining =
                  Number(
                    material.remaining ??
                      total - used
                  );

                const percentage =
                  total > 0
                    ? Math.min(
                        100,
                        (used / total) * 100
                      )
                    : 0;

                return (
                  <div
                    className="p-4"
                    key={material.id}
                  >

                    <div className="flex justify-between">

                      <div>

                        <b className="text-sm">
                          {material.name}
                        </b>

                        <p className="mt-1 text-xs text-slate-500">
                          {material.unit}
                        </p>

                      </div>

                      <span className="text-xs text-slate-500">
                        {material.category}
                      </span>

                    </div>

                    <div className="mt-2 flex justify-between text-xs text-slate-600">

                      <span>
                        Used: {used}{" "}
                        {material.unit}
                      </span>

                      <span>
                        Remaining: {remaining}{" "}
                        {material.unit}
                      </span>

                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className="h-full rounded-full bg-slate-800 transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              })

            ) : (

              <Empty />

            )}

          </div>

        </section>

      </div>

      {/* =================================================
          MATERIAL TAKEN BY WORKERS
      ================================================= */}

      <section className="mt-6 overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-[#071A33] via-[#0B2A4A] to-[#174D78] p-5 text-white sm:p-6">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div className="flex items-center gap-3">

              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10">

                <Package size={22} />

              </div>

              <div>

                <h2 className="text-xl font-bold">
                  Material Taken by Workers
                </h2>

                <p className="mt-1 text-xs text-blue-200">
                  See which worker took which material
                  and quantity.
                </p>

              </div>

            </div>

            {/* TRANSACTION COUNT */}

            <div className="rounded-xl bg-white/10 px-5 py-3">

              <p className="text-[10px] uppercase tracking-wide text-blue-200">
                Total Transactions
              </p>

              <p className="mt-1 text-xl font-extrabold">
                {totalTransactions}
              </p>

            </div>

          </div>

        </div>

        {/* CONTENT */}

        <div className="p-5 sm:p-6">

          {materialUsage.length > 0 ? (

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {materialUsage
                .slice()
                .reverse()
                .map((usage) => {

                  const worker =
                    (data.users || []).find(
                      (user) =>
                        user.id ===
                        usage.workerId
                    );

                  const material =
                    (data.materials || []).find(
                      (item) =>
                        item.id ===
                        usage.materialId
                    );

                  return (
                    <div
                      key={usage.id}
                      className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >

                      {/* WORKER */}

                      <div className="flex items-center gap-3">

                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#0B2A4A] text-white">

                          <UserRound size={20} />

                        </div>

                        <div className="min-w-0">

                          <p className="text-sm font-bold text-slate-900">
                            {usage.workerName ||
                              worker?.name ||
                              "Unknown Worker"}
                          </p>

                          <p className="text-xs text-slate-500">
                            {worker?.phone ||
                              "Worker"}
                          </p>

                        </div>

                      </div>

                      {/* MATERIAL */}

                      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">

                        <div className="flex items-center justify-between gap-3">

                          <div className="flex min-w-0 items-center gap-2">

                            <Package
                              size={18}
                              className="shrink-0 text-[#0B2A4A]"
                            />

                            <div className="min-w-0">

                              <p className="truncate text-sm font-bold text-[#0B2A4A]">
                                {usage.materialName ||
                                  material?.name ||
                                  "Material"}
                              </p>

                              <p className="text-xs text-slate-500">
                                {material?.category ||
                                  "Material"}
                              </p>

                            </div>

                          </div>

                          <div className="rounded-lg bg-white px-3 py-2 text-center shadow-sm">

                            <p className="text-[10px] font-semibold uppercase text-slate-400">
                              Taken
                            </p>

                            <p className="text-lg font-extrabold text-[#0B2A4A]">
                              {usage.quantity}
                            </p>

                            <p className="text-[10px] text-slate-500">
                              {usage.unit}
                            </p>

                          </div>

                        </div>

                      </div>

                      {/* DATE / TIME */}

                      <div className="mt-4 flex flex-wrap gap-2">

                        <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">

                          <CalendarDays size={14} />

                          {usage.date || "-"}
                        </div>

                        <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">

                          <Clock3 size={14} />

                          {usage.time || "-"}
                        </div>

                      </div>

                    </div>
                  );
                })}

            </div>

          ) : (

            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">

              <Package
                size={42}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 font-bold text-slate-700">
                No material taken by workers yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                When a worker takes material from
                this plot, the worker, material and
                quantity will appear here.
              </p>

            </div>

          )}

        </div>

      </section>

      {/* =================================================
          ATTENDANCE
      ================================================= */}

      <section className="card mt-6">

        <div className="border-b p-5">

          <h2 className="font-bold">
            Recent Attendance & Work Details
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase text-slate-500">

              <tr>

                <th className="px-4 py-3">
                  Worker
                </th>

                <th className="px-4 py-3">
                  Date
                </th>

                <th className="px-4 py-3">
                  In
                </th>

                <th className="px-4 py-3">
                  Out
                </th>

                <th className="px-4 py-3">
                  Work
                </th>

              </tr>

            </thead>

            <tbody className="divide-y">

              {ats.map((attendance) => (

                <tr key={attendance.id}>

                  <td className="px-4 py-3 font-medium">

                    {data.users.find(
                      (user) =>
                        user.id ===
                        attendance.workerId
                    )?.name || "-"}

                  </td>

                  <td className="px-4 py-3">
                    {attendance.date}
                  </td>

                  <td className="px-4 py-3">
                    {attendance.checkIn}
                  </td>

                  <td className="px-4 py-3">
                    {attendance.checkOut || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {attendance.work}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {!ats.length && <Empty />}

        </div>

      </section>

    </div>
  );
}

/* =========================================================
   METRIC
========================================================= */

function Metric({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <Icon size={18} />

      <div className="mt-3 text-xs text-slate-500">
        {label}
      </div>

      <div className="mt-1 font-bold">
        {value}
      </div>

    </div>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function Empty() {
  return (
    <div className="p-5 text-sm text-slate-500">
      No records yet.
    </div>
  );
}