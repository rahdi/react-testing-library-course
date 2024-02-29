import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";
import { describe, expect } from "vitest";
import OrderEntry from "../OrderEntry";

test("Update scoop subtotal when scoops change", async () => {
  const user = userEvent.setup();
  render(<Options optionType="scoops" />);

  // make sure total starts out at $0.00
  const scoopsSubtotal = screen.getByText("Scoops total: $", { exact: false });
  expect(scoopsSubtotal).toHaveTextContent("0.00");

  // update vanilla scoops to 1 and check the subtotal
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");
  expect(scoopsSubtotal).toHaveTextContent("2.00");

  // update chocolate scoops to 2 and check subtotal again
  const chocolateInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });

  await user.clear(chocolateInput);
  await user.type(chocolateInput, "2");
  expect(scoopsSubtotal).toHaveTextContent("6.00");
});

test("Update toppings subtotal when toppings change", async () => {
  const user = userEvent.setup();
  render(<Options optionType="toppings" />);

  // make sure total starts out at $0.00
  const toppingsSubtotal = screen.getByText("Toppings total: $", {
    exact: false,
  });
  expect(toppingsSubtotal).toHaveTextContent("0.00");

  // add "Cherries" topping and check the subtotal
  const cherriesCheckbox = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  await user.click(cherriesCheckbox);
  expect(toppingsSubtotal).toHaveTextContent("1.50");

  // add "Hot fudge" topping and check the subtotal again
  // we don't have to use 'await', because if we found "Cherries", the data is loaded to page
  const hotFudgeCheckbox = screen.getByRole("checkbox", {
    name: "Hot fudge",
  });
  await user.click(hotFudgeCheckbox);
  expect(toppingsSubtotal).toHaveTextContent("3.00");

  // remove "Cherries" topping and check the subtotal again
  await user.click(cherriesCheckbox);
  expect(toppingsSubtotal).toHaveTextContent("1.50");
});

describe("Grand total", () => {
  test("Grand total starts at $0.00", () => {
    render(<OrderEntry />);

    const grandTotal = screen.getByText("Grand total: $", {
      exact: false,
    });
    expect(grandTotal).toHaveTextContent("0.00");
  });

  test("Grand total updates properly if scoop is added first", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    // find elements
    const grandTotal = screen.getByText("Grand total: $", {
      exact: false,
    });
    const cherriesCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });

    // add 2 vanilla scoops
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "2");
    expect(grandTotal).toHaveTextContent("4.00");

    // add cherries topping
    await user.click(cherriesCheckbox);
    expect(grandTotal).toHaveTextContent("5.50");
  });

  test("Grand total updates properly if topping is added first", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    // find elements
    const grandTotal = screen.getByText("Grand total: $", {
      exact: false,
    });
    const hotFudgeCheckbox = await screen.findByRole("checkbox", {
      name: "Hot fudge",
    });
    const chocolateInput = await screen.findByRole("spinbutton", {
      name: "Chocolate",
    });

    // add hot fudge topping
    await user.click(hotFudgeCheckbox);
    expect(grandTotal).toHaveTextContent("1.50");

    // add chocolate scoop
    await user.clear(chocolateInput);
    await user.type(chocolateInput, "1");
    expect(grandTotal).toHaveTextContent("3.50");
  });

  test("Grand total updates properly if item is removed", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    // find elements
    const grandTotal = screen.getByText("Grand total: $", {
      exact: false,
    });
    const cherriesCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });

    // add 2 vanilla scoops, grandTotal should be $4.00
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "2");

    // add cherries topping, grandTotal should be $5.50
    await user.click(cherriesCheckbox);

    // remove 1 vanilla scoop
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");
    expect(grandTotal).toHaveTextContent("3.50");

    // remove cherries topping
    await user.click(cherriesCheckbox);
    expect(grandTotal).toHaveTextContent("2.00");
  });
});
