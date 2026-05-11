# Project Architecture Summary

## 3-Layer Architecture

```
Layer 1: INIT (initSupabase.js)
  └─ Initializes Supabase client globally, provides window.getSupabase()

Layer 2: API (js/supabaseClient.js)
  └─ ALL Supabase operations: supabaseAPI.auth, .db, .storage, .realtime
  └─ Returns: { success: boolean, data, error }

Layer 3: UI/LOGIC (HTML + js/*.js)
  └─ Page-specific code, calls supabaseAPI methods only
```

## Files & Responsibilities

| File | Purpose |
|------|---------|
| `initSupabase.js` | Initialize Supabase (load FIRST) |
| `js/supabaseClient.js` | All Supabase operations (load SECOND) |
| `login.html` | Auth UI → uses supabaseAPI.auth |
| `dashboard.html` | Main app dashboard |
| `index.html` | Landing page |
| `get-started.html` | Onboarding flow |
| `js/addproducts.js` | Product upload → uses supabaseAPI.db.insertData() |
| `js/product.js` | Product display (mock data) |
| `js/leads.js` | Leads display (mock data) |
| `js/getstarted.js` | Onboarding logic → uses supabaseAPI.db.fetchOne() |

## Architecture Rules (MANDATORY)

✅ **REQUIRED:**
- Load scripts in order: initSupabase.js → supabaseClient.js → page JS
- All Supabase calls go through supabaseAPI
- All API methods return `{ success: boolean, data, error }`
- Always check `result.success` before using `result.data`

❌ **FORBIDDEN (breaks system):**
- Direct `supabase.*` calls from page files
- Loading supabaseClient before initSupabase
- Adding Supabase operations to page-specific JS files
- Mixing supabaseAPI and raw queries

## supabaseAPI Structure

```
supabaseAPI.auth: signUpWithPassword, signInWithPassword, signInWithOtp, 
                  verifyOtp, signOut, getSession, getUser

supabaseAPI.db: fetchData, insertData, updateData, deleteData, fetchOne

supabaseAPI.storage: uploadFile, deleteFile, getPublicUrl

supabaseAPI.realtime: subscribeToTable, unsubscribeFromTable
```

## Data Flow

```
User Action → Page JS → supabaseAPI method → supabaseClient.js → 
Returns { success, data, error } → Page JS updates UI
```

## Current Status

✅ Completed: initSupabase.js, supabaseClient.js, login.html, dashboard.html, index.html, addproducts.js, getstarted.js

⏳ TODO: Add Supabase queries to product.js & leads.js (currently mock data)
