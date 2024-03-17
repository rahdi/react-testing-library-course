import { http, HttpResponse } from "msw";
import { expect } from "vitest";
import userEvent from "@testing-library/user-event";

import { server } from "../../../mocks/server";
import { render, screen } from "../../../test-utils/testing-library-utils";
import OrderEntry from "../OrderEntry";

// we can use "test.only" to test only one test (in case of multiple tests in one file)
test("Handles error for scoops and toppings routes", async () => {
  server.resetHandlers(
    http.get("http://localhost:3030/scoops", () => {
      return new HttpResponse(null, { status: 500 });
    }),
    http.get("http://localhost:3030/toppings", () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  render(<OrderEntry />);

  // const alerts = await screen.findAllByRole("alert", {
  //   name: "An unexpected error occurred. Please try again later.",
  // });

  const alerts = await screen.findAllByText(
    "An unexpected error occurred. Please try again later."
  );
  expect(alerts).toHaveLength(2);
});

// we can use "test.skip" to skip one test
test.skip("my test 2", () => {});

test("Disable 'Go to summary' button, when there is no scoops", async () => {
  const user = userEvent.setup();

  render(<OrderEntry handleClick={() => {}} />); // <- TS would complain

  // order button should be disabled at start
  const button = screen.getByRole("button", { name: "Go to summary" });
  expect(button).toBeDisabled();

  // button should be enabled after adding scoops
  const chocolateScoop = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  expect(chocolateScoop).toBeInTheDocument();
  await user.clear(chocolateScoop);
  await user.type(chocolateScoop, "2");
  const scoopsTotal = screen.getByText("Scoops total: $", { exact: false });
  expect(scoopsTotal).toHaveTextContent("4.00");
  expect(button).toBeEnabled();

  // order button should be disabled again, after removing scoops
  await user.clear(chocolateScoop);
  await user.type(chocolateScoop, "0");
  expect(scoopsTotal).toHaveTextContent("0.00");
  expect(button).toBeDisabled();
});
