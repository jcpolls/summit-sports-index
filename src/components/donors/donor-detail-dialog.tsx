'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { Donor, DonorTier } from '@/types/database'
import { SEED_DONATIONS } from '@/components/donors/donation-history-chart'

const TIER_STYLES: Record<DonorTier, string> = {
  platinum: 'bg-slate-200 text-slate-800',
  gold: 'bg-yellow-100 text-yellow-800',
  silver: 'bg-gray-100 text-gray-700',
  bronze: 'bg-orange-100 text-orange-800',
}

interface DonorDetailDialogProps {
  donor: Donor
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DonorDetailDialog({ donor, open, onOpenChange }: DonorDetailDialogProps) {
  const donations = SEED_DONATIONS.filter((d) => d.donor_id === donor.id).sort(
    (a, b) => new Date(b.gift_date).getTime() - new Date(a.gift_date).getTime()
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {donor.first_name} {donor.last_name}
          </DialogTitle>
          <DialogDescription>{donor.affiliation}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{donor.email ?? 'N/A'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tier</p>
              <Badge variant="outline" className={TIER_STYLES[donor.donor_tier]}>
                {donor.donor_tier.charAt(0).toUpperCase() + donor.donor_tier.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Lifetime Total</p>
              <p className="font-bold">{formatCurrency(donor.lifetime_total)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Board Member</p>
              <p className="font-medium">{donor.is_board_member ? 'Yes' : 'No'}</p>
            </div>
          </div>

          {donations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Donation History</h4>
              <div className="max-h-48 space-y-1 overflow-y-auto">
                {donations.map((don) => (
                  <div
                    key={don.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                  >
                    <div>
                      <span className="font-medium">{formatCurrency(don.amount)}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {don.designation}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(don.gift_date)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
