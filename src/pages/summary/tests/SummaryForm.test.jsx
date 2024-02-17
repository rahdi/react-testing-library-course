// tests to ensure, that:
// checkbox is unchecked by default
// checking checkbox enables button
// unchecking checkbox again disables button

import { expect } from "vitest";
import SummaryForm from "../SummaryForm";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("Initial conditions", () => {
  render(<SummaryForm />);

  // find elements
  const checkboxElement = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  const buttonElement = screen.getByRole("button", { name: /confirm order/i });

  // test initial conditions
  expect(checkboxElement).toBeInTheDocument();
  expect(buttonElement).toBeInTheDocument();
  expect(checkboxElement).not.toBeChecked();
  expect(buttonElement).toBeDisabled();
});

test("Checkbox enables button on first click and disables it on second click", async () => {
  // create user instance for user events
  const user = userEvent.setup();

  render(<SummaryForm />);

  // find elements
  const checkboxElement = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  const buttonElement = screen.getByRole("button", { name: /confirm order/i });

  // click the checkbox
  await user.click(checkboxElement);

  // test, if the button is enabled
  expect(buttonElement).toBeEnabled();

  // click the checkbox again
  await user.click(checkboxElement);

  // test, if the button is disabled again
  expect(buttonElement).toBeDisabled();
});

test("Popover response to hover", async () => {
  // create user instance for user events
  const user = userEvent.setup();

  render(<SummaryForm />);

  // popover starts out hidden
  const nullPopover = screen.queryByText(
    /no ice cream will actually be delivered/i
  );
  expect(nullPopover).not.toBeInTheDocument();

  // popover appears on mousehover of checkbox label
  const termsAndConditions = screen.getByText(/terms and conditions/i);
  await user.hover(termsAndConditions);
  const popover = screen.getByText(/no ice cream will actually be delivered/i);
  expect(popover).toBeInTheDocument();

  // popover disappears on leave
  await user.unhover(termsAndConditions);
  expect(popover).not.toBeInTheDocument();
});
