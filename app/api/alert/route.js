import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Alert from '@/lib/models/Alert';
import User from '@/lib/models/User';

export async function POST(req) {
  try {
    await connectDB();
    const { deviceId, mode, trigger, location, roadType } = await req.json();

    if (!deviceId || !mode || !trigger) {
      return NextResponse.json(
        { error: 'deviceId, mode, trigger required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ deviceId });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const alert = await Alert.create({
      userId: user._id,
      mode,
      trigger,
      location: {
        lat: location?.lat || null,
        lng: location?.lng || null,
      },
      roadType: roadType || null,
      sentTo: user.contacts,
    });

    return NextResponse.json(
      {
        message: 'Alert saved',
        alert,
        contacts: user.contacts,
        userName: user.name,
      },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const deviceId = searchParams.get('deviceId');

    if (!deviceId) {
      return NextResponse.json(
        { error: 'deviceId is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ deviceId });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const alerts = await Alert.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ alerts });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}