import apiClient from "../../../services/apiClient";

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
};

export const downloadPortfolioPdf = async () => {
  const response = await apiClient.get("/reports/portfolio/pdf", {
    responseType: "blob",
  });

  const fileBlob = new Blob([response.data], { type: "application/pdf" });
  downloadBlob(fileBlob, "portfolio-statement.pdf");
};

export const downloadWalletTransactionsExcel = async (
  from: string,
  to: string,
) => {
  const response = await apiClient.get(
    "/reports/wallet-transactions/excel",
    {
      params: { from, to },
      responseType: "blob",
    },
  );

  const fileBlob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  downloadBlob(fileBlob, "wallet-transactions.xlsx");
};
