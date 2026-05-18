export interface Position {
  symbol: string;
  quantity: number;
  avgPriceInCents: number;
  currentPriceInCents: number;
  invested: number;
  currentValue: number;
  pnl: number;
  pnlPercentage: number;
}

export interface BuyOrderRequest {
  symbol: string;
  quantity: number;
}

export interface SellOrderRequest {
  symbol: string;
  quantity: number;
}

export interface OrderResponse {
  orderId: string;
  status: string;
}

export interface PaginatedPositionResponse {
  content: Position[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
