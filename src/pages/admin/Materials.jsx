import { useMemo, useState } from "react";
import {
Edit3,
Plus,
Trash2,
Package,
UserRound,
Clock3,
MapPin,
ClipboardList,
History,
Layers3,
CalendarDays,
Sparkles,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import Modal from "../../components/Modal";

const blank = {
projectId: "",
name: "",
category: "",
unit: "",
quantity: 0,
used: 0,
date: new Date().toISOString().slice(0, 10),
notes: "",
};

export default function Materials() {
const {
data,
addMaterial,
updateMaterial,
deleteMaterial,
} = useApp();

const [modal, setModal] = useState(null);
const [form, setForm] = useState(blank);

/* =====================================================
OPEN NEW MATERIAL
===================================================== */

const openNew = () => {
setForm({
...blank,
projectId: data.projects[0]?.id || "",
});


setModal("new");


};

/* =====================================================
EDIT MATERIAL
===================================================== */

const edit = (material) => {
setForm({
...material,
});


setModal(material);


};

/* =====================================================
SAVE MATERIAL
===================================================== */

const submit = (e) => {
e.preventDefault();


const quantity = Number(form.quantity || 0);
const used = Number(form.used || 0);

const materialData = {
  ...form,
  quantity,
  used,
  remaining: Math.max(0, quantity - used),
};

if (modal === "new") {
  addMaterial(materialData);
} else {
  updateMaterial(modal.id, materialData);
}

setModal(null);


};

/* =====================================================
MATERIAL USAGE HISTORY
===================================================== */

const materialUsage = data.materialUsage || [];

/* =====================================================
PROJECT LOOKUP
===================================================== */

const getProjectName = (projectId) => {
return (
data.projects.find(
(project) => project.id === projectId
)?.name || "-"
);
};

/* =====================================================
WORKER LOOKUP
===================================================== */

const getWorkerName = (usage) => {
if (usage.workerName) {
return usage.workerName;
}


return (
  data.users?.find(
    (user) => user.id === usage.workerId
  )?.name || "Unknown Worker"
);


};

/* =====================================================
MATERIAL USAGE SUMMARY
===================================================== */

const usageSummary = useMemo(() => {
const summary = {};


materialUsage.forEach((usage) => {
  if (!summary[usage.materialId]) {
    summary[usage.materialId] = {
      quantity: 0,
      transactions: 0,
      workers: new Set(),
    };
  }

  summary[usage.materialId].quantity += Number(
    usage.quantity || 0
  );

  summary[usage.materialId].transactions += 1;

  if (usage.workerId) {
    summary[usage.materialId].workers.add(
      usage.workerId
    );
  }
});

return summary;


}, [materialUsage]);

return ( <div className="min-h-screen space-y-6">


  {/* =================================================
      PAGE HEADER
  ================================================= */}

  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#17251B] via-[#263A28] to-[#3F5130] p-6 text-white shadow-xl sm:p-7">

    {/* Background Decorations */}

    <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl" />

    <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-amber-300/10 blur-3xl" />

    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />

    <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

      <div>

        <div className="mb-2 flex items-center gap-2">

          <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/10 text-amber-300">
            <Package size={18} />
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-200/70">
            Inventory Management
          </span>

        </div>

        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
          Material Details
        </h1>

        <p className="mt-1.5 text-sm text-emerald-100/70">
          Track material received, used, remaining and
          worker usage.
        </p>

      </div>

      <button
        type="button"
        className="group inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-[#17251B] shadow-lg transition duration-200 hover:-translate-y-1 hover:bg-amber-300 hover:shadow-xl"
        onClick={openNew}
      >
        <Plus
          size={17}
          className="transition-transform duration-200 group-hover:rotate-90"
        />

        Add Material
      </button>

    </div>

  </div>

  {/* =================================================
      SUMMARY
  ================================================= */}

  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

    <SummaryCard
      icon={Package}
      label="Material Items"
      value={data.materials.length}
      variant="emerald"
    />

    <SummaryCard
      icon={ClipboardList}
      label="Usage Transactions"
      value={materialUsage.length}
      variant="amber"
    />

    <SummaryCard
      icon={UserRound}
      label="Workers Using Materials"
      value={
        new Set(
          materialUsage.map(
            (item) => item.workerId
          )
        ).size
      }
      variant="teal"
    />

    <SummaryCard
      icon={History}
      label="Total Quantity Used"
      value={materialUsage.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      )}
      variant="orange"
    />

  </div>

  {/* =================================================
      MATERIAL INVENTORY
  ================================================= */}

  <div className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-sm">

    {/* Section Header */}

    <div className="relative overflow-hidden border-b border-emerald-900/10 bg-gradient-to-r from-[#17251B] via-[#263A28] to-[#3F5130] px-5 py-5 text-white">

      <div className="pointer-events-none absolute -right-10 -top-16 h-32 w-32 rounded-full bg-emerald-300/10 blur-2xl" />

      <div className="relative z-10 flex items-center gap-3">

        <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/10 text-amber-300">
          <Package size={19} />
        </div>

        <div>

          <h2 className="font-extrabold">
            Material Inventory
          </h2>

          <p className="mt-0.5 text-xs text-emerald-100/65">
            Current stock for every construction plot
          </p>

        </div>

      </div>

    </div>

    <div className="overflow-x-auto">

      <table className="w-full min-w-[1050px] text-left text-sm">

        <thead className="bg-gradient-to-r from-emerald-50/70 to-amber-50/40 text-[10px] uppercase tracking-wider text-emerald-800/70">

          <tr>

            <th className="px-4 py-3.5 font-extrabold">
              Material
            </th>

            <th className="font-extrabold">
              Plot
            </th>

            <th className="font-extrabold">
              Category
            </th>

            <th className="font-extrabold">
              Received
            </th>

            <th className="font-extrabold">
              Used
            </th>

            <th className="font-extrabold">
              Remaining
            </th>

            <th className="font-extrabold">
              Worker Usage
            </th>

            <th className="font-extrabold">
              Date
            </th>

            <th className="px-4 py-3.5 font-extrabold">
              Actions
            </th>

          </tr>

        </thead>

        <tbody className="divide-y divide-slate-100">

          {data.materials.map((material) => {

            const usage =
              usageSummary[material.id];

            const isLowStock =
              Number(material.remaining) <=
              Number(material.quantity) * 0.2;

            return (
              <tr
                key={material.id}
                className="group transition duration-200 hover:bg-emerald-50/30"
              >

                {/* MATERIAL */}

                <td className="px-4 py-4">

                  <div className="flex items-center gap-3">

                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-100 to-lime-50 text-emerald-800 transition duration-200 group-hover:scale-105">

                      <Package size={17} />

                    </div>

                    <div>

                      <div className="font-extrabold text-[#263A28]">
                        {material.name}
                      </div>

                      <div className="mt-0.5 text-xs font-medium text-slate-500">
                        {material.unit}
                      </div>

                    </div>

                  </div>

                </td>

                {/* PLOT */}

                <td>

                  <div className="flex items-center gap-1.5 font-medium text-slate-700">

                    <MapPin
                      size={14}
                      className="text-emerald-600"
                    />

                    {getProjectName(
                      material.projectId
                    )}

                  </div>

                </td>

                {/* CATEGORY */}

                <td>

                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600">

                    <Layers3 size={12} />

                    {material.category || "-"}

                  </span>

                </td>

                {/* RECEIVED */}

                <td>

                  <span className="font-bold text-slate-700">
                    {material.quantity}{" "}
                    {material.unit}
                  </span>

                </td>

                {/* USED */}

                <td>

                  <span className="rounded-lg bg-orange-50 px-2.5 py-1.5 text-xs font-bold text-orange-700">
                    {material.used || 0}{" "}
                    {material.unit}
                  </span>

                </td>

                {/* REMAINING */}

                <td>

                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1.5 text-xs font-bold ${
                      isLowStock
                        ? "bg-orange-50 text-orange-700 ring-1 ring-orange-100"
                        : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                    }`}
                  >
                    {material.remaining}{" "}
                    {material.unit}
                  </span>

                </td>

                {/* WORKER USAGE */}

                <td>

                  {usage ? (

                    <div className="text-xs">

                      <div className="font-extrabold text-[#263A28]">
                        {usage.transactions}{" "}
                        transaction
                        {usage.transactions !== 1
                          ? "s"
                          : ""}
                      </div>

                      <div className="mt-0.5 text-slate-500">
                        {usage.quantity}{" "}
                        {material.unit} used
                      </div>

                    </div>

                  ) : (

                    <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-400">
                      No worker usage
                    </span>

                  )}

                </td>

                {/* DATE */}

                <td>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">

                    <CalendarDays
                      size={13}
                      className="text-emerald-600"
                    />

                    {material.date}

                  </div>

                </td>

                {/* ACTIONS */}

                <td className="px-4 py-4">

                  <div className="flex gap-2">

                    <button
                      type="button"
                      className="grid h-9 w-9 place-items-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-100 hover:shadow-sm"
                      onClick={() =>
                        edit(material)
                      }
                      title="Edit material"
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      type="button"
                      className="grid h-9 w-9 place-items-center rounded-lg border border-orange-100 bg-orange-50 text-orange-600 transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-100 hover:shadow-sm"
                      onClick={() =>
                        confirm(
                          "Delete material record?"
                        ) &&
                        deleteMaterial(
                          material.id
                        )
                      }
                      title="Delete material"
                    >
                      <Trash2 size={15} />
                    </button>

                  </div>

                </td>

              </tr>
            );
          })}

        </tbody>

      </table>

    </div>

    {/* Empty State */}

    {!data.materials.length && (
      <div className="p-12 text-center">

        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-300">
          <Package size={32} />
        </div>

        <p className="mt-4 font-extrabold text-[#263A28]">
          No materials added
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Add materials to start tracking construction
          inventory.
        </p>

      </div>
    )}

  </div>

  {/* =================================================
      WORKER MATERIAL USAGE
  ================================================= */}

  <div className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-sm">

    {/* Section Header */}

    <div className="relative overflow-hidden border-b border-emerald-900/10 bg-gradient-to-r from-[#17251B] via-[#263A28] to-[#3F5130] px-5 py-5 text-white">

      <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-amber-300/10 blur-2xl" />

      <div className="relative z-10 flex items-center gap-3">

        <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/10 text-amber-300">
          <History size={20} />
        </div>

        <div>

          <h2 className="font-extrabold">
            Worker Material Usage
          </h2>

          <p className="mt-0.5 text-xs text-emerald-100/65">
            See which worker took which material,
            quantity, plot and time.
          </p>

        </div>

      </div>

    </div>

    {materialUsage.length > 0 ? (

      <div className="overflow-x-auto">

        <table className="w-full min-w-[1000px] text-left text-sm">

          <thead className="bg-gradient-to-r from-emerald-50/70 to-amber-50/40 text-[10px] uppercase tracking-wider text-emerald-800/70">

            <tr>

              <th className="px-4 py-3.5 font-extrabold">
                Worker
              </th>

              <th className="font-extrabold">
                Material
              </th>

              <th className="font-extrabold">
                Plot
              </th>

              <th className="font-extrabold">
                Quantity Taken
              </th>

              <th className="font-extrabold">
                Date
              </th>

              <th className="font-extrabold">
                Time
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-slate-100">

            {[...materialUsage]
              .reverse()
              .map((usage) => (

                <tr
                  key={usage.id}
                  className="transition duration-200 hover:bg-emerald-50/30"
                >

                  {/* WORKER */}

                  <td className="px-4 py-4">

                    <div className="flex items-center gap-3">

                      <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-emerald-100 to-lime-50 text-emerald-800">
                        <UserRound size={17} />
                      </div>

                      <div>

                        <div className="font-extrabold text-[#263A28]">
                          {getWorkerName(
                            usage
                          )}
                        </div>

                        <div className="mt-0.5 text-xs text-slate-500">
                          ID:{" "}
                          {usage.workerId ||
                            "-"}
                        </div>

                      </div>

                    </div>

                  </td>

                  {/* MATERIAL */}

                  <td>

                    <div className="flex items-center gap-2">

                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                        <Package size={14} />
                      </div>

                      <span className="font-bold text-slate-700">
                        {usage.materialName ||
                          getMaterialName(
                            data.materials,
                            usage.materialId
                          )}
                      </span>

                    </div>

                  </td>

                  {/* PLOT */}

                  <td>

                    <div className="flex items-center gap-1.5 font-medium text-slate-600">

                      <MapPin
                        size={14}
                        className="text-emerald-600"
                      />

                      {getProjectName(
                        usage.projectId
                      )}

                    </div>

                  </td>

                  {/* QUANTITY */}

                  <td>

                    <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-xs font-extrabold text-amber-700 ring-1 ring-amber-100">

                      {usage.quantity}{" "}
                      {usage.unit}

                    </span>

                  </td>

                  {/* DATE */}

                  <td>

                    <div className="flex items-center gap-1.5 text-slate-600">

                      <CalendarDays
                        size={13}
                        className="text-emerald-600"
                      />

                      {usage.date || "-"}

                    </div>

                  </td>

                  {/* TIME */}

                  <td>

                    <div className="flex items-center gap-1.5 text-slate-600">

                      <Clock3
                        size={14}
                        className="text-emerald-600"
                      />

                      {usage.time || "-"}

                    </div>

                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>

    ) : (

      <div className="p-12 text-center">

        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-50 text-amber-300">
          <ClipboardList size={32} />
        </div>

        <p className="mt-4 font-extrabold text-[#263A28]">
          No material usage recorded
        </p>

        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
          When a worker takes material from the
          Worker page, the transaction will appear
          here automatically.
        </p>

      </div>

    )}

  </div>

  {/* =================================================
      MODAL
  ================================================= */}

  {modal && (
    <Modal
      title={
        modal === "new"
          ? "Add Material"
          : "Edit Material"
      }
      onClose={() => setModal(null)}
    >

      <Form
        form={form}
        setForm={setForm}
        submit={submit}
        projects={data.projects}
      />

    </Modal>
  )}

</div>


);
}

/* =========================================================
FORM
========================================================= */

function Form({
form,
setForm,
submit,
projects,
}) {
const change = (e) => {
setForm({
...form,
[e.target.name]: e.target.value,
});
};

return ( <form
   onSubmit={submit}
   className="grid gap-4 sm:grid-cols-2"
 >


  {/* Plot */}

  <div>

    <label className="label">
      Plot
    </label>

    <select
      className="input transition duration-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
      name="projectId"
      value={form.projectId}
      onChange={change}
      required
    >

      <option value="">
        Select plot
      </option>

      {projects.map((project) => (
        <option
          key={project.id}
          value={project.id}
        >
          {project.name}
        </option>
      ))}

    </select>

  </div>

  <Field
    label="Material Name"
    name="name"
    value={form.name}
    onChange={change}
    required
  />

  <Field
    label="Category"
    name="category"
    value={form.category}
    onChange={change}
  />

  <Field
    label="Unit"
    name="unit"
    value={form.unit}
    onChange={change}
    placeholder="Bags / Kg / Nos"
  />

  <Field
    label="Quantity Received"
    name="quantity"
    type="number"
    min="0"
    step="any"
    value={form.quantity}
    onChange={change}
  />

  <Field
    label="Quantity Used"
    name="used"
    type="number"
    min="0"
    step="any"
    value={form.used}
    onChange={change}
  />

  <Field
    label="Date"
    name="date"
    type="date"
    value={form.date}
    onChange={change}
  />

  {/* Notes */}

  <div className="sm:col-span-2">

    <label className="label">
      Notes
    </label>

    <textarea
      className="input resize-y transition duration-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
      name="notes"
      value={form.notes}
      onChange={change}
      rows={3}
      placeholder="Add material notes..."
    />

  </div>

  {/* Submit */}

  <div className="flex justify-end sm:col-span-2">

    <button
      type="submit"
      className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#17251B] via-[#263A28] to-[#3F5130] px-5 py-2.5 text-sm font-extrabold text-white shadow-md shadow-emerald-900/15 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >

      <Sparkles
        size={15}
        className="text-amber-300 transition-transform duration-200 group-hover:rotate-12"
      />

      Save Material

    </button>

  </div>

</form>


);
}

/* =========================================================
FIELD
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

/* =========================================================
SUMMARY CARD
========================================================= */

function SummaryCard({
icon: Icon,
label,
value,
variant = "emerald",
}) {
const variants = {
emerald:
"from-emerald-700 to-green-500",
amber:
"from-amber-600 to-yellow-400",
teal:
"from-teal-700 to-emerald-400",
orange:
"from-orange-700 to-amber-400",
};

return ( <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-lg">


  <div className="flex items-center gap-3">

    <div
      className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${
        variants[variant]
      } text-white shadow-md transition duration-300 group-hover:scale-105`}
    >
      <Icon size={18} />
    </div>

    <div className="min-w-0">

      <p className="truncate text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-black text-[#263A28]">
        {value}
      </p>

    </div>

  </div>

</div>


);
}

/* =========================================================
GET MATERIAL NAME
========================================================= */

function getMaterialName(
materials,
materialId
) {
return (
materials.find(
(material) =>
material.id === materialId
)?.name || "-"
);
}
