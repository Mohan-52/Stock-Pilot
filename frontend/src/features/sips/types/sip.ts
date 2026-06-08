export type SipFrequency = "MINUTELY" | "DAILY" | "WEEKLY" | "MONTHLY";

export type SipStatus = "ACTIVE" | "PAUSED" | "CANCELLED";

export type SipExecutionStatus = "SUCCESS" | "FAILED";

export type Sip = {
  sipId: string;
  instrumentId: string;
  symbol: string;
  companyName: string;
  websiteUrl?: string | null;
  amountPerCycle: number;
  frequency: SipFrequency;
  nextExecutionDate?: string | null;
  status: SipStatus;
};

export type SipExecution = {
  executionTime: string;
  stockPrice: number;
  quantity: number;
  investedAmount: number;
  status: SipExecutionStatus;
  failureReason?: string | null;
};

export type SipResponse = {
  content: Sip[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type SipExecutionResponse = {
  content: SipExecution[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type Instrument = {
  id: string;
  symbol: string;
  name: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  price?: number | null;
};

export type CreateSipPayload = {
  instrumentId: string;
  amountPerCycle: number;
  frequency: SipFrequency;
};

export type UpdateSipPayload = {
  amountPerCycle: number;
  frequency: SipFrequency;
};
