# BuildTrack — Contractor Workforce Management

A React + Tailwind CSS contractor management system for multiple construction plots/sites.

## Features

### Admin
- Phone + password authentication
- Dashboard with active plots, labour count, attendance and materials
- Create/edit/delete construction projects/plots
- Assign labourers to one or more plots
- View complete project details
- Track material received, used and remaining
- Low-stock material alerts
- View/filter/export labour attendance as CSV
- Create/edit/activate/deactivate labour accounts
- Only admin users can create labour credentials

### Labour
- Login using phone number + password supplied by admin
- See assigned plots
- Submit daily attendance
- Record check-in/check-out time
- Select plot/site
- Record work performed and additional details
- Update today's submitted attendance

## Storage and authentication

This version intentionally uses `localStorage` for a standalone demo/prototype. It persists data across browser refreshes.

Important: localStorage authentication is NOT suitable for production because passwords and application data are stored client-side. For production, replace the auth/data layer with a backend API, hashed passwords, sessions/JWT, database and server-side authorization.

## Run

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Demo credentials

Admin:
- Phone: `9999999999`
- Password: `admin123`

Labour:
- Phone: `9876543210`
- Password: `worker123`

A second worker is included:
- Phone: `9876501234`
- Password: `worker123`

## Main routes

- `/login`
- `/admin`
- `/admin/projects`
- `/admin/projects/:id`
- `/admin/materials`
- `/admin/attendance`
- `/admin/workers`
- `/worker`

## Notes

The app uses seeded demo data on first launch. Changes are persisted in localStorage under `buildtrack_data_v1`.

To reset demo data during development, open the browser console and run:

```js
localStorage.removeItem("buildtrack_data_v1");
localStorage.removeItem("buildtrack_session");
location.reload();
```
