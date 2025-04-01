import React, { useContext } from "react";
import Head from "next/head";
import { Container, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";
import { ExpenseContext } from "../../../src/contexts/ExpenseContext";
import GroupForm from "../../../src/components/groups/GroupForm";

const EditGroupPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { groups } = useContext(ExpenseContext);

  // Find group by ID
  const group = groups.find((g) => g.id === id);

  return (
    <>
      <Head>
        <title>Edit Group | Splitwise Clone</title>
      </Head>

      <Container className="py-4">
        <Row>
          <Col lg={8} className="mx-auto">
            <h1 className="mb-4">Edit Group</h1>
            {group ? (
              <GroupForm existingGroup={group} />
            ) : (
              <div className="text-center py-5">
                <p>Group not found</p>
                <button
                  className="btn btn-link"
                  onClick={() => router.push("/groups")}
                >
                  Back to Groups
                </button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EditGroupPage;
