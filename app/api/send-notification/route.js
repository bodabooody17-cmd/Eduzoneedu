// app/api/send-notification/route.js
// OneSignal real notification dispatch route

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID || 'b4eeea32-69c4-4ef9-a0d4-d6a8bbc8cde0';

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, message, actionUrl } = body || {};

    if (!title || !message) {
      return new Response(
        JSON.stringify({ success: false, error: 'title and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = (process.env.ONESIGNAL_REST_API_KEY || process.env.ONESIGNAL_API_KEY || '').trim();
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'ONESIGNAL_REST_API_KEY is not configured in environment variables' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const payload = {
      app_id: ONESIGNAL_APP_ID,
      included_segments: ['All'],
      headings: {
        en: title,
        ar: title,
      },
      contents: {
        en: message,
        ar: message,
      },
    };

    if (actionUrl && typeof actionUrl === 'string' && actionUrl.trim()) {
      payload.url = actionUrl.trim();
    }

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Key ${trimmedKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: data?.errors || `OneSignal error (${response.status})`,
          onesignal: data,
          app_id: ONESIGNAL_APP_ID,
        }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        app_id: ONESIGNAL_APP_ID,
        included_segments: ['All'],
        notification_id: data?.id,
        onesignal: data,
        message: 'تم إرسال الإشعار بنجاح عبر OneSignal لجميع المشتركين!',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
