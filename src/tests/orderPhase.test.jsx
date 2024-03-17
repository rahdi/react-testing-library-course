import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { expect } from "vitest";

test("order phases for happy path", async () => {
  const user = userEvent.setup();

  // render app
  render(<App />);

  // add ice cream scoops and toppings
  const vanillaScoop = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaScoop);
  await user.type(vanillaScoop, "1");

  const cherriesTopping = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  await user.click(cherriesTopping);

  const grandTotal = screen.getByText("Grand total: $", { exact: false });
  expect(grandTotal).toHaveTextContent("3.50");

  // find and click order button
  const goToSummaryButton = screen.getByRole("button");
  expect(goToSummaryButton).toHaveTextContent("Go to summary");
  await user.click(goToSummaryButton);

  // check summary information based on order
  const summaryHeading = screen.getByRole("heading", {
    name: "Order Summary",
  });
  expect(summaryHeading).toBeInTheDocument();

  const scoopsHeading = screen.getByRole("heading", { name: "Scoops: $2.00" });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.getByRole("heading", {
    name: "Toppings: $1.50",
  });
  expect(toppingsHeading).toBeInTheDocument();

  expect(screen.getByText("1 Vanilla")).toBeInTheDocument();
  expect(screen.getByText("Cherries")).toBeInTheDocument();

  // alternatively
  // const optionItems = screen.getAllByRole('listItem');
  // const optionItemsText = optionItems.map((item) => item.textContent);
  // expect(optionItemsText).toEqual(['1 Vanilla', 'Cherries']);

  // accept terms and conditions and click button to confirm order
  const termsAndConditionsCheckbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  await user.click(termsAndConditionsCheckbox);

  const confirmButton = screen.getByRole("button", { name: /confirm order/i });
  await user.click(confirmButton);

  // expect "loading" text
  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();

  // confirm order number on confirmation page
  const orderNumber = await screen.findByText("Your order number is", {
    exact: false,
  });
  expect(orderNumber).toHaveTextContent("1234");

  // expect "loading" text to disappear
  const notLoading = screen.queryByText(/loading/i);
  expect(notLoading).not.toBeInTheDocument();

  // click "new order" button on confirmation page
  const createNewOrderButton = screen.getByRole("button", {
    name: "Create new order",
  });
  await user.click(createNewOrderButton);

  // check that scoops and toppings subtotals have been reset
  const scoopsTotal = await screen.findByText("Scoops total: $", {
    exact: false,
  });
  // alternatively
  // const scoopsTotal = await screen.findByText("Scoops total: $0.00");
  const toppingsTotal = await screen.findByText("Toppings total: $", {
    exact: false,
  });
  expect(scoopsTotal).toHaveTextContent("0.00");
  expect(toppingsTotal).toHaveTextContent("0.00");

  // do we need to await anything to avoid test errors?
});

test("Toppings header is not on summary page, when no toppings were added", async () => {
  const user = userEvent.setup();

  render(<App />);

  // add ice cream scoops
  const vanillaScoop = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaScoop);
  await user.type(vanillaScoop, "2");

  // find and click order button
  const goToSummaryButton = screen.getByRole("button");
  await user.click(goToSummaryButton);

  // check summary information and check, if there are no toppings heading
  const scoopsHeading = screen.getByRole("heading", { name: "Scoops: $4.00" });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.queryByText("Toppings: $", { exact: false });
  expect(toppingsHeading).not.toBeInTheDocument();
});

test("Toppings header is not on summary page, when toppings were added and then removed", async () => {
  const user = userEvent.setup();

  render(<App />);

  // add ice cream scoops
  const vanillaScoop = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaScoop);
  await user.type(vanillaScoop, "2");

  // add cherries topping
  const cherriesTopping = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  await user.click(cherriesTopping);
  expect(cherriesTopping).toBeChecked();
  const toppingsTotal = screen.getByText("Toppings total: $", { exact: false });
  expect(toppingsTotal).toHaveTextContent("1.50");

  // remove the topping
  await user.click(cherriesTopping);
  expect(cherriesTopping).not.toBeChecked();
  expect(toppingsTotal).toHaveTextContent("0.00");

  // find and click order button
  const goToSummaryButton = screen.getByRole("button");
  await user.click(goToSummaryButton);

  // check summary information and check, if there are no toppings heading
  const scoopsHeading = screen.getByRole("heading", { name: "Scoops: $4.00" });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.queryByText("Toppings: $", { exact: false });
  expect(toppingsHeading).not.toBeInTheDocument();
});
