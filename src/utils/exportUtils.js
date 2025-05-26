// src/utils/exportUtils.js
export const exportExpensesToCSV = (expenses) => {
  const headers = ["Date", "Description", "Amount", "Paid By", "Split With"];
  const csvContent = [
    headers,
    ...expenses.map((expense) => [
      expense.date,
      expense.description,
      expense.amount,
      expense.paidBy,
      expense.participants.map((p) => p.name).join("; "),
    ]),
  ];
  // Generate and download CSV
};
