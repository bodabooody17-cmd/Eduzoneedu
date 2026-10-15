import { db } from '../../../src/db/notificationsDb';

export async function POST(request: Request) {
  try {
    let userId: string | undefined;
    try {
      const body = await request.json();
      userId = body?.userId;
    } catch {}

    const result = await db.notification.markAllAsRead(userId);

    return new Response(
      JSON.stringify({
        success: true,
        count: result.count,
        message: 'All notifications marked as read',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
