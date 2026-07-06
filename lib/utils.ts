export function formatARS(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toFixed(0)}`
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toLocaleString('es-AR')
}

export const COLORS = [
  '#1B3A5C', '#C9A84C', '#2E6DA4', '#E8A838', '#3B82F6',
  '#F59E0B', '#6366F1', '#10B981', '#EF4444', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#84CC16',
]

export const RIESGO_COLOR: Record<string, string> = {
  Crítico: '#EF4444',
  Bajo: '#F59E0B',
  OK: '#10B981',
}
