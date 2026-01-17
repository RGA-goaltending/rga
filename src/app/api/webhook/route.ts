import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/app/lib/firebaseAdmin';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  
  // FIX: headers() is now async in Next.js 15
  const headerList = await headers();
  const sig = headerList.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Extract data
    const { bookingId, slotId, userId } = session.metadata!;
    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name;

    try {
        console.log(`💰 Payment received for Booking: ${bookingId}`);

        // 1. Mark Booking as PAID
        await adminDb.collection('bookings').doc(bookingId).update({
            status: 'paid',
            stripeSessionId: session.id,
            amountPaid: session.amount_total ? session.amount_total / 100 : 0,
            paidAt: new Date().toISOString()
        });

        // 2. Mark Slot as SOLD OUT
        if (slotId) {
            await adminDb.collection('training_slots').doc(slotId).update({
                status: 'sold_out',
                bookedBy: userId,
                bookingId: bookingId
            });
        }

        // 3. Send Confirmation Email
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS && customerEmail) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            await transporter.sendMail({
                from: '"RGA Goaltending" <no-reply@goalieschool.ca>',
                to: customerEmail,
                subject: '✅ Payment Received: Session Confirmed',
                text: `
                  Hi ${customerName},

                  Your payment was successful! Your training session is now fully secured.
                  
                  You can view your confirmed schedule in the "My Bookings" tab on our website.

                  Thank you,
                  RGA Team
                `
            });
            console.log("✅ Confirmation email sent.");
        }

    } catch (error) {
        console.error("Error updating database after payment:", error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}