'use client'

import { useDemoMode } from '@/lib/providers/demo-mode-provider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export function DemoModeToggle() {
  const { demoMode, setDemoMode } = useDemoMode()

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="demo-mode"
        checked={demoMode}
        onCheckedChange={setDemoMode}
      />
      <Label htmlFor="demo-mode" className="text-xs font-medium cursor-pointer">
        Demo Mode
      </Label>
    </div>
  )
}
