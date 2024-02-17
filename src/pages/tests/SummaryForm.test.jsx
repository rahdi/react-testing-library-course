// tests to ensure, that:
// checkbox is unchecked by default
// checking checkbox enables button
// unchecking checkbox again disables button

import { expect } from "vitest";
import SummaryForm from "../summary/SummaryForm";
import { fireEvent, render, screen } from "@testing-library/react";

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

test("Checkbox enables button on first click and disables it on second click", () => {
  render(<SummaryForm />);

  // find elements
  const checkboxElement = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  const buttonElement = screen.getByRole("button", { name: /confirm order/i });

  // click the checkbox
  fireEvent.click(checkboxElement);

  // test, if the button is enabled
  expect(buttonElement).toBeEnabled();

  // click the checkbox again
  fireEvent.click(checkboxElement);

  // test, if the button is disabled again
  expect(buttonElement).toBeDisabled();
});
