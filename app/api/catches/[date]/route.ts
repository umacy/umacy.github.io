import { NextResponse } from "next/server"

type CatchDetailRow = {
  ship_name: string
  species: string
  kg_caught: number
  price_per_kg: number
  subtotal: number
  date: string
}

const catchDetails: CatchDetailRow[] = [
  {
    ship_name: "Santa Maria",
    species: "Anchoveta",
    kg_caught: 1200,
    price_per_kg: 3.1,
    subtotal: 3720,
    date: "2026-07-15",
  },
  {
    ship_name: "Santa Maria",
    species: "Jurel",
    kg_caught: 540,
    price_per_kg: 4.8,
    subtotal: 2592,
    date: "2026-07-15",
  },
  {
    ship_name: "Mar Azul",
    species: "Bonito",
    kg_caught: 820,
    price_per_kg: 6.4,
    subtotal: 5248,
    date: "2026-07-15",
  },
  {
    ship_name: "El Faro",
    species: "Caballa",
    kg_caught: 640,
    price_per_kg: 5.2,
    subtotal: 3328,
    date: "2026-07-14",
  },
]

export async function GET(request: Request, { params }: { params: { date: string } }) {
  try {
    const date = params.date

    console.log("[v0] Fetching catch details for date:", date)

    const dateOnly = date.split("T")[0]
    console.log("[v0] Extracted date only:", dateOnly)

    const result = catchDetails
      .filter((row) => row.date === dateOnly)
      .sort((a, b) => a.ship_name.localeCompare(b.ship_name) || a.species.localeCompare(b.species))

    console.log("[v0] Query returned", result.length, "rows")
    console.log("[v0] Sample data:", result[0])

    // Group by ship (vessel)
    const groupedByShip = result.reduce(
      (acc: any, row: any) => {
        const shipName = row.ship_name
        if (!acc[shipName]) {
          acc[shipName] = {
            shipName,
            crewCount: 0, // catch_logs doesn't have crew_count, default to 0
            totalIncome: 0,
            catches: [],
          }
        }
        acc[shipName].catches.push({
          species: row.species,
          kgCaught: Number(row.kg_caught),
          pricePerKg: Number(row.price_per_kg),
          subtotal: Number(row.subtotal),
        })
        acc[shipName].totalIncome += Number(row.subtotal)
        return acc
      },
      {} as Record<string, any>,
    )

    const finalData = Object.values(groupedByShip)
    console.log("[v0] Returning", finalData.length, "ships")

    return NextResponse.json(finalData)
  } catch (error) {
    console.error("[v0] Error fetching catch details:", error)
    return NextResponse.json({ error: "Failed to fetch catch details" }, { status: 500 })
  }
}
