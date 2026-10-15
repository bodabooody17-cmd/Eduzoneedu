import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../src/db/userTrackingDb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = body?.user || body;

    if (!user?.id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Real tracking requirement:
    // await db.loginLog.create({ data: { userId: user.id, timestamp: new Date() } })
    const log = await db.loginLog.create({
      data: {
        userId: user.id,
        timestamp: new Date(),
      },
    });

    console.log(`[NextAuth Track] Login recorded for student: ${user.id}`);

    return NextResponse.json({
      success: true,
      log,
      message: 'Login log created successfully',
    });
  } catch (error: any) {
    console.error('Error logging user login:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to record login log' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'NextAuth Route Active',
    tracking: 'Real loginLog tracking enabled',
  });
}
