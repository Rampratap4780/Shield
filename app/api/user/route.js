import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req) {
  try {
    await connectDB();
    const { deviceId, name, phone, contacts } = await req.json();

    if (!deviceId || !name || !phone || !contacts) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (contacts.length < 1 || contacts.length > 3) {
      return NextResponse.json(
        { error: 'Add 1 to 3 contacts' },
        { status: 400 }
      );
    }

    let user = await User.findOne({ deviceId });

    if (user) {
      user.name = name;
      user.phone = phone;
      user.contacts = contacts;
      await user.save();
      return NextResponse.json({ message: 'Profile updated', user });
    }

    user = await User.create({ deviceId, name, phone, contacts });
    return NextResponse.json(
      { message: 'Profile created', user },
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

    return NextResponse.json({ user });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { deviceId, settings } = await req.json();

    if (!deviceId) {
      return NextResponse.json(
        { error: 'deviceId is required' },
        { status: 400 }
      );
    }

    const user = await User.findOneAndUpdate(
      { deviceId },
      { settings },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Settings updated', user });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}