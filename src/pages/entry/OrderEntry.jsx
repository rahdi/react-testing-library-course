import React from "react";
import Options from "./Options";
import GrandTotal from "./GrandTotal";
import { Button } from "react-bootstrap";
import { useOrderDetails } from "../../contexts/OrderDetails";

const OrderEntry = ({ handleClick }) => {
  const { totals } = useOrderDetails();

  return (
    <div>
      <Options optionType="scoops" />
      <Options optionType="toppings" />
      <GrandTotal />

      <Button
        variant="primary"
        size="lg"
        onClick={handleClick}
        disabled={totals.scoops === 0}
      >
        Go to summary
      </Button>
    </div>
  );
};

export default OrderEntry;
