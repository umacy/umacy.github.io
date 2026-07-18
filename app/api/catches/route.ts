import { NextResponse } from "next/server"

type CatchLog = {
  id: number
  vessel: string
  species: string
  total_kg: number
  price_per_kg: number
  total_value: number
  date: string
}

const catchLogs: CatchLog[] = [
  {
    id: 1,
    vessel: "Santa Maria",
    species: "Anchoveta",
    total_kg: 1200,
    price_per_kg: 3.1,
    total_value: 3720,
    date: "2026-07-15",
  },
  {
    id: 2,
    vessel: "Mar Azul",
    species: "Bonito",
    total_kg: 820,
    price_per_kg: 6.4,
    total_value: 5248,
    date: "2026-07-14",
  },
  {
    id: 3,
    vessel: "El Faro",
    species: "Caballa",
    total_kg: 640,
    price_per_kg: 5.2,
    total_value: 3328,
    date: "2026-07-13",
  },
  {
    id: 4,
    vessel: "Santa Maria",
    species: "Jurel",
    total_kg: 910,
    price_per_kg: 4.8,
    total_value: 4368,
    date: "2026-07-12",
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    const filtered = search
      ? catchLogs.filter((item) => {
          const query = search.toLowerCase()
          return (
            item.vessel.toLowerCase().includes(query) ||
            item.species.toLowerCase().includes(query) ||
            item.date.includes(search)
          )
        })
      : catchLogs

    const result = [...filtered]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 50)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error fetching catch logs:", error)
    return NextResponse.json({ error: "Failed to fetch catch logs" }, { status: 500 })
  }
}
