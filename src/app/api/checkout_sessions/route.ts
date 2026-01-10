import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/app/lib/firebaseAdmin'; // Ensure this path matches where you created the file

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover'  // Cast if your types are older than the version string
});

export async function POST(req: NextRequest) {
  let slotId: string | null = null;

  try {
    const body = await req.json();
    slotId = body.slotId;
    const { customerName, customerEmail, userId } = body;

    if (!slotId || !customerName || !customerEmail || !userId) {
      return NextResponse.json({ error: 'Missing required session information' }, { status: 400 });
    }

    // 1. Use Admin SDK to get the slot (Bypasses Security Rules)
    const slotRef = adminDb.collection('training_slots').doc(slotId);
    const slotSnap = await slotRef.get();

    // 2. Check availability
    if (!slotSnap.exists || slotSnap.data()?.status !== 'available') {
      return NextResponse.json({ error: 'This slot is no longer available.' }, { status: 409 });
    }

    const slot = slotSnap.data()!;

    // 3. Data Validation
    if (
      typeof slot.price !== 'number' ||
      !slot.packageName ||
      !slot.date ||
      !slot.startTime
    ) {
      console.error('Invalid slot data:', slot);
      throw new Error('Corrupt slot data in the database. Please contact support.');
    }

    const trainingDate = new Date(slot.date);
    if (isNaN(trainingDate.getTime())) {
      console.error('Invalid date format:', slot);
      throw new Error('Corrupt date format in the database.');
    }

    // 4. Mark as "Pending" (Admin Write)
    await slotRef.update({
      status: 'pending',
      customerName,
      customerEmail,
      userId,
    });

    // 5. Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: slot.packageName,
              description: `Training session on ${trainingDate.toLocaleDateString()} at ${slot.startTime}`,
            },
            unit_amount: slot.price * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/book?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/book?canceled=true`,
      metadata: {
        slotId: slotId,
        userId: userId,
      },
      customer_email: customerEmail,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });

  } catch (error: unknown) { // FIXED: Changed 'any' to 'unknown'
    console.error('Booking Process Error:', error);

    // 6. Revert Logic (Using Admin SDK)
    if (slotId) {
      try {
        const slotRef = adminDb.collection('training_slots').doc(slotId);
        const slotSnap = await slotRef.get();
        
        // Only revert if it is still "pending"
        if (slotSnap.exists && slotSnap.data()?.status === 'pending') {
          await slotRef.update({
            status: 'available',
            customerName: null,
            customerEmail: null,
            userId: null,
          });
          console.log(`Successfully reverted slot ${slotId} to available.`);
        }
      } catch (revertError) {
        console.error(`CRITICAL: Failed to revert slot status for slotId ${slotId}:`, revertError);
      }
    }

    // FIXED: Type check the error message
    let errorMessage = 'An unknown error occurred. Please try again.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}