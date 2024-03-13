import { useState } from "react";
import { Container } from "react-bootstrap";
import OrderSummary from "./pages/summary/OrderSummary";
import OrderEntry from "./pages/entry/OrderEntry";
import { OrderDetailsProvider } from "./contexts/OrderDetails";
import OrderConfirmation from "./pages/confirmation/OrderConfirmation";

function App() {
  const [orderPhase, setOrderPhase] = useState("inProgress"); // "inProgress | review | complete"

  return (
    <Container>
      <OrderDetailsProvider>
        {orderPhase === "inProgress" && (
          <OrderEntry handleClick={() => setOrderPhase("review")} />
        )}
        {orderPhase === "review" && (
          <OrderSummary handleClick={() => setOrderPhase("complete")} />
        )}
        {orderPhase === "complete" && (
          <OrderConfirmation handleClick={() => setOrderPhase("inProgress")} />
        )}
      </OrderDetailsProvider>
    </Container>
  );
}

export default App;
