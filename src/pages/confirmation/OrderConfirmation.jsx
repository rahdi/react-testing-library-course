import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useOrderDetails } from "../../contexts/OrderDetails";
import AlertBanner from "../common/AlertBanner";

const OrderConfirmation = ({ handleClick }) => {
  const [orderNumber, setOrderNumber] = useState(null);
  const { resetOrder } = useOrderDetails();
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.post("http://localhost:3030/order");
        if (response.data.orderNumber) {
          setOrderNumber(response.data.orderNumber);
          setError(false);
        }
      } catch (error) {
        setError(true);
      }
    })();
  }, []);

  const createNewOrder = () => {
    resetOrder();
    handleClick();
  };
  const newOrderButton = (
    <Button onClick={createNewOrder}>Create new order</Button>
  );

  if (error)
    return (
      <>
        <AlertBanner />
        {newOrderButton}
      </>
    );

  if (orderNumber === null) return <div>Loading</div>;

  return (
    <div>
      <h2>Thank you</h2>
      <h5>Your order number is {orderNumber}</h5>

      <p>as per our terms and conditions, nothing will happen now</p>

      {newOrderButton}
    </div>
  );
};

export default OrderConfirmation;
