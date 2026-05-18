import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Safety App running',
    time: new Date().toISOString()
  });
}