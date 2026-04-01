'use client'

import { useState } from 'react'
import { Trash2, Bell, BellOff, ChevronDown, Check, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SCHOOLS } from '@/lib/constants/schools'
import type { CoachEventType } from '@/types/database'

const SPORTS = [
  'Football',
  "Men's Basketball",
  "Women's Basketball",
  'Baseball',
  'Softball',
  'Soccer',
  'All Sports',
]

const EVENT_TYPE_OPTIONS: { value: CoachEventType; label: string }[] = [
  { value: 'hire', label: 'Hire' },
  { value: 'departure', label: 'Departure' },
  { value: 'extension', label: 'Contract Extension' },
]

interface AlertSubscription {
  id: string
  schools: string[]
  sports: string[]
  event_types: CoachEventType[]
  email: string
  active: boolean
}

// Seed some existing alerts
const INITIAL_ALERTS: AlertSubscription[] = [
  {
    id: 'sub-01',
    schools: ['michigan', 'alabama'],
    sports: ['Football'],
    event_types: ['hire', 'departure', 'extension'],
    email: 'admin@summitsports.io',
    active: true,
  },
  {
    id: 'sub-02',
    schools: ['oregon', 'duke', 'kansas'],
    sports: ["Men's Basketball", "Women's Basketball"],
    event_types: ['hire', 'departure'],
    email: 'scout@summitsports.io',
    active: true,
  },
]

