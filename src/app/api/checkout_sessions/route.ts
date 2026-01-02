import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!,
   {
  apiVersion: '2025-11-17',
});

export async function POST(req: NextRequest) {
  const { slotId, customerName, customerEmail } = await req.json();

  if (!slotId || !customerName || !customerEmail) {
    return NextResponse.json({ error: 'Missing required session information' }, { status: 400 });
  }

  try {
    const slotRef = doc(db, 'training_slots', slotId);
    const slotSnap = await getDoc(slotRef);

    if (!slotSnap.exists() || slotSnap.data().status !== 'available') {
      return NextResponse.json({ error: 'This slot is no longer available.' }, { status: 409 });
    }

    const slot = slotSnap.data();

    // Create a preliminary booking entry or mark as pending
    await updateDoc(slotRef, {
      status: 'pending',
      customerName,
      customerEmail,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Hockey Training - ${new Date(slot.date).toLocaleDateString()}`,
              description: `Private session at ${slot.startTime}`,
            },
            unit_amount: slot.price * 100, // Price in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/book?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/book?canceled=true`,
      metadata: {
        slotId: slotId,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe session creation failed:', error);
    // Revert the status if payment initiation fails
    const slotRef = doc(db, 'training_slots', slotId);
    await updateDoc(slotRef, { status: 'available', customerName: null, customerEmail: null });

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
