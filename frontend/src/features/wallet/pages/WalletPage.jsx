import { useState } from "react";
import WalletCard from "../components/WalletCard";
import WalletTransactions from "../components/WalletTransactions";
import AddMoneyModal from "../components/AddMoneyModal";
import { useWallet } from "../hooks/useWallet";
import { ToastProvider } from "../components/ToastProvider";
import TradingLayout from "../../trading/components/TradingLayout";

const WalletPage = () => {
  const [open, setOpen] = useState(false);
  const { refetch } = useWallet();

  const handleSuccess = async () => {
    // After successful payment confirmation, refetch wallet
    await refetch();
  };

  return (
    <ToastProvider>
      <TradingLayout
        eyebrow="Wallet"
        title="Cash balance"
        subtitle="Manage simulator cash and review wallet activity alongside your trading workflow."
      >
        <div className="max-w-4xl">
          <WalletCard onAddMoney={() => setOpen(true)} />
          <WalletTransactions />
        </div>

        <AddMoneyModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onSuccess={handleSuccess}
          minAmount={1}
        />
      </TradingLayout>
    </ToastProvider>
  );
};

export default WalletPage;
