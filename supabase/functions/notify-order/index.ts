const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { order, screenshotBase64 } = await req.json()

    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
    if (!botToken) {
      return new Response(
        JSON.stringify({ error: 'TELEGRAM_BOT_TOKEN not configured. Add it in Environment Variables.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const BOT_CHAT_ID = '8380074229'
    const ADMIN_CHAT_ID = '7224704901'

    const orderTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

    const message = `🆕 <b>NEW ORDER RECEIVED — NExXON API Marketplace</b>

━━━━━━━━━━━━━━━━━━━━━━━
🆔 <b>Order ID:</b> <code>${order.orderId}</code>
👤 <b>Name:</b> ${escapeHtml(order.userName)}
📱 <b>Username:</b> ${order.userUsername ? '@' + escapeHtml(order.userUsername.replace('@', '')) : 'N/A'}
📞 <b>Phone:</b> ${escapeHtml(order.userPhone || 'N/A')}

━━━━━━━━━━━━━━━━━━━━━━━
🏷️ <b>API Purchased:</b> ${escapeHtml(order.apiName)}
💰 <b>Original Price:</b> ₹${order.originalPrice}
🎉 <b>Discount:</b> -₹${order.discount}
💵 <b>Paid Amount:</b> ₹${order.totalAmount}

━━━━━━━━━━━━━━━━━━━━━━━
🔢 <b>UTR Number:</b> <code>${escapeHtml(order.utrNumber)}</code>
📸 <b>Screenshot:</b> ${order.screenshotUrl ? 'Attached below' : 'Not provided'}

━━━━━━━━━━━━━━━━━━━━━━━
⏰ <b>Order Time:</b> ${orderTime} IST
🌐 <b>User IP:</b> ${escapeHtml(order.ipAddress || 'Unknown')}`

    const sendMsg = async (chatId: string) => {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      })
      return res.json()
    }

    const sendPhoto = async (chatId: string, photoBase64: string, caption: string) => {
      // Convert base64 to blob for sendPhoto
      const base64Data = photoBase64.split(',')[1] || photoBase64
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'image/jpeg' })

      const form = new FormData()
      form.append('chat_id', chatId)
      form.append('photo', blob, 'screenshot.jpg')
      form.append('caption', caption)

      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        body: form,
      })
      return res.json()
    }

    // Send text messages to both
    const [botResult, adminResult] = await Promise.all([
      sendMsg(BOT_CHAT_ID),
      sendMsg(ADMIN_CHAT_ID),
    ])

    // Send screenshot if provided
    let screenshotResults = []
    if (screenshotBase64) {
      const caption = `📸 Payment Screenshot\n🆔 Order: ${order.orderId}\n👤 ${order.userName}`
      screenshotResults = await Promise.all([
        sendPhoto(BOT_CHAT_ID, screenshotBase64, caption),
        sendPhoto(ADMIN_CHAT_ID, screenshotBase64, caption),
      ])
    }

    return new Response(
      JSON.stringify({
        success: true,
        botResult,
        adminResult,
        screenshotResults,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('notify-order error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
