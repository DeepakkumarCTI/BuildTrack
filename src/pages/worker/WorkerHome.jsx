import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  LogIn,
  LogOut,
  UserRound,
  CheckCircle2,
  Send,
  Package,
  Plus,
  Minus,
  BriefcaseBusiness,
  CalendarDays,
  Boxes,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const nowDate = () =>
  new Date().toISOString().slice(0, 10);

const nowTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

export default function WorkerHome() {
  const {
    data,
    currentUser,
    addAttendance,
    updateAttendance,
    updateMaterial,
    addMaterialUsage,
    logout,
  } = useApp();

  const navigate = useNavigate();

  const today = nowDate();

  /* =====================================================
     ASSIGNED PROJECTS
  ===================================================== */

  const myProjects = (data.projects || []).filter((project) =>
    project.workerIds?.includes(currentUser.id)
  );

  /* =====================================================
     TODAY ATTENDANCE
  ===================================================== */

  const todayRecord = (data.attendance || []).find(
    (attendance) =>
      attendance.workerId === currentUser.id &&
      attendance.date === today
  );

  /* =====================================================
     ATTENDANCE FORM
  ===================================================== */

  const [form, setForm] = useState({
    projectId:
      todayRecord?.projectId ||
      myProjects[0]?.id ||
      "",
    work: todayRecord?.work || "",
    notes: todayRecord?.notes || "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* =====================================================
     MATERIAL FORM
  ===================================================== */

  const [materialForm, setMaterialForm] = useState({
    materialId: "",
    quantity: "",
  });

  const [materialMessage, setMaterialMessage] = useState("");
  const [materialLoading, setMaterialLoading] = useState(false);

  /* =====================================================
     ALL MATERIALS FOR SELECTED PLOT
  ===================================================== */

  const projectMaterials = useMemo(() => {
    if (!form.projectId) {
      return [];
    }

    return (data.materials || []).filter(
      (material) =>
        material.projectId === form.projectId
    );
  }, [
    data.materials,
    form.projectId,
  ]);

  /* =====================================================
     MATERIALS WITH STOCK AVAILABLE
  ===================================================== */

  const availableMaterials = useMemo(() => {
    return projectMaterials.filter(
      (material) =>
        Number(material.remaining || 0) > 0
    );
  }, [projectMaterials]);

  /* =====================================================
     MATERIALS TAKEN TODAY
  ===================================================== */

  const materialsTakenToday = useMemo(() => {
    return (
      data.materialUsage?.filter(
        (item) =>
          item.workerId === currentUser.id &&
          item.date === today
      ) || []
    );
  }, [
    data.materialUsage,
    currentUser.id,
    today,
  ]);

  /* =====================================================
     TOTAL MATERIAL COUNTS
  ===================================================== */

  const materialSummary = useMemo(() => {
    return projectMaterials.reduce(
      (summary, material) => {
        summary.totalMaterials += 1;

        summary.totalQuantity += Number(
          material.quantity || 0
        );

        summary.totalUsed += Number(
          material.used || 0
        );

        summary.totalRemaining += Number(
          material.remaining || 0
        );

        return summary;
      },
      {
        totalMaterials: 0,
        totalQuantity: 0,
        totalUsed: 0,
        totalRemaining: 0,
      }
    );
  }, [projectMaterials]);

  /* =====================================================
     SYNC ATTENDANCE FORM
  ===================================================== */

  useEffect(() => {
    if (todayRecord) {
      setForm({
        projectId:
          todayRecord.projectId ||
          myProjects[0]?.id ||
          "",
        work: todayRecord.work || "",
        notes: todayRecord.notes || "",
      });
    }
  }, [
    todayRecord?.id,
    todayRecord?.checkIn,
    todayRecord?.checkOut,
    todayRecord?.projectId,
    todayRecord?.work,
    todayRecord?.notes,
  ]);

  /* =====================================================
     WHEN PROJECT CHANGES
     RESET MATERIAL SELECTION
  ===================================================== */

  useEffect(() => {
    setMaterialForm({
      materialId: "",
      quantity: "",
    });

    setMaterialMessage("");
  }, [form.projectId]);

  /* =====================================================
     START WORK
  ===================================================== */

  const handleLogin = () => {
    setMessage("");

    if (!form.projectId) {
      setMessage(
        "Please select the plot/site before starting work."
      );
      return;
    }

    if (!form.work.trim()) {
      setMessage(
        "Please enter the work you are doing."
      );
      return;
    }

    if (
      todayRecord?.checkIn &&
      !todayRecord?.checkOut
    ) {
      setMessage(
        "You have already started work today."
      );
      return;
    }

    if (todayRecord?.checkOut) {
      setMessage(
        "Today's attendance has already been completed."
      );
      return;
    }

    setLoading(true);

    const currentTime = nowTime();

    addAttendance({
      workerId: currentUser.id,
      projectId: form.projectId,
      date: today,
      checkIn: currentTime,
      checkOut: "",
      work: form.work,
      notes: form.notes,
    });

    setMessage(
      `Work started successfully at ${currentTime}.`
    );

    setLoading(false);
  };

  /* =====================================================
     END WORK / LOGOUT
  ===================================================== */

  const handleLogout = () => {
    setMessage("");

    if (!todayRecord) {
      setMessage(
        "Please login/start work first."
      );
      return;
    }

    if (!todayRecord.checkIn) {
      setMessage(
        "Please login/start work first."
      );
      return;
    }

    if (todayRecord.checkOut) {
      setMessage(
        "Today's work has already been completed."
      );
      return;
    }

    setLoading(true);

    const currentTime = nowTime();

    updateAttendance(todayRecord.id, {
      checkOut: currentTime,
      work: form.work,
      notes: form.notes,
      projectId: form.projectId,
    });

    setMessage(
      `Work ended successfully at ${currentTime}.`
    );

    setTimeout(() => {
      logout();

      navigate("/login", {
        replace: true,
      });
    }, 500);
  };

  /* =====================================================
     UPDATE WORK DETAILS
  ===================================================== */

  const handleUpdateDetails = () => {
    setMessage("");

    if (!todayRecord) {
      setMessage(
        "Please login/start work first."
      );
      return;
    }

    if (todayRecord.checkOut) {
      setMessage(
        "Today's work is already completed."
      );
      return;
    }

    if (!form.projectId) {
      setMessage(
        "Please select a plot/site."
      );
      return;
    }

    if (!form.work.trim()) {
      setMessage(
        "Please enter your work details."
      );
      return;
    }

    updateAttendance(todayRecord.id, {
      projectId: form.projectId,
      work: form.work,
      notes: form.notes,
    });

    setMessage(
      "Work details updated successfully."
    );
  };

  /* =====================================================
     TAKE MATERIAL
  ===================================================== */

  const handleTakeMaterial = () => {
    setMaterialMessage("");

    if (!todayRecord?.checkIn) {
      setMaterialMessage(
        "Please login/start work before taking materials."
      );
      return;
    }

    if (todayRecord?.checkOut) {
      setMaterialMessage(
        "Your work is already completed."
      );
      return;
    }

    if (!materialForm.materialId) {
      setMaterialMessage(
        "Please select a material."
      );
      return;
    }

    const requestedQuantity = Number(
      materialForm.quantity
    );

    if (
      !requestedQuantity ||
      requestedQuantity <= 0
    ) {
      setMaterialMessage(
        "Please enter a valid quantity."
      );
      return;
    }

    const material = (data.materials || []).find(
      (item) =>
        item.id === materialForm.materialId
    );

    if (!material) {
      setMaterialMessage(
        "Material not found."
      );
      return;
    }

    /* Make sure material belongs to selected plot */
    if (material.projectId !== form.projectId) {
      setMaterialMessage(
        "This material does not belong to the selected plot."
      );
      return;
    }

    const totalQuantity = Number(
      material.quantity || 0
    );

    const usedQuantity = Number(
      material.used || 0
    );

    const remainingQuantity = Number(
      material.remaining ??
        totalQuantity - usedQuantity
    );

    if (remainingQuantity <= 0) {
      setMaterialMessage(
        "This material is currently out of stock."
      );
      return;
    }

    if (
      requestedQuantity >
      remainingQuantity
    ) {
      setMaterialMessage(
        `Only ${remainingQuantity} ${material.unit} is available.`
      );
      return;
    }

    setMaterialLoading(true);

    const newUsed =
      usedQuantity +
      requestedQuantity;

    const newRemaining =
      remainingQuantity -
      requestedQuantity;

    /* =================================================
       UPDATE SHARED MATERIAL INVENTORY

       Admin will automatically see these values
       because both pages use the same AppContext.
    ================================================= */

    updateMaterial(material.id, {
      used: newUsed,
      remaining: newRemaining,
    });

    /* =================================================
       CREATE MATERIAL USAGE TRANSACTION
    ================================================= */

    const usageRecord = {
      id: `usage-${Date.now()}`,

      workerId: currentUser.id,

      workerName:
        currentUser.name,

      projectId:
        form.projectId,

      materialId:
        material.id,

      materialName:
        material.name,

      quantity:
        requestedQuantity,

      unit:
        material.unit,

      date:
        today,

      time:
        nowTime(),
    };

    if (
      typeof addMaterialUsage ===
      "function"
    ) {
      addMaterialUsage(
        usageRecord
      );
    }

    /* RESET FORM */

    setMaterialForm({
      materialId: "",
      quantity: "",
    });

    setMaterialMessage(
      `${requestedQuantity} ${material.unit} of ${material.name} taken successfully.`
    );

    setMaterialLoading(false);
  };

  /* =====================================================
     STATUS
  ===================================================== */

  const isLoggedIn = Boolean(
    todayRecord?.checkIn &&
    !todayRecord?.checkOut
  );

  const isCompleted = Boolean(
    todayRecord?.checkOut
  );

  /* =====================================================
     SELECTED PROJECT
  ===================================================== */

  const selectedProject = myProjects.find(
    (project) =>
      project.id === form.projectId
  );

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="w-full max-w-none space-y-5">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#071A33] via-[#0B2A4A] to-[#174D78] p-5 text-white shadow-xl sm:p-7">

        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative">

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

            {/* USER */}

            <div className="flex items-center gap-3">

              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/10">
                <UserRound size={23} />
              </div>

              <div>

                <p className="text-sm text-blue-200">
                  Welcome
                </p>

                <h1 className="text-2xl font-bold">
                  {currentUser.name}
                </h1>

                <p className="mt-1 text-xs text-blue-200">
                  {currentUser.phone}
                </p>

              </div>

            </div>

            {/* STATUS */}

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">

              <Info
                icon={CalendarDays}
                label="Today"
                value={today}
              />

              <Info
                icon={MapPin}
                label="Plots"
                value={myProjects.length}
              />

              <div className="col-span-2 sm:col-span-1">

                <Info
                  icon={CheckCircle2}
                  label="Status"
                  value={
                    isCompleted
                      ? "Completed"
                      : isLoggedIn
                      ? "Working"
                      : "Not Started"
                  }
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="grid gap-5 xl:grid-cols-12">

        {/* =================================================
            ATTENDANCE
        ================================================= */}

        <section className="rounded-3xl bg-white p-5 shadow-lg ring-1 ring-slate-200 xl:col-span-8 sm:p-6">

          <div className="flex items-start gap-3">

            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0B2A4A]">
              <BriefcaseBusiness size={21} />
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Daily Attendance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Record your daily work and attendance.
              </p>

            </div>

          </div>

          {/* CHECK IN / CHECK OUT */}

          {(isLoggedIn || isCompleted) && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">

                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                  <LogIn size={15} />
                  Check-In
                </div>

                <div className="mt-1 text-xl font-bold text-emerald-800">
                  {todayRecord?.checkIn || "--:--"}
                </div>

              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <LogOut size={15} />
                  Check-Out
                </div>

                <div className="mt-1 text-xl font-bold text-slate-800">
                  {todayRecord?.checkOut ||
                    "Not completed"}
                </div>

              </div>

            </div>
          )}

          {/* FORM */}

          <div className="mt-5 grid gap-4 sm:grid-cols-2">

            {/* PLOT */}

            <div>

              <label className="label">
                Plot / Site
              </label>

              <select
                className="input"
                value={form.projectId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    projectId:
                      e.target.value,
                  })
                }
                disabled={
                  isLoggedIn ||
                  isCompleted
                }
              >

                <option value="">
                  Select plot
                </option>

                {myProjects.map(
                  (project) => (
                    <option
                      key={project.id}
                      value={project.id}
                    >
                      {project.name} —{" "}
                      {project.location}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* DATE */}

            <div>

              <label className="label">
                Attendance Date
              </label>

              <input
                className="input"
                value={today}
                readOnly
              />

            </div>

            {/* WORK */}

            <div className="sm:col-span-2">

              <label className="label">
                What work are you doing?
              </label>

              <textarea
                className="input min-h-24 resize-none"
                value={form.work}
                onChange={(e) =>
                  setForm({
                    ...form,
                    work: e.target.value,
                  })
                }
                disabled={isCompleted}
                placeholder="Example: Foundation work, brick work, electrical..."
              />

            </div>

            {/* NOTES */}

            <div className="sm:col-span-2">

              <label className="label">
                Additional Details
              </label>

              <textarea
                className="input min-h-20 resize-none"
                value={form.notes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    notes: e.target.value,
                  })
                }
                disabled={isCompleted}
                placeholder="Optional notes, issues, material requirement..."
              />

            </div>

            {/* MESSAGE */}

            {message && (
              <div className="rounded-xl bg-blue-50 p-3 text-sm font-semibold text-[#0B2A4A] sm:col-span-2">
                {message}
              </div>
            )}

            {/* BUTTONS */}

            <div className="sm:col-span-2">

              {!isLoggedIn &&
                !isCompleted && (
                  <button
                    type="button"
                    onClick={handleLogin}
                    disabled={loading}
                    className="btn-primary flex w-full items-center justify-center gap-2 py-3"
                  >
                    <LogIn size={18} />

                    {loading
                      ? "Starting Work..."
                      : "Login / Start Work"}
                  </button>
                )}

              {isLoggedIn && (
                <div className="grid gap-3 sm:grid-cols-2">

                  <button
                    type="button"
                    onClick={
                      handleUpdateDetails
                    }
                    className="btn-secondary flex w-full items-center justify-center gap-2 py-3"
                  >
                    <Send size={17} />
                    Update Details
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <LogOut size={18} />

                    {loading
                      ? "Ending Work..."
                      : "Logout / End Work"}
                  </button>

                </div>
              )}

              {isCompleted && (
                <div className="rounded-xl bg-emerald-50 p-4 text-center">

                  <div className="flex items-center justify-center gap-2 font-semibold text-emerald-700">
                    <CheckCircle2 size={20} />
                    Today's attendance is completed
                  </div>

                  <p className="mt-1 text-sm text-emerald-600">
                    Check-in:{" "}
                    {todayRecord?.checkIn}
                    {" • "}
                    Check-out:{" "}
                    {todayRecord?.checkOut}
                  </p>

                </div>
              )}

            </div>

          </div>

        </section>

        {/* =================================================
            ASSIGNED PLOTS
        ================================================= */}

        <section className="rounded-3xl bg-white p-5 shadow-lg ring-1 ring-slate-200 xl:col-span-4 sm:p-6">

          <div className="flex items-center gap-3">

            <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-[#0B2A4A]">
              <MapPin size={21} />
            </div>

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                My Assigned Plots
              </h2>

              <p className="text-xs text-slate-500">
                Your assigned construction sites
              </p>

            </div>

          </div>

          <div className="mt-5 grid gap-3">

            {myProjects.map(
              (project) => (
                <div
                  key={project.id}
                  className={`rounded-2xl border p-4 transition ${
                    form.projectId === project.id
                      ? "border-blue-300 bg-blue-50 shadow-sm"
                      : "border-slate-100 bg-gradient-to-br from-slate-50 to-blue-50"
                  }`}
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <h3 className="font-bold text-slate-900">
                        {project.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {project.location}
                      </p>

                    </div>

                    <div className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-[#0B2A4A] shadow-sm">
                      {project.stage}
                    </div>

                  </div>

                </div>
              )
            )}

            {!myProjects.length && (
              <div className="rounded-2xl bg-slate-50 p-6 text-center">

                <MapPin
                  size={30}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-2 text-sm font-semibold text-slate-700">
                  No plot assigned
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Contact the administrator.
                </p>

              </div>
            )}

          </div>

        </section>

      </div>

      {/* =================================================
          MATERIAL MANAGEMENT
      ================================================= */}

      {isLoggedIn && (
        <section className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200">

          {/* MATERIAL HEADER */}

          <div className="bg-gradient-to-r from-[#071A33] via-[#0B2A4A] to-[#174D78] p-5 text-white sm:p-6">

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div className="flex items-center gap-3">

                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10">
                  <Package size={21} />
                </div>

                <div>

                  <h2 className="text-xl font-bold">
                    Material Inventory
                  </h2>

                  <p className="text-xs text-blue-200">
                    {selectedProject
                      ? `Materials for ${selectedProject.name}`
                      : "Materials for selected plot"}
                  </p>

                </div>

              </div>

              {/* MATERIAL COUNT */}

              <div className="rounded-xl bg-white/10 px-4 py-2">

                <p className="text-[10px] text-blue-200">
                  Total Materials
                </p>

                <p className="text-lg font-bold">
                  {materialSummary.totalMaterials}
                </p>

              </div>

            </div>

          </div>

          <div className="p-5 sm:p-6">

            {/* =================================================
                INVENTORY SUMMARY
            ================================================= */}

            <div className="grid gap-3 sm:grid-cols-3">

              {/* TOTAL */}

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">

                <div className="flex items-center gap-2">

                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-100 text-[#0B2A4A]">
                    <Boxes size={18} />
                  </div>

                  <div>

                    <p className="text-xs font-semibold text-slate-500">
                      Total Stock
                    </p>

                    <p className="text-xl font-extrabold text-[#0B2A4A]">
                      {materialSummary.totalQuantity}
                    </p>

                  </div>

                </div>

              </div>

              {/* USED */}

              <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">

                <div className="flex items-center gap-2">

                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-orange-100 text-orange-700">
                    <Minus size={18} />
                  </div>

                  <div>

                    <p className="text-xs font-semibold text-orange-600">
                      Total Used
                    </p>

                    <p className="text-xl font-extrabold text-orange-700">
                      {materialSummary.totalUsed}
                    </p>

                  </div>

                </div>

              </div>

              {/* REMAINING */}

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">

                <div className="flex items-center gap-2">

                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
                    <CheckCircle2 size={18} />
                  </div>

                  <div>

                    <p className="text-xs font-semibold text-emerald-600">
                      Remaining
                    </p>

                    <p className="text-xl font-extrabold text-emerald-700">
                      {materialSummary.totalRemaining}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                ALL MATERIALS
            ================================================= */}

            <div className="mt-6">

              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">

                <div>

                  <h3 className="font-bold text-slate-900">
                    All Materials
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Complete material inventory for this plot.
                  </p>

                </div>

                <div className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
                  {availableMaterials.length} Available
                </div>

              </div>

              {projectMaterials.length > 0 ? (

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  {projectMaterials.map(
                    (material) => {

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

                      const usedPercentage =
                        total > 0
                          ? Math.min(
                              100,
                              (used / total) *
                                100
                            )
                          : 0;

                      return (
                        <div
                          key={material.id}
                          className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >

                          {/* MATERIAL NAME */}

                          <div className="flex items-start justify-between gap-3">

                            <div className="flex min-w-0 items-center gap-3">

                              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#0B2A4A] text-white">
                                <Package size={19} />
                              </div>

                              <div className="min-w-0">

                                <h4 className="truncate font-bold text-slate-900">
                                  {material.name}
                                </h4>

                                <p className="mt-0.5 text-xs text-slate-500">
                                  Unit:{" "}
                                  {material.unit}
                                </p>

                              </div>

                            </div>

                            {/* STOCK STATUS */}

                            <span
                              className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                                remaining <= 0
                                  ? "bg-red-100 text-red-700"
                                  : remaining <=
                                    total *
                                      0.2
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-emerald-100 text-emerald-700"
                              }`}
                            >
                              {remaining <= 0
                                ? "Out of Stock"
                                : remaining <=
                                  total *
                                    0.2
                                ? "Low Stock"
                                : "Available"}
                            </span>

                          </div>

                          {/* QUANTITY GRID */}

                          <div className="mt-4 grid grid-cols-3 gap-2">

                            {/* TOTAL */}

                            <div className="rounded-xl bg-blue-50 p-3 text-center">

                              <p className="text-[10px] font-semibold text-slate-500">
                                Total
                              </p>

                              <p className="mt-1 text-lg font-extrabold text-[#0B2A4A]">
                                {total}
                              </p>

                              <p className="text-[10px] text-slate-400">
                                {material.unit}
                              </p>

                            </div>

                            {/* USED */}

                            <div className="rounded-xl bg-orange-50 p-3 text-center">

                              <p className="text-[10px] font-semibold text-orange-600">
                                Used
                              </p>

                              <p className="mt-1 text-lg font-extrabold text-orange-700">
                                {used}
                              </p>

                              <p className="text-[10px] text-orange-500">
                                {material.unit}
                              </p>

                            </div>

                            {/* REMAINING */}

                            <div className="rounded-xl bg-emerald-50 p-3 text-center">

                              <p className="text-[10px] font-semibold text-emerald-600">
                                Remaining
                              </p>

                              <p className="mt-1 text-lg font-extrabold text-emerald-700">
                                {remaining}
                              </p>

                              <p className="text-[10px] text-emerald-500">
                                {material.unit}
                              </p>

                            </div>

                          </div>

                          {/* PROGRESS */}

                          <div className="mt-4">

                            <div className="mb-1 flex justify-between text-[10px] font-semibold text-slate-500">

                              <span>
                                Usage
                              </span>

                              <span>
                                {Math.round(
                                  usedPercentage
                                )}
                                %
                              </span>

                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-slate-200">

                              <div
                                className="h-full rounded-full bg-[#0B2A4A] transition-all"
                                style={{
                                  width: `${usedPercentage}%`,
                                }}
                              />

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              ) : (

                <div className="mt-4 rounded-2xl bg-slate-50 p-8 text-center">

                  <Package
                    size={36}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-2 font-semibold text-slate-700">
                    No materials added
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    The administrator has not added materials
                    to this plot yet.
                  </p>

                </div>

              )}

            </div>

            {/* =================================================
                TAKE MATERIAL
            ================================================= */}

            <div className="mt-6 grid gap-5 xl:grid-cols-12">

              <div className="xl:col-span-5">

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                  <div className="flex items-center gap-3">

                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100 text-[#0B2A4A]">
                      <Plus size={19} />
                    </div>

                    <div>

                      <h3 className="font-bold text-slate-900">
                        Take Material
                      </h3>

                      <p className="text-xs text-slate-500">
                        Taken quantity is automatically deducted.
                      </p>

                    </div>

                  </div>

                  <div className="mt-5 space-y-4">

                    {/* MATERIAL */}

                    <div>

                      <label className="label">
                        Select Material
                      </label>

                      <select
                        className="input"
                        value={
                          materialForm.materialId
                        }
                        onChange={(e) =>
                          setMaterialForm({
                            ...materialForm,
                            materialId:
                              e.target.value,
                          })
                        }
                        disabled={
                          !availableMaterials.length
                        }
                      >

                        <option value="">
                          Select material
                        </option>

                        {availableMaterials.map(
                          (material) => (
                            <option
                              key={material.id}
                              value={material.id}
                            >
                              {material.name} —{" "}
                              {material.remaining}{" "}
                              {material.unit} available
                            </option>
                          )
                        )}

                      </select>

                    </div>

                    {/* SELECTED MATERIAL STOCK */}

                    {materialForm.materialId && (
                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">

                        {(() => {
                          const selectedMaterial =
                            availableMaterials.find(
                              (item) =>
                                item.id ===
                                materialForm.materialId
                            );

                          if (!selectedMaterial) {
                            return null;
                          }

                          return (
                            <div className="flex items-center justify-between gap-3">

                              <div>

                                <p className="text-xs font-semibold text-slate-500">
                                  Available Stock
                                </p>

                                <p className="text-lg font-extrabold text-[#0B2A4A]">
                                  {
                                    selectedMaterial.remaining
                                  }{" "}
                                  {
                                    selectedMaterial.unit
                                  }
                                </p>

                              </div>

                              <Package
                                size={25}
                                className="text-[#0B2A4A]"
                              />

                            </div>
                          );
                        })()}

                      </div>
                    )}

                    {/* QUANTITY */}

                    <div>

                      <label className="label">
                        Quantity Taken
                      </label>

                      <input
                        type="number"
                        min="0.01"
                        step="any"
                        className="input"
                        value={
                          materialForm.quantity
                        }
                        onChange={(e) =>
                          setMaterialForm({
                            ...materialForm,
                            quantity:
                              e.target.value,
                          })
                        }
                        placeholder="Enter quantity"
                        disabled={
                          !availableMaterials.length
                        }
                      />

                    </div>

                    {/* BUTTON */}

                    <button
                      type="button"
                      onClick={
                        handleTakeMaterial
                      }
                      disabled={
                        materialLoading ||
                        !availableMaterials.length
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#071A33] to-[#174D78] px-4 py-3 text-sm font-bold text-white shadow-md transition hover:from-[#0B2A4A] hover:to-[#1E5B88] disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      <Package size={18} />

                      {materialLoading
                        ? "Updating..."
                        : "Take Material"}

                    </button>

                  </div>

                  {materialMessage && (
                    <div className="mt-4 rounded-xl bg-blue-50 p-3 text-xs font-semibold text-[#0B2A4A]">
                      {materialMessage}
                    </div>
                  )}

                </div>

              </div>

              {/* =================================================
                  MATERIAL TRANSACTIONS
              ================================================= */}

              <div className="xl:col-span-7">

                <div className="rounded-2xl border border-slate-200 bg-white p-5">

                  <div className="flex items-center justify-between gap-3">

                    <div>

                      <h3 className="font-bold text-slate-900">
                        Materials Taken Today
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Material transactions recorded for you today.
                      </p>

                    </div>

                    <div className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">
                      {materialsTakenToday.length}{" "}
                      Transactions
                    </div>

                  </div>

                  {materialsTakenToday.length > 0 ? (

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">

                      {materialsTakenToday.map(
                        (item) => (
                          <div
                            key={item.id}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                          >

                            <div className="flex items-center gap-3">

                              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-[#0B2A4A]">
                                <Package size={17} />
                              </div>

                              <div className="min-w-0">

                                <p className="truncate text-sm font-bold text-slate-800">
                                  {item.materialName}
                                </p>

                                <p className="text-xs text-slate-500">
                                  {item.date} •{" "}
                                  {item.time}
                                </p>

                              </div>

                            </div>

                            <div className="mt-4 flex items-end justify-between">

                              <div>

                                <p className="text-xs text-slate-500">
                                  Quantity Taken
                                </p>

                                <p className="text-lg font-extrabold text-[#0B2A4A]">
                                  {item.quantity}{" "}
                                  {item.unit}
                                </p>

                              </div>

                              <CheckCircle2
                                size={20}
                                className="text-emerald-500"
                              />

                            </div>

                          </div>
                        )
                      )}

                    </div>

                  ) : (

                    <div className="mt-4 rounded-2xl bg-slate-50 p-6 text-center">

                      <Minus
                        size={28}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-2 text-sm font-semibold text-slate-600">
                        No materials taken today
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Your material transactions will appear here.
                      </p>

                    </div>

                  )}

                </div>

              </div>

            </div>

          </div>

        </section>
      )}

    </div>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function Info({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">

      <Icon size={17} />

      <div className="mt-2 text-[11px] text-blue-200">
        {label}
      </div>

      <div className="mt-1 truncate text-sm font-semibold text-white">
        {value}
      </div>

    </div>
  );
}