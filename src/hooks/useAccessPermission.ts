import { useState, useEffect } from 'react';
import { UserRole, MenuId, AccessLevel } from '../types';
import { 
  canEditMenu, 
  getSavedAuthSession, 
  canManageSettings, 
  canManageUsers, 
  canExportPdf, 
  checkMenuAccessLevel 
} from '../services/authService';

export interface AccessPermissionResult {
  role: UserRole;
  accessLevel: AccessLevel;
  canEdit: boolean;
  isReadOnly: boolean;
  canManage: boolean;
  canExport: boolean;
}

export function useAccessPermission(
  menuId?: MenuId | string, 
  explicitRole?: UserRole, 
  explicitCanEdit?: boolean
): AccessPermissionResult {
  const [role, setRole] = useState<UserRole>(() => {
    if (explicitRole) return explicitRole;
    const session = getSavedAuthSession();
    return session?.role || 'santri';
  });

  useEffect(() => {
    if (explicitRole) {
      setRole(explicitRole);
    } else {
      const session = getSavedAuthSession();
      if (session?.role) {
        setRole(session.role);
      }
    }
  }, [explicitRole]);

  // If explicitCanEdit is provided, prioritize it
  if (explicitCanEdit !== undefined) {
    const accessLevel: AccessLevel = explicitCanEdit ? 'read_write' : 'read';
    return {
      role,
      accessLevel,
      canEdit: explicitCanEdit,
      isReadOnly: !explicitCanEdit,
      canManage: role === 'admin' || canManageSettings(role),
      canExport: canExportPdf(role),
    };
  }

  // Calculate based on role and menuId
  const accessLevel = menuId ? checkMenuAccessLevel(role, menuId) : 'read_write';
  const canEdit = role === 'admin' || (menuId ? accessLevel === 'read_write' : true);
  const isReadOnly = !canEdit;
  const canManage = role === 'admin' || canManageSettings(role);
  const canExport = canExportPdf(role);

  return {
    role,
    accessLevel,
    canEdit,
    isReadOnly,
    canManage,
    canExport,
  };
}
