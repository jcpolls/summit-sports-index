'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useDemoMode } from '@/lib/providers/demo-mode-provider'

type RealtimeCallback = (payload: { new: Record<string, unknown> }) => void

interface UseRealtimeOptions {
  table: string
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  onData: RealtimeCallback
  enabled?: boolean
}

export function useRealtime({ table, event = 'INSERT', onData, enabled = true }: UseRealtimeOptions) {
  useEffect(() => {
    if (!enabled) return

    const supabase = createClient()
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes' as never,
        { event, schema: 'public', table },
        (payload: { new: Record<string, unknown> }) => {
          onData(payload)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, event, enabled, onData])
}

export function useDemoSimulator() {
  const { demoMode } = useDemoMode()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (demoMode) {
      intervalRef.current = setInterval(async () => {
        try {
          await fetch('/api/seed', { method: 'POST' })
        } catch {
          // Silently fail
        }
      }, 15000) // Every 15 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [demoMode])
}
