import { useState } from "react";
import WalletCard from "../components/WalletCard";
import AddMoneyModal from "../components/AddMoneyModal";
import { useWallet } from "../hooks/useWallet";
import { ToastProvider } from "../components/ToastProvider";

const WalletPage = () => {
  const [open, setOpen] = useState(false);
  const { refetch } = useWallet();

  const handleSuccess = async () => {
    // After successful payment confirmation, refetch wallet
    await refetch();
  };

  return (
    <ToastProvider>
      <div className="p-6 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <WalletCard onAddMoney={() => setOpen(true)} />
        </div>

        <AddMoneyModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onSuccess={handleSuccess}
          minAmount={1}
        />
      </div>
    </ToastProvider>
  );
};

export default WalletPage;
