import { stat } from "fs";
import React, { useReducer, useState, useRef, useEffect } from "react";
import { FixedSizeList as List } from "react-window";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type Action =
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "TOGGLE_TODO"; payload: number };

const initialState: Todo[] = [];

const todoReducer = (state: Todo[], action: Action): Todo[] => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, action.payload];
    case "TOGGLE_TODO":
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    default:
      return state;
  }
};

const TodoList = () => {
  const [todos, dispatch] = useReducer(todoReducer, initialState);
  const [filterTodo, setFilterTodo] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputHeight, setInputHeight] = useState<number>(0);

  useEffect(() => {
    setFilterTodo(todos);
  }, [todos]);
  useEffect(() => {
    if (inputRef.current) {
      setInputHeight(inputRef.current.scrollHeight);
    }
  }, [inputText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    setInputHeight(e.target.scrollHeight);
  };

  const handleAddTodo = () => {
    if (inputText.trim() !== "") {
      const newTodo: Todo = {
        id: todos.length + 1,
        text: inputText,
        completed: false,
      };
      dispatch({ type: "ADD_TODO", payload: newTodo });
      setInputText("");
      setInputHeight(0);
    }
  };

  const handleToggleTodo = (id: number) => {
    dispatch({ type: "TOGGLE_TODO", payload: id });
  };

  const handleComplete = () => {
    setFilterTodo(todos.filter((todo) => todo.completed === true));
  };
  const handlePending = () => {
    setFilterTodo(todos.filter((todo) => todo.completed === false));
  };

  const handleAll = () => {
    setFilterTodo(todos);
  };
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const todo = filterTodo[index];
    return (
      <div
        style={style}
        className="flex items-center p-2 border-b border-gray-300"
      >
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => handleToggleTodo(todo.id)}
          className="mr-2"
          data-testid={`toggle-todo-${todo.id}`}
        />
        <span className={todo.completed ? "line-through" : ""}>
          {todo.text}
        </span>
      </div>
    );
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Todo App</h1>

      <div className="container mx-auto p-4">
        <textarea
          ref={inputRef}
          style={{ height: inputHeight }}
          value={inputText}
          onChange={handleInputChange}
          placeholder="Add new task..."
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleAddTodo}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Todo
        </button>
        {filterTodo.length > 0 ? (
          <List
            height={400}
            itemCount={filterTodo.length}
            itemSize={50} // Set the height of each item
            width={400}
          >
            {Row}
          </List>
        ) : (
          <h1 className="p-6 m-6">No todos Exist!</h1>
        )}
      </div>
      <button
        className="m-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleComplete}
      >
        Completed
      </button>
      <button
        className="m-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        onClick={handlePending}
      >
        pending
      </button>
      <button
        className="m-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleAll}
      >
        All
      </button>
    </>
  );
};

export default TodoList;
