import React from "react";
import { useOrderDetails } from "../../contexts/OrderDetails";
import { formatCurrency } from "../../utilities";

const GrandTotal = () => {
  const { totals } = useOrderDetails();

  return (
    <h2>Grand total: {formatCurrency(totals.scoops + totals.toppings)}</h2>
  );
};

export default GrandTotal;
