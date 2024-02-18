import { http, HttpResponse } from "msw";
import { server } from "../../../mocks/server";

import { render, screen, logRoles } from "@testing-library/react";
import OrderEntry from "../OrderEntry";

// we can use "test.only" to test only one test (in case of multiple tests in one file)
test.only("Handles error for scoops and toppings routes", async () => {
  server.resetHandlers(
    http.get("http://localhost:3030/scoops", () => {
      return new HttpResponse(null, { status: 500 });
    }),
    http.get("http://localhost:3030/toppings", () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  const { container } = render(<OrderEntry />);

  // const alerts = await screen.findAllByRole("alert", {
  //   name: "An unexpected error occurred. Please try again later.",
  // });

  const alerts = await screen.findAllByText(
    "An unexpected error occurred. Please try again later."
  );
  logRoles(container);
  expect(alerts).toHaveLength(2);
});

// we can use "test.skip" to skip one test
test.skip("my test 2", () => {});
test("my test 3", () => {});
test("my test 4", () => {});
test("my test 5", () => {});
