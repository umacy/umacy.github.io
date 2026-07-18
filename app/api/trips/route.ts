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
  image_url: string | null
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
    image_url: null,
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
    image_url: null,
  },
]

function toDisplayTime(value: string): string {
  const [rawHour, rawMinute] = value.split(":")
  const hour = Number.parseInt(rawHour || "0", 10)
  const minute = rawMinute || "00"
  const suffix = hour >= 12 ? "PM" : "AM"
  const hour12 = hour % 12 || 12
  return `${hour12.toString().padStart(2, "0")}:${minute} ${suffix}`
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0]

    const result = trips
      .filter((trip) => trip.trip_date === date)
      .sort((a, b) => a.departure_time.localeCompare(b.departure_time))
      .map((trip) => ({
        id: trip.id,
        ship_name: trip.ship_name,
        image_url: trip.image_url,
        departure: toDisplayTime(trip.departure_time),
        return: toDisplayTime(trip.return_time),
        location: trip.location,
        target: trip.target_species,
        status: trip.status,
      }))

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error fetching trips:", error)
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
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
      trip_date,
      estimated_income,
      duration_days,
      image_url,
    } = body

    const newTrip: TripRecord = {
      id: String(Date.now()),
      ship_name,
      captain: captain || null,
      crew_members: crew_members || null,
      departure_time,
      return_time,
      location,
      target_species,
      fishing_zone: fishing_zone || null,
      status: "In Progress",
      trip_date,
      estimated_income: estimated_income || null,
      duration_days: duration_days || null,
      image_url: image_url || null,
    }

    trips = [newTrip, ...trips]
    return NextResponse.json(newTrip)
  } catch (error) {
    console.error("[v0] Error creating trip:", error)
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 })
  }
}
