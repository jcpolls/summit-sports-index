import { Role } from '@/types/database'

export const ROLES: Role[] = ['admin', 'donor', 'researcher']

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  donor: 'Donor',
  researcher: 'Researcher',
}

export const ROLE_COLORS: Record<Role, string> = {
  admin: 'bg-blue-100 text-blue-800',
  donor: 'bg-green-100 text-green-800',
  researcher: 'bg-purple-100 text-purple-800',
}

export interface PermissionMap {
  canViewChronicleComplaints: boolean
  canViewDonorNames: boolean
  canViewDonorEmails: boolean
  canConfigureAlertThresholds: boolean
}

export const ROLE_PERMISSIONS: Record<Role, PermissionMap> = {
  admin: {
    canViewChronicleComplaints: true,
    canViewDonorNames: true,
    canViewDonorEmails: true,
    canConfigureAlertThresholds: true,
  },
  donor: {
    canViewChronicleComplaints: false,
    canViewDonorNames: true,
    canViewDonorEmails: true,
    canConfigureAlertThresholds: false,
  },
  researcher: {
    canViewChronicleComplaints: true,
    canViewDonorNames: false,
    canViewDonorEmails: false,
    canConfigureAlertThresholds: false,
  },
}
