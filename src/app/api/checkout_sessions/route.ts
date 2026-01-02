import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  const { slotId, customerName, customerEmail, userId } = await req.json();

  if (!slotId || !customerName || !customerEmail || !userId) {
    return NextResponse.json({ error: 'Missing required session information' }, { status: 400 });
  }

  try {
    const slotRef = doc(db, 'training_slots', slotId);
    const slotSnap = await getDoc(slotRef);

    if (!slotSnap.exists() || slotSnap.data().status !== 'available') {
      return NextResponse.json({ error: 'This slot is no longer available.' }, { status: 409 });
    }

    const slot = slotSnap.data();

    await updateDoc(slotRef, {
      status: 'pending',
      customerName,
      customerEmail,
      userId, // Add userId to the document
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: slot.packageName,
              description: `Training session on ${new Date(slot.date).toLocaleDateString()} at ${slot.startTime}`,
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
        userId: userId,
      },
      customer_email: customerEmail,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });

  } catch (error) {
    console.error('Stripe session creation failed:', error);
    const slotRef = doc(db, 'training_slots', slotId);
    // Revert the status if payment initiation fails, removing the pending customer data
    await updateDoc(slotRef, { 
      status: 'available', 
      customerName: null, 
      customerEmail: null,
      userId: null,
    });

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
