# Keycloak setup for Bloodchain (localhost)

After `docker compose up keycloak`, Keycloak runs with **no realm or client**. The apps expect realm `bloodchain` and client `bloodchain-frontend`. Create them once:

---

## 1. Open Keycloak Admin

1. In the browser go to: **http://localhost:8080**
2. Click **Administration Console** (or go to http://localhost:8080/admin).
3. Log in:
   - **Username:** `admin`
   - **Password:** `admin`

---

## 2. Create the realm

1. Top-left: open the **realm** dropdown (it says "Keycloak" or "master").
2. Click **Create realm**.
3. **Realm name:** `bloodchain`
4. Leave other defaults, click **Create**.

---

## 3. Create the client

1. In the left menu: **Clients** → **Create client**.
2. **General settings**
   - **Client type:** OpenID Connect
   - **Client ID:** `bloodchain-frontend`
   - Next
3. **Capability config**
   - **Client authentication:** OFF (this is a public frontend client).
   - **Authorization:** OFF
   - **Authentication flow:** check **Standard flow** and **Direct access grants** if you want (optional).
   - Next
4. **Login settings**
   - **Root URL:** leave empty or `http://localhost:5173`
   - **Home URL:** leave empty
   - **Valid redirect URIs:** add (one per line or comma-separated, depending on UI):
     ```
     http://localhost:5173/*
     http://localhost:5175/*
     http://localhost:3000/*
     ```
   - **Valid post logout redirect URIs:** add:
     ```
     http://localhost:5173/*
     http://localhost:5175/*
     http://localhost:3000/*
     ```
   - **Web origins:** add (or use `+` to copy from redirect URIs):
     ```
     http://localhost:5173
     http://localhost:5175
     http://localhost:3000
     ```
   - Save

---

## 4. Create a test user (optional)

1. Left menu: **Users** → **Add user**.
2. **Username:** `test` (or any name).
3. **Email:** optional.
4. **First name / Last name:** optional.
5. Click **Create**.
6. Open the **Credentials** tab → **Set password** (e.g. `test`), turn OFF "Temporary" if you don't want to change it on first login.

---

## 5. Try again

- Restart or refresh **Voyager** at http://localhost:5175.
- You should be sent to Keycloak's login page for the **bloodchain** realm (no more 404), then back to Voyager after login.

If you add more apps (e.g. Mars on another port), add their URLs to **Valid redirect URIs**, **Post logout redirect URIs**, and **Web origins** in the `bloodchain-frontend` client.

---

## 6. Create realm roles (REQUIRED — do this once)

The backend `provisionUser` endpoint assigns roles to KC users automatically, but the roles must exist first.

1. Left menu: **Realm roles** → **Create role** (repeat for each):

| Role name | Description |
|-----------|-------------|
| `admin`   | Full system administrator |
| `lab`     | Lab technician (Mars-lab access) |
| `medical` | Medical staff (Scyther clinical) |
| `transit` | Courier / transport (Voyager) |
| `public`  | Donor (Azure app) |

> **Important:** role names must be **lowercase** — the apps normalize Keycloak roles to uppercase internally, so `admin` → `ADMIN`.

---

## 7. How user provisioning works now

When High Command calls `POST /api/v1/admin/users`, the backend:

1. Checks for duplicate email in Postgres (fast fail)
2. Creates the user in Keycloak via Admin REST API with a **temporary password** (auto-generated as `BC-XXXXXXXX`)
3. Assigns the selected realm role in Keycloak
4. Writes the user record to Postgres
5. Returns `{ ...user, kcUserId, tempPassword }` — the admin sees the temp password once to share with the new user

The new user logs in with their email + temp password and is forced to change it on first login.

**Backend env vars** (already in `.env`):
```
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=bloodchain
KEYCLOAK_ADMIN_USER=admin
KEYCLOAK_ADMIN_PASS=admin
```

---

## 8. Client split — `azure-public` vs `bloodchain-frontend`

The Azure donor app uses its **own** Keycloak client so it can offer self-registration without exposing a "Register" link in staff apps.

### Create the `azure-public` client (one-time)

1. **Clients → Create client**
   - **Client type:** OpenID Connect
   - **Client ID:** `azure-public`
   - **Client authentication:** OFF (public)
   - **Standard flow:** ✅
2. **Login settings:**

   | Field | Value |
   |-------|-------|
   | Valid redirect URIs | `http://localhost:5177/*` |
   | Valid post logout redirect URIs | `http://localhost:5177/*` |
   | Web origins | `http://localhost:5177` |

3. Save.

### Enable self-registration (realm-level)

**Realm Settings → Login tab → User registration → ON**

> Self-registration is intentionally realm-wide but the custom login theme suppresses the "Register" link for any client that is **not** `azure-public` (see `login.ftl`), so staff apps are unaffected.

### Assign default `public` role to new registrants

**Realm Settings → User Registration → Default roles → Add `public`**

This ensures every self-registered donor automatically receives the `PUBLIC` role.


