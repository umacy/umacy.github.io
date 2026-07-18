import { NextResponse } from "next/server"

type MarketPrice = {
  species: string
  port: string
  price_per_kg: number
  change_percentage: number
  recorded_at: string
}

const marketPrices: MarketPrice[] = [
  { species: "Anchoveta", port: "Paita", price_per_kg: 3.2, change_percentage: 2.4, recorded_at: "2026-07-16T09:00:00Z" },
  { species: "Anchoveta", port: "Callao", price_per_kg: 3.0, change_percentage: 1.8, recorded_at: "2026-07-16T09:10:00Z" },
  { species: "Bonito", port: "Paita", price_per_kg: 6.5, change_percentage: -0.9, recorded_at: "2026-07-16T09:20:00Z" },
  { species: "Bonito", port: "Chimbote", price_per_kg: 6.1, change_percentage: 1.2, recorded_at: "2026-07-16T09:30:00Z" },
  { species: "Caballa", port: "Ilo", price_per_kg: 5.3, change_percentage: 0.5, recorded_at: "2026-07-15T12:00:00Z" },
  { species: "Jurel", port: "Pisco", price_per_kg: 4.9, change_percentage: 3.1, recorded_at: "2026-07-14T10:00:00Z" },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const port = searchParams.get("port")
    const species = searchParams.get("species")
    const days = Number.parseInt(searchParams.get("days") || "7")

    const dateThreshold = new Date()
    dateThreshold.setDate(dateThreshold.getDate() - days)

    const filteredByDate = marketPrices.filter((item) => new Date(item.recorded_at) >= dateThreshold)

    // Get latest prices
    if (!species) {
      const portFiltered =
        port && port !== "All Ports" ? filteredByDate.filter((item) => item.port === port) : filteredByDate

      const bySpeciesPort = new Map<string, MarketPrice>()
      for (const item of portFiltered.sort((a, b) => b.recorded_at.localeCompare(a.recorded_at))) {
        const key = `${item.species}::${item.port}`
        if (!bySpeciesPort.has(key)) {
          bySpeciesPort.set(key, item)
        }
      }

      const result = Array.from(bySpeciesPort.values()).sort(
        (a, b) => a.species.localeCompare(b.species) || a.port.localeCompare(b.port),
      )

      return NextResponse.json(result)
    }

    // Get historical data for a specific species
    const result = filteredByDate
      .filter((item) => item.species === species)
      .filter((item) => (port && port !== "All Ports" ? item.port === port : true))
      .sort((a, b) => a.recorded_at.localeCompare(b.recorded_at))

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error fetching market prices:", error)
    return NextResponse.json({ error: "Failed to fetch market prices" }, { status: 500 })
  }
}
