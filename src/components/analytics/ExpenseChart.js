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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, Nav, Tab } from "react-bootstrap";
import { ExpenseContext } from "../../contexts/ExpenseContext";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const ExpenseChart = () => {
  const { expenses } = useContext(ExpenseContext);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [activeTab, setActiveTab] = useState("monthly");

  useEffect(() => {
    if (expenses.length > 0) {
      generateMonthlyData();
      generateCategoryData();
    }
  }, [expenses]);

  const generateMonthlyData = () => {
    // Create a map to store monthly totals
    const monthMap = {};

    // Define month names
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Process each expense
    expenses.forEach((expense) => {
      if (!expense.date) return;

      const date = new Date(expense.date);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const monthKey = `${year}-${monthIndex}`;

      if (!monthMap[monthKey]) {
        monthMap[monthKey] = {
          name: `${monthNames[monthIndex]} ${year}`,
          total: 0,
          timestamp: new Date(year, monthIndex, 1).getTime(), // For sorting
        };
      }

      monthMap[monthKey].total += parseFloat(expense.amount || 0);
    });

    // Convert to array and sort by date
    const data = Object.values(monthMap)
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-6); // Get only the last 6 months

    setMonthlyData(data);
  };

  const generateCategoryData = () => {
    // Define some basic categories (in a real app, these would be user-defined)
    const categories = {
      "Food & Drink": [
        "food",
        "drink",
        "grocery",
        "restaurant",
        "dinner",
        "lunch",
        "breakfast",
      ],
      Transportation: [
        "gas",
        "car",
        "uber",
        "taxi",
        "transport",
        "bus",
        "train",
        "subway",
      ],
      Entertainment: [
        "movie",
        "entertainment",
        "game",
        "concert",
        "ticket",
        "show",
      ],
      Utilities: [
        "utility",
        "water",
        "electricity",
        "gas",
        "bill",
        "internet",
        "phone",
      ],
      Shopping: ["shopping", "clothes", "shoes", "electronics"],
      Other: [],
    };

    // Create a map to store category totals
    const categoryMap = Object.keys(categories).reduce((map, category) => {
      map[category] = 0;
      return map;
    }, {});

    // Process each expense
    expenses.forEach((expense) => {
      const description = (expense.description || "").toLowerCase();

      // Determine which category this expense belongs to
      let matched = false;
      for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some((keyword) => description.includes(keyword))) {
          categoryMap[category] += parseFloat(expense.amount || 0);
          matched = true;
          break;
        }
      }

      // If no category matched, put in "Other"
      if (!matched) {
        categoryMap["Other"] += parseFloat(expense.amount || 0);
      }
    });

    // Convert to array for Recharts
    const data = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);

    setCategoryData(data);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const renderMonthlyChart = () => {
    if (monthlyData.length === 0) {
      return <div className="text-center py-5">No data available</div>;
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={monthlyData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          <Bar dataKey="total" name="Total Expenses" fill="#5bc5a7" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderCategoryChart = () => {
    if (categoryData.length === 0) {
      return <div className="text-center py-5">No data available</div>;
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header>
        <h5 className="mb-0">Expense Analytics</h5>
      </Card.Header>
      <Card.Body>
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="monthly">Monthly Spending</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="category">Spending by Category</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="monthly">{renderMonthlyChart()}</Tab.Pane>
            <Tab.Pane eventKey="category">{renderCategoryChart()}</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Card.Body>
    </Card>
  );
};

export default ExpenseChart;
