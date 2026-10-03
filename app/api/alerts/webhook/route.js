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

const updateStatusInStorage = (messageId, newStatus, responseText) => {
  try {
    const filePath = getStoragePath();
    if (!fs.existsSync(filePath)) return;
    const current = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    let modified = false;

    if (Array.isArray(current.history)) {
      current.history = current.history.map((item) => {
        if (item.messageId === messageId || item.id === messageId) {
          modified = true;
          return {
            ...item,
            status: newStatus,
            apiResponse: responseText || item.apiResponse,
            updatedAt: new Date().toISOString()
          };
        }
        return item;
      });
    }

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(current, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Error updating webhook status in storage:", err);
  }
};

// GET: Meta Webhook Verification Challenge
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "jsr_retail_verify_token";

    if (mode === "subscribe" && token === expectedToken) {
      console.log("Meta WhatsApp Webhook verified successfully!");
      return new Response(challenge, { status: 200 });
    }

    return new Response("Forbidden: Invalid verify token", { status: 403 });
  } catch (err) {
    console.error("Webhook GET error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// POST: Meta WhatsApp Delivery Receipts & Error Callbacks
export async function POST(req) {
  try {
    const body = await req.json();

    if (body.object === "whatsapp_business_account" || body.entry) {
      const entries = body.entry || [];
      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value || {};
          const statuses = value.statuses || [];

          for (const st of statuses) {
            const msgId = st.id;
            const rawStatus = (st.status || "").toLowerCase();
            const errors = st.errors || [];

            let mappedStatus = "Sent";
            let responseText = `Status: ${rawStatus}`;

            if (rawStatus === "delivered") {
              mappedStatus = "Delivered";
              responseText = "Delivered to recipient handset";
            } else if (rawStatus === "read") {
              mappedStatus = "Read";
              responseText = "Read by recipient";
            } else if (rawStatus === "sent") {
              mappedStatus = "Sent";
              responseText = "Dispatched by telecom network";
            } else if (rawStatus === "failed") {
              mappedStatus = "Failed";
              if (errors.length > 0) {
                const err = errors[0];
                const code = err.code || "";
                const title = err.title || err.message || "";
                const details = err.error_data?.details || "";

                if (code === 131047) {
                  responseText = `Failed (Code 131047): 24-hour customer window is closed. Recipient must message your WhatsApp business number first or an approved template must be used.`;
                } else if (code === 131026) {
                  responseText = `Failed (Code 131026): Message undeliverable. Recipient number is not registered on WhatsApp.`;
                } else {
                  responseText = `Failed (Code ${code}): ${title} ${details}`.trim();
                }
              } else {
                responseText = "Failed: Rejected by WhatsApp service";
              }
            }

            console.log(`[Webhook Update] msgId=${msgId} status=${mappedStatus} reason=${responseText}`);
            updateStatusInStorage(msgId, mappedStatus, responseText);
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook POST error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
