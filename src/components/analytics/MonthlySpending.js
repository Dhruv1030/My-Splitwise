// src/components/analytics/MonthlySpending.js
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const MonthlySpending = ({ expenses }) => {
  // Process expenses to get monthly totals
  const monthlyData = processMonthlyExpenses(expenses);

  return (
    <LineChart data={monthlyData}>
      <Line type="monotone" dataKey="amount" stroke="#8884d8" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
    </LineChart>
  );
};
