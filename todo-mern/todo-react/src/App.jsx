import { useState } from "react";
import Navbar from "./Components/Navbar";
import AddTodo from "./Components/AddTodo";
import TodoList from "./Components/TodoList";

function App() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = (newTodo) => {
    setTodos([...todos, newTodo]);
  };

  const handleToggleComplete = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const handleEditTodo = (updatedTodos) => {
    setTodos(updatedTodos);
  };

  const handleDeleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[35%]">
        <h1 className="font-bold text-center text-3xl mb-8">
          Manage Your Tasks
        </h1>
        <AddTodo onAdd={handleAddTodo} />
        <TodoList
          todos={todos}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTodo}
          onDelete={handleDeleteTodo}
        />
      </div>
    </>
  );
}

export default App;
