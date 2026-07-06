'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts'
import { formatARS, formatNumber, COLORS } from '@/lib/utils'
import type { Sucursal } from '@/lib/types'

export default function SucursalesPage() {
  const [data, setData] = useState<Sucursal[]>([])
  useEffect(() => { fetch('/data/sucursales.json').then(r => r.json()).then(setData) }, [])

  const fisicas = data.filter(s => s.canal === 'Físico')
  const eco = data.find(s => s.canal === 'E-commerce')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Performance por Sucursal</h1>
        <p className="text-sm text-gray-500 mt-1">Comparativa de ingresos, unidades y ticket promedio · 2023–2025</p>
      </div>

      {eco && (
        <div className="mb-6 bg-gradient-to-r from-[#1B3A5C] to-[#2E6DA4] rounded-xl p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">Canal E-commerce</p>
          <div className="grid grid-cols-3 gap-6">
            <div><p className="text-2xl font-bold">{formatARS(eco.ingresos)}</p><p className="text-xs text-white/60 mt-0.5">Ingresos totales</p></div>
            <div><p className="text-2xl font-bold">{formatNumber(eco.unidades)}</p><p className="text-xs text-white/60 mt-0.5">Unidades vendidas</p></div>
            <div><p className="text-2xl font-bold">{formatARS(eco.ticket_prom)}</p><p className="text-xs text-white/60 mt-0.5">Ticket promedio</p></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Ingresos Netos por Sucursal Física</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fisicas} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => formatARS(v)} />
              <YAxis type="category" dataKey="nombre_sucursal" tick={{ fontSize: 10 }} width={110} />
              <Tooltip formatter={(v: number) => formatARS(v)} />
              <Bar dataKey="ingresos" radius={[0,4,4,0]} name="Ingresos">
                {fisicas.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Ticket Promedio por Sucursal (ARS)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[...fisicas].sort((a,b)=>b.ticket_prom-a.ticket_prom)} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => formatARS(v)} />
              <YAxis type="category" dataKey="nombre_sucursal" tick={{ fontSize: 10 }} width={110} />
              <Tooltip formatter={(v: number) => formatARS(v)} />
              <Bar dataKey="ticket_prom" fill="#C9A84C" radius={[0,4,4,0]} name="Ticket Promedio" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Tabla Resumen de Sucursales</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Sucursal','Zona','Formato','Canal','Ingresos','Unidades','Ticket Prom.'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((s,i) => (
                <tr key={s.id_sucursal} className={`border-b border-gray-50 ${i%2===0?'bg-white':'bg-gray-50/50'}`}>
                  <td className="py-2.5 px-3 font-medium text-gray-900">{s.nombre_sucursal}</td>
                  <td className="py-2.5 px-3 text-gray-600">{s.zona}</td>
                  <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">{s.formato}</span></td>
                  <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded-full text-xs ${s.canal==='E-commerce'?'bg-blue-100 text-blue-700':'bg-green-100 text-green-700'}`}>{s.canal}</span></td>
                  <td className="py-2.5 px-3 font-semibold text-gray-900">{formatARS(s.ingresos)}</td>
                  <td className="py-2.5 px-3 text-gray-700">{formatNumber(s.unidades)}</td>
                  <td className="py-2.5 px-3 text-gray-700">{formatARS(s.ticket_prom)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
