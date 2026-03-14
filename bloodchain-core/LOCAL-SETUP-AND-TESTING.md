# Bloodchain — Local setup, flow & testing

This document explains **what to run**, **in what order**, and **how to test** the Bloodchain stack on your machine. It also covers the Keycloak Admin steps and common issues we’ve fixed.

---

## 1. What runs where

| Service | Port | Purpose |
|--------|------|--------|
| **Postgres** | 5432 | bloodchain-core database |
| **Keycloak** | 8080 | Auth (login, realm `bloodchain`, client `bloodchain-frontend`) |
| **bloodchain-core** | 4000 (default) | API gateway (`/api/v1/admin`, `/api/v1/assets`, `/health`) |
| **High Command** | 5173 (Vite default) | Admin dashboard |
| **Scyther** | 5173 or 5174 | Collection app |
| **Voyager** | 5175 | Driver app |
| **Azure** | 5173 or another | Donor app |
| **Mars-lab** | 3000 or another | Lab app |

Use different ports for each frontend when running several at once (e.g. 5173, 5174, 5175, 5176).

---

## 2. Startup order (recommended)

### Step 1 — Database and Keycloak (Docker)

From the **bloodchain-core** directory (scratch copy):

```bash
cd C:\Users\cima22-022\.gemini\antigravity\scratch\bloodchain-core
docker compose up -d postgres
docker compose up -d keycloak
```

- **Postgres** must be up first; otherwise bloodchain-core will fail with “Can’t reach database”.
- **Keycloak** starts with no realm or client; you create those once in the Admin Console (see below).
- Keycloak data is persisted in the `keycloak_data` volume, so realm/client/users survive container restarts.

### Step 2 — Keycloak Admin: create realm and client (one-time)

If you haven’t done this yet, the apps will get **404** when they redirect to Keycloak (realm `bloodchain` not found). Do this once:

