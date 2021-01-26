import React from "react";
import { Container, Card } from "react-bootstrap";
import Background from "../assets/bg.jpg";

const HomePage = () => {
  return (
    <>
      <Container
        fluid
        style={{
          background: `url(${Background})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: "130vh",
          backgroundPosition: "center top",
          display: "flex",
          flexDirection: "column",
        }}
      ></Container>
    </>
  );
};

export default HomePage;

/*
 <Card
        className="text-center"
        style={{ backgroundColor: "#003E4B", color: "white" }}
      >
        <Card.Body>
          <Card.Text>Footer</Card.Text>
        </Card.Body>
        <Card.Img variant="bottom" />
      </Card>*/
