import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const reqBuffer = await req.arrayBuffer();

  let event;

  try {
    event = stripe.webhooks.constructEvent(Buffer.from(reqBuffer), sig!, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      const { slotId } = session.metadata!;

      try {
        const slotRef = doc(db, 'training_slots', slotId);
        const slotSnap = await getDoc(slotRef);

        if (slotSnap.exists() && slotSnap.data().status === 'pending') {
          await updateDoc(slotRef, {
            status: 'booked',
            bookedAt: new Date().toISOString(),
            stripeSessionId: session.id,
          });
          console.log(`Slot ${slotId} successfully booked.`);
        }
      } catch (dbError) {
        console.error(`Database update failed for slot ${slotId}:`, dbError);
        // Optionally, handle this error, e.g., by logging or sending an alert
      }
      break;

    case 'checkout.session.async_payment_failed':
    case 'checkout.session.expired':
      const failedSession = event.data.object as Stripe.Checkout.Session;
      const { slotId: failedSlotId } = failedSession.metadata!;

      try {
        const slotRef = doc(db, 'training_slots', failedSlotId);
        const slotSnap = await getDoc(slotRef);

        // Only revert if it's still in the 'pending' state
        if (slotSnap.exists() && slotSnap.data().status === 'pending') {
          await updateDoc(slotRef, {
            status: 'available',
            customerName: null,
            customerEmail: null,
          });
          console.log(`Booking for slot ${failedSlotId} expired or failed. Slot is now available.`);
        }
      } catch (dbError) {
        console.error(`Database revert failed for slot ${failedSlotId}:`, dbError);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