1. Open **http://localhost:8080** in the browser.
2. Click **Administration Console** (or go to **http://localhost:8080/admin**).
3. Log in:
   - **Username:** `admin`  
   - **Password:** `admin`
4. **Create realm:** Top-left realm dropdown → **Create realm** → Realm name: `bloodchain` → Create.
5. **Create client:** Left menu **Clients** → **Create client**  
   - Client type: OpenID Connect  
   - Client ID: `bloodchain-frontend`  
   - Capability: **Client authentication OFF** (public frontend)  
   - Login settings: add **Valid redirect URIs** and **Web origins** for your app origins, e.g.:
     - `http://localhost:5173/*`, `http://localhost:5175/*`, `http://localhost:3000/*`
     - Web origins: `http://localhost:5173`, `http://localhost:5175`, `http://localhost:3000`
   - Save.
6. **Test user (optional):** **Users** → **Add user** (e.g. username `test`) → **Credentials** tab → **Set password** (e.g. `test`), turn OFF “Temporary”.

Full step-by-step is in **KEYCLOAK-SETUP.md** in this repo.

### Step 3 — bloodchain-core (Node)

From bloodchain-core:

```bash
cd C:\Users\cima22-022\.gemini\antigravity\scratch\bloodchain-core
npm run dev
```

You should see “Database connected” and the API listening (e.g. port 4000). Check:

- **http://localhost:4000/health** — should return JSON `{ "status": "operational", ... }`.

### Step 4 — Frontends (Vite / npm)

Open separate terminals for each app you want to test. Point them at the core API (e.g. `VITE_API_URL=http://localhost:4000/api/v1` if needed).

Examples:

```bash
# High Command (admin)
cd C:\Users\cima22-022\.gemini\antigravity\scratch\high-command
npm run dev
# Often http://localhost:5173

# Scyther (collection)
cd C:\Users\cima22-022\.gemini\antigravity\scratch\scyther
npm run dev
# Use another port if 5173 is taken, e.g. npm run dev -- --port 5174

# Voyager (driver)
cd C:\Users\cima22-022\.gemini\antigravity\scratch\voyager
npm run dev
# e.g. --port 5175

# Azure (donor)
cd C:\Users\cima22-022\.gemini\antigravity\scratch\azure
npm run dev

# Mars-lab (lab)
cd C:\Users\cima22-022\mars-lab
npm run dev
```

Ensure each app’s origin is listed in Keycloak’s `bloodchain-frontend` client (redirect URIs and Web origins) if you use login on that app.

---

## 3. High Command without Keycloak (bypass)

To use High Command without logging in via Keycloak (e.g. to provision users before full auth):

1. Set env when starting the app:
   - **Windows (PowerShell):** `$env:VITE_SKIP_KEYCLOAK="true"; npm run dev`
   - **Windows (CMD):** `set VITE_SKIP_KEYCLOAK=true && npm run dev`
2. High Command will skip the Keycloak login flow.
3. The High Command API layer sends **`Authorization: Bearer dev-bypass`** on every request, which bloodchain-core accepts in non-production for `requireAuth` routes. So **provisioning a user** and **listing users/stats** work.

Use this only for local/admin convenience; don’t enable skip Keycloak in production.

---

## 4. Testing flow — what to test

### 4.1 Keycloak and realm

- Open **http://localhost:8080** → Administration Console → login `admin` / `admin`.
- Switch realm to **bloodchain** (top-left).
- Confirm **Clients** → **bloodchain-frontend** exists and redirect URIs include your app URLs.
- Confirm at least one **User** (e.g. `test`) with a set password.

### 4.2 bloodchain-core

- **Health:** `GET http://localhost:4000/health` → 200 and JSON.
- **Auth required:** Without a token, `GET http://localhost:4000/api/v1/admin/users` should return 401 (or 403) unless the server is configured to allow unauthenticated access (it shouldn’t).
- **With dev-bypass:**  
  `GET http://localhost:4000/api/v1/admin/users`  
  Header: `Authorization: Bearer dev-bypass`  
  → 200 and JSON (list of users or empty array).

### 4.3 High Command

- **With bypass:** Start with `VITE_SKIP_KEYCLOAK=true`. Open dashboard; you should see stats and users from bloodchain-core (or empty states). Provision a new user; it should succeed (core creates user).
- **With Keycloak:** Start without the env var; you should be redirected to Keycloak login (bloodchain realm), then back to High Command.

### 4.4 Scyther

- Start Scyther; ensure `VITE_API_URL` points at `http://localhost:4000/api/v1` (or default).
- Log in via Keycloak (bloodchain realm). Donor check-in and inventory should load donors and units from core (GET `/admin/users`, GET `/assets`). If none exist, you should see empty states.

### 4.5 Voyager

- Open Voyager; log in with Keycloak. Job feed comes from the API (assets). You should see either jobs or the empty state (“No pending blood units at this time”).

### 4.6 Azure

- Log in with Keycloak. Donation history (when wired to core) comes from `GET /assets/my-donations`. Other screens may still show empty or placeholder data until Mission 3 is finished.

### 4.7 Mars-lab

- Log in; use lab flows (samples, biohazard). No mock data; confirm empty states when there is no data.

---

## 5. Troubleshooting

| Issue | What to do |
|-------|------------|
| **Keycloak 404** (e.g. when opening Voyager) | Realm `bloodchain` or client `bloodchain-frontend` not created. Follow **KEYCLOAK-SETUP.md** (Section 2 above) in Admin Console at http://localhost:8080/admin. |
| **bloodchain-core “Can’t reach database”** | Start Postgres first: from bloodchain-core run `docker compose up -d postgres`, then restart `npm run dev`. |
| **401 when provisioning user from High Command** | With `VITE_SKIP_KEYCLOAK=true`, High Command must send `Authorization: Bearer dev-bypass`. Check `high-command\src\lib\api.ts` (or equivalent) request interceptor adds this header when skip Keycloak is enabled. |
| **Keycloak container crash (e.g. EOFException)** | Theme volume was causing startup issues; it’s commented out in `docker-compose.yml`. Keycloak runs without custom theme until Mission 4. Use default theme. |
| **CORS or wrong API URL** | Ensure each frontend’s `VITE_API_URL` (or equivalent) is `http://localhost:4000/api/v1` and that bloodchain-core is running. |

---

## 6. File reference (paths used in this doc)

- **bloodchain-core (scratch):** `C:\Users\cima22-022\.gemini\antigravity\scratch\bloodchain-core`
  - `docker-compose.yml`, `KEYCLOAK-SETUP.md`, `HANDOVER.md`, `LOCAL-SETUP-AND-TESTING.md`
- **High Command:** `C:\Users\cima22-022\.gemini\antigravity\scratch\high-command`
- **Scyther:** `C:\Users\cima22-022\.gemini\antigravity\scratch\scyther`
- **Voyager:** `C:\Users\cima22-022\.gemini\antigravity\scratch\voyager`
- **Azure (scratch):** `C:\Users\cima22-022\.gemini\antigravity\scratch\azure`
- **Mars-lab (root):** `C:\Users\cima22-022\mars-lab`

For a full list of important files and next steps, see **HANDOVER.md**.

---

*Use this document together with KEYCLOAK-SETUP.md and HANDOVER.md for local runs and testing.*
