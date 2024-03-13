import React from "react";
import Options from "./Options";
import GrandTotal from "./GrandTotal";
import { Button } from "react-bootstrap";

const OrderEntry = ({ handleClick }) => {
  return (
    <div>
      <Options optionType="scoops" />
      <Options optionType="toppings" />
      <GrandTotal />

      <Button variant="primary" size="lg" onClick={handleClick}>
        Go to summary
      </Button>
    </div>
  );
};

export default OrderEntry;
