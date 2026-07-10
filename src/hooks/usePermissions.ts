import type { User } from "@/store";

export const usePermissions = () => {
  const allowedRoles = new Set(["ADMIN", "MANAGER"]);

  const _hasPermission = (user: User | null) => {
    if (!user) {
      return false;
    }
    return allowedRoles.has(user.role);
  };
  return {
    isAllowed: _hasPermission,
  };
};
