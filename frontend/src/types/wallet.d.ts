export interface Wallet {
  id: string;
  userId: string;
  balance: number; // stored in smallest currency unit (cents)
  currency: string;
}

export interface CreatePaymentRequest {
  amount: number; // in cents
}

export interface CreatePaymentResponse {
  clientSecret: string;
}
