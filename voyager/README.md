# Voyager: Logistics & Transit Application

![Voyager UI Overview - Placeholder]

**Voyager** is the mobile-first logistics tracker of the Bloodchain Ecosystem. It is utilized by **Drivers and Medical Couriers** to transport blood safely across the massive geography of Botswana.

---

## 🌍 Role in the Bloodchain Ecosystem
Voyager acts as the glue bridging local clinics (`Scyther`), centralized labs (`Mars-lab`), and the final destination hospitals. When blood needs to move, Voyager tracks its physical location, ensuring the chain of custody remains visibly unbroken during transit.

## ✨ Core Features
- **Job Feed & Active Assignments**: Couriers view a feed of pending dispatch requests ("Take 50 units from Gaborone Clinic to National Lab").
- **Live Map Feed**: Integrates coordinate maps to show pickup/dropoff points alongside GPS telemetry.
- **Custody Handshake**: When a driver picks up a batch of blood, they scan it, flipping the status to `IN_TRANSIT` and writing an immutable CustodyEvent attached to their specific user ID.
- **Shift-Sync Ledger (Right Sidebar popup)**: Allows drivers to see if another courier has already picked up a batch from a specific clinic, preventing dry runs.
- **Mobile-First Design**: The only app in the ecosystem styled specifically for narrow smartphone screens (using max-width constraints), as drivers use this on the road.

## 🛠 Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v3 (Orange/Dark aesthetic for high contrast outdoors)
- **Authentication**: Supabase Auth restricted strictly to the `TRANSIT` role.
- **Routing**: React Router DOM (Mobile Bottom Navigation architecture instead of a Sidebar).
- **Mapping**: Lightweight map embeddings / coordinate tracking mockups.

## 📂 Architecture
Unlike the others, Voyager uses a `max-w-lg mx-auto` container layout (`App.jsx`) to simulate a mobile app on desktop monitors. The `ShiftSyncLog` floats externally to the central container. Transit users primarily trigger `IN_TRANSIT` and `RECEIVED` status updates on the backend.
