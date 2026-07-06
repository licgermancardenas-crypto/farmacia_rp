# Farmacias RP — Sales Analytics Dashboard

> Interactive BI dashboard showcasing 3 years of commercial data (2023–2025) for a pharmacy chain operating in Argentina. Built as a portfolio piece demonstrating end-to-end data analytics work: dataset generation, ETL design, KPI definition, and front-end visualization.

**Live demo →** [farmacias-rp.vercel.app](https://farmacias-rp.vercel.app) *(deploying)*

---

## Overview

This project presents a fully functional analytics dashboard for **Farmacias RP**, a multi-branch pharmacy chain in Argentina. The underlying dataset was generated synthetically but modeled against the chain's real product catalog of **1,479 SKUs** across 13 branches, incorporating Argentine macroeconomic conditions (IPC inflation), seasonal demand patterns, commercial events, and channel-level dynamics.

It serves as a concrete portfolio demonstration of the data strategy and BI work carried out as an external consultant for the company since December 2024.

---

## What's inside

| Section | Description |
|---|---|
| **Resumen Ejecutivo** | Top-line KPIs, monthly revenue trend, payment mix, and commercial event impact |
| **Sucursales** | Branch-level revenue breakdown, e-commerce vs. physical performance |
| **Categorías** | Revenue and ticket by product category, year-over-year evolution |
| **Inventario** | Stock coverage, expired units, and out-of-stock alerts by branch and category |
| **Canales** | Physical vs. e-commerce channel comparison across all 36 months |

---

## Dataset

The synthetic dataset was designed to reflect realistic business dynamics:

- **~970K rows** of daily aggregated sales (`ventas_diarias`) across 13 branches × 12 categories × 36 months
- **50,000 individual transactions** (`transacciones`) with ticket-level detail: SKU, price, discount, payment method, cashier, and shift
- **Argentine IPC inflation** applied month by month (base 1.0 Jan 2023 → ~8.58 Dec 2025) to nominal prices
- **Seasonality** modeled per category (e.g., cold/flu peaks in winter, fragrances spike at Día de la Madre)
- **Commercial events**: Día de la Madre, Hot Sale, Black Friday, PAMI settlement dates
- **Branch profiles**: premium, medicamentos, mixto, digital — each with distinct category multipliers and ramp-up curves for recently opened locations
- **E-commerce growth trend**: ×1.0 in January 2023 → ×3.5 by December 2025

Data is pre-aggregated into 9 lightweight JSON files (~50 KB total) served from `/public/data/` for fast Vercel static delivery — no server-side computation required.

---

## Tech stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** — utility-first styling
- **Recharts** — AreaChart, BarChart, PieChart, LineChart
- **Lucide React** — icons
- **Vercel** — deployment

---

## Project structure

```
app/
  page.tsx          # Resumen Ejecutivo
  sucursales/       # Branch performance
  categorias/       # Category analytics
  inventario/       # Stock & inventory risk
  canales/          # Channel comparison
components/
  Sidebar.tsx
  KPICard.tsx
lib/
  types.ts          # TypeScript interfaces
  utils.ts          # Formatting helpers, color palette
public/
  data/             # Pre-aggregated JSON files
    kpis.json
    ventas_mensuales.json
    sucursales.json
    categorias.json
    eventos.json
    stock.json
    canal.json
    medios_pago.json
    año_categoria.json
```

---

## Local setup

```bash
git clone https://github.com/licgermancardenas-crypto/farmacia_rp.git
cd farmacia_rp
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Context & methodology

This dashboard is part of a broader data strategy engagement for Farmacias RP that includes:

- **Catalog scraping** — automated extraction of 1,479 SKUs with pricing and availability from the chain's web catalog
- **Competitive intelligence** — cross-market price monitoring pipeline
- **ETL & data modeling** — structuring raw transactional data into analytics-ready tables
- **KPI framework** — definition and tracking of commercial, operational, and inventory KPIs
- **Inventory optimization** — identifying high-wastage categories (medications nearing expiry, slow-moving fragrances) to reduce losses
- **Predictive modeling** — demand forecasting model in development

The simulated dataset was built to faithfully represent the patterns observed in real operations, without exposing any confidential business data.

---

## About

**Germán Cárdenas** — Data & BI Analyst  
Freelance consultant specializing in data strategy, business intelligence, and process automation for retail and pharmaceutical clients in Argentina.

- GitHub: [@licgermancardenas-crypto](https://github.com/licgermancardenas-crypto)
- Email: yellowy.c76@gmail.com

---

*Dataset is synthetic. All figures are simulated for portfolio demonstration purposes.*
