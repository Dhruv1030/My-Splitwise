import React, { useContext, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";
import { ExpenseContext } from "../../contexts/ExpenseContext";

const TransactionHistoryChart = () => {
  const { currentUser } = useContext(AuthContext);
  const { expenses } = useContext(ExpenseContext);
  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    if (expenses.length > 0 && currentUser) {
      generateTransactionData();
    }
  }, [expenses, currentUser]);

  const generateTransactionData = () => {
    // Group expenses by date
    const expensesByDate = {};

    // Sort expenses by date
    const sortedExpenses = [...expenses].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Track running balance
    let runningBalance = 0;

    // Process each expense to calculate daily balances
    sortedExpenses.forEach((expense) => {
      if (!expense.date) return;

      const date = expense.date.split("T")[0]; // Get just the date part

      if (!expensesByDate[date]) {
        expensesByDate[date] = {
          date,
          expenses: 0,
          payments: 0,
          netChange: 0,
          balance: 0,
        };
      }

      const amount = parseFloat(expense.amount || 0);

      // Calculate how this expense affects the current user's balance
      if (expense.isPayment) {
        // This is a payment/settlement
        if (expense.paidBy === currentUser?.id) {
          // You paid someone
          expensesByDate[date].payments -= amount;
          expensesByDate[date].netChange -= amount;
          runningBalance -= amount;
        } else if (expense.participants.some((p) => p.id === currentUser?.id)) {
          // Someone paid you
          expensesByDate[date].payments += amount;
          expensesByDate[date].netChange += amount;
          runningBalance += amount;
        }
      } else {
        // This is a regular expense
        if (expense.paidBy === currentUser?.id) {
          // You paid the expense
          const yourShare =
            expense.participants.find((p) => p.id === currentUser.id)?.amount ||
            0;
          const othersShare = amount - yourShare;

          expensesByDate[date].expenses += othersShare;
          expensesByDate[date].netChange += othersShare;
          runningBalance += othersShare;
        } else {
          // Someone else paid
          const yourShare =
            expense.participants.find((p) => p.id === currentUser.id)?.amount ||
            0;

          expensesByDate[date].expenses -= yourShare;
          expensesByDate[date].netChange -= yourShare;
          runningBalance -= yourShare;
        }
      }

      expensesByDate[date].balance = runningBalance;
    });

    // Convert to array and sort by date
    const data = Object.values(expensesByDate).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Add a final point with the current balance
    if (data.length > 0) {
      data.push({
        date: "Current",
        expenses: 0,
        payments: 0,
        netChange: 0,
        balance: data[data.length - 1].balance,
      });
    }

    setTransactionData(data);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatDate = (date) => {
    if (date === "Current") return date;
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const renderTransactionChart = () => {
    if (transactionData.length === 0) {
      return (
        <div className="text-center py-5">No transaction data available</div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={transactionData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatDate} />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            labelFormatter={(label) =>
              label === "Current"
                ? "Current Balance"
                : `Date: ${new Date(label).toLocaleDateString()}`
            }
          />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />
          <Line
            type="monotone"
            dataKey="balance"
            name="Running Balance"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header>
        <h5 className="mb-0">Balance History</h5>
      </Card.Header>
      <Card.Body>
        {renderTransactionChart()}
        <div className="text-center text-muted mt-2">
          <small>
            Above zero = Others owe you, Below zero = You owe others
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TransactionHistoryChart;
