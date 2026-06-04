export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'instructor'
  | 'student'
  | 'builder'
  | 'client'
  | 'member';

export type ModuleName =
  | 'academy'
  | 'build_studio'
  | 'community'
  | 'admin_panel'
  | 'marketplace'
  | 'hiring'
  | 'ai_tools';

// ─────────────────────────────────────────
// ROLE → HOME ROUTE
// ─────────────────────────────────────────
export const ROLE_HOME: Record<UserRole, string> = {
  super_admin: '/admin',
  admin: '/admin',
  instructor: '/dashboard',
  student: '/dashboard',
  builder: '/dashboard',
  client: '/dashboard',
  member: '/dashboard',
};

// Alias — used in some components
export const getDashboardRoute = (role: UserRole): string =>
  ROLE_HOME[role] || '/dashboard';

// ─────────────────────────────────────────
// ROLE LABELS
// ─────────────────────────────────────────
export const ROLE_LABEL: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin OS',
  instructor: 'Instructor Portal',
  student: 'Student Portal',
  builder: 'Builder Workspace',
  client: 'Client Portal',
  member: 'Dashboard',
};

// ─────────────────────────────────────────
// NAVIGATION ITEMS PER ROLE
// ─────────────────────────────────────────
export const ROLE_NAV_ITEMS: Partial<
  Record<UserRole, { key: string; label: string; href: string; icon: string }[]>
> = {
  student: [
    { key: 'overview', label: 'Overview', href: '/dashboard', icon: 'Home' },
    { key: 'academy', label: 'Academy', href: '/academy', icon: 'BookOpen' },
    { key: 'payments', label: 'Payments', href: '/dashboard', icon: 'CreditCard' },
    { key: 'projects', label: 'Projects', href: '/dashboard', icon: 'FolderOpen' },
    { key: 'support', label: 'Support', href: '/dashboard', icon: 'AlertCircle' },
  ],
  client: [
    { key: 'overview', label: 'Overview', href: '/dashboard', icon: 'Home' },
    { key: 'builds', label: 'My Builds', href: '/dashboard', icon: 'Hammer' },
    { key: 'support', label: 'Support', href: '/dashboard', icon: 'AlertCircle' },
  ],
  builder: [
    { key: 'overview', label: 'Overview', href: '/dashboard', icon: 'Home' },
    { key: 'assigned', label: 'Assigned Work', href: '/dashboard', icon: 'Layers' },
    { key: 'builds', label: 'Builds', href: '/dashboard', icon: 'Hammer' },
    { key: 'support', label: 'Support', href: '/dashboard', icon: 'AlertCircle' },
  ],
  instructor: [
    { key: 'overview', label: 'Overview', href: '/dashboard', icon: 'Home' },
    { key: 'students', label: 'My Students', href: '/dashboard', icon: 'Users' },
    { key: 'assignments', label: 'Assignments', href: '/dashboard', icon: 'FileText' },
    { key: 'academy', label: 'Academy', href: '/academy', icon: 'BookOpen' },
  ],
  admin: [
    { key: 'overview', label: 'Overview', href: '/admin', icon: 'LayoutDashboard' },
    { key: 'payments', label: 'Payments', href: '/admin', icon: 'CreditCard' },
    { key: 'students', label: 'Students', href: '/admin', icon: 'Users' },
    { key: 'builds', label: 'Builds', href: '/admin', icon: 'Package' },
    { key: 'announcements', label: 'Announcements', href: '/admin', icon: 'Bell' },
  ],
  super_admin: [
    { key: 'overview', label: 'Overview', href: '/admin', icon: 'LayoutDashboard' },
    { key: 'users', label: 'All Users', href: '/admin', icon: 'Users' },
    { key: 'roles', label: 'Role Management', href: '/admin', icon: 'Shield' },
    { key: 'analytics', label: 'Analytics', href: '/admin', icon: 'BarChart2' },
    { key: 'platform', label: 'Platform Settings', href: '/admin', icon: 'Settings' },
  ],
};

// ─────────────────────────────────────────
// MODULE → ROUTE MAP
// ─────────────────────────────────────────
export const MODULE_ROUTES: Record<ModuleName, string[]> = {
  academy: ['/academy', '/dashboard/projects', '/dashboard/assignments'],
  build_studio: ['/build', '/dashboard/builds', '/dashboard/assigned'],
  community: ['/community'],
  admin_panel: ['/admin'],
  marketplace: ['/marketplace'],
  hiring: ['/hiring'],
  ai_tools: ['/dashboard/ai'],
};

// ─────────────────────────────────────────
// PERMISSION FUNCTIONS
// ─────────────────────────────────────────

/** Check if user has any of the required roles. Admin always passes. */
export function hasAnyRole(
  userRoles: UserRole[],
  required: UserRole[],
): boolean {
  if (
    userRoles.includes('super_admin') ||
    userRoles.includes('admin')
  )
    return true;
  return required.some((r) => userRoles.includes(r));
}

/** Alias for backwards compatibility */
export const hasRole = hasAnyRole;

/** Check if user has access to a specific module. Admin always passes. */
export function hasModuleAccess(
  userModules: ModuleName[],
  required: ModuleName,
  userRoles: UserRole[] = [],
): boolean {
  if (
    userRoles.includes('admin') ||
    userRoles.includes('super_admin')
  )
    return true;
  return userModules.includes(required);
}

/** Alias for backwards compatibility */
export const hasModule = (
  userModules: ModuleName[],
  required: ModuleName,
): boolean => userModules.includes(required);

/** Check if a user can access a given route based on roles + modules. */
export function canAccessRoute(
  userRoles: UserRole[],
  userModules: ModuleName[],
  route: string,
): boolean {
  if (
    userRoles.includes('admin') ||
    userRoles.includes('super_admin')
  )
    return true;

  for (const [module, routes] of Object.entries(MODULE_ROUTES)) {
    if (routes.some((r) => route.startsWith(r))) {
      return userModules.includes(module as ModuleName);
    }
  }

  return true; // default allow for unlisted routes
}