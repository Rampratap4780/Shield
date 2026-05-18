import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Alert from '@/lib/models/Alert';

export async function PUT(req, context) {
  try {
    await connectDB();

    const params = await context.params;
    const id = params.id;

    const alert = await Alert.findByIdAndUpdate(
      id,
      { cancelled: true },
      { returnDocument: 'after' }
    );

    if (!alert) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Alert cancelled', alert });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}