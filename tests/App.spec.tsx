import { render, screen } from "@testing-library/react";

import { App } from "../src/App";

test("App renders Dashboard with Drafter Drafter heading", () => {
    render(<App />);

    const heading = screen.getByText(/Drafter Drafter/i);

    expect(heading).toBeInTheDocument();
});

test("Dashboard shows + New Project button", () => {
    render(<App />);

    const btn = screen.getByText(/\+ New Project/i);

    expect(btn).toBeInTheDocument();
});

test("Dashboard shows Load Demo Projects button", () => {
    render(<App />);

    const btn = screen.getByText(/Load Demo Projects/i);

    expect(btn).toBeInTheDocument();
});

test("Dashboard shows empty state message when no projects", () => {
    render(<App />);

    const msg = screen.getByText(/No projects yet/i);

    expect(msg).toBeInTheDocument();
});
