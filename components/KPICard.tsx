import { LucideIcon } from 'lucide-react'

interface Props {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  color?: string
}

export default function KPICard({ title, value, subtitle, icon: Icon, color = '#C9A84C' }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="mt-1.5 text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
        </div>
        <div className="p-2.5 rounded-lg" style={{ backgroundColor: color + '20' }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </div>
  )
}
