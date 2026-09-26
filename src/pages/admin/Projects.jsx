import { useState } from "react";
import { Link } from "react-router-dom";
import {
Edit3,
Eye,
Plus,
Trash2,
MapPin,
Users,
CalendarDays,
Layers3,
Building2,
UserRound,
Sparkles,
ChevronLeft,
ChevronRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import Modal from "../../components/Modal";

const blank = {
name: "",
client: "",
location: "",
status: "In Progress",
stage: "Planning",
startDate: "",
endDate: "",
description: "",
targetWorkers: 1,
workerIds: [],
};

export default function Projects() {
const {
data,
addProject,
updateProject,
deleteProject,
} = useApp();

const [modal, setModal] = useState(null);
const [form, setForm] = useState(blank);
const [mobileProject, setMobileProject] = useState(0);

const openNew = () => {
setForm(blank);
setModal("new");
};

const openEdit = (p) => {
setForm(p);
setModal(p);
};

const submit = (e) => {
e.preventDefault();


if (modal === "new") {
  addProject(form);
} else {
  updateProject(modal.id, form);
}

setModal(null);


};

const nextProject = () => {
setMobileProject((current) =>
current < data.projects.length - 1 ? current + 1 : current
);
};

const previousProject = () => {
setMobileProject((current) =>
current > 0 ? current - 1 : current
);
};

const goToProject = (index) => {
setMobileProject(index);
};

return ( <div className="min-h-screen">


  {/* =====================================================
      PAGE HEADER
  ====================================================== */}

  <Header onAdd={openNew} />

  {/* =====================================================
      MOBILE PROJECT SLIDER
  ====================================================== */}

  <div className="mt-6 md:hidden">

    {data.projects.length > 0 ? (
      <>
        {/* Slider Window */}
        <div className="relative overflow-hidden rounded-2xl">

          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${mobileProject * 100}%)`,
            }}
          >
            {data.projects.map((p) => (
              <div
                key={p.id}
                className="w-full shrink-0"
              >
                <ProjectCard
                  project={p}
                  onEdit={openEdit}
                  onDelete={deleteProject}
                />
              </div>
            ))}
          </div>

          {/* Previous Button */}
          {mobileProject > 0 && (
            <button
              type="button"
              onClick={previousProject}
              className="absolute left-2 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#17251B]/90 text-white shadow-lg backdrop-blur-sm transition hover:bg-[#263A28]"
              aria-label="Previous project"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {/* Next Button */}
          {mobileProject < data.projects.length - 1 && (
            <button
              type="button"
              onClick={nextProject}
              className="absolute right-2 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#17251B]/90 text-white shadow-lg backdrop-blur-sm transition hover:bg-[#263A28]"
              aria-label="Next project"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>

        {/* Mobile Project Counter */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {data.projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              onClick={() => goToProject(index)}
              aria-label={`Go to project ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === mobileProject
                  ? "w-7 bg-emerald-600"
                  : "w-2 bg-slate-300"
              }`}
            />
          ))}
        </div>

        {/* Swipe Hint */}
        {data.projects.length > 1 && (
          <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-400">
            <ChevronLeft size={12} />
            Swipe to view projects
            <ChevronRight size={12} />
          </div>
        )}
      </>
    ) : (
      <EmptyProjects />
    )}

  </div>

  {/* =====================================================
      DESKTOP PROJECT GRID
      UNCHANGED
  ====================================================== */}

  <div className="mt-6 hidden gap-5 md:grid md:grid-cols-2 xl:grid-cols-3">

    {data.projects.map((p) => (
      <ProjectCard
        key={p.id}
        project={p}
        onEdit={openEdit}
        onDelete={deleteProject}
      />
    ))}

    {!data.projects.length && <EmptyProjects />}
  </div>

  {/* =====================================================
      PROJECT MODAL
  ====================================================== */}

  {modal && (
    <Modal
      title={
        modal === "new"
          ? "Create Project"
          : "Edit Project"
      }
      onClose={() => setModal(null)}
    >
      <ProjectForm
        form={form}
        setForm={setForm}
        onSubmit={submit}
        workers={data.users.filter(
          (u) => u.role === "labour" && u.active
        )}
      />
    </Modal>
  )}

</div>


);
}

/* =========================================================
PROJECT CARD
========================================================= */

function ProjectCard({
project: p,
onEdit,
onDelete,
}) {
return ( <div
   className="group overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
 >


  {/* =================================================
      PROJECT CARD HEADER
  ================================================== */}

  <div className="relative overflow-hidden bg-gradient-to-br from-[#17251B] via-[#263A28] to-[#3F5130] p-5 text-white">

    {/* Decorative circles */}

    <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-300/10 blur-xl transition duration-500 group-hover:bg-emerald-300/20" />

    <div className="pointer-events-none absolute -bottom-12 left-1/3 h-24 w-24 rounded-full bg-amber-300/10 blur-xl" />

    {/* Top Content */}

    <div className="relative z-10 flex items-start justify-between gap-3">

      <div className="flex min-w-0 items-start gap-3">

        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/10 text-amber-300 backdrop-blur-sm">
          <Building2 size={19} strokeWidth={2.2} />
        </div>

        <div className="min-w-0">

          <h2 className="truncate text-base font-extrabold tracking-tight">
            {p.name}
          </h2>

          <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-100/70">
            <MapPin size={12} />
            {p.location || "Location not added"}
          </p>

        </div>

      </div>

      <StatusBadge status={p.status} />

    </div>

    {/* Client */}

    <div className="relative z-10 mt-4 flex items-center gap-2 border-t border-white/10 pt-3">

      <UserRound
        size={14}
        className="text-amber-300"
      />

      <span className="text-xs text-white/70">
        Client:
      </span>

      <span className="truncate text-xs font-bold text-white">
        {p.client || "Not assigned"}
      </span>

    </div>

  </div>

  {/* =================================================
      PROJECT CARD BODY
  ================================================== */}

  <div className="p-5">

    {/* Information Grid */}

    <div className="grid grid-cols-2 gap-3">

      <Info
        l="Stage"
        v={p.stage}
        icon={Layers3}
      />

      <Info
        l="Workers"
        v={p.workerIds?.length || 0}
        icon={Users}
      />

      <Info
        l="Start"
        v={p.startDate || "-"}
        icon={CalendarDays}
      />

      <Info
        l="End"
        v={p.endDate || "-"}
        icon={CalendarDays}
      />

    </div>

    {/* Description */}

    <div className="mt-4 rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-emerald-50/40 p-3.5">

      <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700/70">
        Description
      </p>

      <p className="line-clamp-3 text-sm leading-6 text-slate-600">
        {p.description ||
          "No description added for this project."}
      </p>

    </div>

    {/* Actions */}

    <div className="mt-5 flex gap-2">

      <Link
        to={`/admin/projects/${p.id}`}
        className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#17251B] via-[#263A28] to-[#3F5130] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-900/10 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-900/20"
      >
        <Eye
          size={15}
          className="transition-transform duration-200 group-hover:scale-110"
        />

        Details
      </Link>

      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-100 hover:shadow-md"
        onClick={() => onEdit(p)}
        title="Edit project"
      >
        <Edit3 size={15} />
      </button>

      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-xl border border-orange-100 bg-orange-50 text-orange-600 transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-100 hover:shadow-md"
        onClick={() =>
          confirm(
            "Delete this project and its attendance/material records?"
          ) && onDelete(p.id)
        }
        title="Delete project"
      >
        <Trash2 size={15} />
      </button>

    </div>

  </div>

</div>


);
}

/* =========================================================
EMPTY PROJECT STATE
========================================================= */

function EmptyProjects() {
return ( <div className="col-span-full rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-10 text-center">


  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
    <Building2 size={25} />
  </div>

  <h3 className="mt-4 text-base font-extrabold text-[#263A28]">
    No Projects Yet
  </h3>

  <p className="mt-1 text-sm text-slate-500">
    Create your first construction project to start tracking it.
  </p>

</div>


);
}

/* =========================================================
PAGE HEADER
========================================================= */

function Header({ onAdd }) {
return ( <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#17251B] via-[#263A28] to-[#3F5130] p-6 text-white shadow-xl sm:p-7">


  {/* Background decorations */}

  <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-300/10 blur-3xl" />

  <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-amber-300/10 blur-3xl" />

  {/* Decorative line */}

  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />

  <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

    <div>

      <div className="mb-2 flex items-center gap-2">

        <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/10 text-amber-300">
          <Building2 size={17} />
        </div>

        <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-200/70">
          Construction Management
        </span>

      </div>

      <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
        Projects / Plots
      </h1>

      <p className="mt-1.5 text-sm text-emerald-100/70">
        Create and monitor every construction site.
      </p>

    </div>

    <button
      type="button"
      onClick={onAdd}
      className="group inline-flex w-fit items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-[#17251B] shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-1 hover:bg-amber-300 hover:shadow-xl"
    >
      <Plus
        size={17}
        className="transition-transform duration-200 group-hover:rotate-90"
      />

      Add Plot
    </button>

  </div>

</div>


);
}

/* =========================================================
STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
const styles = {
Completed:
"bg-emerald-400/20 text-emerald-100 border-emerald-300/20",


"In Progress":
  "bg-amber-400/20 text-amber-100 border-amber-300/20",

Planning:
  "bg-sky-400/20 text-sky-100 border-sky-300/20",

"On Hold":
  "bg-orange-400/20 text-orange-100 border-orange-300/20",


};

return (
<span
className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
        styles[status] ||
        "border-white/10 bg-white/10 text-white"
      }`}
>
{status} </span>
);
}

