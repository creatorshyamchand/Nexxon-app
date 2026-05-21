// @ts-ignore - Deno edge function, not processed by Vite
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BOT_TOKEN = '8380074229:AAFgmH4xBaD_Z_pVIjez-qC-mXBBBs4z4cI'

// Auto-register the webhook on cold start (runs async, non-blocking)
let webhookRegistered = false
async function ensureWebhookRegistered() {
  if (webhookRegistered) return
  webhookRegistered = true
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const webhookUrl = `${supabaseUrl}/functions/v1/telegram-webhook`
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl, drop_pending_updates: false }),
    })
    console.log('Webhook registered:', webhookUrl)
  } catch (e) {
    console.error('Webhook registration failed:', e)
  }
}

async function answerCallback(callbackQueryId: string, text: string, showAlert = false) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackQueryId, text, show_alert: showAlert }),
    })
  } catch { /* non-critical */ }
}

async function editMessage(chatId: number, messageId: number, text: string, isPhoto: boolean) {
  const method = isPhoto ? 'editMessageCaption' : 'editMessageText'
  const bodyKey = isPhoto ? 'caption' : 'text'
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        [bodyKey]: text,
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: [] },
      }),
    })
  } catch (e) {
    console.error('editMessage error:', e)
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Manual webhook setup endpoint: GET ?setup=1
  const url = new URL(req.url)
  if (req.method === 'GET' && url.searchParams.get('setup') === '1') {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const webhookUrl = `${supabaseUrl}/functions/v1/telegram-webhook`
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl }),
    })
    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Trigger webhook registration on first cold start
  ensureWebhookRegistered()

  try {
    const body = await req.json()
    console.log('Telegram update:', JSON.stringify(body).slice(0, 500))

    // Handle inline keyboard callback (Approve / Reject button press)
    if (body.callback_query) {
      const { id: callbackId, data: callbackData, from, message } = body.callback_query

      if (!callbackData || !callbackData.includes(':')) {
        await answerCallback(callbackId, 'Invalid action')
        return new Response('ok', { headers: corsHeaders })
      }

      const colonIdx = callbackData.indexOf(':')
      const action = callbackData.slice(0, colonIdx)
      const orderId = callbackData.slice(colonIdx + 1)

      if (!orderId || !['approve', 'reject'].includes(action)) {
        await answerCallback(callbackId, 'Unknown action')
        return new Response('ok', { headers: corsHeaders })
      }

      // Update order in Supabase using service role key (bypasses RLS)
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SERVICE_ROLE_KEY')!
      )

      const newStatus = action === 'approve' ? 'approved' : 'rejected'

      const { data: order, error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('order_id', orderId)
        .select()
        .single()

      if (error || !order) {
        console.error('DB update error:', error)
        await answerCallback(callbackId, '❌ Failed to update order', true)
        return new Response('ok', { headers: corsHeaders })
      }

      // Answer the callback query popup
      const popupText = action === 'approve' ? '✅ Order Approved!' : '❌ Order Rejected'
      await answerCallback(callbackId, popupText, true)

      // Edit the original Telegram message to remove the buttons and show final status
      const adminName = from.username ? `@${from.username}` : from.first_name
      const statusLine = action === 'approve'
        ? `✅ <b>APPROVED</b> by ${adminName}`
        : `❌ <b>REJECTED</b> by ${adminName}`

      const updatedCaption = `${statusLine}

🆔 Order: <code>${orderId}</code>
👤 Customer: ${order.user_name}
🏷️ API: <b>${order.api_name}</b>
💰 Amount: ₹${order.total_amount}
🔢 UTR: <code>${order.utr_number}</code>`

      const isPhotoMessage = !!(message?.photo || message?.document)
      await editMessage(message.chat.id, message.message_id, updatedCaption, isPhotoMessage)
    }

    // Always return 200 — Telegram retries if it gets a non-200
    return new Response('ok', { headers: corsHeaders })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return new Response('ok', { headers: corsHeaders })
  }
})
