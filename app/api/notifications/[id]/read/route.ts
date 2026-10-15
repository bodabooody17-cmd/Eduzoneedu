import { db } from '../../../../src/db/notificationsDb';

interface Params {
  params: {
    id: string;
  };
}

export async function POST(_request: Request, { params }: Params) {
  try {
    const id = params?.id;
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Notification ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updated = await db.notification.update({
      where: { id },
      data: { isRead: true },
    });

    if (!updated) {
      return new Response(
        JSON.stringify({ success: false, error: 'Notification not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        notification: updated,
        message: 'Notification marked as read',
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

export async function PATCH(request: Request, context: Params) {
  return POST(request, context);
}
