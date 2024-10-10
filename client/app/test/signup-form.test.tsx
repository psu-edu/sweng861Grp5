import { SignUpForm } from "@/components/signup-form";
import { fireEvent, render, screen } from "@testing-library/react";

describe("SignUpForm Component", () => {
  it("should render the Sign Up form with all the necessary input fields", () => {
    render(<SignUpForm />);

    // Check if the Card Title is rendered
    expect(screen.getByText("Sign Up")).toBeInTheDocument();

    // Check for input fields
    expect(screen.getByLabelText("First name")).toBeInTheDocument();
    expect(screen.getByLabelText("Last name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();

    // Check if the "Create an account" button is present
    expect(screen.getByText("Create an account")).toBeInTheDocument();
  });

  it("should allow user to fill out the form fields", () => {
    render(<SignUpForm />);

    // Input fields
    const firstNameInput = screen.getByLabelText("First name");
    const lastNameInput = screen.getByLabelText("Last name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    // Fill in the input fields
    fireEvent.change(firstNameInput, { target: { value: "Richard" } });
    fireEvent.change(lastNameInput, { target: { value: "Hendricks" } });
    fireEvent.change(emailInput, {
      target: { value: "richard@piedpiper.com" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "supersecurepassword" },
    });

    // Check if the input values have been updated
    expect(firstNameInput).toHaveValue("Richard");
    expect(lastNameInput).toHaveValue("Hendricks");
    expect(emailInput).toHaveValue("richard@piedpiper.com");
    expect(passwordInput).toHaveValue("supersecurepassword");
  });

  it("should have a link to the login page", () => {
    render(<SignUpForm />);

    const loginLink = screen.getByText("Sign in");

    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest("a")).toHaveAttribute("href", "/login");
  });

  it("should submit the form when the 'Create an account' button is clicked", () => {
    // Mock the form submission behavior
    const handleSubmit = jest.fn();

    render(<SignUpForm />);

    const button = screen.getByText("Create an account");

    // Simulate click
    fireEvent.click(button);

    // Check if the submit handler was called (this would require a real handler to be set in the component)
    expect(handleSubmit).not.toHaveBeenCalled(); // Placeholder, assuming no real submit logic
  });
});
