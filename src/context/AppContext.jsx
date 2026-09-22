import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AppContext = createContext(null);

const STORAGE = "buildtrack_data_v1";

const seed = {
  users: [
    {
      id: "admin-1",
      role: "admin",
      name: "Site Administrator",
      phone: "9999999999",
      password: "admin123",
      active: true,
      createdAt: "2026-09-01",
    },

    {
      id: "lab-1",
      role: "labour",
      name: "Ravi Kumar",
      phone: "9876543210",
      password: "worker123",
      active: true,
      createdAt: "2026-09-05",
    },

    {
      id: "lab-2",
      role: "labour",
      name: "Suresh",
      phone: "9876501234",
      password: "worker123",
      active: true,
      createdAt: "2026-09-05",
    },
  ],

  projects: [
    {
      id: "p1",
      name: "Green Valley Villa",
      client: "Arun Constructions",
      location: "Saravanampatti",
      status: "In Progress",
      stage: "Foundation",
      startDate: "2026-08-10",
      endDate: "2027-01-15",
      description:
        "Independent villa construction with RCC structure.",
      workerIds: ["lab-1"],
      targetWorkers: 8,
    },

    {
      id: "p2",
      name: "Lake View Residence",
      client: "Kumar Family",
      location: "Kovaipudur",
      status: "In Progress",
      stage: "Brick Work",
      startDate: "2026-07-20",
      endDate: "2026-12-20",
      description:
        "Residential building construction.",
      workerIds: ["lab-2"],
      targetWorkers: 10,
    },
  ],

  materials: [
    {
      id: "m1",
      projectId: "p1",
      name: "Cement",
      category: "Structural",
      unit: "Bags",
      quantity: 120,
      used: 70,
      remaining: 50,
      date: "2026-09-20",
      notes: "OPC 53 grade",
    },

    {
      id: "m2",
      projectId: "p1",
      name: "Steel Rod",
      category: "Structural",
      unit: "Kg",
      quantity: 1500,
      used: 900,
      remaining: 600,
      date: "2026-09-18",
      notes: "12mm and 16mm",
    },

    {
      id: "m3",
      projectId: "p2",
      name: "Bricks",
      category: "Masonry",
      unit: "Nos",
      quantity: 5000,
      used: 3200,
      remaining: 1800,
      date: "2026-09-19",
      notes: "First class bricks",
    },
  ],

  attendance: [
    {
      id: "a1",
      workerId: "lab-1",
      projectId: "p1",
      date: "2026-09-20",
      checkIn: "08:42",
      checkOut: "17:35",
      work: "Foundation column reinforcement",
      notes: "Morning shift",
      status: "Present",
    },

    {
      id: "a2",
      workerId: "lab-2",
      projectId: "p2",
      date: "2026-09-20",
      checkIn: "09:05",
      checkOut: "",
      work: "Brick wall work",
      notes: "",
      status: "Present",
    },
  ],

  materialUsage: [],
};

/* =========================================================
   LOAD DATA
========================================================= */

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE);

    if (!raw) {
      return seed;
    }

    const parsed = JSON.parse(raw);

    return {
      ...seed,
      ...parsed,

      users: parsed.users || [],
      projects: parsed.projects || [],
      materials: parsed.materials || [],
      attendance: parsed.attendance || [],
      materialUsage: parsed.materialUsage || [],
    };
  } catch {
    return seed;
  }
}

/* =========================================================
   APP PROVIDER
========================================================= */

