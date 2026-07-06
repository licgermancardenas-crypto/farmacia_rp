'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts'
import { formatARS, formatNumber, COLORS } from '@/lib/utils'
import type { Categoria } from '@/lib/types'

interface AñoCat { año: number; categoria_principal: string; ingresos: number }

export default function CategoriasPage() {
  const [cats, setCats] = useState<Categoria[]>([])
  const [añoCat, setAñoCat] = useState<AñoCat[]>([])

  useEffect(() => {
    fetch('/data/categorias.json').then(r => r.json()).then(setCats)
    fetch('/data/año_categoria.json').then(r => r.json()).then(setAñoCat)
  }, [])

  const topCats = cats.slice(0, 6).map(c => c.categoria_principal)
  const años = [2023, 2024, 2025]
  const evolucion = años.map(año => {
    const row: Record<string, number | string> = { año }
    topCats.forEach(cat => {
      const found = añoCat.find(d => d.año === año && d.categoria_principal === cat)
      row[cat] = found?.ingresos ?? 0
    })
    return row
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Análisis por Categoría</h1>
        <p className="text-sm text-gray-500 mt-1">14 categorías · 78 subcategorías · Todos los canales</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {cats.slice(0,4).map((c,i) => (
          <div key={c.categoria_principal} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="w-3 h-3 rounded-full mb-2" style={{ background: COLORS[i] }} />
            <p className="text-xs text-gray-500 font-medium">{c.categoria_principal}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{formatARS(c.ingresos)}</p>
            <p className="text-xs text-gray-400 mt-0.5">Ticket prom. {formatARS(c.ticket_prom)}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Ingresos Totales por Categoría</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={cats} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => formatARS(v)} />
              <YAxis type="category" dataKey="categoria_principal" tick={{ fontSize: 10 }} width={130} />
              <Tooltip formatter={(v) => formatARS(Number(v))} />
              <Bar dataKey="ingresos" radius={[0,4,4,0]} name="Ingresos">
                {cats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Ticket Promedio por Categoría</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={[...cats].sort((a,b)=>b.ticket_prom-a.ticket_prom)} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => formatARS(v)} />
              <YAxis type="category" dataKey="categoria_principal" tick={{ fontSize: 10 }} width={130} />
              <Tooltip formatter={(v) => formatARS(Number(v))} />
              <Bar dataKey="ticket_prom" fill="#C9A84C" radius={[0,4,4,0]} name="Ticket Promedio" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Evolución Interanual — Top 6 Categorías</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={evolucion}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="año" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => formatARS(v)} />
            <Tooltip formatter={(v) => formatARS(Number(v))} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {topCats.map((cat, i) => (
              <Line key={cat} type="monotone" dataKey={cat} stroke={COLORS[i]}
                strokeWidth={2} dot={{ r: 4 }} name={cat} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
