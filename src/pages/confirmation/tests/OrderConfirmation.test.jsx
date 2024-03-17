import { expect } from "vitest";
import { HttpResponse, delay, http } from "msw";

import { server } from "../../../mocks/server";
import { render, screen } from "../../../test-utils/testing-library-utils";
import OrderConfirmation from "../OrderConfirmation";

test("Display error message, when there is an error response from server", async () => {
  server.resetHandlers(
    http.post("http://localhost:3030/order", () => {
      delay(300);
      return new HttpResponse(null, { status: 500 });
    })
  );

  render(<OrderConfirmation />);

  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent(
    "An unexpected error occurred. Please try again later."
  );
});
