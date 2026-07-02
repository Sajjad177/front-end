# Project Onboarding & Architecture Guide

Welcome! This document is a step-by-step developer guide for the frontend codebase. It is designed to help any developer (from fresher to senior) understand the project setup, learn how to add new features, and understand where frontend and backend integrations take place.

---

## 1. High-Level Folder Structure

The project code is organized inside the `src` directory to keep the root directory clean. Here is a summary of the folders and what lives inside them:

| Directory | What lives here? | Example |
| :--- | :--- | :--- |
| `src/app` | **Next.js App Router (Routes)**. Pages, layouts, templates, and the global middleware. | `(dashboard)/dashboard/overview/page.tsx` |
| `src/features` | **Domain Modules**. Business logic, forms, feature-specific buttons, and state wrappers. | `auth/components/ProtectedRoute.tsx` |
| `src/services` | **API Integration Layer**. Axios client configuration and endpoints. | `api/api-client.ts`, `auth/auth-service.ts` |
| `src/stores` | **Global State**. Zustand stores for cross-component shared state. | `auth-store.ts`, `theme-store.ts` |
| `src/components` | **Shared Global Components**. Atomic UI components and common layouts. | `ui/button.tsx`, `layout/sidebar.tsx` |
| `src/hooks` | **Global Reusable React Hooks**. Hooks that do not belong to a specific feature. | `use-debounce.ts`, `use-media-query.ts` |
| `src/schemas` | **Validation templates**. Zod schemas for input validation. | `auth.ts` (Login/Register validations) |
| `src/constants` | **Configuration constants**. App routes, API endpoints, and storage keys. | `routes.ts`, `api.ts` |
| `src/types` | **Global TypeScript Models**. Standard types shared across features. | `user.d.ts`, `api.d.ts` |
| `src/utils` | **Pure JS functions**. Simple math helper, currency, and date formatters. | `format.ts` |

---

## 2. Where to Add Frontend Functionality

When building new client-side features (e.g. a new form, page, modal, or dropdown), follow these steps:

### A. Creating the Routing Page (`src/app`)
Next.js 15 uses folder-based routing. To create a new page, add a folder under the appropriate **Route Group**:
* **Website Pages (Public):** Add folders under `src/app/(website)/` (e.g., `src/app/(website)/services/page.tsx` matches `/services`).
* **Dashboard Pages (Secured):** Add folders under `src/app/(dashboard)/dashboard/` (e.g., `src/app/(dashboard)/dashboard/settings/page.tsx` matches `/dashboard/settings`).
* **Auth Pages (Guest-only):** Add folders under `src/app/(auth)/` (e.g., `src/app/(auth)/login/page.tsx`).

*Best Practice:* Keep page files small. A page should only import and render components from the `features/` or `components/` directories. Do not write complex UI layouts directly inside `page.tsx`.

### B. Designing Components (`src/components` vs. `src/features`)
* **Is it a global reusable widget?** (e.g., a custom Button, Date Picker, Input Field, Card, Spinner, Dialog)
  * Put it in `src/components/ui/` or `src/components/common/`.
* **Is it tied to a specific business module?** (e.g., `BillingTable`, `ProfileSettingsForm`, `UserAvatarUpload`)
  * Group them inside a module folder under `src/features/` (e.g., `src/features/billing/components/BillingTable.tsx`).

### C. Declaring State Management (`src/stores` vs. local React State)
* **Zustand (`src/stores`):** Use for state that is shared globally across layouts and routes (e.g. logged-in user details, light/dark mode, active global loading spinners, transient notification queues).
* **React `useState`:** Use for local UI state that only one component cares about (e.g. is a dropdown open, is a accordion expanded, what is currently typed in a text box).

---

## 3. Where to Add Backend Integration (API Layer)

Although there is no database in the frontend, we prepare a clean layer to handle communicating with the backend. 

### A. Step 1: Add endpoints (`src/constants/api.ts`)
First, add your new REST API endpoint string to the `API_ENDPOINTS` object. This makes it easy to update URL paths in the future:
```typescript
export const API_ENDPOINTS = {
  USERS: {
    PROFILE: "/users/profile",
    UPDATE: "/users/update", // New Endpoint
  }
}
```

### B. Step 2: Write the Service Call (`src/services`)
Create or edit services under `src/services/` using the custom `apiClient` Axios wrapper. The service handles the HTTP call and returns standardized data:
```typescript
import { apiClient } from "../api/api-client";
import { API_ENDPOINTS } from "@/constants/api";

export const userService = {
  updateProfile: async (data: UpdateProfileInput) => {
    // This performs an HTTP PUT request to http://localhost:5000/api/v1/users/update
    return apiClient.put(API_ENDPOINTS.USERS.UPDATE, data);
  }
};
```

### C. Step 3: Trigger Server Sync using TanStack Query (`src/features`)
To bind the service to the UI, create a custom mutation or query hook inside the corresponding feature's `hooks/` folder. This handles loading/error states and triggers local UI actions on success:
```typescript
import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/users/user-service";
import { useNotify } from "@/stores/notification-store";

export function useUpdateProfileMutation() {
  const notify = useNotify();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => userService.updateProfile(data),
    onSuccess: () => {
      notify.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      notify.error(error.message || "Failed to update profile");
    }
  });
}
```

### D. Step 4: Import and Bind to the Component
Finally, import the hook in your component and call it when the user triggers an action (like submitting a form):
```tsx
import { useUpdateProfileMutation } from "../hooks/use-update-profile";

export function ProfileForm() {
  const { mutate, isPending } = useUpdateProfileMutation();

  const onSubmit = (formData) => {
    mutate(formData);
  };

  return (
    <form onSubmit={onSubmit}>
      {/* Input Fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
```

---

## 4. Key Security & Interceptor Features Already Configured

1. **Authorization Headers:**
   The `api-client.ts` interceptor automatically reads the logged-in user's JWT token from the Zustand `auth-store` and attaches it as `Authorization: Bearer <TOKEN>` to every outgoing request.
2. **Access Protection Middleware (`src/middleware.ts`):**
   Runs on Edge serverless functions. If an unauthenticated user tries to visit `/dashboard/*`, the middleware intercepts the request instantly and redirects them to `/login` to prevent data leak or UI flicker.
3. **Validation Guards (`src/schemas`):**
   Zod validates client-side input data before it's sent to the server. If an input is invalid, validation errors are shown immediately in the browser, reducing unnecessary server load.
