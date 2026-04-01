import { cn } from '@/lib/utils'

interface SchoolLogoProps {
  name: string
  primaryColor: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZES = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
}

export function SchoolLogo({ name, primaryColor, size = 'md', className }: SchoolLogoProps) {
  const initials = name
    .split(' ')
    .filter((w) => w[0] === w[0]?.toUpperCase() && w.length > 2)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold text-white shrink-0',
        SIZES[size],
        className
      )}
      style={{ backgroundColor: primaryColor }}
    >
      {initials}
    </div>
  )
}
