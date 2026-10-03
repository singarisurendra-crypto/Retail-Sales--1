import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const getStoragePath = () => {
  const dir = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      console.error("Error creating directory for alert settings:", e);
    }
  }
  return path.join(dir, "alert_settings.json");
};

const getDefaultSettings = () => ({
  enabled: true,
  alertTime: "00:00",
  ownerAlert: true,
  ownerMobile: "",
  partnerAlerts: true,
  sections: {
    sales: true,
    collections: true,
    payments: true,
    stock: true
  },
  partnerRecipients: [],
  lastDailyAlertDate: null
});

// GET: Retrieve latest saved settings and alert history
export async function GET() {
  try {
    const filePath = getStoragePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      return NextResponse.json({
        success: true,
        settings: parsed.settings || getDefaultSettings(),
        history: parsed.history || []
      });
    }

    return NextResponse.json({
      success: true,
      settings: getDefaultSettings(),
      history: []
    });
  } catch (err) {
    console.error("GET /api/alerts/settings error:", err);
    return NextResponse.json({
      success: true,
      settings: getDefaultSettings(),
      history: [],
      error: err.message
    });
  }
}

// POST: Save updated settings and/or alert history
export async function POST(req) {
  try {
    const body = await req.json();
    const filePath = getStoragePath();

    let current = {
      settings: getDefaultSettings(),
      history: []
    };

    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        current = JSON.parse(raw);
      } catch (e) {
        console.error("Error reading existing settings file:", e);
      }
    }

    if (body.settings) {
      current.settings = {
        ...current.settings,
        ...body.settings
      };
    }

    if (body.history && Array.isArray(body.history)) {
      current.history = body.history.slice(0, 500);
    }

    fs.writeFileSync(filePath, JSON.stringify(current, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "Alert settings persisted successfully",
      settings: current.settings,
      historyCount: current.history.length
    });
  } catch (err) {
    console.error("POST /api/alerts/settings error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
