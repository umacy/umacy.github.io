import { NextResponse } from "next/server"

type ShipRecord = {
  id: string
  name: string
  port: string
  image_url: string | null
  crew_count: number
}

let ships: ShipRecord[] = [
  { id: "1", name: "Santa Maria", port: "Paita", image_url: null, crew_count: 6 },
  { id: "2", name: "Mar Azul", port: "Callao", image_url: null, crew_count: 5 },
  { id: "3", name: "El Faro", port: "Chimbote", image_url: null, crew_count: 4 },
]

export async function GET(request: Request) {
  try {
    const result = [...ships].sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error fetching ships:", error)
    return NextResponse.json({ error: "Failed to fetch ships" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, port, image_url } = body

    const newShip: ShipRecord = {
      id: String(Date.now()),
      name,
      port,
      image_url: image_url || null,
      crew_count: 0,
    }

    ships = [newShip, ...ships]
    return NextResponse.json(newShip)
  } catch (error) {
    console.error("[v0] Error creating ship:", error)
    return NextResponse.json({ error: "Failed to create ship" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, port, image_url } = body

    const index = ships.findIndex((ship) => ship.id === id)
    if (index < 0) {
      return NextResponse.json({ error: "Ship not found" }, { status: 404 })
    }

    const updated: ShipRecord = {
      ...ships[index],
      name,
      port,
      image_url: image_url || null,
    }
    ships[index] = updated
    return NextResponse.json(updated)
  } catch (error) {
    console.error("[v0] Error updating ship:", error)
    return NextResponse.json({ error: "Failed to update ship" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Ship ID is required" }, { status: 400 })
    }

    ships = ships.filter((ship) => ship.id !== id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting ship:", error)
    return NextResponse.json({ error: "Failed to delete ship" }, { status: 500 })
  }
}