export function AppProvider({ children }) {
  const [data, setData] = useState(loadData);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("buildtrack_session") || "null"
      );
    } catch {
      return null;
    }
  });

  /* =======================================================
     SAVE DATA TO LOCAL STORAGE
  ======================================================= */

  useEffect(() => {
    localStorage.setItem(
      STORAGE,
      JSON.stringify(data)
    );
  }, [data]);

  /* =======================================================
     IMPORTANT:
     SYNC DATA BETWEEN BROWSER TABS
  ======================================================= */

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key !== STORAGE || !event.newValue) {
        return;
      }

      try {
        const updatedData = JSON.parse(event.newValue);

        setData({
          ...seed,
          ...updatedData,

          users: updatedData.users || [],
          projects: updatedData.projects || [],
          materials: updatedData.materials || [],
          attendance: updatedData.attendance || [],
          materialUsage:
            updatedData.materialUsage || [],
        });
      } catch (error) {
        console.error(
          "Failed to sync BuildTrack data:",
          error
        );
      }
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  /* =======================================================
     SAVE LOGIN SESSION
  ======================================================= */

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        "buildtrack_session",
        JSON.stringify(currentUser)
      );
    } else {
      localStorage.removeItem(
        "buildtrack_session"
      );
    }
  }, [currentUser]);

  /* =========================================================
     LOGIN
  ========================================================= */

  const login = (phone, password) => {
    const user = data.users.find(
      (u) =>
        u.phone === phone &&
        u.password === password &&
        u.active
    );

    if (!user) {
      return {
        ok: false,
        message:
          "Invalid phone number or password.",
      };
    }

    setCurrentUser({
      id: user.id,
      role: user.role,
      name: user.name,
      phone: user.phone,
    });

    return {
      ok: true,
      role: user.role,
    };
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const logout = () => {
    setCurrentUser(null);
  };

  /* =========================================================
     RESET DATA
  ========================================================= */

  const resetData = () => {
    setData({
      ...seed,
      materialUsage: [],
    });
  };

  /* =========================================================
     USERS
  ========================================================= */

  const addUser = (user) =>
    setData((d) => ({
      ...d,

      users: [
        ...d.users,

        {
          ...user,
          id: crypto.randomUUID(),
          createdAt:
            new Date()
              .toISOString()
              .slice(0, 10),
          active: true,
        },
      ],
    }));

  const updateUser = (id, patch) =>
    setData((d) => ({
      ...d,

      users: d.users.map((u) =>
        u.id === id
          ? {
              ...u,
              ...patch,
            }
          : u
      ),
    }));

  const deleteUser = (id) =>
    setData((d) => ({
      ...d,

      users: d.users.filter(
        (u) => u.id !== id
      ),

      attendance: d.attendance.filter(
        (a) => a.workerId !== id
      ),

      materialUsage: (
        d.materialUsage || []
      ).filter(
        (item) => item.workerId !== id
      ),
    }));

  /* =========================================================
     PROJECTS
  ========================================================= */

  const addProject = (project) =>
    setData((d) => ({
      ...d,

      projects: [
        ...d.projects,

        {
          ...project,
          id: crypto.randomUUID(),
          workerIds:
            project.workerIds || [],
        },
      ],
    }));

  const updateProject = (id, patch) =>
    setData((d) => ({
      ...d,

      projects: d.projects.map(
        (project) =>
          project.id === id
            ? {
                ...project,
                ...patch,
              }
            : project
      ),
    }));

  const deleteProject = (id) =>
    setData((d) => ({
      ...d,

      projects: d.projects.filter(
        (project) =>
          project.id !== id
      ),

      materials: d.materials.filter(
        (material) =>
          material.projectId !== id
      ),

      attendance: d.attendance.filter(
        (attendance) =>
          attendance.projectId !== id
      ),

      materialUsage: (
        d.materialUsage || []
      ).filter(
        (item) =>
          item.projectId !== id
      ),
    }));

  /* =========================================================
     MATERIALS
  ========================================================= */

  const addMaterial = (material) =>
    setData((d) => {
      const quantity = Number(
        material.quantity || 0
      );

      const used = Number(
        material.used || 0
      );

      return {
        ...d,

        materials: [
          ...d.materials,

          {
            ...material,

            id: crypto.randomUUID(),

            date:
              material.date ||
              new Date()
                .toISOString()
                .slice(0, 10),

            quantity,

            used,

            remaining:
              Math.max(
                0,
                quantity - used
              ),
          },
        ],
      };
    });

  const updateMaterial = (
    id,
    patch
  ) =>
    setData((d) => ({
      ...d,

      materials: d.materials.map(
        (material) => {
          if (material.id !== id) {
            return material;
          }

          const quantity = Number(
            patch.quantity ??
              material.quantity ??
              0
          );

          const used = Number(
            patch.used ??
              material.used ??
              0
          );

          return {
            ...material,
            ...patch,
            quantity,
            used,
            remaining:
              Math.max(
                0,
                quantity - used
              ),
          };
        }
      ),
    }));

  const deleteMaterial = (id) =>
    setData((d) => ({
      ...d,

      materials: d.materials.filter(
        (material) =>
          material.id !== id
      ),

      materialUsage: (
        d.materialUsage || []
      ).filter(
        (item) =>
          item.materialId !== id
      ),
    }));

  /* =========================================================
     MATERIAL USAGE
  ========================================================= */

  const addMaterialUsage = (
    usage
  ) =>
    setData((d) => ({
      ...d,

      materialUsage: [
        ...(d.materialUsage || []),

        {
          ...usage,

          id:
            usage.id ||
            crypto.randomUUID(),
        },
      ],
    }));

  /* =========================================================
     ATTENDANCE
  ========================================================= */

  const addAttendance = (
    record
  ) =>
    setData((d) => ({
      ...d,

      attendance: [
        ...d.attendance,

        {
          ...record,

          id: crypto.randomUUID(),

          status: "Present",
        },
      ],
    }));

  const updateAttendance = (
    id,
    patch
  ) =>
    setData((d) => ({
      ...d,

      attendance: d.attendance.map(
        (attendance) =>
          attendance.id === id
            ? {
                ...attendance,
                ...patch,
              }
            : attendance
      ),
    }));

  /* =========================================================
     CONTEXT VALUE
  ========================================================= */

  const value = useMemo(
    () => ({
      data,

      currentUser,

      login,
      logout,
      resetData,

      /* Users */
      addUser,
      updateUser,
      deleteUser,

      /* Projects */
      addProject,
      updateProject,
      deleteProject,

      /* Materials */
      addMaterial,
      updateMaterial,
      deleteMaterial,

      /* Material Usage */
      addMaterialUsage,

      /* Attendance */
      addAttendance,
      updateAttendance,
    }),
    [
      data,
      currentUser,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export const useApp = () =>
  useContext(AppContext);