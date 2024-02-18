import { createContext, useContext, useState } from "react";
import { pricePerItem } from "../constants";

const OrderDetails = createContext();

// create custom hook to check whether we're in a provider
export const useOrderDetails = () => {
  const contextValue = useContext(OrderDetails);

  if (!contextValue) {
    throw new Error(
      "useOrderDetails must be called from within an OrderDetails Provider"
    );
  }

  return contextValue;
};

const initialState = {
  scoops: {}, // example { Chocolate: 1, Vanilla: 2 }
  toppings: {}, // example { "Gummi Bears": 1 }
};

export const OrderDetailsProvider = (props) => {
  const [optionCounts, setOptionsCounts] = useState({ ...initialState });

  const updateItemCount = (itemName, newItemCount, optionType) => {
    // make a copy of existing state
    const newOptionCounts = { ...optionCounts };

    // update the copy with the new information
    newOptionCounts[optionType][itemName] = newItemCount;

    // update the state with the updated copy
    setOptionsCounts(newOptionCounts);
  };

  const resetOrder = () => {
    setOptionsCounts({ ...initialState });
  };

  // utility function to derive totals from optionCounts state value
  const calculateTotal = (optionType) => {
    // get an array of counts for the option type (for example [1,2])
    const countsArray = Object.values(optionCounts[optionType]);

    // total the values in the array of counts for the number of items
    const totalCount = countsArray.reduce((total, value) => total + value, 0);

    // multiply the total number of items by the price for this item type
    return totalCount * pricePerItem[optionType];
  };

  const totals = {
    scoops: calculateTotal("scoops"),
    toppings: calculateTotal("toppings"),
  };

  const value = { optionCounts, totals, updateItemCount, resetOrder };
  return <OrderDetails.Provider value={value} {...props} />;
};
