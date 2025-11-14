'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { CircleFadingPlus, Compass, House, LucideIcon, Settings, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'

type Item = {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

const TOP_ITEMS: Item[] = [
  { href: '/', label: 'Home', icon: House, exact: true },
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/create', label: 'Create', icon: CircleFadingPlus },
  { href: '/profile', label: 'Profile', icon: UserRound },
]

const BOTTOM_ITEMS: Item[] = [
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function AppSideBar() {
  const pathname = usePathname()

  const isActive = (item: Item) => {
    if (item.exact) return pathname === item.href
    return pathname === item.href || pathname.startsWith(item.href + '/')
  }

  return (
    <aside className="h-screen w-24 bg-zinc-100 border-r border-r-zinc-200 py-6 flex flex-col items-center justify-between fixed top-0 left-0">
      {/* logo */}
      <div className="flex flex-col items-center gap-y-5">
        <Link href="/" className="side-bar-item" aria-label="ClairFix home" title="ClairFix">
          <div className="w-7 h-7 relative">
            <Image src="/img/logo.png" alt="ClairFix" fill priority />
          </div>
        </Link>

        {/* top items */}
        {TOP_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn('side-bar-item group', !active && 'hover:bg-white/70')}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
              title={item.label}
            >
              <Icon
                size={25}
                className={cn(
                  'transition-all',
                  active
                    ? 'text-red-500 scale-110' // icon đỏ khi active
                    : 'text-zinc-700 group-hover:text-red-400 group-hover:scale-105'
                )}
              />
            </Link>
          )
        })}
      </div>

      {/* bottom items */}
      <div className="flex flex-col items-center gap-y-5">
        {BOTTOM_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn('side-bar-item group', !active && 'hover:bg-white/70')}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
              title={item.label}
            >
              <Icon
                size={25}
                className={cn(
                  'transition-all',
                  active
                    ? 'text-red-500 scale-110'
                    : 'text-zinc-700 group-hover:text-red-400 group-hover:scale-105'
                )}
              />
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
