'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RoleGuard } from '@/components/shared/role-guard'
import { SEED_ALERT_THRESHOLDS } from '@/lib/seed-data/alerts'
import { AlertThreshold } from '@/types/database'
import { Settings2 } from 'lucide-react'

const OPERATOR_LABELS: Record<string, string> = {
  gt: '> (greater than)',
  lt: '< (less than)',
  gte: '>= (greater or equal)',
  lte: '<= (less or equal)',
  eq: '= (equal to)',
}

export function AlertThresholdConfig() {
  const [thresholds, setThresholds] = useState<AlertThreshold[]>(SEED_ALERT_THRESHOLDS)

  function updateThreshold(id: string, updates: Partial<AlertThreshold>) {
    setThresholds((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    )
  }

  function handleSave() {
    console.log('Saving alert thresholds:', thresholds)
  }

  return (
    <RoleGuard allowedRoles={['admin']}>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings2 className="h-3.5 w-3.5 mr-1" />
            Configure Thresholds
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Alert Thresholds</DialogTitle>
            <DialogDescription>
              Configure when alerts should be triggered based on metric thresholds.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto py-2">
            {thresholds.map((threshold) => (
              <div
                key={threshold.id}
                className="rounded-lg border p-3 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    {threshold.metric}
                  </Label>
                  <Switch
                    checked={threshold.is_active}
                    onCheckedChange={(checked: boolean) =>
                      updateThreshold(threshold.id, { is_active: checked })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Operator</Label>
                    <Select
                      value={threshold.operator}
                      onValueChange={(val: string) =>
                        updateThreshold(threshold.id, { operator: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(OPERATOR_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Value</Label>
                    <Input
                      type="number"
                      value={threshold.threshold_value}
                      onChange={(e) =>
                        updateThreshold(threshold.id, {
                          threshold_value: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">
                    Email notifications
                  </Label>
                  <Switch
                    checked={threshold.notify_email}
                    onCheckedChange={(checked: boolean) =>
                      updateThreshold(threshold.id, { notify_email: checked })
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button onClick={handleSave} size="sm">
              Save Thresholds
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RoleGuard>
  )
}
