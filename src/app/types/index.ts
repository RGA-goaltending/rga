// types/index.ts
export interface TrainingSlot {
  id: string;
  date: string;       // ISO Date String (YYYY-MM-DD)
  startTime: string;  // "14:00"
  price: number;
  status: 'available' | 'booked';
  customerName?: string;
  customerEmail?: string;
  bookedAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
}