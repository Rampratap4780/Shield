import { NextResponse } from 'next/server';

const ROAD_TYPES = [
  'motorway', 'trunk', 'primary',
  'secondary', 'tertiary',
  'motorway_link', 'trunk_link', 'primary_link',
];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'lat and lng required' },
        { status: 400 }
      );
    }

    const query = `
      [out:json][timeout:5];
      way(around:30,${lat},${lng})["highway"];
      out tags;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
    });

    const data = await response.json();

    if (!data.elements || data.elements.length === 0) {
      return NextResponse.json({ onRoad: false, roadType: null });
    }

    const roadType = data.elements[0]?.tags?.highway || null;
    const onRoad = ROAD_TYPES.includes(roadType);

    return NextResponse.json({ onRoad, roadType });

  } catch (error) {
    // API fail ho toh safe side pe alert allow karo
    return NextResponse.json({ onRoad: true, roadType: 'unknown' });
  }
}