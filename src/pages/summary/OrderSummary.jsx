// import React from "react";
import { useOrderDetails } from "../../contexts/OrderDetails";
import { formatCurrency } from "../../utilities";
import SummaryForm from "./SummaryForm";

const OrderSummary = ({ handleClick }) => {
  const { totals, optionCounts } = useOrderDetails();

  const scoopArray = Object.entries(optionCounts.scoops);
  const scoopList = scoopArray.map(([key, value]) => (
    <li key={key}>
      {value} {key}
    </li>
  ));

  let toppingsDisplay = null;

  if (totals.toppings > 0) {
    const toppingArray = Object.keys(optionCounts.toppings);
    const toppingList = toppingArray.map((key) => <li key={key}>{key}</li>);

    toppingsDisplay = (
      <>
        <h2>Toppings: {formatCurrency(totals.toppings)}</h2>
        <ul>{toppingList}</ul>
      </>
    );
  }

  return (
    <div>
      <h1>Order Summary</h1>
      <h2>Scoops: {formatCurrency(totals.scoops)}</h2>
      {totals.scoops > 0 && <ul>{scoopList}</ul>}

      {toppingsDisplay}

      <SummaryForm handleClick={handleClick} />
    </div>
  );
};

export default OrderSummary;
