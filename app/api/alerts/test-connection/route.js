import { NextResponse } from "next/server";

export async function GET() {
  const waToken = process.env.WHATSAPP_API_TOKEN || "EABAMPOndUj8BSqjB0UZBbWeZChZBRyv46QxXS6otXvY5GTiOYR6hzs9Ed5G2WhCbVgLZCS2zCXLeCXUi82Abc4E4tsYTnF6Ws4kd3DxLo0XCL3gWwssNb5dJw99T4yPcBpMZC3v58mmlW1jxz2K4nlmO2lZAGq1AlYiPZAKsfyJlc2wzk0apVJcNuK5pszWYFXD1gZDZD";
  const waPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || "1300895136448574";

  if (!waToken || !waPhoneId) {
    return NextResponse.json({
      configured: false,
      mode: "WhatsApp Web Client (wa.me)",
      message: "Meta Cloud API credentials are not set in environment variables (WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID). The application runs in WhatsApp Web mode.",
      instructions: [
        "1. In WhatsApp Web mode, clicking 'Open WhatsApp' opens the pre-filled business summary in WhatsApp Web.",
        "2. To enable automated delivery and handset tracking, obtain a WhatsApp Business API Token and Phone Number ID from Meta Business Suite (developers.facebook.com).",
        "3. Configure WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID, and set webhook URL to https://your-domain.vercel.app/api/alerts/webhook"
      ]
    });
  }

  try {
    const metaUrl = `https://graph.facebook.com/v20.0/${waPhoneId}?fields=verified_name,display_phone_number,quality_rating,code_verification_status`;
    const res = await fetch(metaUrl, {
      headers: { "Authorization": `Bearer ${waToken}` }
    });
    const data = await res.json();

    if (res.ok && !data.error) {
      return NextResponse.json({
        configured: true,
        mode: "Meta WhatsApp Cloud API (Automated Gateway)",
        verifiedName: data.verified_name || "Verified Business",
        displayPhoneNumber: data.display_phone_number || waPhoneId,
        qualityRating: data.quality_rating || "GREEN",
        verificationStatus: data.code_verification_status || "VERIFIED",
        webhookUrl: "/api/alerts/webhook",
        message: "WhatsApp Cloud API connection is active and authenticated!"
      });
    } else {
      const err = data.error || {};
      return NextResponse.json({
        configured: false,
        error: true,
        code: err.code,
        message: `Meta API Connection Failed: ${err.message || "Invalid credentials"}`,
        troubleshooting: err.code === 190 ? "Access token has expired. Please regenerate your System User or Permanent Token in Meta Business Manager." : "Check your Phone Number ID and permissions in Meta Developer Portal."
      }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({
      configured: false,
      error: true,
      message: `Network error connecting to Meta servers: ${err.message}`
    }, { status: 500 });
  }
}
