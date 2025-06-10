import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import {
  BiReceipt,
  BiDollar,
  BiPlus,
  BiGroup,
  BiUser,
  BiCalendarCheck,
} from "react-icons/bi";
import { ExpenseContext } from "../../contexts/ExpenseContext";
import { AuthContext } from "../../contexts/AuthContext";

const ActivityContainer = styled.div`
  position: relative;
  padding-left: 30px;

  &:before {
    content: "";
    position: absolute;
    left: 12px;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: ${(props) => props.theme.colors.border};
  }
`;

const ActivityItem = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const ActivityIcon = styled.div`
  position: absolute;
  left: -30px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: ${(props) => props.bg || props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const ActivityContent = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius};
  padding: 1rem;
`;

const ActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;

  .title {
    font-weight: 500;
  }

  .date {
    font-size: 0.75rem;
    color: ${(props) => props.theme.colors.textLight};
  }
`;

const ActivityMessage = styled.div`
  font-size: 0.875rem;

  a {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ActivityAmount = styled.span`
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: #6c757d; // instead of props.theme.colors.textLight

  svg {
    margin-bottom: 1rem;
  }
`;

const ActivityFeed = () => {
  const { expenses, groups } = useContext(ExpenseContext);
  const { currentUser } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!expenses || !groups || !currentUser) return;

    // Generate activity items from expenses
    const expenseActivities = expenses.map((expense) => {
      const isPayer = expense.paidBy === currentUser.id;
      const group = groups.find((g) => g.id === expense.group);

      let activityType = "expense_added";
      let icon = <BiReceipt size={14} />;
      let bgColor = "#16B174";

      if (expense.isSettlement) {
        activityType = "payment";
        icon = <BiDollar size={14} />;
        bgColor = "#4CAF50";
      }

      return {
        id: expense.id,
        type: activityType,
        date:
          expense.created_at || expense.timestamp || new Date().toISOString(),
        expense,
        group,
        isPayer,
        icon,
        bgColor,
      };
    });

    // Sort by date
    const sortedActivities = expenseActivities.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    // Take only the most recent 10
    setActivities(sortedActivities.slice(0, 10));
  }, [expenses, groups, currentUser]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!expenses || !groups || !currentUser) {
    return <p>Loading activity feed...</p>;
  }

  const getActivityContent = (activity) => {
    switch (activity.type) {
      case "expense_added":
        return (
          <>
            <ActivityHeader>
              <div className="title">Expense Added</div>
              <div className="date">{formatTime(activity.date)}</div>
            </ActivityHeader>
            <ActivityMessage>
              {activity.isPayer ? "You" : "Someone"} added "
              <Link href={`/expenses/${activity.expense.id}`}>
                {activity.expense.description}
              </Link>
              " (<ActivityAmount>${activity.expense.amount}</ActivityAmount>)
              {activity.group && (
                <>
                  {" in "}
                  <Link href={`/groups/${activity.group.id}`}>
                    {activity.group.name}
                  </Link>
                </>
              )}
            </ActivityMessage>
          </>
        );

      case "payment":
        return (
          <>
            <ActivityHeader>
              <div className="title">Payment</div>
              <div className="date">{formatTime(activity.date)}</div>
            </ActivityHeader>
            <ActivityMessage>
              {activity.isPayer ? "You made" : "Someone made"} a payment of{" "}
              <ActivityAmount>${activity.expense.amount}</ActivityAmount>
            </ActivityMessage>
          </>
        );

      default:
        return null;
    }
  };

  if (activities.length === 0) {
    return (
      <EmptyState>
        <BiCalendarCheck size={48} />
        <h5>No Recent Activity</h5>
        <p className="mb-0">Your recent activity will appear here.</p>
      </EmptyState>
    );
  }

  // Group activities by date
  const groupedActivities = activities.reduce((groups, activity) => {
    const date = formatDate(activity.date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {});

  return (
    <div>
      {Object.keys(groupedActivities).map((date) => (
        <div key={date}>
          <h6 className="mb-3 text-muted">{date}</h6>
          <ActivityContainer>
            {groupedActivities[date].map((activity) => (
              <ActivityItem key={`${activity.type}-${activity.id}`}>
                <ActivityIcon bg={activity.bgColor}>
                  {activity.icon}
                </ActivityIcon>
                <ActivityContent>
                  {getActivityContent(activity)}
                </ActivityContent>
              </ActivityItem>
            ))}
          </ActivityContainer>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
