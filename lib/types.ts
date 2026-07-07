export interface KPIs {
  ingresos_totales: number
  unidades_totales: number
  transacciones_totales: number
  ticket_promedio: number
  total_sucursales: number
  total_categorias: number
  total_subcategorias: number
  pct_descuento_promedio: number
}

export interface VentaMensual {
  año: number
  mes: number
  nombre_mes: string
  periodo: string
  ingresos: number
  unidades: number
  transacciones: number
  ingresos_reales: number
}

export interface Sucursal {
  id_sucursal: string
  nombre_sucursal: string
  zona: string
  canal: string
  formato: string
  ingresos: number
  unidades: number
  transacciones: number
  ticket_prom: number
  ingresos_reales: number
}

export interface Categoria {
  categoria_principal: string
  ingresos: number
  unidades: number
  ticket_prom: number
  ingresos_reales: number
}

export interface Evento {
  evento_comercial: string
  ingresos_prom: number
  dias: number
}

export interface StockRow {
  nombre_sucursal: string
  categoria_principal: string
  dias_cob_prom: number
  u_vencidas: number
  skus_agotados: number
  critico: number
  bajo: number
  ok: number
}

export interface CanalMes {
  año: number
  mes: number
  canal: string
  periodo: string
  ingresos: number
  unidades: number
}

export interface MixGlobal {
  medio_pago: string
  pct: number
  ticket_prom: number
  transacciones: number
}

export interface MediosPago {
  mix_global: MixGlobal[]
  evolucion_año: Record<string, number>[]
  ticket_por_año: Record<string, number>[]
  mix_por_categoria: Record<string, number | string>[]
}
