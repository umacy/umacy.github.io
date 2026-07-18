import { NextResponse } from "next/server"

type PriceForecast = {
  id: number
  species: string
  region: string
  forecast_date: string
  price: number
  confidence_level: number
  trend: "up" | "down" | "stable"
  created_at: string
}

const priceForecasts: PriceForecast[] = [
  {
    id: 1,
    species: "Anchoveta",
    region: "Paita",
    forecast_date: "2026-07-20",
    price: 3.4,
    confidence_level: 87,
    trend: "up",
    created_at: "2026-07-17T08:00:00Z",
  },
  {
    id: 2,
    species: "Bonito",
    region: "Callao",
    forecast_date: "2026-07-24",
    price: 6.2,
    confidence_level: 84,
    trend: "stable",
    created_at: "2026-07-17T08:00:00Z",
  },
  {
    id: 3,
    species: "Caballa",
    region: "Chimbote",
    forecast_date: "2026-07-29",
    price: 5.1,
    confidence_level: 81,
    trend: "down",
    created_at: "2026-07-17T08:00:00Z",
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const species = searchParams.get("species")
    const region = searchParams.get("region")
    const dateRange = searchParams.get("dateRange")

    // Calculate date limit for filtering
    let dateLimitDays = 30 // default
    if (dateRange === "7days") dateLimitDays = 7
    else if (dateRange === "14days") dateLimitDays = 14

    const now = new Date()
    const dateLimit = new Date(now)
    dateLimit.setDate(now.getDate() + dateLimitDays)

    const hasSpeciesFilter = species && species !== "all"
    const hasRegionFilter = region && region !== "all"
    const hasDateFilter = dateRange && dateRange !== "all"

    const result = priceForecasts
      .filter((row) => (hasSpeciesFilter ? row.species === species : true))
      .filter((row) => (hasRegionFilter ? row.region === region : true))
      .filter((row) => {
        if (!hasDateFilter) return true
        return new Date(row.forecast_date) <= dateLimit
      })
      .sort((a, b) => a.forecast_date.localeCompare(b.forecast_date) || a.species.localeCompare(b.species))

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error fetching price forecasts:", error)
    return NextResponse.json({ error: "Failed to fetch price forecasts" }, { status: 500 })
  }
}
