import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("App", () => {
  it("wires providers and router without crashing", async () => {
    render(<App />);
    expect(await screen.findByText(/esqueleto del proyecto listo/i)).toBeInTheDocument();
  });
});
