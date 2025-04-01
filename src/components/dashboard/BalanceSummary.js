import React, { useContext } from "react";
import Link from "next/link";
import { ListGroup, Button } from "react-bootstrap";
import styled from "styled-components";
import { BiArrowFromLeft, BiArrowFromRight, BiDollar } from "react-icons/bi";
import { AuthContext } from "../../contexts/AuthContext";

const BalanceItem = styled(ListGroup.Item)`
  border: none;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  padding: 0.75rem 0;

  &:last-child {
    border-bottom: none;
  }
`;

const UserCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.bg || props.theme.colors.primary};
  color: white;
  margin-right: 1rem;
  font-weight: 500;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const UserName = styled.div`
  font-weight: 500;
`;

const BalanceAmount = styled.div`
  font-weight: 600;
  color: ${(props) =>
    props.type === "you-owe"
      ? props.theme.colors.danger
      : props.theme.colors.success};
`;

const DirectionIcon = styled.div`
  margin: 0 1rem;
  color: ${(props) => props.theme.colors.textLight};
`;

const ActionButton = styled.div`
  margin-top: 0.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: ${(props) => props.theme.colors.textLight};

  svg {
    margin-bottom: 1rem;
  }
`;

const BalanceSummary = ({ balances }) => {
  const { currentUser } = useContext(AuthContext);

  if (balances.length === 0) {
    return (
      <EmptyState>
        <BiDollar size={48} />
        <h5>All settled up!</h5>
        <p className="mb-0">You have no balances with anyone.</p>
      </EmptyState>
    );
  }

  return (
    <ListGroup variant="flush">
      {balances.map((balance, index) => {
        const youOwe = balance.from.id === currentUser?.id;
        const otherUser = youOwe ? balance.to : balance.from;

        return (
          <BalanceItem key={index} className="d-flex align-items-center">
            <div className="d-flex flex-column flex-md-row align-items-md-center w-100">
              <div className="d-flex align-items-center">
                <UserCircle>
                  {otherUser.avatar ? (
                    <img src={otherUser.avatar} alt={otherUser.name} />
                  ) : (
                    otherUser.name.charAt(0).toUpperCase()
                  )}
                </UserCircle>

                <div>
                  <UserName>{otherUser.name}</UserName>
                  <BalanceAmount type={youOwe ? "you-owe" : "owes-you"}>
                    {youOwe ? "You owe" : "Owes you"} ${balance.amount}
                  </BalanceAmount>
                </div>
              </div>

              <ActionButton className="ms-auto mt-3 mt-md-0">
                {youOwe ? (
                  <Link href={`/settle-up?userId=${otherUser.id}`} passHref>
                    <Button variant="outline-success" size="sm">
                      Pay ${balance.amount}
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/remind?userId=${otherUser.id}`} passHref>
                    <Button variant="outline-primary" size="sm">
                      Send Reminder
                    </Button>
                  </Link>
                )}
              </ActionButton>
            </div>
          </BalanceItem>
        );
      })}
    </ListGroup>
  );
};

export default BalanceSummary;
