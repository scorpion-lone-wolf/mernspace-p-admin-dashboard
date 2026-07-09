import LoginPage from "@/pages/login/Login";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Login Page", () => {
  it("should render with required fields", () => {
    render(<LoginPage />);
    // getBy return the element if present else throw error
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Remember me" })
    ).toBeInTheDocument();

    expect(screen.getByText("Forgot password")).toBeInTheDocument();
  });
});
