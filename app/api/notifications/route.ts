import { db } from '../../../src/db/notificationsDb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'all';

    const notifications = await db.notification.findMany({
      where: userId !== 'all' ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return new Response(
      JSON.stringify({
        success: true,
        notifications,
        unreadCount,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err?.message || 'Failed to fetch notifications',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, message, userId = 'all', actionUrl, type = 'update' } = body || {};

    if (!title || !message) {
      return new Response(
        JSON.stringify({ success: false, error: 'title and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const notification = await db.notification.create({
      data: {
        userId,
        title,
        message,
        actionUrl,
        type,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        notification,
        message: 'Notification created successfully',
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err?.message || 'Failed to create notification',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
