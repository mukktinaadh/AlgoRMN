import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { error: dbError } = await supabaseAdmin
      .from("subscribers")
      .upsert({ email, confirmed: true }, { onConflict: "email" });

    if (dbError) {
      console.error("Supabase error:", dbError);
      return NextResponse.json(
        { error: "Could not save subscription" },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: "You're in — Algormn",
      html: `
        <div style="font-family: 'IBM Plex Mono', monospace; background: #0C0C0C; color: #F0EDE6; padding: 40px; max-width: 600px;">
          <h1 style="font-family: 'Playfair Display', serif; font-size: 28px; color: #F0EDE6; margin-bottom: 16px;">Welcome to Algormn.</h1>
          <p style="color: #A09C94; font-size: 14px; line-height: 1.8; margin-bottom: 24px;">
            Every week, one deep-dive on how systems actually work. No tutorials. No padding. Just the internals.
          </p>
          <p style="color: #A09C94; font-size: 14px; line-height: 1.8;">
            You'll get the next article in your inbox. Reply STOP anytime to unsubscribe.
          </p>
          <hr style="border: 1px solid #2A2A2A; margin: 32px 0;" />
          <p style="color: #5C5955; font-size: 12px;">Algormn · Built in India 🇮🇳</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Check your inbox!" });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
