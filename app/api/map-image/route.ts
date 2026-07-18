import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lng = Number.parseFloat(searchParams.get("lng") || "-81.1")
  const lat = Number.parseFloat(searchParams.get("lat") || "-5.1")
  const zoom = Number.parseInt(searchParams.get("zoom") || "10", 10)
  const width = Number.parseInt(searchParams.get("width") || "800", 10)
  const height = Number.parseInt(searchParams.get("height") || "600", 10)

  const safeLng = Number.isFinite(lng) ? lng : -81.1
  const safeLat = Number.isFinite(lat) ? lat : -5.1
  const safeZoom = Number.isFinite(zoom) ? Math.min(18, Math.max(1, zoom)) : 10
  const safeWidth = Number.isFinite(width) ? Math.min(1280, Math.max(200, width)) : 800
  const safeHeight = Number.isFinite(height) ? Math.min(1280, Math.max(200, height)) : 600

  const mapboxToken = process.env.MAPBOX_TOKEN
  const mapboxUrl = mapboxToken
    ? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${safeLng},${safeLat},${safeZoom},0/${safeWidth}x${safeHeight}@2x?access_token=${mapboxToken}`
    : `https://staticmap.openstreetmap.de/staticmap.php?center=${safeLat},${safeLng}&zoom=${safeZoom}&size=${safeWidth}x${safeHeight}&maptype=mapnik`

  return NextResponse.json(
    {
      url: mapboxUrl,
      provider: mapboxToken ? "mapbox" : "osm-fallback",
    },
    {
      headers: {
        "Cache-Control": "private, max-age=300",
      },
    },
  )
}
