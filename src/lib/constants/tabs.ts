import {
  LayoutDashboard,
  Trophy,
  Scale,
  Heart,
  Eye,
  Bell,
  LucideIcon,
} from 'lucide-react'

export interface TabDef {
  label: string
  href: string
  icon: LucideIcon
}

export const TABS: TabDef[] = [
  { label: 'Overview', href: '/overview', icon: LayoutDashboard },
  { label: 'Rankings', href: '/rankings', icon: Trophy },
  { label: 'Title IX/EADA', href: '/title-ix', icon: Scale },
  { label: 'Donor Tracker', href: '/donors', icon: Heart },
  { label: 'Reputation Watch', href: '/reputation', icon: Eye },
  { label: 'Alerts', href: '/alerts', icon: Bell },
]
