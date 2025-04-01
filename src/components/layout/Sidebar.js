import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import {
  BiHomeAlt,
  BiGroup,
  BiReceipt,
  BiUser,
  BiFolderPlus,
  BiPlus,
  BiChevronDown,
  BiChevronUp,
} from "react-icons/bi";
import { ExpenseContext } from "../../contexts/ExpenseContext";
import { AuthContext } from "../../contexts/AuthContext";

const SidebarContainer = styled.aside`
  width: ${(props) => props.theme.sizes.sidebarWidth};
  background-color: ${(props) => props.theme.colors.white};
  border-right: 1px solid ${(props) => props.theme.colors.border};
  height: calc(100vh - ${(props) => props.theme.sizes.headerHeight});
  overflow-y: auto;
  position: fixed;
  top: ${(props) => props.theme.sizes.headerHeight};
  left: 0;
  transition: transform 0.3s ease;
  z-index: 990;

  @media (max-width: 768px) {
    transform: translateX(${(props) => (props.isOpen ? "0" : "-100%")});
  }
`;

const SidebarSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  color: ${(props) => props.theme.colors.textLight};
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
  }
`;

const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: ${(props) => (props.isCollapsed ? "0" : "500px")};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const SidebarItem = styled.li`
  a {
    display: flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    color: ${(props) => props.theme.colors.text};
    text-decoration: none;
    transition: background-color 0.2s;
    border-left: 3px solid transparent;

    &:hover {
      background-color: ${(props) => props.theme.colors.background};
    }

    &.active {
      background-color: ${(props) => props.theme.colors.background};
      color: ${(props) => props.theme.colors.primary};
      border-left-color: ${(props) => props.theme.colors.primary};
      font-weight: 500;
    }

    .icon {
      margin-right: 0.75rem;
      display: flex;
      align-items: center;
    }

    .badge {
      margin-left: auto;
      background-color: ${(props) => props.theme.colors.primary};
    }
  }
`;

const GroupCircle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  background-color: ${(props) => props.color || props.theme.colors.primary};
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
`;

const AddButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  width: 100%;
  text-align: left;

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
  }

  .icon {
    margin-right: 0.5rem;
  }
`;

const TotalBalance = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  padding: 1rem 1.25rem;
  margin: 0.75rem;
  border-radius: ${(props) => props.theme.borderRadius};

  .label {
    color: ${(props) => props.theme.colors.textLight};
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
  }

  .amount {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${(props) =>
      parseFloat(props.amount) >= 0
        ? props.theme.colors.success
        : props.theme.colors.danger};
  }
`;

const Sidebar = () => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const { groups, friends, getTotalBalance } = useContext(ExpenseContext);
  const [isGroupsCollapsed, setIsGroupsCollapsed] = useState(false);
  const [isFriendsCollapsed, setIsFriendsCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const totalBalance = getTotalBalance();

  return (
    <SidebarContainer isOpen={isSidebarOpen}>
      <TotalBalance amount={totalBalance}>
        <div className="label">Your Total Balance</div>
        <div className="amount">
          {parseFloat(totalBalance) >= 0 ? "+" : ""}${totalBalance}
        </div>
      </TotalBalance>

      <SidebarSection>
        <SidebarList>
          <SidebarItem>
            <Link href="/dashboard" passHref>
              <a className={router.pathname === "/dashboard" ? "active" : ""}>
                <span className="icon">
                  <BiHomeAlt size={20} />
                </span>
                Dashboard
              </a>
            </Link>
          </SidebarItem>
          <SidebarItem>
            <Link href="/activity" passHref>
              <a className={router.pathname === "/activity" ? "active" : ""}>
                <span className="icon">
                  <BiReceipt size={20} />
                </span>
                Recent Activity
              </a>
            </Link>
          </SidebarItem>
          <SidebarItem>
            <Link href="/all-expenses" passHref>
              <a
                className={router.pathname === "/all-expenses" ? "active" : ""}
              >
                <span className="icon">
                  <BiReceipt size={20} />
                </span>
                All Expenses
              </a>
            </Link>
          </SidebarItem>
        </SidebarList>
      </SidebarSection>

      <SidebarSection>
        <SidebarHeader onClick={() => setIsGroupsCollapsed(!isGroupsCollapsed)}>
          <span>GROUPS</span>
          {isGroupsCollapsed ? (
            <BiChevronDown size={20} />
          ) : (
            <BiChevronUp size={20} />
          )}
        </SidebarHeader>
        <SidebarList isCollapsed={isGroupsCollapsed}>
          {groups.map((group) => (
            <SidebarItem key={group.id}>
              <Link href={`/groups/${group.id}`} passHref>
                <a
                  className={
                    router.asPath === `/groups/${group.id}` ? "active" : ""
                  }
                >
                  <GroupCircle color={group.color}>
                    {group.name.charAt(0).toUpperCase()}
                  </GroupCircle>
                  {group.name}
                </a>
              </Link>
            </SidebarItem>
          ))}
          <SidebarItem>
            <Link href="/groups/create" passHref>
              <AddButton>
                <span className="icon">
                  <BiPlus size={18} />
                </span>
                Add a group
              </AddButton>
            </Link>
          </SidebarItem>
        </SidebarList>
      </SidebarSection>

      <SidebarSection>
        <SidebarHeader
          onClick={() => setIsFriendsCollapsed(!isFriendsCollapsed)}
        >
          <span>FRIENDS</span>
          {isFriendsCollapsed ? (
            <BiChevronDown size={20} />
          ) : (
            <BiChevronUp size={20} />
          )}
        </SidebarHeader>
        <SidebarList isCollapsed={isFriendsCollapsed}>
          {friends.map((friend) => (
            <SidebarItem key={friend.id}>
              <Link href={`/friends/${friend.id}`} passHref>
                <a
                  className={
                    router.asPath === `/friends/${friend.id}` ? "active" : ""
                  }
                >
                  <GroupCircle>
                    {friend.name.charAt(0).toUpperCase()}
                  </GroupCircle>
                  {friend.name}
                </a>
              </Link>
            </SidebarItem>
          ))}
          <SidebarItem>
            <Link href="/friends/add" passHref>
              <AddButton>
                <span className="icon">
                  <BiPlus size={18} />
                </span>
                Add a friend
              </AddButton>
            </Link>
          </SidebarItem>
        </SidebarList>
      </SidebarSection>
    </SidebarContainer>
  );
};

export default Sidebar;
