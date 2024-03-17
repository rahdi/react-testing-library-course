import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";

import { render, screen } from "../../../test-utils/testing-library-utils";
import ScoopOption from "../ScoopOption";

test("Scoop inputs turn red, if the value is invalid", async () => {
  const user = userEvent.setup();

  render(<ScoopOption />);

  // expect scoop input to be red, if the value is negative
  const scoopInput = screen.getByRole("spinbutton");
  await user.clear(scoopInput);
  await user.type(scoopInput, "-2");
  expect(scoopInput).toHaveClass("is-invalid");

  // expect scoop input to be red, if the value is decimal
  await user.clear(scoopInput);
  await user.type(scoopInput, "1.5");
  expect(scoopInput).toHaveClass("is-invalid");

  // expect scoop input to be red, if the value is too high
  await user.clear(scoopInput);
  await user.type(scoopInput, "11");
  expect(scoopInput).toHaveClass("is-invalid");

  // expect scoop input to be valid, if the value is valid
  await user.clear(scoopInput);
  await user.type(scoopInput, "2");
  expect(scoopInput).not.toHaveClass("is-invalid");
});
