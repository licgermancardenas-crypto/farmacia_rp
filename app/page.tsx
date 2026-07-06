'use client'

import { useEffect, useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { DollarSign, ShoppingCart, Receipt, TrendingUp, Store, Tag } from 'lucide-react'
import KPICard from '@/components/KPICard'
import { formatARS, formatNumber, COLORS } from '@/lib/utils'
import type { KPIs, VentaMensual, Categoria } from '@/lib/types'

export default function Home() {
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [mensuales, setMensuales] = useState<VentaMensual[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [eventos, setEventos] = useState<{ evento_comercial: string; ingresos_prom: number }[]>([])
  const [mediosPago, setMediosPago] = useState<Record<string, number>>({})

  useEffect(() => {
    fetch('/data/kpis.json').then(r => r.json()).then(setKpis)
    fetch('/data/ventas_mensuales.json').then(r => r.json()).then(setMensuales)
    fetch('/data/categorias.json').then(r => r.json()).then(setCategorias)
    fetch('/data/eventos.json').then(r => r.json()).then(setEventos)
    fetch('/data/medios_pago.json').then(r => r.json()).then(setMediosPago)
  }, [])

  const mpData = Object.entries(mediosPago).map(([name, value]) => ({ name, value }))

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Resumen Ejecutivo</h1>
        <p className="text-sm text-gray-500 mt-1">
          Farmacia y Droguería RP de Went S.A. · 13 sucursales · Ene 2023 — Dic 2025
        </p>
      </div>

      {kpis && (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          <KPICard title="Ingresos Netos Totales" value={formatARS(kpis.ingresos_totales)}
            subtitle="3 años acumulados" icon={DollarSign} color="#1B3A5C" />
          <KPICard title="Unidades Vendidas" value={formatNumber(kpis.unidades_totales)}
            subtitle="todos los canales" icon={ShoppingCart} color="#C9A84C" />
          <KPICard title="Transacciones" value={formatNumber(kpis.transacciones_totales)}
            subtitle="tickets procesados" icon={Receipt} color="#2E6DA4" />
          <KPICard title="Ticket Promedio" value={formatARS(kpis.ticket_promedio)}
            subtitle="por transacción" icon={TrendingUp} color="#10B981" />
          <KPICard title="Sucursales" value={`${kpis.total_sucursales}`}
            subtitle="físicas + e-commerce" icon={Store} color="#8B5CF6" />
          <KPICard title="Categorías" value={`${kpis.total_categorias}`}
            subtitle={`${kpis.total_subcategorias} subcategorías`} icon={Tag} color="#F59E0B" />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Evolución de Ingresos Netos (ARS)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={mensuales}>
              <defs>
                <linearGradient id="gradIngreso" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B3A5C" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1B3A5C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="periodo" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(2)} interval={2} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => formatARS(v)} />
              <Tooltip formatter={(v) => formatARS(Number(v))} labelFormatter={l => `Período: ${l}`} />
              <Area type="monotone" dataKey="ingresos" stroke="#1B3A5C" strokeWidth={2}
                fill="url(#gradIngreso)" name="Ingresos Netos" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Mix de Medios de Pago</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={mpData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                dataKey="value" nameKey="name" paddingAngle={2}>
                {mpData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${Number(v)}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {mpData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-gray-600">{d.name}</span>
                </div>
                <span className="font-medium">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Ingresos por Categoría</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categorias.slice(0,8)} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => formatARS(v)} />
              <YAxis type="category" dataKey="categoria_principal" tick={{ fontSize: 10 }} width={120} />
              <Tooltip formatter={(v) => formatARS(Number(v))} />
              <Bar dataKey="ingresos" radius={[0,4,4,0]} name="Ingresos">
                {categorias.slice(0,8).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Ingreso Promedio por Evento Comercial</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={eventos} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => formatARS(v)} />
              <YAxis type="category" dataKey="evento_comercial" tick={{ fontSize: 10 }} width={120} />
              <Tooltip formatter={(v) => formatARS(Number(v))} />
              <Bar dataKey="ingresos_prom" fill="#C9A84C" radius={[0,4,4,0]} name="Ingreso Promedio" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
