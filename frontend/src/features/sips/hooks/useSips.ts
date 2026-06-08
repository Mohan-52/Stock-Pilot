import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  cancelSip,
  createSip,
  getSipExecutions,
  getSips,
  pauseSip,
  resumeSip,
  searchInstruments,
  SIP_PAGE_SIZE,
  updateSip,
} from "../api/sipApi";
import type { CreateSipPayload, UpdateSipPayload } from "../types/sip";

export const SIPS_QUERY_KEY = ["sips"];
export const SIP_EXECUTIONS_QUERY_KEY = ["sip-executions"];

export const useSips = (page = 0) => {
  return useQuery({
    queryKey: [...SIPS_QUERY_KEY, page],
    queryFn: () => getSips({ page, size: SIP_PAGE_SIZE }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
    retry: 1,
  });
};

export const useInstrumentSearch = (query: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["sip-instrument-search", query],
    queryFn: () => searchInstruments(query),
    enabled,
    staleTime: 1000 * 60,
  });
};

const useSipMutation = <TVariables,>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SIPS_QUERY_KEY });
    },
  });
};

export const useCreateSip = () => {
  return useSipMutation<CreateSipPayload>(createSip);
};

export const useUpdateSip = () => {
  return useSipMutation<{ sipId: string; payload: UpdateSipPayload }>(updateSip);
};

export const usePauseSip = () => {
  return useSipMutation<string>(pauseSip);
};

export const useResumeSip = () => {
  return useSipMutation<string>(resumeSip);
};

export const useCancelSip = () => {
  return useSipMutation<string>(cancelSip);
};

export const useSipExecutions = (sipId?: string, page = 0) => {
  return useQuery({
    queryKey: [...SIP_EXECUTIONS_QUERY_KEY, sipId, page],
    queryFn: () =>
      getSipExecutions({ sipId: sipId || "", page, size: SIP_PAGE_SIZE }),
    enabled: Boolean(sipId),
    placeholderData: keepPreviousData,
    retry: 1,
  });
};

export const SIP_FREQUENCIES = [
  "MINUTELY",
  "DAILY",
  "WEEKLY",
  "MONTHLY",
] as const;
