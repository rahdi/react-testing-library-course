import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useOrderDetails } from "../../contexts/OrderDetails";

const OrderConfirmation = ({ handleClick }) => {
  const [orderNumber, setOrderNumber] = useState(null);
  const { resetOrder } = useOrderDetails();

  useEffect(() => {
    (async () => {
      const response = await axios.post("http://localhost:3030/order");
      if (response.data.orderNumber) {
        setOrderNumber(response.data.orderNumber);
      }
      // TODO: handle error response
    })();
  }, []);

  if (orderNumber === null) return <div>Loading</div>;

  const createNewOrder = () => {
    resetOrder();
    handleClick();
  };

  return (
    <div>
      <h2>Thank you</h2>
      <h5>Your order number is {orderNumber}</h5>

      <p>as per our terms and conditions, nothing will happen now</p>

      <Button onClick={createNewOrder}>Create new order</Button>
    </div>
  );
};

export default OrderConfirmation;
