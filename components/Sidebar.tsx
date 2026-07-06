'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Store, Tag, Package, Wifi, FlaskConical
} from 'lucide-react'

const NAV = [
  { href: '/',            label: 'Resumen',      icon: LayoutDashboard },
  { href: '/sucursales',  label: 'Sucursales',   icon: Store },
  { href: '/categorias',  label: 'Categorías',   icon: Tag },
  { href: '/inventario',  label: 'Inventario',   icon: Package },
  { href: '/canales',     label: 'Canales',      icon: Wifi },
]

export default function Sidebar() {
  const path = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-[#0f1e30] text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <FlaskConical className="text-[#C9A84C]" size={22} />
          <span className="font-bold text-lg tracking-tight">Farmacias RP</span>
        </div>
        <p className="text-xs text-white/40">Sales Analytics Dashboard</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? 'bg-[#C9A84C] text-[#0f1e30] font-semibold'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-xs text-white/30 leading-relaxed">
          Demo interactiva · Datos simulados<br />
          sobre catálogo real de 1.479 SKUs
        </p>
        <p className="text-xs text-white/20 mt-2">
          © 2026 Germán Cárdenas
        </p>
      </div>
    </aside>
  )
}
