import { NextResponse } from "next/server"

type CrewMember = {
  id: string
  name: string
  role: string
  ship_id: string | null
  avatar_url: string | null
}

const ships: Record<string, string> = {
  "1": "Santa Maria",
  "2": "Mar Azul",
  "3": "El Faro",
}

let crewMembers: CrewMember[] = [
  { id: "1", name: "Diego Flores", role: "Captain", ship_id: "1", avatar_url: null },
  { id: "2", name: "Rosa Quispe", role: "Deckhand", ship_id: "1", avatar_url: null },
  { id: "3", name: "Jorge Silva", role: "Engineer", ship_id: "2", avatar_url: null },
  { id: "4", name: "Ana Torres", role: "Deckhand", ship_id: "3", avatar_url: null },
]

export async function GET(request: Request) {
  try {
    const result = [...crewMembers]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((member) => ({
        ...member,
        ship_name: member.ship_id ? ships[member.ship_id] || null : null,
      }))

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error fetching crew members:", error)
    return NextResponse.json({ error: "Failed to fetch crew members" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, role, ship_id, avatar_url } = body

    const newMember: CrewMember = {
      id: String(Date.now()),
      name,
      role,
      ship_id: ship_id || null,
      avatar_url: avatar_url || null,
    }

    crewMembers = [newMember, ...crewMembers]
    return NextResponse.json(newMember)
  } catch (error) {
    console.error("[v0] Error creating crew member:", error)
    return NextResponse.json({ error: "Failed to create crew member" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, role, ship_id, avatar_url } = body

    const index = crewMembers.findIndex((member) => member.id === id)
    if (index < 0) {
      return NextResponse.json({ error: "Crew member not found" }, { status: 404 })
    }

    const updated: CrewMember = {
      id,
      name,
      role,
      ship_id: ship_id || null,
      avatar_url: avatar_url || null,
    }

    crewMembers[index] = updated
    return NextResponse.json(updated)
  } catch (error) {
    console.error("[v0] Error updating crew member:", error)
    return NextResponse.json({ error: "Failed to update crew member" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Crew member ID is required" }, { status: 400 })
    }

    crewMembers = crewMembers.filter((member) => member.id !== id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting crew member:", error)
    return NextResponse.json({ error: "Failed to delete crew member" }, { status: 500 })
  }
}
