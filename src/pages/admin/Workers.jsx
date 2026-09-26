
import { useState } from "react";
import {
  Edit3,
  Plus,
  Trash2,
  UserRound,
  Users,
  ShieldCheck,
  MapPin,
  Phone,
  UserCheck,
  UserX,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import Modal from "../../components/Modal";

const blank = {
  name: "",
  phone: "",
  password: "",
  active: true,
};

export default function Workers() {
  const { data, addUser, updateUser, deleteUser } = useApp();

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(blank);

  const workers = data.users.filter(
    (u) => u.role === "labour"
  );

  const activeWorkers = workers.filter(
    (w) => w.active
  ).length;

  const inactiveWorkers = workers.filter(
    (w) => !w.active
  ).length;

  const newOne = () => {
    setForm({ ...blank });
    setModal("new");
  };

  const edit = (worker) => {
    setForm({
      ...worker,
      password: "",
    });

    setModal(worker);
  };

  const submit = (e) => {
    e.preventDefault();

    if (modal === "new") {
      addUser({
        ...form,
        role: "labour",
      });
    } else {
      const patch = {
        name: form.name,
        phone: form.phone,
        active: form.active,
      };

      if (form.password) {
        patch.password = form.password;
      }

      updateUser(modal.id, patch);
    }

    setModal(null);
  };

  return (
    <div className="relative -mx-4 w-[calc(100%+2rem)] space-y-6 overflow-x-hidden sm:-mx-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:w-[calc(100%+4rem)]">

      {/* =========================================================
          PAGE HEADER
      ========================================================= */}

      <section className="relative overflow-hidden rounded-none border-y border-blue-200 bg-gradient-to-br from-[#06182D] via-[#0B2A4A] to-[#174D78] p-4 shadow-xl sm:rounded-3xl sm:border sm:p-6">

        {/* Background decorations */}

        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="pointer-events-none absolute right-1/3 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-sky-400/5 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          {/* TITLE */}

          <div className="flex min-w-0 items-center gap-3 sm:gap-4">

            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/10 text-blue-200 shadow-inner sm:h-13 sm:w-13">
              <Users size={23} />
            </div>

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <h1 className="text-xl font-bold tracking-tight text-white sm:text-3xl">
                  Labour Accounts
                </h1>

                <span className="rounded-full border border-blue-300/20 bg-blue-400/10 px-2.5 py-1 text-[10px] font-semibold text-blue-200">
                  Workforce
                </span>

              </div>

              <p className="mt-1 max-w-xl text-xs leading-5 text-blue-100/75 sm:text-sm">
                Create and manage worker accounts, access,
                and site assignments.
              </p>

            </div>

          </div>

          {/* CREATE BUTTON */}

          <button
            type="button"
            onClick={newOne}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#0B2A4A] shadow-lg transition hover:bg-blue-50 hover:shadow-xl sm:w-auto sm:py-2.5"
          >
            <Plus size={17} />
            Create Labour Account
          </button>

        </div>

        {/* HEADER FOOTER */}

        <div className="relative mt-5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">

          <div className="flex items-center gap-2 text-xs text-blue-100/70">
            <ShieldCheck size={14} />
            Admin controlled access
          </div>

          <div className="h-1 w-1 rounded-full bg-blue-300/40" />

          <div className="text-xs text-blue-100/70">
            {workers.length} total worker accounts
          </div>

        </div>

      </section>

      {/* =========================================================
          SUMMARY
      ========================================================= */}

      <div className="grid gap-3 px-0 sm:grid-cols-3 sm:gap-4">

        <SummaryCard
          icon={Users}
          label="Total Workers"
          value={workers.length}
          description="All labour accounts"
          tone="blue"
        />

        <SummaryCard
          icon={UserCheck}
          label="Active Accounts"
          value={activeWorkers}
          description="Currently enabled"
          tone="emerald"
        />

        <SummaryCard
          icon={UserX}
          label="Inactive Accounts"
          value={inactiveWorkers}
          description="Currently disabled"
          tone="slate"
        />

      </div>

      {/* =========================================================
          SECTION HEADER
      ========================================================= */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <div className="h-5 w-1 rounded-full bg-[#0B2A4A]" />

            <h2 className="text-lg font-bold text-[#0B2A4A]">
              Worker Accounts
            </h2>

          </div>

          <p className="mt-1 text-sm text-slate-500">
            Manage worker credentials and account access.
          </p>

        </div>

        <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#0B2A4A]">
          <Users size={14} />
          {workers.length}{" "}
          {workers.length === 1 ? "Worker" : "Workers"}
        </div>

      </div>

      {/* =========================================================
          WORKER CARDS
      ========================================================= */}

      {workers.length > 0 ? (

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">

          {workers.map((worker) => {

            const assignedPlots =
              data.projects.filter((project) =>
                project.workerIds?.includes(worker.id)
              ).length;

            return (

              <div
                key={worker.id}
                className="group relative min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl sm:rounded-3xl"
              >

                {/* TOP ACCENT */}

                <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#071A33] via-[#0B5E9E] to-cyan-400" />

                {/* GLOW */}

                <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-blue-50 blur-3xl transition group-hover:bg-cyan-50" />

                <div className="relative p-4 sm:p-5">

                  {/* =================================================
                      WORKER HEADER
                  ================================================= */}

                  <div className="flex min-w-0 items-start justify-between gap-3">

                    <div className="flex min-w-0 gap-3">

                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50 text-[#0B2A4A] shadow-sm">
                        <UserRound size={21} />
                      </div>

                      <div className="min-w-0">

                        <h3 className="truncate font-bold text-slate-900">
                          {worker.name}
                        </h3>

                        <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">

                          <Phone size={13} />

                          <span className="truncate">
                            {worker.phone}
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* STATUS */}

                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold sm:text-xs ${
                        worker.active
                          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-slate-100 text-slate-500"
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            worker.active
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        />

                        {worker.active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </span>

                  </div>

                  {/* =================================================
                      WORKER INFO
                  ================================================= */}

                  <div className="mt-5 grid grid-cols-2 gap-2">

                    {/* PLOTS */}

                    <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3">

                      <div className="flex items-center gap-2">

                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-white text-[#0B2A4A] shadow-sm">
                          <MapPin size={15} />
                        </div>

                        <div className="min-w-0">

                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Assigned Plots
                          </p>

                          <p className="mt-0.5 text-lg font-extrabold text-[#0B2A4A]">
                            {assignedPlots}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* ACCOUNT */}

                    <div
                      className={`rounded-2xl border p-3 ${
                        worker.active
                          ? "border-emerald-100 bg-emerald-50/70"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >

                      <div className="flex items-center gap-2">

                        <div
                          className={`grid h-8 w-8 place-items-center rounded-lg bg-white shadow-sm ${
                            worker.active
                              ? "text-emerald-700"
                              : "text-slate-500"
                          }`}
                        >
                          {worker.active ? (
                            <UserCheck size={15} />
                          ) : (
                            <UserX size={15} />
                          )}
                        </div>

                        <div className="min-w-0">

                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Account
                          </p>

                          <p
                            className={`mt-0.5 text-sm font-extrabold ${
                              worker.active
                                ? "text-emerald-700"
                                : "text-slate-500"
                            }`}
                          >
                            {worker.active
                              ? "Enabled"
                              : "Disabled"}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      ACTIONS
                  ================================================= */}

                  <div className="mt-4 flex gap-2">

                    <button
                      type="button"
                      onClick={() => edit(worker)}
                      className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-sm font-bold text-[#0B2A4A] transition hover:border-blue-200 hover:bg-blue-100"
                    >
                      <Edit3 size={15} />
                      Edit Account
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        confirm(
                          "Delete this labour account and attendance records?"
                        ) && deleteUser(worker.id)
                      }
                      title="Delete account"
                      className="inline-flex shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={15} />
                    </button>

                  </div>

                </div>

              </div>

            );
          })}

        </div>

      ) : (

        /* =========================================================
           EMPTY STATE
        ========================================================= */

        <div className="rounded-2xl border border-dashed border-blue-200 bg-white p-8 text-center shadow-sm sm:rounded-3xl sm:p-12">

          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-[#0B2A4A]">
            <Users size={27} />
          </div>

          <h3 className="mt-4 font-bold text-slate-900">
            No labour accounts yet
          </h3>

          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            Create a labour account to allow workers to
            access their BuildTrack workspace.
          </p>

          <button
            type="button"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#071A33] to-[#174D78] px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:from-[#0B2A4A] hover:to-[#1E5B88]"
            onClick={newOne}
          >
            <Plus size={16} />
            Create Labour Account
          </button>

        </div>

      )}

      {/* =========================================================
          MODAL
      ========================================================= */}

      {modal && (
        <Modal
          title={
            modal === "new"
              ? "Create Labour Account"
              : "Edit Labour Account"
          }
          onClose={() => setModal(null)}
        >
          <Form
            form={form}
            setForm={setForm}
            submit={submit}
            editing={modal !== "new"}
          />
        </Modal>
      )}

    </div>
  );
}

/* ================================================================
   FORM
================================================================ */

function Form({
  form,
  setForm,
  submit,
  editing,
}) {
  const change = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  return (
    <form
      onSubmit={submit}
      className="space-y-5"
    >

      {/* NAME */}

      <div>

        <label className="label">
          Worker Name
        </label>

        <input
          className="input focus:border-blue-500 focus:ring-blue-500"
          name="name"
          value={form.name}
          onChange={change}
          placeholder="Enter worker name"
          required
        />

      </div>

      {/* PHONE */}

      <div>

        <label className="label">
          Phone Number
        </label>

        <input
          className="input focus:border-blue-500 focus:ring-blue-500"
          name="phone"
          inputMode="numeric"
          value={form.phone}
          onChange={change}
          placeholder="Enter phone number"
          required
        />

      </div>

      {/* PASSWORD */}

      <div>

        <label className="label">

          Password{" "}

          {editing && (
            <span className="text-xs font-normal text-slate-400">
              (leave blank to keep current)
            </span>
          )}

        </label>

        <input
          className="input focus:border-blue-500 focus:ring-blue-500"
          type="password"
          name="password"
          value={form.password}
          onChange={change}
          placeholder={
            editing
              ? "Enter new password"
              : "Create password"
          }
          required={!editing}
        />

      </div>

      {/* ACTIVE */}

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-sm">

        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) =>
            setForm({
              ...form,
              active: e.target.checked,
            })
          }
          className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
        />

        <span>

          <span className="block font-semibold text-slate-900">
            Account active
          </span>

          <span className="block text-xs text-slate-500">
            Allow this worker to access their account.
          </span>

        </span>

      </label>

      {/* SAVE */}

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#071A33] to-[#174D78] px-4 py-3 text-sm font-bold text-white shadow-md transition hover:from-[#0B2A4A] hover:to-[#1E5B88] hover:shadow-lg"
      >
        <ShieldCheck size={16} />
        Save Account
      </button>

    </form>
  );
}

/* ================================================================
   SUMMARY CARD
================================================================ */

function SummaryCard({
  icon: Icon,
  label,
  value,
  description,
  tone = "blue",
}) {
  const tones = {

    blue: {
      icon: "border-blue-100 bg-blue-50 text-[#0B2A4A]",
      value: "text-[#0B2A4A]",
      bar: "from-[#071A33] to-[#1685C7]",
    },

    emerald: {
      icon: "border-emerald-100 bg-emerald-50 text-emerald-700",
      value: "text-emerald-700",
      bar: "from-emerald-600 to-teal-400",
    },

    slate: {
      icon: "border-slate-200 bg-slate-100 text-slate-600",
      value: "text-slate-700",
      bar: "from-slate-500 to-slate-300",
    },

  };

  const current =
    tones[tone] || tones.blue;

  return (

    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">

      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50/70 blur-2xl transition group-hover:bg-sky-50" />

      <div className="relative flex items-center gap-3 sm:gap-4">

        <div
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${current.icon}`}
        >
          <Icon size={19} />
        </div>

        <div className="min-w-0">

          <p className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-[11px]">
            {label}
          </p>

          <p
            className={`mt-1 text-2xl font-bold tracking-tight ${current.value}`}
          >
            {value}
          </p>

          {description && (
            <p className="mt-0.5 text-[10px] text-slate-400">
              {description}
            </p>
          )}

        </div>

      </div>

      <div className="relative mt-4 h-1 overflow-hidden rounded-full bg-slate-100">

        <div
          className={`h-full w-1/3 rounded-full bg-gradient-to-r ${current.bar} transition-all duration-500 group-hover:w-2/3`}
        />

      </div>

    </div>

  );
}