/* =========================================================
INFORMATION CARD
========================================================= */

function Info({ l, v, icon: Icon }) {
return ( <div className="group rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-emerald-50/40 p-3 transition duration-200 hover:border-emerald-100 hover:shadow-sm">


  <div className="flex items-center gap-1.5">

    {Icon && (
      <Icon
        size={12}
        className="text-emerald-600"
      />
    )}

    <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
      {l}
    </div>

  </div>

  <div className="mt-1.5 truncate text-sm font-extrabold text-[#263A28]">
    {v}
  </div>

</div>


);
}

/* =========================================================
PROJECT FORM
========================================================= */

function ProjectForm({
form,
setForm,
onSubmit,
workers,
}) {
const change = (e) =>
setForm({
...form,
[e.target.name]: e.target.value,
});

return ( <form
   onSubmit={onSubmit}
   className="grid gap-4 sm:grid-cols-2"
 >


  {/* Project Name */}

  <Field
    label="Project / Plot Name"
    name="name"
    value={form.name}
    onChange={change}
    required
  />

  {/* Client */}

  <Field
    label="Client"
    name="client"
    value={form.client}
    onChange={change}
  />

  {/* Location */}

  <Field
    label="Location"
    name="location"
    value={form.location}
    onChange={change}
  />

  {/* Status */}

  <div>
    <label className="label">
      Status
    </label>

    <select
      className="input"
      name="status"
      value={form.status}
      onChange={change}
    >
      <option>Planning</option>
      <option>In Progress</option>
      <option>On Hold</option>
      <option>Completed</option>
    </select>
  </div>

  {/* Stage */}

  <div>
    <label className="label">
      Current Stage
    </label>

    <select
      className="input"
      name="stage"
      value={form.stage}
      onChange={change}
    >
      {[
        "Planning",
        "Foundation",
        "Structure",
        "Brick Work",
        "Plastering",
        "Electrical",
        "Plumbing",
        "Finishing",
        "Handover",
      ].map((x) => (
        <option key={x}>
          {x}
        </option>
      ))}
    </select>
  </div>

  {/* Target Workers */}

  <Field
    label="Target Workers"
    name="targetWorkers"
    type="number"
    min="1"
    value={form.targetWorkers}
    onChange={change}
  />

  {/* Start Date */}

  <Field
    label="Start Date"
    name="startDate"
    type="date"
    value={form.startDate}
    onChange={change}
  />

  {/* End Date */}

  <Field
    label="Expected End Date"
    name="endDate"
    type="date"
    value={form.endDate}
    onChange={change}
  />

  {/* Labour Assignment */}

  <div className="sm:col-span-2">

    <div className="mb-2 flex items-center gap-2">

      <Users
        size={15}
        className="text-emerald-700"
      />

      <label className="label mb-0">
        Assign Labourers
      </label>

    </div>

    <div className="grid gap-2 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 to-white p-3 sm:grid-cols-2">

      {workers.length > 0 ? (
        workers.map((w) => (
          <label
            key={w.id}
            className="group flex cursor-pointer items-center gap-3 rounded-xl border border-transparent bg-white p-3 text-sm shadow-sm transition duration-200 hover:border-emerald-200 hover:bg-emerald-50/50"
          >

            <input
              type="checkbox"
              checked={form.workerIds?.includes(w.id)}
              onChange={(e) =>
                setForm({
                  ...form,
                  workerIds: e.target.checked
                    ? [
                        ...(form.workerIds || []),
                        w.id,
                      ]
                    : (form.workerIds || []).filter(
                        (id) => id !== w.id
                      ),
                })
              }
              className="h-4 w-4 rounded border-emerald-300 text-emerald-700 focus:ring-emerald-500"
            />

            <div className="min-w-0">

              <p className="truncate font-bold text-[#263A28]">
                {w.name}
              </p>

              <p className="mt-0.5 text-[11px] text-slate-500">
                {w.phone}
              </p>

            </div>

          </label>
        ))
      ) : (
        <div className="sm:col-span-2 rounded-xl border border-dashed border-emerald-200 bg-white p-5 text-center">

          <Users
            size={22}
            className="mx-auto text-emerald-400"
          />

          <p className="mt-2 text-sm font-bold text-slate-600">
            No active labourers available
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Add an active labour account to assign workers.
          </p>

        </div>
      )}

    </div>

  </div>

  {/* Description */}

  <div className="sm:col-span-2">

    <label className="label">
      Description
    </label>

    <textarea
      className="input min-h-24 resize-y"
      name="description"
      value={form.description}
      onChange={change}
      placeholder="Add project details, requirements or notes..."
    />

  </div>

  {/* Submit */}

  <div className="flex justify-end gap-2 sm:col-span-2">

    <button
      type="submit"
      className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#17251B] via-[#263A28] to-[#3F5130] px-5 py-2.5 text-sm font-extrabold text-white shadow-md shadow-emerald-900/15 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >

      <Sparkles
        size={15}
        className="text-amber-300 transition-transform duration-200 group-hover:rotate-12"
      />

      Save Project

    </button>

  </div>

</form>


);
}

/* =========================================================
FORM FIELD
========================================================= */

function Field({
label,
...props
}) {
return ( <div>


  <label className="label">
    {label}
  </label>

  <input
    className="input transition duration-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
    {...props}
  />

</div>


);
}
