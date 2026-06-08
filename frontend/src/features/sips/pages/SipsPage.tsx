import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  History,
  Pause,
  Pencil,
  Play,
  Plus,
  Search,
  X,
} from "lucide-react";
import Modal from "../../../components/Modal";
import { useToast } from "../../../components/ToastProvider";
import TradingLayout from "../../trading/components/TradingLayout";
import {
  SIP_FREQUENCIES,
  useCancelSip,
  useCreateSip,
  useInstrumentSearch,
  usePauseSip,
  useResumeSip,
  useSipExecutions,
  useSips,
  useUpdateSip,
} from "../hooks/useSips";
import type {
  Instrument,
  Sip,
  SipFrequency,
  SipStatus,
} from "../types/sip";

const formSchema = z.object({
  amount: z.coerce
    .number({ error: "Enter an amount." })
    .positive("Amount must be greater than zero.")
    .max(1_000_000, "Amount is too large."),
  frequency: z.enum(SIP_FREQUENCIES),
});

const createSchema = formSchema.extend({
  instrumentId: z.string().min(1, "Select an instrument."),
});

type ConfirmationAction = "pause" | "resume" | "cancel";

type ConfirmationState = {
  sip: Sip;
  action: ConfirmationAction;
} | null;

const inputClass =
  "min-h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 disabled:cursor-not-allowed disabled:opacity-60";

const formatCurrency = (cents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);

const formatDateTime = (value?: string | null) => {
  if (!value) return "Not scheduled";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not scheduled";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const statusStyles: Record<SipStatus, string> = {
  ACTIVE: "border-emerald-300/30 bg-emerald-400/10 text-emerald-300",
  PAUSED: "border-amber-300/30 bg-amber-400/10 text-amber-300",
  CANCELLED: "border-red-300/30 bg-red-400/10 text-red-300",
};

const StatusBadge = ({ status }: { status: SipStatus }) => (
  <span
    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
  >
    {status}
  </span>
);

