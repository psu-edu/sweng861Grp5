import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { LoginForm } from "@/components/login-form";

describe("LoginForm", () => {
  test("renders login form with email and password inputs", () => {
    render(<LoginForm />);

    // Check if the form title is present
    expect(screen.getByTestId("login")).toBeInTheDocument();

    // Check if the email input is present
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();

    // Check if the password input is present
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();

    // Check if the login button is present
    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(loginButton).toBeInTheDocument();

    const forgotPasswordLink = screen.getByText(/forgot your password\?/i);
    expect(forgotPasswordLink).toBeInTheDocument();

    const signUpLink = screen.getByText(/sign up/i);
    expect(signUpLink).toBeInTheDocument();
  });

  test("allows user to type into email and password fields", () => {
    // Render the LoginForm component
    render(<LoginForm />);

    // Get the email and password input fields
    const emailInput: HTMLInputElement = screen.getByLabelText(/email/i);
    const passwordInput: HTMLInputElement = screen.getByLabelText(/password/i);

    // Simulate typing in the email field
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput.value).toBe("test@example.com");

    // Simulate typing in the password field
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(passwordInput.value).toBe("password123");
  });

  test("submit button is rendered and can be clicked", () => {
    // Render the LoginForm component
    render(<LoginForm />);

    // Get the login button
    const loginButton = screen.getByRole("button", { name: /login/i });

    // Simulate button click
    fireEvent.click(loginButton);

    // Check if button is still in the document after clicking (since it's a static test)
    expect(loginButton).toBeInTheDocument();
  });
});
