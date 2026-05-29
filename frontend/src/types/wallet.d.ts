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

export interface WalletTransaction {
  id: string;
  type: "BUY" | "SELL";
  amount: number;
  referenceId: string;
  createdAt: string;
}

export interface WalletTransactionsResponse {
  content: WalletTransaction[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