const CompanyIdentity = ({ sip }: { sip: Sip }) => (
  <div className="flex min-w-0 items-center gap-3">
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-400/10 text-sm font-black text-emerald-300">
      {sip.symbol.slice(0, 2)}
    </span>
    <div className="min-w-0">
      <p className="truncate font-semibold text-white">{sip.companyName}</p>
      {sip.websiteUrl && (
        <a
          href={sip.websiteUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-slate-500 hover:text-emerald-300"
        >
          Visit website
        </a>
      )}
    </div>
  </div>
);

const SipActions = ({
  sip,
  onEdit,
  onConfirm,
  onHistory,
}: {
  sip: Sip;
  onEdit: (sip: Sip) => void;
  onConfirm: (sip: Sip, action: ConfirmationAction) => void;
  onHistory: (sip: Sip) => void;
}) => (
  <div className="flex flex-wrap gap-2">
    {sip.status !== "CANCELLED" && (
      <button
        type="button"
        onClick={() => onEdit(sip)}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </button>
    )}
    {sip.status === "ACTIVE" && (
      <button
        type="button"
        onClick={() => onConfirm(sip, "pause")}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-amber-300/20 bg-amber-400/10 px-3 text-xs font-semibold text-amber-200 transition hover:bg-amber-400/20"
      >
        <Pause className="h-3.5 w-3.5" />
        Pause
      </button>
    )}
    {sip.status === "PAUSED" && (
      <button
        type="button"
        onClick={() => onConfirm(sip, "resume")}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-3 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/20"
      >
        <Play className="h-3.5 w-3.5" />
        Resume
      </button>
    )}
    {sip.status !== "CANCELLED" && (
      <button
        type="button"
        onClick={() => onConfirm(sip, "cancel")}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-red-300/20 bg-red-400/10 px-3 text-xs font-semibold text-red-200 transition hover:bg-red-400/20"
      >
        <X className="h-3.5 w-3.5" />
        Cancel
      </button>
    )}
    <button
      type="button"
      onClick={() => onHistory(sip)}
      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-sky-300/20 bg-sky-400/10 px-3 text-xs font-semibold text-sky-200 transition hover:bg-sky-400/20"
    >
      <History className="h-3.5 w-3.5" />
      View History
    </button>
  </div>
);

const SipFormModal = ({
  isOpen,
  sip,
  onClose,
}: {
  isOpen: boolean;
  sip: Sip | null;
  onClose: () => void;
}) => {
  const toast = useToast();
  const createMutation = useCreateSip();
  const updateMutation = useUpdateSip();
  const [query, setQuery] = useState("");
  const [selectedInstrument, setSelectedInstrument] =
    useState<Instrument | null>(null);
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<SipFrequency>("MONTHLY");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = Boolean(sip);
  const isPending = createMutation.isPending || updateMutation.isPending;
  const instruments = useInstrumentSearch(query, isOpen && !isEdit);

  useEffect(() => {
    if (!isOpen) return;

    setQuery("");
    setSelectedInstrument(null);
    setAmount(sip ? String(sip.amountPerCycle / 100) : "");
    setFrequency(sip?.frequency || "MONTHLY");
    setErrors({});
  }, [isOpen, sip]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const values = {
      amount,
      frequency,
      ...(isEdit ? {} : { instrumentId: selectedInstrument?.id || "" }),
    };
    const result = (isEdit ? formSchema : createSchema).safeParse(values);

    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        nextErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    const payload = {
      amountPerCycle: result.data.amount,
      frequency: result.data.frequency,
    };

    try {
      if (sip) {
        await updateMutation.mutateAsync({ sipId: sip.sipId, payload });
        toast.push("success", `${sip.symbol} SIP updated successfully.`);
      } else {
        await createMutation.mutateAsync({
          ...payload,
          instrumentId: selectedInstrument!.id,
        });
        toast.push("success", "SIP created successfully.");
      }
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save this SIP.";
      setErrors({ form: message });
      toast.push("error", message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isPending ? () => undefined : onClose}
      title={isEdit ? `Edit ${sip?.symbol} SIP` : "Create SIP"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {isEdit ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Instrument
            </p>
            <p className="mt-2 font-semibold text-white">
              {sip?.symbol} · {sip?.companyName}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              The instrument cannot be changed after creation.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor="sip-instrument" className="text-sm font-semibold text-white">
              Instrument
            </label>
            {selectedInstrument ? (
              <div className="flex items-center justify-between rounded-lg border border-emerald-300/30 bg-emerald-400/10 p-3">
                <div className="flex min-w-0 items-center gap-3">
                  {selectedInstrument.logoUrl ? (
                    <img
                      src={selectedInstrument.logoUrl}
                      alt=""
                      className="h-10 w-10 rounded-lg bg-white object-contain p-1"
                    />
                  ) : (
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-800 text-sm font-bold">
                      {selectedInstrument.symbol.slice(0, 2)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-white">
                      {selectedInstrument.symbol}
                    </p>
                    <p className="truncate text-sm text-slate-400">
                      {selectedInstrument.name}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInstrument(null)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
                  aria-label="Change instrument"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="sip-instrument"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by symbol or company"
                    className={`${inputClass} pl-10`}
                  />
                </label>
                <div className="max-h-52 overflow-y-auto rounded-lg border border-white/10 bg-[#081423]">
                  {instruments.isLoading ? (
                    <div className="space-y-2 p-3">
                      {[0, 1, 2].map((item) => (
                        <div key={item} className="h-12 animate-pulse rounded-lg bg-white/[0.06]" />
                      ))}
                    </div>
                  ) : instruments.isError ? (
                    <p className="p-4 text-sm text-red-300">
                      Unable to load instruments.
                    </p>
                  ) : instruments.data?.length ? (
                    instruments.data.map((instrument) => (
                      <button
                        key={instrument.id}
                        type="button"
                        onClick={() => {
                          setSelectedInstrument(instrument);
                          setErrors((current) => ({ ...current, instrumentId: "" }));
                        }}
                        className="flex w-full items-center gap-3 border-b border-white/5 p-3 text-left transition last:border-0 hover:bg-white/[0.06]"
                      >
                        {instrument.logoUrl ? (
                          <img
                            src={instrument.logoUrl}
                            alt=""
                            className="h-9 w-9 rounded-lg bg-white object-contain p-1"
                          />
                        ) : (
                          <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-800 text-xs font-bold">
                            {instrument.symbol.slice(0, 2)}
                          </span>
                        )}
                        <span className="min-w-0">
                          <span className="block font-semibold text-white">
                            {instrument.symbol}
                          </span>
                          <span className="block truncate text-xs text-slate-400">
                            {instrument.name}
                          </span>
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-slate-400">
                      No matching instruments.
                    </p>
                  )}
                </div>
              </>
            )}
            {errors.instrumentId && (
              <p className="text-sm text-red-300">{errors.instrumentId}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="sip-amount" className="text-sm font-semibold text-white">
            Amount per cycle
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              $
            </span>
            <input
              id="sip-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className={`${inputClass} pl-8`}
              placeholder="50.00"
              disabled={isPending}
            />
          </div>
          {errors.amount && <p className="text-sm text-red-300">{errors.amount}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="sip-frequency" className="text-sm font-semibold text-white">
            Frequency
          </label>
          <select
            id="sip-frequency"
            value={frequency}
            onChange={(event) => setFrequency(event.target.value as SipFrequency)}
            className={inputClass}
            disabled={isPending}
          >
            {SIP_FREQUENCIES.map((option) => (
              <option key={option} value={option} className="bg-[#0b1728]">
                {option}
              </option>
            ))}
          </select>
          <p className="text-xs text-amber-300">
            MINUTELY exists only for demonstration and testing.
          </p>
          {errors.frequency && (
            <p className="text-sm text-red-300">{errors.frequency}</p>
          )}
        </div>

        {errors.form && (
          <p className="rounded-lg border border-red-300/20 bg-red-400/10 p-3 text-sm text-red-200">
            {errors.form}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="min-h-11 rounded-lg border border-white/10 px-4 text-sm font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="min-h-11 rounded-lg bg-emerald-400 px-5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-600"
          >
            {isPending ? "Saving..." : isEdit ? "Save changes" : "Create SIP"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const ConfirmationDialog = ({
  state,
  onClose,
}: {
  state: ConfirmationState;
  onClose: () => void;
}) => {
  const toast = useToast();
  const pauseMutation = usePauseSip();
  const resumeMutation = useResumeSip();
  const cancelMutation = useCancelSip();
  const mutation =
    state?.action === "pause"
      ? pauseMutation
      : state?.action === "resume"
        ? resumeMutation
        : cancelMutation;
  const isPending = mutation.isPending;

  const copy = {
    pause: {
      title: "Pause SIP",
      message: "Pause this SIP? Scheduled investments will stop until resumed.",
      confirm: "Pause SIP",
    },
    resume: {
      title: "Resume SIP",
      message: "Resume this SIP? Scheduled investments will begin again.",
      confirm: "Resume SIP",
    },
    cancel: {
      title: "Cancel SIP",
      message: "Cancel this SIP permanently?",
      confirm: "Cancel SIP",
    },
  };

  const handleConfirm = async () => {
    if (!state) return;

    try {
      await mutation.mutateAsync(state.sip.sipId);
      const completedAction = {
        pause: "paused",
        resume: "resumed",
        cancel: "cancelled",
      }[state.action];
      toast.push(
        "success",
        `${state.sip.symbol} SIP ${completedAction} successfully.`,
      );
      onClose();
    } catch (error) {
      toast.push(
        "error",
        error instanceof Error ? error.message : `Unable to ${state.action} SIP.`,
      );
    }
  };

  const current = state ? copy[state.action] : copy.pause;

  return (
    <Modal isOpen={Boolean(state)} onClose={isPending ? () => undefined : onClose} title={current.title} size="max-w-md">
      <p className="text-sm leading-6 text-slate-300">{current.message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="min-h-11 rounded-lg border border-white/10 px-4 text-sm font-semibold text-slate-200 hover:bg-white/10"
        >
          Keep SIP
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isPending}
          className={`min-h-11 rounded-lg px-4 text-sm font-semibold text-white disabled:opacity-50 ${
            state?.action === "cancel"
              ? "bg-red-500 hover:bg-red-400"
              : "bg-emerald-500 hover:bg-emerald-400"
          }`}
        >
          {isPending ? "Working..." : current.confirm}
        </button>
      </div>
    </Modal>
  );
};

const HistoryDrawer = ({
  sip,
  onClose,
}: {
  sip: Sip | null;
  onClose: () => void;
}) => {
  const [page, setPage] = useState(0);
  const executions = useSipExecutions(sip?.sipId, page);

  useEffect(() => {
    setPage(0);
  }, [sip?.sipId]);

  if (!sip) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70">
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
        aria-label="Close history"
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-3xl flex-col border-l border-white/10 bg-[#091525] shadow-2xl">
        <div className="flex items-start justify-between border-b border-white/10 p-5 sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
              {sip.symbol}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              SIP Execution History
            </h2>
            <p className="mt-1 text-sm text-slate-400">{sip.companyName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label="Close history"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {executions.isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="h-24 animate-pulse rounded-lg bg-white/[0.06]" />
              ))}
            </div>
          ) : executions.isError ? (
            <div className="rounded-lg border border-red-300/20 bg-red-400/10 p-5 text-red-200">
              <p className="font-semibold">Unable to load SIP history</p>
              <p className="mt-2 text-sm">
                {executions.error instanceof Error
                  ? executions.error.message
                  : "Please try again."}
              </p>
              <button
                type="button"
                onClick={() => executions.refetch()}
                className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white"
              >
                Retry
              </button>
            </div>
          ) : !executions.data?.content.length ? (
            <div className="grid min-h-72 place-items-center text-center">
              <div>
                <History className="mx-auto h-10 w-10 text-slate-600" />
                <p className="mt-4 font-semibold text-white">
                  No SIP executions yet.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto rounded-lg border border-white/10 md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/[0.05] text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Execution Time</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Quantity</th>
                      <th className="px-4 py-3">Stock Price</th>
                      <th className="px-4 py-3">Invested Amount</th>
                      <th className="px-4 py-3">Failure Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {executions.data.content.map((execution, index) => (
                      <tr key={`${execution.executionTime}-${index}`}>
                        <td className="whitespace-nowrap px-4 py-4 text-slate-300">
                          {formatDateTime(execution.executionTime)}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              execution.status === "SUCCESS"
                                ? "bg-emerald-400/10 text-emerald-300"
                                : "bg-red-400/10 text-red-300"
                            }`}
                          >
                            {execution.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-300">
                          {execution.quantity.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-slate-300">
                          {formatCurrency(execution.stockPrice)}
                        </td>
                        <td className="px-4 py-4 text-slate-300">
                          {formatCurrency(execution.investedAmount)}
                        </td>
                        <td className="px-4 py-4 text-xs text-red-200">
                          {execution.failureReason || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 md:hidden">
                {executions.data.content.map((execution, index) => (
                  <article
                    key={`${execution.executionTime}-${index}`}
                    className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">
                        {formatDateTime(execution.executionTime)}
                      </p>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          execution.status === "SUCCESS"
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-red-400/10 text-red-300"
                        }`}
                      >
                        {execution.status}
                      </span>
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-xs text-slate-500">Quantity</dt>
                        <dd className="mt-1 text-slate-200">
                          {execution.quantity.toLocaleString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-slate-500">Stock Price</dt>
                        <dd className="mt-1 text-slate-200">
                          {formatCurrency(execution.stockPrice)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-slate-500">Invested</dt>
                        <dd className="mt-1 text-slate-200">
                          {formatCurrency(execution.investedAmount)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-slate-500">Failure Reason</dt>
                        <dd className="mt-1 break-words text-red-200">
                          {execution.failureReason || "—"}
                        </dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>

        {executions.data && executions.data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 p-4">
            <p className="text-sm text-slate-400">
              Page {page + 1} of {executions.data.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-lg border border-white/10 p-2 text-slate-200 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={executions.data.last}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border border-white/10 p-2 text-slate-200 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

const SipsPage = () => {
  const [page, setPage] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSip, setEditingSip] = useState<Sip | null>(null);
  const [historySip, setHistorySip] = useState<Sip | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationState>(null);
  const sips = useSips(page);

  const summary = useMemo(() => {
    const content = sips.data?.content || [];
    return {
      active: content.filter((sip) => sip.status === "ACTIVE").length,
      monthly: content
        .filter((sip) => sip.status === "ACTIVE" && sip.frequency === "MONTHLY")
        .reduce((sum, sip) => sum + sip.amountPerCycle, 0),
    };
  }, [sips.data?.content]);

  const openCreate = () => {
    setEditingSip(null);
    setFormOpen(true);
  };

  const actions = (
    <button
      type="button"
      onClick={openCreate}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
    >
      <Plus className="h-4 w-4" />
      Create SIP
    </button>
  );

  return (
    <TradingLayout
      eyebrow="Recurring investments"
      title="Systematic Investment Plans"
      subtitle="Automate recurring investments into your favorite stocks."
      actions={actions}
    >
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-emerald-400/10 p-2 text-emerald-300">
              <CalendarClock className="h-5 w-5" />
            </span>
            <p className="text-sm text-slate-400">Active SIPs on this page</p>
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">{summary.active}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-sky-400/10 p-2 text-sky-300">
              <CircleDollarSign className="h-5 w-5" />
            </span>
            <p className="text-sm text-slate-400">Active monthly allocation</p>
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">
            {formatCurrency(summary.monthly)}
          </p>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-lg border border-white/10 bg-[#0b1728]">
        <div className="border-b border-white/10 p-5">
          <h2 className="text-lg font-semibold text-white">Your SIPs</h2>
          <p className="mt-1 text-sm text-slate-400">
            Manage amounts, schedules, and execution history.
          </p>
        </div>

        {sips.isLoading ? (
          <div className="space-y-3 p-4">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="h-24 animate-pulse rounded-lg bg-white/[0.06]" />
            ))}
          </div>
        ) : sips.isError ? (
          <div className="p-4">
            <div className="rounded-lg border border-red-300/20 bg-red-400/10 p-5 text-red-200">
              <p className="font-semibold">Unable to load SIPs</p>
              <p className="mt-2 text-sm">
                {sips.error instanceof Error ? sips.error.message : "Please try again."}
              </p>
              <button
                type="button"
                onClick={() => sips.refetch()}
                className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white"
              >
                Retry
              </button>
            </div>
          </div>
        ) : !sips.data?.content.length ? (
          <div className="p-10 text-center">
            <CalendarClock className="mx-auto h-12 w-12 text-slate-600" />
            <h2 className="mt-5 text-xl font-semibold text-white">No SIPs yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Create your first recurring investment plan and let Stock Pilot
              handle the schedule.
            </p>
            <button
              type="button"
              onClick={openCreate}
              className="mt-6 rounded-lg bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
            >
              Create SIP
            </button>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-5 py-3">Company</th>
                    <th className="px-5 py-3">Symbol</th>
                    <th className="px-5 py-3">Amount Per Cycle</th>
                    <th className="px-5 py-3">Frequency</th>
                    <th className="px-5 py-3">Next Execution</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {sips.data.content.map((sip) => (
                    <tr key={sip.sipId} className="align-top hover:bg-white/[0.02]">
                      <td className="px-5 py-4">
                        <CompanyIdentity sip={sip} />
                      </td>
                      <td className="px-5 py-4 font-semibold text-white">{sip.symbol}</td>
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-white">
                        {formatCurrency(sip.amountPerCycle)}
                      </td>
                      <td className="px-5 py-4 text-slate-300">{sip.frequency}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-300">
                        {formatDateTime(sip.nextExecutionDate)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={sip.status} />
                      </td>
                      <td className="min-w-80 px-5 py-4">
                        <SipActions
                          sip={sip}
                          onEdit={(selected) => {
                            setEditingSip(selected);
                            setFormOpen(true);
                          }}
                          onConfirm={(selected, action) =>
                            setConfirmation({ sip: selected, action })
                          }
                          onHistory={setHistorySip}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 p-4 lg:hidden">
              {sips.data.content.map((sip) => (
                <article
                  key={sip.sipId}
                  className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <CompanyIdentity sip={sip} />
                    <StatusBadge status={sip.status} />
                  </div>
                  <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-xs text-slate-500">Symbol</dt>
                      <dd className="mt-1 font-semibold text-white">{sip.symbol}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Amount</dt>
                      <dd className="mt-1 font-semibold text-white">
                        {formatCurrency(sip.amountPerCycle)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Frequency</dt>
                      <dd className="mt-1 text-slate-200">{sip.frequency}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Next Execution</dt>
                      <dd className="mt-1 text-slate-200">
                        {formatDateTime(sip.nextExecutionDate)}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <SipActions
                      sip={sip}
                      onEdit={(selected) => {
                        setEditingSip(selected);
                        setFormOpen(true);
                      }}
                      onConfirm={(selected, action) =>
                        setConfirmation({ sip: selected, action })
                      }
                      onHistory={setHistorySip}
                    />
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {sips.data && sips.data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 p-4">
            <p className="text-sm text-slate-400">
              Page {page + 1} of {sips.data.totalPages} · {sips.data.totalElements} SIPs
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-lg border border-white/10 p-2 text-slate-200 disabled:opacity-30"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={sips.data.last}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border border-white/10 p-2 text-slate-200 disabled:opacity-30"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      <SipFormModal
        isOpen={formOpen}
        sip={editingSip}
        onClose={() => {
          setFormOpen(false);
          setEditingSip(null);
        }}
      />
      <ConfirmationDialog
        state={confirmation}
        onClose={() => setConfirmation(null)}
      />
      <HistoryDrawer sip={historySip} onClose={() => setHistorySip(null)} />
    </TradingLayout>
  );
};

export default SipsPage;
