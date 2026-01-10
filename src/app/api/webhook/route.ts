import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/app/lib/firebaseAdmin'; 


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover', // Use the version compatible with your types
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const reqBuffer = await req.arrayBuffer();

  let event;

  try {
    event = stripe.webhooks.constructEvent(Buffer.from(reqBuffer), sig!, webhookSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      
      if (!session.metadata?.slotId) {
        return NextResponse.json({ error: 'No slotId in metadata' }, { status: 400 });
      }

      const { slotId, userId } = session.metadata;
      const customerEmail = session.customer_details?.email;
      const customerName = session.customer_details?.name;

      try {
        const slotRef = adminDb.collection('training_slots').doc(slotId);

        // ✅ USE A TRANSACTION
        // This prevents race conditions (e.g., 2 people buying the last spot at the exact same millisecond)
        await adminDb.runTransaction(async (transaction) => {
          const slotDoc = await transaction.get(slotRef);

          if (!slotDoc.exists) {
            throw new Error("Slot does not exist!");
          }

          const currentData = slotDoc.data();
          const currentBooked = currentData?.bookedCount || 0;
          const capacity = currentData?.capacity || 1; // Default to 1 if missing

          // 1. Calculate new count
          const newBookedCount = currentBooked + 1;

          // 2. Determine if we are now full
          // If count >= capacity, mark as 'sold_out'. Otherwise, stay 'available'.
          const newStatus = newBookedCount >= capacity ? 'sold_out' : 'available';

          // 3. Update the Main Slot (Counters only)
          transaction.update(slotRef, {
            status: newStatus,
            bookedCount: newBookedCount,
          });

          // 4. Save the Student in a SUB-COLLECTION
          // This creates a list: training_slots/{id}/bookings/{bookingId}
          const newBookingRef = slotRef.collection('bookings').doc(); 
          transaction.set(newBookingRef, {
            userId: userId,
            customerName: customerName,
            customerEmail: customerEmail,
            stripeSessionId: session.id,
            bookedAt: new Date().toISOString(),
            status: 'confirmed'
          });
        });

        console.log(`✅ Slot ${slotId} booking confirmed. Count increased.`);

      } catch (dbError) {
        console.error(`❌ Database update failed for slot ${slotId}:`, dbError);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
      break;

    case 'checkout.session.async_payment_failed':
    case 'checkout.session.expired':
      // Since we don't reserve spots *before* payment anymore (to allow multiple people to try),
      // we don't need to revert anything here. The spot was never taken.
      console.log('Payment failed or expired.');
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}