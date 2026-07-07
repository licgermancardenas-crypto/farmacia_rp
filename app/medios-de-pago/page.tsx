'use client'
import { useEffect, useState } from 'react'
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { formatARS, formatNumber } from '@/lib/utils'
import type { MediosPago, MixGlobal } from '@/lib/types'

const COLORS: Record<string, string> = {
  'Tarjeta Crédito': '#1B3A5C',
  'Tarjeta Débito':  '#2E6DA4',
  'MercadoPago':     '#C9A84C',
  'Obra Social':     '#10B981',
  'Efectivo':        '#94A3B8',
}

const MEDIOS = ['Tarjeta Crédito', 'Tarjeta Débito', 'MercadoPago', 'Obra Social', 'Efectivo']

export default function MediosDePagoPage() {
  const [data, setData] = useState<MediosPago | null>(null)

  useEffect(() => {
    fetch('/data/medios_pago.json').then(r => r.json()).then(setData)
  }, [])

  if (!data) return <div className="p-8 text-gray-400">Cargando…</div>

  const top = data.mix_global[0]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Medios de Pago</h1>
        <p className="text-sm text-gray-500 mt-1">Mix de pago, ticket promedio y evolución por canal · 2023–2025</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {data.mix_global.map((m: MixGlobal) => (
          <div key={m.medio_pago} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="w-3 h-3 rounded-full mb-2" style={{ backgroundColor: COLORS[m.medio_pago] }} />
            <p className="text-xs text-gray-500 font-medium leading-tight">{m.medio_pago}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{m.pct}%</p>
            <p className="text-xs text-gray-400 mt-0.5">ticket {formatARS(m.ticket_prom)}</p>
            <p className="text-xs text-gray-400">{formatNumber(m.transacciones)} txn</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Pie chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Distribución Global</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data.mix_global}
                dataKey="pct"
                nameKey="medio_pago"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, value }) => `${String(name).split(' ').pop()} ${value}%`}
                labelLine={false}
              >
                {data.mix_global.map((m: MixGlobal) => (
                  <Cell key={m.medio_pago} fill={COLORS[m.medio_pago]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${Number(v)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Ticket promedio por año */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Ticket Promedio por Año (ARS)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.ticket_por_año} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="año" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => formatARS(Number(v))} />
              <Tooltip formatter={(v) => formatARS(Number(v))} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              {MEDIOS.map(m => (
                <Bar key={m} dataKey={m} fill={COLORS[m]} radius={[3,3,0,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Evolución % por año */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Evolución del Mix por Año (%)</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data.evolucion_año}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="año" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} domain={[0, 40]} />
            <Tooltip formatter={(v) => `${Number(v)}%`} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {MEDIOS.map(m => (
              <Line key={m} type="monotone" dataKey={m} stroke={COLORS[m]} strokeWidth={2} dot={{ r: 4 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Mix por categoría */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Mix por Categoría (%)</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data.mix_por_categoria} layout="vertical" barSize={14}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} domain={[0, 100]} />
            <YAxis type="category" dataKey="categoria" tick={{ fontSize: 10 }} width={120} />
            <Tooltip formatter={(v) => `${Number(v)}%`} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            {MEDIOS.map(m => (
              <Bar key={m} dataKey={m} stackId="a" fill={COLORS[m]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
