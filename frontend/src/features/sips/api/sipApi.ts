import apiClient from "../../../services/apiClient";
import type {
  CreateSipPayload,
  Instrument,
  SipExecutionResponse,
  SipResponse,
  UpdateSipPayload,
} from "../types/sip";

export const SIP_PAGE_SIZE = 10;

const extractErrorMessage = (error: unknown) => {
  const maybeError = error as {
    response?: { data?: { message?: string; error?: string } };
    message?: string;
  };

  return (
    maybeError?.response?.data?.message ||
    maybeError?.response?.data?.error ||
    maybeError?.message ||
    "Something went wrong."
  );
};

const withApiError = async <T>(request: () => Promise<{ data: T }>) => {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getSips = ({ page = 0, size = SIP_PAGE_SIZE } = {}) => {
  return withApiError<SipResponse>(() =>
    apiClient.get(`/sips?page=${page}&size=${size}`),
  );
};

export const createSip = (payload: CreateSipPayload) => {
  return withApiError(() => apiClient.post("/sips", payload));
};

export const updateSip = ({
  sipId,
  payload,
}: {
  sipId: string;
  payload: UpdateSipPayload;
}) => {
  return withApiError(() => apiClient.put(`/sips/${sipId}`, payload));
};

export const pauseSip = (sipId: string) => {
  return withApiError(() => apiClient.put(`/sips/${sipId}/pause`));
};

export const resumeSip = (sipId: string) => {
  return withApiError(() => apiClient.put(`/sips/${sipId}/resume`));
};

export const cancelSip = (sipId: string) => {
  return withApiError(() => apiClient.put(`/sips/${sipId}/cancel`));
};

export const getSipExecutions = ({
  sipId,
  page = 0,
  size = SIP_PAGE_SIZE,
}: {
  sipId: string;
  page?: number;
  size?: number;
}) => {
  return withApiError<SipExecutionResponse>(() =>
    apiClient.get(`/sips/${sipId}/executions?page=${page}&size=${size}`),
  );
};

export const searchInstruments = async (query: string) => {
  const response = await withApiError<Instrument[]>(() => apiClient.get("/stocks"));
  const search = query.trim().toLowerCase();

  if (!search) {
    return response.slice(0, 8);
  }

  return response
    .filter((instrument) =>
      [instrument.symbol, instrument.name]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(search)),
    )
    .slice(0, 8);
};
