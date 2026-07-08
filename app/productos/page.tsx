'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { formatARS, formatNumber, COLORS } from '@/lib/utils'
import { Package2, Tag, TrendingUp, Percent } from 'lucide-react'
import KPICard from '@/components/KPICard'

interface Producto {
  nombre_producto: string
  categoria_principal: string
  marca: string
  ingresos: number
  unidades: number
  transacciones: number
  precio_prom: number
}

interface Marca {
  marca: string
  ingresos: number
  unidades: number
  transacciones: number
}

interface ProductosData {
  kpis: { total_skus: number; total_marcas: number; precio_prom_global: number; descuento_prom_pct: number }
  top20_productos: Producto[]
  top10_marcas: Marca[]
  marcas_por_categoria: { marca: string; ingresos: number; categoria: string }[][]
}

export default function ProductosPage() {
  const [data, setData] = useState<ProductosData | null>(null)
  const [vista, setVista] = useState<'ingresos' | 'unidades'>('ingresos')

  useEffect(() => {
    fetch('/data/productos.json').then(r => r.json()).then(setData)
  }, [])

  if (!data) return <div className="p-8 text-gray-400">Cargando…</div>

  const top10 = [...data.top20_productos]
    .sort((a, b) => vista === 'ingresos' ? b.ingresos - a.ingresos : b.unidades - a.unidades)
    .slice(0, 10)
    .map(p => ({
      ...p,
      nombre_corto: p.nombre_producto.length > 38 ? p.nombre_producto.slice(0, 38) + '…' : p.nombre_producto,
    }))

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Productos & Marcas</h1>
        <p className="text-sm text-gray-500 mt-1">Top SKUs, marcas líderes y análisis por categoría · 2023–2025</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <KPICard title="SKUs activos" value={formatNumber(data.kpis.total_skus)} icon={Package2} />
        <KPICard title="Marcas" value={formatNumber(data.kpis.total_marcas)} icon={Tag} color="#2E6DA4" />
        <KPICard title="Precio promedio" value={formatARS(data.kpis.precio_prom_global)} icon={TrendingUp} color="#10B981" />
        <KPICard title="Descuento promedio" value={`${data.kpis.descuento_prom_pct}%`} icon={Percent} color="#F59E0B" />
      </div>

      {/* Top productos */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Top 10 Productos</h2>
          <div className="flex gap-1">
            {(['ingresos', 'unidades'] as const).map(v => (
              <button
                key={v}
                onClick={() => setVista(v)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                  vista === v ? 'bg-[#1B3A5C] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {v === 'ingresos' ? 'Por Ingreso' : 'Por Unidades'}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={top10} layout="vertical" barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => vista === 'ingresos' ? formatARS(Number(v)) : formatNumber(Number(v))} />
            <YAxis type="category" dataKey="nombre_corto" tick={{ fontSize: 9 }} width={200} />
            <Tooltip formatter={(v) => vista === 'ingresos' ? formatARS(Number(v)) : formatNumber(Number(v))} />
            <Bar dataKey={vista} radius={[0, 4, 4, 0]}>
              {top10.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Top 10 marcas */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Top 10 Marcas por Ingreso</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.top10_marcas} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => formatARS(Number(v))} />
              <YAxis type="category" dataKey="marca" tick={{ fontSize: 10 }} width={110} />
              <Tooltip formatter={(v) => formatARS(Number(v))} />
              <Bar dataKey="ingresos" radius={[0, 4, 4, 0]}>
                {data.top10_marcas.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabla top 20 */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Ranking Completo — Top 20 SKUs</h2>
          <div className="overflow-y-auto" style={{ maxHeight: 280 }}>
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-white">
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-2 font-medium">#</th>
                  <th className="pb-2 font-medium">Producto</th>
                  <th className="pb-2 font-medium text-right">Ingresos</th>
                  <th className="pb-2 font-medium text-right">Un.</th>
                </tr>
              </thead>
              <tbody>
                {data.top20_productos.map((p, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-1.5 text-gray-400 pr-2">{i + 1}</td>
                    <td className="py-1.5 pr-2">
                      <p className="text-gray-800 font-medium leading-tight truncate max-w-[160px]">{p.nombre_producto}</p>
                      <p className="text-gray-400">{p.marca}</p>
                    </td>
                    <td className="py-1.5 text-right font-medium text-gray-800">{formatARS(p.ingresos)}</td>
                    <td className="py-1.5 text-right text-gray-500">{p.unidades}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
