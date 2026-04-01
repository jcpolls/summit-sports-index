'use client'

import { createContext, useContext } from 'react'

// ─── Role ─────────────────────────────────────────────────────────────────────
export type Role = 'admin' | 'donor' | 'researcher'

export interface RoleContextValue {
  role: Role
  setRole: (r: Role) => void
}

export const RoleContext = createContext<RoleContextValue>({
  role: 'admin',
  setRole: () => {},
})

export function useRole() {
  return useContext(RoleContext)
}

// ─── Selected School ──────────────────────────────────────────────────────────
export interface SchoolContextValue {
  selectedSchool: string
  setSelectedSchool: (slug: string) => void
}

export const SchoolContext = createContext<SchoolContextValue>({
  selectedSchool: 'michigan',
  setSelectedSchool: () => {},
})

export function useSelectedSchool() {
  return useContext(SchoolContext)
}

// Alias for backward compat with old useSchoolFilter hook
export function useSchoolFilter() {
  const { selectedSchool, setSelectedSchool } = useSelectedSchool()
  return { selectedSchool, setSelectedSchool }
}

// ─── Demo Mode ────────────────────────────────────────────────────────────────
export interface DemoModeContextValue {
  demoMode: boolean
  setDemoMode: (v: boolean) => void
}

export const DemoModeContext = createContext<DemoModeContextValue>({
  demoMode: true,
  setDemoMode: () => {},
})

export function useDemoMode() {
  return useContext(DemoModeContext)
}
