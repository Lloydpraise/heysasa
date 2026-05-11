# Supabase Architecture Map

## System Overview

This project uses a **3-layer Supabase architecture** to ensure clean code organization and maintainability:

```
Layer 1: INITIALIZATION
└─ initSupabase.js (root)
   └─ Initializes Supabase client globally
   └─ Provides window.getSupabase() accessor

Layer 2: API (Centralized)
└─ js/supabaseClient.js
   └─ ALL Supabase operations happen here
   └─ Exposes global supabaseAPI object
   └─ Organized: auth, db, storage, realtime

Layer 3: UI/LOGIC (Page-specific)
└─ js/*.js files (addproducts.js, leads.js, product.js, getstarted.js)
└─ HTML files (login.html, dashboard.html, index.html, get-started.html)
└─ Call methods from supabaseAPI only
└─ Never call supabase directly
```

---

## File Responsibilities

### Root Level

| File | Purpose | Loads Before |
|------|---------|--------------|
| `initSupabase.js` | Initialize Supabase client with credentials | supabaseClient.js |

### HTML Entry Points (Must include both files in order)

| File | Purpose | Required Scripts |
|------|---------|------------------|
| `login.html` | Authentication UI | initSupabase.js → supabaseClient.js |
| `dashboard.html` | Main app dashboard | initSupabase.js → supabaseClient.js |
| `index.html` | Home/landing page | initSupabase.js → supabaseClient.js |
| `get-started.html` | Onboarding flow | initSupabase.js → supabaseClient.js |

### JS API Layer (js/supabaseClient.js)

**Exports**: Global `supabaseAPI` object

**Organized into 4 categories:**

1. **`supabaseAPI.auth`** - All authentication operations
   - signUpWithPassword, signInWithPassword, signInWithOtp, verifyOtp, signOut, getSession, getUser

2. **`supabaseAPI.db`** - All database operations
   - fetchData, insertData, updateData, deleteData, fetchOne

3. **`supabaseAPI.storage`** - All file operations
   - uploadFile, deleteFile, getPublicUrl

4. **`supabaseAPI.realtime`** - Real-time subscriptions
   - subscribeToTable, unsubscribeFromTable

**Key Rule**: All methods return `{ success: boolean, data: any, error: any }`

### JS UI/Logic Layer (js/*.js files)

| File | Responsibility | Accesses |
|------|-----------------|----------|
| `addproducts.js` | Product upload UI logic | supabaseAPI.db.insertData() |
| `product.js` | Product display UI logic | (Currently mock data) |
| `leads.js` | Leads display UI logic | (Currently mock data) |
| `getstarted.js` | Onboarding flow logic | supabaseAPI.db.fetchOne(), supabase.functions.invoke() |

---

## Architecture Rules

### ✅ REQUIRED (System depends on these)

1. **Always load scripts in order:**
   - initSupabase.js FIRST
   - supabaseClient.js SECOND
   - Individual JS files AFTER (in any order)

2. **All Supabase calls must go through supabaseAPI:**
   - ❌ Never use `supabase` directly from page files
   - ✅ Always use `supabaseAPI.*` 
   - Add new methods to supabaseClient.js, not page files

3. **Return format consistency:**
   - All supabaseAPI methods return: `{ success: true/false, data, error }`
   - Always check `result.success` before accessing `result.data`

4. **Layer separation:**
   - Layer 1 (init): Only initializes, nothing else
   - Layer 2 (API): Only API operations, no UI logic
   - Layer 3 (UI): Only UI/display logic, no direct Supabase calls

### ❌ FORBIDDEN (Will break the system)

- Direct `supabase.*` calls from page files
- Mixing supabaseAPI and raw supabase queries
- Loading supabaseClient.js before initSupabase.js
- Adding supabase operations directly in page-specific JS files
- Modifying initSupabase.js except for credentials

---

## Adding New Functionality

### When to add to supabaseClient.js:
- Any new Supabase auth operation → add to `auth` section
- Any new database query → add to `db` section
- Any new file upload/storage → add to `storage` section
- Any new real-time feature → add to `realtime` section

### When to add to page-specific JS:
- UI event handlers
- DOM manipulation
- Form validation
- UI state management
- Calling supabaseAPI methods

### When to add to HTML:
- UI elements only
- Script loading (must be: initSupabase → supabaseClient → page JS)

---

## Data Flow

```
User Action (HTML/UI)
    ↓
Page-specific JS (addproducts.js, leads.js, etc.)
    ↓
Calls supabaseAPI.* method
    ↓
supabaseClient.js (API layer)
    ↓
Returns { success, data, error }
    ↓
Page-specific JS handles response
    ↓
Updates UI
```

---

## Current Implementation Status

✅ Completed:
- initSupabase.js - Initialization layer set up
- supabaseClient.js - API layer with auth, db, storage, realtime methods
- login.html - Updated to use supabaseAPI.auth
- dashboard.html - Includes both required script files
- index.html - Includes both required script files
- addproducts.js - Updated to use supabaseAPI.db.insertData()
- getstarted.js - Updated to use supabaseAPI.db.fetchOne()

⏳ Next Steps (for future development):
- Add Supabase queries to product.js (currently uses mock data)
- Add Supabase queries to leads.js (currently uses mock data)
- Add Edge Function calls as needed
- Add real-time subscriptions where appropriate

---

## Key Access Points

| Need | Use | Location |
|------|-----|----------|
| Get Supabase client | `window.getSupabase()` | initSupabase.js |
| Auth operations | `supabaseAPI.auth.*` | supabaseClient.js |
| Database ops | `supabaseAPI.db.*` | supabaseClient.js |
| File uploads | `supabaseAPI.storage.*` | supabaseClient.js |
| Real-time | `supabaseAPI.realtime.*` | supabaseClient.js |

---

## Architectural Constraints for AI Agents

When adding features or fixing bugs:

1. **Never violate layer separation** - Keep UI logic away from API layer
2. **No direct supabase calls** - Route everything through supabaseAPI
3. **Maintain return consistency** - All API methods must return `{ success, data, error }`
4. **Respect script loading order** - initSupabase must load before supabaseClient
5. **New Supabase operations go to supabaseClient.js** - Never add to page files
6. **Check success before accessing data** - Always validate `result.success`

---

## File Dependency Graph

```
login.html
├─ initSupabase.js
│  └─ Initializes window.supabase
├─ supabaseClient.js
│  └─ Depends on: window.supabase, window.getSupabase()
│  └─ Exposes: supabaseAPI
└─ Inline script
   └─ Calls supabaseAPI.auth.*

dashboard.html
├─ js/addproducts.js
│  └─ Calls supabaseAPI.db.*
├─ initSupabase.js
│  └─ Initializes window.supabase
├─ supabaseClient.js
│  └─ Exposes supabaseAPI
└─ Page config & navigation scripts

index.html
├─ initSupabase.js
├─ supabaseClient.js
└─ Other scripts

get-started.html
├─ js/getstarted.js
│  └─ Calls supabaseAPI.db.*, window.getSupabase()
├─ initSupabase.js
├─ supabaseClient.js (must be included)
└─ Inline form logic
```
