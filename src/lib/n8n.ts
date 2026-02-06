/**
 * n8n Integration Stubs
 * 
 * This module provides placeholder functions for n8n webhook integration.
 * Replace the webhook URLs with your actual n8n endpoints when ready.
 */

// Placeholder webhook URL - replace with actual n8n webhook URL
const N8N_WEBHOOK_BASE_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || '';

interface N8nWebhookPayload {
  event: string;
  data: Record<string, unknown>;
  timestamp: string;
  userId?: string;
}

/**
 * Trigger an n8n workflow via webhook
 * @param endpoint - The webhook endpoint path (e.g., '/user-login')
 * @param payload - The data to send to the workflow
 */
export async function triggerN8nWorkflow(
  endpoint: string,
  payload: Omit<N8nWebhookPayload, 'timestamp'>
): Promise<{ success: boolean; error?: string }> {
  if (!N8N_WEBHOOK_BASE_URL) {
    console.warn('[n8n] Webhook URL not configured. Set VITE_N8N_WEBHOOK_URL in environment.');
    return { success: false, error: 'n8n webhook not configured' };
  }

  try {
    const response = await fetch(`${N8N_WEBHOOK_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('[n8n] Webhook error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Notify n8n of a successful user login
 */
export async function notifyUserLogin(userId: string, email: string) {
  return triggerN8nWorkflow('/user-login', {
    event: 'user.login',
    data: { email },
    userId,
  });
}

/**
 * Notify n8n of an access denied event
 */
export async function notifyAccessDenied(email: string) {
  return triggerN8nWorkflow('/access-denied', {
    event: 'user.access_denied',
    data: { email },
  });
}
