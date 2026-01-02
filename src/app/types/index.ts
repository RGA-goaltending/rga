// types/index.ts
export interface TrainingSlot {
  id: string;
  date: string;       // ISO Date String (YYYY-MM-DD)
  startTime: string;  // "14:00"
  price: number;
  packageName: string;
  status: 'available' | 'booked' | 'pending';
  customerName?: string;
  customerEmail?: string;
  bookedAt?: string; // ISO String
  userId?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName?: string | null;
}