function MultiSelectPills({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string
  options: string[]
  selected: string[]
  onToggle: (v: string) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1 w-full justify-between">
          <span className="truncate">
            {selected.length === 0
              ? label
              : selected.length === 1
              ? selected[0]
              : `${selected.length} selected`}
          </span>
          <ChevronDown className="h-3 w-3 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => onToggle(opt)}
            className="flex items-center gap-2"
          >
            <div
              className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors ${
                selected.includes(opt) ? 'border-foreground bg-foreground' : 'border-muted-foreground'
              }`}
            >
              {selected.includes(opt) && <Check className="h-2.5 w-2.5 text-background" />}
            </div>
            <span className="text-xs">{opt}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AlertSetup() {
  const [alerts, setAlerts] = useState<AlertSubscription[]>(INITIAL_ALERTS)

  // Form state
  const [formSchools, setFormSchools] = useState<string[]>([])
  const [formSports, setFormSports] = useState<string[]>([])
  const [formEventTypes, setFormEventTypes] = useState<CoachEventType[]>([])
  const [formEmail, setFormEmail] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState(false)

  function toggleItem<T extends string>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]
  }

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  function handleSubmit() {
    const errs: string[] = []
    if (formSchools.length === 0) errs.push('Select at least one school.')
    if (formEventTypes.length === 0) errs.push('Select at least one event type.')
    if (!formEmail) errs.push('Email is required.')
    else if (!isValidEmail(formEmail)) errs.push('Enter a valid email address.')
    setErrors(errs)
    if (errs.length) return

    const newAlert: AlertSubscription = {
      id: `sub-${Date.now()}`,
      schools: formSchools,
      sports: formSports.length ? formSports : ['All Sports'],
      event_types: formEventTypes,
      email: formEmail,
      active: true,
    }
    setAlerts((prev) => [newAlert, ...prev])
    setFormSchools([])
    setFormSports([])
    setFormEventTypes([])
    setFormEmail('')
    setErrors([])
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  function toggleActive(id: string) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)))
  }

  function deleteAlert(id: string) {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  const schoolOptions = SCHOOLS.map((s) => s.shortName)
  const schoolSlugForName = (name: string) => SCHOOLS.find((s) => s.shortName === name)?.slug ?? name
  const schoolNameForSlug = (slug: string) => SCHOOLS.find((s) => s.slug === slug)?.shortName ?? slug
  const schoolColorForSlug = (slug: string) => SCHOOLS.find((s) => s.slug === slug)?.primaryColor ?? '#6b7280'

  return (
    <div className="space-y-6">
      {/* Create Alert Form */}
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-blue-500" />
          <h3 className="font-semibold text-sm">Create Alert</h3>
        </div>

        {/* Schools */}
        <div className="space-y-1.5">
          <Label className="text-xs">Schools</Label>
          <MultiSelectPills
            label="Select schools..."
            options={schoolOptions}
            selected={formSchools.map(schoolNameForSlug)}
            onToggle={(name) => {
              const slug = schoolSlugForName(name)
              setFormSchools((prev) => toggleItem(prev, slug))
            }}
          />
          {formSchools.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {formSchools.map((slug) => (
                <Badge
                  key={slug}
                  variant="secondary"
                  className="text-[10px] h-4 px-1.5 gap-0.5 cursor-pointer"
                  onClick={() => setFormSchools((p) => p.filter((s) => s !== slug))}
                >
                  {schoolNameForSlug(slug)} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Sports */}
        <div className="space-y-1.5">
          <Label className="text-xs">Sports</Label>
          <MultiSelectPills
            label="Select sports..."
            options={SPORTS}
            selected={formSports}
            onToggle={(s) => setFormSports((prev) => toggleItem(prev, s))}
          />
          {formSports.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {formSports.map((s) => (
                <Badge
                  key={s}
                  variant="secondary"
                  className="text-[10px] h-4 px-1.5 gap-0.5 cursor-pointer"
                  onClick={() => setFormSports((p) => p.filter((x) => x !== s))}
                >
                  {s} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Event types */}
        <div className="space-y-1.5">
          <Label className="text-xs">Event Types</Label>
          <div className="flex gap-2 flex-wrap">
            {EVENT_TYPE_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFormEventTypes((prev) => toggleItem(prev, value))}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
                  formEventTypes.includes(value)
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-muted-foreground border-muted-foreground/30 hover:border-foreground/50'
                }`}
              >
                {formEventTypes.includes(value) && <Check className="h-3 w-3" />}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label className="text-xs" htmlFor="alert-email">Email</Label>
          <Input
            id="alert-email"
            type="email"
            placeholder="you@example.com"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            className="h-8 text-xs"
          />
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <ul className="text-xs text-red-600 space-y-0.5">
            {errors.map((e, i) => <li key={i}>• {e}</li>)}
          </ul>
        )}

        {/* Success */}
        {success && (
          <p className="text-xs text-green-600 font-medium">Alert created successfully.</p>
        )}

        <Button size="sm" className="w-full gap-1.5" onClick={handleSubmit}>
          <Plus className="h-3.5 w-3.5" />
          Create Alert
        </Button>
      </div>

      {/* My Alerts list */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">My Alerts ({alerts.length})</h3>
        {alerts.length === 0 ? (
          <p className="text-xs text-muted-foreground">No alerts configured.</p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-xl border p-4 space-y-3 transition-opacity ${
                alert.active ? '' : 'opacity-60'
              }`}
            >
              {/* School badges */}
              <div className="flex flex-wrap gap-1">
                {alert.schools.map((slug) => (
                  <Badge
                    key={slug}
                    variant="outline"
                    className="text-[10px] h-5 px-1.5 gap-1"
                    style={{ borderColor: schoolColorForSlug(slug), color: schoolColorForSlug(slug) }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: schoolColorForSlug(slug) }}
                    />
                    {schoolNameForSlug(slug)}
                  </Badge>
                ))}
              </div>

              {/* Sport tags */}
              <div className="flex flex-wrap gap-1">
                {alert.sports.map((s) => (
                  <Badge key={s} variant="secondary" className="text-[10px] h-4 px-1.5">
                    {s}
                  </Badge>
                ))}
              </div>

              {/* Event type tags */}
              <div className="flex flex-wrap gap-1">
                {alert.event_types.map((et) => (
                  <Badge
                    key={et}
                    variant="outline"
                    className="text-[10px] h-4 px-1.5 capitalize"
                  >
                    {et}
                  </Badge>
                ))}
              </div>

              {/* Email */}
              <p className="text-[11px] text-muted-foreground">{alert.email}</p>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Switch
                    checked={alert.active}
                    onCheckedChange={() => toggleActive(alert.id)}
                    className="h-4 w-7"
                  />
                  <span className="text-xs text-muted-foreground">
                    {alert.active ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <Bell className="h-3 w-3" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <BellOff className="h-3 w-3" /> Paused
                      </span>
                    )}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-red-500"
                  onClick={() => deleteAlert(alert.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
