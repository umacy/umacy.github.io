import { NextResponse } from "next/server"

type AvailabilityForecast = {
  id: number
  species: string
  region: string
  forecast_date: string
  availability_percentage: number
  confidence_level: number
  created_at: string
}

const availabilityForecasts: AvailabilityForecast[] = [
  {
    id: 1,
    species: "Anchoveta",
    region: "Paita",
    forecast_date: "2026-07-20",
    availability_percentage: 78,
    confidence_level: 88,
    created_at: "2026-07-17T08:00:00Z",
  },
  {
    id: 2,
    species: "Bonito",
    region: "Callao",
    forecast_date: "2026-07-24",
    availability_percentage: 65,
    confidence_level: 82,
    created_at: "2026-07-17T08:00:00Z",
  },
  {
    id: 3,
    species: "Caballa",
    region: "Chimbote",
    forecast_date: "2026-07-29",
    availability_percentage: 71,
    confidence_level: 80,
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

    const result = availabilityForecasts
      .filter((row) => (hasSpeciesFilter ? row.species === species : true))
      .filter((row) => (hasRegionFilter ? row.region === region : true))
      .filter((row) => {
        if (!hasDateFilter) return true
        return new Date(row.forecast_date) <= dateLimit
      })
      .sort((a, b) => a.forecast_date.localeCompare(b.forecast_date) || a.species.localeCompare(b.species))

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error fetching availability forecasts:", error)
    return NextResponse.json({ error: "Failed to fetch availability forecasts" }, { status: 500 })
  }
}
