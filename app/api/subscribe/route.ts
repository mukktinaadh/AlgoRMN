import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    // Validate
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Save to DB — this must succeed regardless of email
    const { error: dbError } = await supabaseAdmin
      .from('subscribers')
      .upsert({ email, confirmed: true }, { onConflict: 'email' })

    if (dbError) {
      console.error('DB error:', dbError.message)
      return NextResponse.json({ error: 'Could not save subscription' }, { status: 500 })
    }

    console.log('Subscriber saved:', email)

    // Send welcome email — failure here does NOT block success response
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
      
      console.log('Attempting email send to:', email, 'from:', fromAddress)
      
      const result = await resend.emails.send({
        from: fromAddress,
        to: email,
        subject: 'You are in — Algormn',
        html: `
          <div style="font-family:monospace;background:#0C0C0C;color:#F0EDE6;padding:40px;max-width:600px;margin:0 auto;">
            <h1 style="font-family:Georgia,serif;font-size:26px;color:#F0EDE6;margin-bottom:16px;">
              Welcome to Algormn.
            </h1>
            <p style="color:#A09C94;font-size:14px;line-height:1.8;margin-bottom:16px;">
              Every week, one deep-dive on how systems actually work. No tutorials. No padding. Just the internals.
            </p>
            <p style="color:#A09C94;font-size:14px;line-height:1.8;margin-bottom:32px;">
              You will get the next article in your inbox. Reply STOP anytime to unsubscribe.
            </p>
            <hr style="border:1px solid #2A2A2A;margin-bottom:24px;" />
            <p style="color:#5C5955;font-size:12px;">Algormn · Built in India</p>
          </div>
        `
      })

      console.log('Email result:', JSON.stringify(result))
    } catch (emailErr) {
      // Log but do not fail — subscriber is already saved
      console.error('Email send failed (non-critical):', emailErr)
    }

    return NextResponse.json({ success: true, message: 'Check your inbox!' })

  } catch (err) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
