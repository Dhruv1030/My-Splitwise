import React, { useContext, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";
import { ExpenseContext } from "../../contexts/ExpenseContext";

const FriendsBalanceChart = () => {
  const { currentUser } = useContext(AuthContext);
  const { friends, calculateBalances, getFriendById } =
    useContext(ExpenseContext);
  const [balanceData, setBalanceData] = useState([]);

  useEffect(() => {
    generateBalanceData();
  }, [friends, calculateBalances]);

  const generateBalanceData = () => {
    if (!calculateBalances) return;

    const balances = calculateBalances();
    const data = [];

    // Process balances involving the current user
    balances.forEach((balance) => {
      let friendId, amount, isPositive;

      if (balance.from === currentUser?.id) {
        // You owe someone
        friendId = balance.to;
        amount = parseFloat(balance.amount);
        isPositive = false;
      } else if (balance.to === currentUser?.id) {
        // Someone owes you
        friendId = balance.from;
        amount = parseFloat(balance.amount);
        isPositive = true;
      } else {
        // Balance doesn't involve current user
        return;
      }

      const friend = getFriendById(friendId);
      if (!friend) return;

      data.push({
        name: friend.name,
        balance: isPositive ? amount : -amount,
        isPositive,
      });
    });

    setBalanceData(data);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderBalanceChart = () => {
    if (balanceData.length === 0) {
      return <div className="text-center py-5">No balance data available</div>;
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={balanceData}
          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tickFormatter={formatCurrency} />
          <YAxis type="category" dataKey="name" width={100} />
          <Tooltip
            formatter={(value) => formatCurrency(Math.abs(value))}
            labelFormatter={(value) => `Balance with ${value}`}
          />
          <Legend />
          <Bar dataKey="balance" name="Balance" fill="#8884d8">
            {balanceData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isPositive ? "#5bc5a7" : "#ff652f"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header>
        <h5 className="mb-0">Friend Balances</h5>
      </Card.Header>
      <Card.Body>
        {renderBalanceChart()}
        <div className="text-center text-muted mt-2">
          <small>
            <span className="text-success">Green</span> = You are owed,
            <span className="text-danger ms-1">Red</span> = You owe
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default FriendsBalanceChart;
