import { useState } from "react";
import { addToWatchlist, removeFromWatchlist } from "../api/watchlistAPI";
import { useToast } from "../../../components/ToastProvider";

const WatchlistButton = ({
  symbol,
  watchlisted,
  onOptimisticChange,
  size = "md",
  showLabel = false,
}) => {
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!symbol || isSaving) {
      return;
    }

    const nextValue = !watchlisted;
    setIsSaving(true);
    onOptimisticChange?.(symbol, nextValue);

    try {
      if (nextValue) {
        await addToWatchlist(symbol);
        toast?.push("success", `${symbol} added to watchlist.`);
      } else {
        await removeFromWatchlist(symbol);
        toast?.push("success", `${symbol} removed from watchlist.`);
      }
    } catch (error) {
      onOptimisticChange?.(symbol, watchlisted);
      toast?.push(
        "error",
        error?.response?.data?.message ||
          error?.message ||
          "Unable to update watchlist.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const iconSize = size === "sm" ? "text-xl" : "text-2xl";

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isSaving}
      aria-label={watchlisted ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
      title={watchlisted ? "Remove from watchlist" : "Add to watchlist"}
      className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 ${showLabel ? "w-auto" : "w-10"} ${iconSize} leading-none text-amber-300 transition hover:border-amber-300/60 hover:bg-amber-300/10 disabled:cursor-wait disabled:opacity-60`}
    >
      <span>{watchlisted ? "★" : "☆"}</span>
      {showLabel && (
        <span className="text-sm font-semibold text-slate-100">
          {watchlisted ? "Watchlisted" : "Not Watchlisted"}
        </span>
      )}
    </button>
  );
};

export default WatchlistButton;
