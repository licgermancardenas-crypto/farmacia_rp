'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { AlertTriangle, CheckCircle, Clock, PackageX } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import type { StockRow } from '@/lib/types'

export default function InventarioPage() {
  const [stock, setStock] = useState<StockRow[]>([])
  useEffect(() => { fetch('/data/stock.json').then(r => r.json()).then(setStock) }, [])

  const totalVencidas = stock.reduce((a,b) => a + b.u_vencidas, 0)
  const totalAgotados = stock.reduce((a,b) => a + b.skus_agotados, 0)
  const totalBajo     = stock.reduce((a,b) => a + b.bajo, 0)
  const totalCritico  = stock.reduce((a,b) => a + b.critico, 0)

  const porSucursal = Array.from(
    stock.reduce((map, r) => {
      const cur = map.get(r.nombre_sucursal) ?? { nombre_sucursal: r.nombre_sucursal, vencidas: 0, agotados: 0, bajo: 0, critico: 0 }
      cur.vencidas += r.u_vencidas
      cur.agotados += r.skus_agotados
      cur.bajo     += r.bajo
      cur.critico  += r.critico
      return map.set(r.nombre_sucursal, cur)
    }, new Map<string, { nombre_sucursal:string; vencidas:number; agotados:number; bajo:number; critico:number }>())
    .values()
  ).sort((a,b) => b.vencidas - a.vencidas)

  const porCategoria = Array.from(
    stock.reduce((map, r) => {
      const cur = map.get(r.categoria_principal) ?? { categoria_principal: r.categoria_principal, vencidas: 0, dias_cob: 0, n: 0 }
      cur.vencidas += r.u_vencidas
      cur.dias_cob += r.dias_cob_prom
      cur.n++
      return map.set(r.categoria_principal, cur)
    }, new Map<string, { categoria_principal:string; vencidas:number; dias_cob:number; n:number }>())
    .values()
  ).map(d => ({ ...d, dias_cob_prom: +(d.dias_cob/d.n).toFixed(1) }))
    .sort((a,b) => b.vencidas - a.vencidas)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Inventario & Control de Stock</h1>
        <p className="text-sm text-gray-500 mt-1">Seguimiento de rotación, vencimientos y quiebres de stock · 2023–2025</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-red-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><AlertTriangle size={16} className="text-red-500" /><p className="text-xs font-medium text-red-600 uppercase">Días en estado Crítico</p></div>
          <p className="text-2xl font-bold text-red-600">{formatNumber(totalCritico)}</p>
          <p className="text-xs text-gray-400 mt-1">días × sucursal × categoría</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><Clock size={16} className="text-amber-500" /><p className="text-xs font-medium text-amber-600 uppercase">Stock Bajo</p></div>
          <p className="text-2xl font-bold text-amber-600">{formatNumber(totalBajo)}</p>
          <p className="text-xs text-gray-400 mt-1">días con cobertura &lt; 5 días</p>
        </div>
        <div className="bg-white rounded-xl border border-orange-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><PackageX size={16} className="text-orange-500" /><p className="text-xs font-medium text-orange-600 uppercase">Unidades Vencidas</p></div>
          <p className="text-2xl font-bold text-orange-600">{formatNumber(totalVencidas)}</p>
          <p className="text-xs text-gray-400 mt-1">unidades perdidas por vencimiento</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><CheckCircle size={16} className="text-green-500" /><p className="text-xs font-medium text-green-600 uppercase">SKUs Agotados</p></div>
          <p className="text-2xl font-bold text-gray-900">{formatNumber(totalAgotados)}</p>
          <p className="text-xs text-gray-400 mt-1">eventos de quiebre de stock</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Unidades Vencidas por Sucursal</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={porSucursal} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="nombre_sucursal" tick={{ fontSize: 10 }} width={110} />
              <Tooltip />
              <Bar dataKey="vencidas" fill="#EF4444" radius={[0,4,4,0]} name="Unidades vencidas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Días de Cobertura Promedio por Categoría</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={porCategoria} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} unit=" días" />
              <YAxis type="category" dataKey="categoria_principal" tick={{ fontSize: 10 }} width={130} />
              <Tooltip formatter={(v) => `${Number(v)} días`} />
              <Bar dataKey="dias_cob_prom" radius={[0,4,4,0]} name="Días cobertura">
                {porCategoria.map((d,i) => (
                  <Cell key={i} fill={d.dias_cob_prom < 3 ? '#EF4444' : d.dias_cob_prom < 5 ? '#F59E0B' : '#10B981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Insight: Problema crítico de gestión de inventario</p>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              La cadena registra pérdidas recurrentes por vencimiento de medicamentos y productos de perfumería, 
              combinadas con quiebres de stock en fechas de alto impacto (Día de la Madre, Hot Sale). 
              Un sistema de alertas tempranas y reposición automatizada puede reducir estas pérdidas en más del 40%.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
