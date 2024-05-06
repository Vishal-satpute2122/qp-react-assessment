import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import TodoList from "./component/TodoList";

test("renders TodoList", () => {
  render(<TodoList />);
  const headerElement = screen.getByText(/Todo App/i);
  expect(headerElement).toBeInTheDocument();

  const inputElement = screen.getByPlaceholderText("Add new task...");
  expect(inputElement).toBeInTheDocument();
});

test("adds a new todo", () => {
  render(<TodoList />);
  const inputElement = screen.getByPlaceholderText("Add new task...");
  const addButton = screen.getByText("Add Todo");

  fireEvent.change(inputElement, { target: { value: "New Task" } });
  fireEvent.click(addButton);

  expect(screen.getByText("New Task")).toBeInTheDocument();
});

test("toggles todo completion", async () => {
  render(<TodoList />);
  const inputElement = screen.getByPlaceholderText("Add new task...");
  const addButton = screen.getByText("Add Todo");

  fireEvent.change(inputElement, { target: { value: "New Task" } });
  fireEvent.click(addButton);

  const checkbox = (await screen.findByTestId(
    "toggle-todo-1"
  )) as HTMLInputElement;

  fireEvent.click(checkbox);
  expect(checkbox.checked).toBe(true);

  fireEvent.click(checkbox);
  expect(checkbox.checked).toBe(false);
});
