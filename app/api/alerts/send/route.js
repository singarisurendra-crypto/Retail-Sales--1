import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const getStoragePath = () => {
  const dir = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {}
  }
  return path.join(dir, "alert_settings.json");
};

const saveLogToHistory = (newLogs) => {
  try {
    const filePath = getStoragePath();
    let current = { settings: {}, history: [] };
    if (fs.existsSync(filePath)) {
      try {
        current = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      } catch (e) {}
    }
    const updatedHistory = [...newLogs, ...(current.history || [])].slice(0, 500);
    current.history = updatedHistory;
    fs.writeFileSync(filePath, JSON.stringify(current, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing alert history to storage:", err);
  }
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { recipients = [], message = "", alertType = "Daily Summary", displayDateTime = "" } = body;

    const results = [];
    const waToken = process.env.WHATSAPP_API_TOKEN;
    const waPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const isCloudApiConfigured = !!(waToken && waPhoneId);

    for (const rec of recipients) {
      const logId = `alt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const cleanNumber = rec.cleanMobile || (rec.mobile ? String(rec.mobile).replace(/[^0-9]/g, "") : "");
      const recipientName = rec.name || rec.recipient || "Recipient";
      const recipientMobileStr = rec.mobile || rec.recipientMobile || "";

      // 1. If recipient is disabled or missing number
      if (rec.status === "Disabled" || !rec.enabled) {
        results.push({
          id: logId,
          recipientId: rec.id,
          recipient: recipientName,
          name: recipientName,
          recipientMobile: recipientMobileStr,
          mobile: recipientMobileStr,
          cleanMobile: cleanNumber,
          alertType,
          status: "Disabled",
          messageId: "—",
          apiResponse: rec.reason || "Recipient alert is toggled OFF in Settings",
          timestamp: new Date().toISOString(),
          displayDateTime: displayDateTime || new Date().toLocaleString()
        });
        continue;
      }

      if (!cleanNumber || cleanNumber.length < 10) {
        results.push({
          id: logId,
          recipientId: rec.id,
          recipient: recipientName,
          name: recipientName,
          recipientMobile: recipientMobileStr,
          mobile: recipientMobileStr,
          cleanMobile: cleanNumber,
          alertType,
          status: "Failed",
          messageId: "—",
          apiResponse: "Invalid recipient – mobile number must contain at least 10 digits",
          timestamp: new Date().toISOString(),
          displayDateTime: displayDateTime || new Date().toLocaleString()
        });
        continue;
      }

      // 2. If WhatsApp Cloud API is configured in environment, dispatch HTTP POST
      if (isCloudApiConfigured) {
        try {
          const formattedTo = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
          const fbUrl = `https://graph.facebook.com/v20.0/${waPhoneId}/messages`;
          const fbRes = await fetch(fbUrl, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${waToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              recipient_type: "individual",
              to: formattedTo,
              type: "text",
              text: { body: message }
            })
          });

          const fbData = await fbRes.json();

          if (fbRes.ok && fbData.messages && fbData.messages.length > 0) {
            const msgId = fbData.messages[0].id || `wamid.${Date.now()}`;
            results.push({
              id: logId,
              recipientId: rec.id,
              recipient: recipientName,
              name: recipientName,
              recipientMobile: recipientMobileStr,
              mobile: recipientMobileStr,
              cleanMobile: formattedTo,
              alertType,
              status: "Sent",
              messageId: msgId,
              apiResponse: "Accepted (Meta WhatsApp API)",
              timestamp: new Date().toISOString(),
              displayDateTime: displayDateTime || new Date().toLocaleString()
            });
          } else {
            const errMsg = fbData.error?.message || "Invalid recipient / rejected by WhatsApp service";
            results.push({
              id: logId,
              recipientId: rec.id,
              recipient: recipientName,
              name: recipientName,
              recipientMobile: recipientMobileStr,
              mobile: recipientMobileStr,
              cleanMobile: formattedTo,
              alertType,
              status: "Failed",
              messageId: "—",
              apiResponse: `Failed – ${errMsg}`,
              timestamp: new Date().toISOString(),
              displayDateTime: displayDateTime || new Date().toLocaleString()
            });
          }
        } catch (fetchErr) {
          results.push({
            id: logId,
            recipientId: rec.id,
            recipient: recipientName,
            name: recipientName,
            recipientMobile: recipientMobileStr,
            mobile: recipientMobileStr,
            cleanMobile: cleanNumber,
            alertType,
            status: "Failed",
            messageId: "—",
            apiResponse: "Failed – WhatsApp service did not respond (network timeout)",
            timestamp: new Date().toISOString(),
            displayDateTime: displayDateTime || new Date().toLocaleString()
          });
        }
      } else {
        // 3. Fallback when Cloud API token is not yet configured:
        // Truthful status: Awaiting manual confirmation via WhatsApp Web client
        const webMsgId = `WA-WEB-${Date.now().toString(36).toUpperCase()}`;
        results.push({
          id: logId,
          recipientId: rec.id,
          recipient: recipientName,
          name: recipientName,
          recipientMobile: recipientMobileStr,
          mobile: recipientMobileStr,
          cleanMobile: cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber,
          alertType,
          status: "Ready",
          messageId: webMsgId,
          apiResponse: "Ready for manual dispatch via WhatsApp Web (Cloud API credentials not set in env)",
          fallbackToWeb: true,
          timestamp: new Date().toISOString(),
          displayDateTime: displayDateTime || new Date().toLocaleString()
        });
      }
    }

    // Persist logs in backend storage
    saveLogToHistory(results);

    return NextResponse.json({
      success: true,
      results,
      cloudApiActive: isCloudApiConfigured
    });
  } catch (err) {
    console.error("POST /api/alerts/send error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
