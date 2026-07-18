import { NextResponse } from "next/server"

type TripRecord = {
  id: string
  ship_name: string
  captain: string | null
  crew_members: number | null
  departure_time: string
  return_time: string
  location: string
  target_species: string
  fishing_zone: string | null
  status: string
  trip_date: string
  estimated_income: number | null
  duration_days: number | null
}

let trips: TripRecord[] = [
  {
    id: "1",
    ship_name: "Santa Maria",
    captain: "Carlos Mendoza",
    crew_members: 6,
    departure_time: "05:30",
    return_time: "15:00",
    location: "Paita",
    target_species: "Anchoveta",
    fishing_zone: "Zona Norte",
    status: "In Progress",
    trip_date: "2026-07-17",
    estimated_income: 5200,
    duration_days: 1,
  },
  {
    id: "2",
    ship_name: "Mar Azul",
    captain: "Luis Rivera",
    crew_members: 5,
    departure_time: "06:00",
    return_time: "16:30",
    location: "Paita",
    target_species: "Bonito",
    fishing_zone: "Zona Centro",
    status: "Planned",
    trip_date: "2026-07-17",
    estimated_income: 6100,
    duration_days: 1,
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const result = trips.find((trip) => trip.id === id)

    if (!result) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error fetching trip details:", error)
    return NextResponse.json({ error: "Failed to fetch trip details" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const {
      ship_name,
      captain,
      crew_members,
      departure_time,
      return_time,
      location,
      target_species,
      fishing_zone,
      status,
      trip_date,
      estimated_income,
      duration_days,
    } = body

    const index = trips.findIndex((trip) => trip.id === id)
    if (index < 0) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 })
    }

    const updated: TripRecord = {
      id,
      ship_name,
      captain: captain || null,
      crew_members: crew_members || null,
      departure_time,
      return_time,
      location,
      target_species,
      fishing_zone: fishing_zone || null,
      status,
      trip_date,
      estimated_income: estimated_income || null,
      duration_days: duration_days || null,
    }

    trips[index] = updated
    return NextResponse.json(updated)
  } catch (error) {
    console.error("[v0] Error updating trip:", error)
    return NextResponse.json({ error: "Failed to update trip" }, { status: 500 })
  }
}
