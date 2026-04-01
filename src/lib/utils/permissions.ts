import { Role, ReputationEvent, Donor } from '@/types/database'
import { ROLE_PERMISSIONS } from '@/lib/constants/roles'

export function filterReputationEvents(events: ReputationEvent[], role: Role): ReputationEvent[] {
  const perms = ROLE_PERMISSIONS[role]
  if (!perms.canViewChronicleComplaints) {
    return events.filter(e => e.event_type !== 'chronicle-complaint')
  }
  return events
}

export function anonymizeDonor(donor: Donor, role: Role): Donor {
  const perms = ROLE_PERMISSIONS[role]
  if (!perms.canViewDonorNames) {
    return {
      ...donor,
      first_name: 'Anonymous',
      last_name: 'Donor',
      email: null,
    }
  }
  if (!perms.canViewDonorEmails) {
    return { ...donor, email: null }
  }
  return donor
}
