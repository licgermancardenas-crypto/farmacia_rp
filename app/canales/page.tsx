'use client'
import { useEffect, useState } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatARS, formatNumber } from '@/lib/utils'
import type { CanalMes, Sucursal } from '@/lib/types'

export default function CanalesPage() {
  const [canal, setCanal] = useState<CanalMes[]>([])
  const [sucursales, setSucursales] = useState<Sucursal[]>([])

  useEffect(() => {
    fetch('/data/canal.json').then(r => r.json()).then(setCanal)
    fetch('/data/sucursales.json').then(r => r.json()).then(setSucursales)
  }, [])

  const eco = sucursales.find(s => s.canal === 'E-commerce')
  const fisicaTotal = sucursales.filter(s => s.canal === 'Físico').reduce((a,b) => a + b.ingresos, 0)
  const ecoTotal = eco?.ingresos ?? 0
  const totalGlobal = fisicaTotal + ecoTotal
  const pctEco = totalGlobal > 0 ? (ecoTotal/totalGlobal*100).toFixed(1) : '0'

  const periodos = [...new Set(canal.map(d => d.periodo))].sort()
  const comparativa = periodos.map(p => {
    const fis = canal.find(d => d.periodo === p && d.canal === 'Físico')
    const eco = canal.find(d => d.periodo === p && d.canal === 'E-commerce')
    return { periodo: p.slice(2), Físico: fis?.ingresos ?? 0, 'E-commerce': eco?.ingresos ?? 0 }
  })

  const porAño = [2023,2024,2025].map(año => {
    const rows = canal.filter(d => d.año === año)
    const fis = rows.filter(d => d.canal==='Físico').reduce((a,b)=>a+b.ingresos,0)
    const eco = rows.filter(d => d.canal==='E-commerce').reduce((a,b)=>a+b.ingresos,0)
    return { año, Físico: fis, 'E-commerce': eco, pctEco: eco/(fis+eco)*100 }
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Canales: Físico vs. E-commerce</h1>
        <p className="text-sm text-gray-500 mt-1">Evolución y participación de cada canal · 2023–2025</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Canal Físico</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatARS(fisicaTotal)}</p>
          <p className="text-xs text-gray-400 mt-1">{(100-Number(pctEco)).toFixed(1)}% del total</p>
        </div>
        <div className="bg-[#1B3A5C] text-white rounded-xl p-5 shadow-sm">
          <p className="text-xs text-white/60 font-medium uppercase tracking-wider">E-commerce</p>
          <p className="text-2xl font-bold mt-1">{formatARS(ecoTotal)}</p>
          <p className="text-xs text-white/50 mt-1">{pctEco}% del total · crecimiento 3.5×</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Global</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatARS(totalGlobal)}</p>
          <p className="text-xs text-gray-400 mt-1">todos los canales 2023–2025</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Evolución Mensual — Físico vs. E-commerce</h2>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={comparativa}>
            <defs>
              <linearGradient id="gradFis" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1B3A5C" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1B3A5C" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradEco" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="periodo" tick={{ fontSize: 10 }} interval={2} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => formatARS(v)} />
            <Tooltip formatter={(v) => formatARS(Number(v))} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="Físico" stroke="#1B3A5C" strokeWidth={2} fill="url(#gradFis)" />
            <Area type="monotone" dataKey="E-commerce" stroke="#C9A84C" strokeWidth={2} fill="url(#gradEco)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Participación E-commerce por Año</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={porAño}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="año" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => formatARS(v)} />
            <Tooltip formatter={(v) => formatARS(Number(v))} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Físico" fill="#1B3A5C" stackId="a" radius={[0,0,0,0]} />
            <Bar dataKey="E-commerce" fill="#C9A84C" stackId="a" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
