import { useState, useEffect,useContext } from "react";
import Navbar from "./Components/Navbar";
import AddTodo from "./Components/AddTodo";
import TodoList from "./Components/TodoList";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./Components/Api";

 
function App() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        const todosFromServer = await getTodos();
        setTodos(todosFromServer);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async (newTodo) => {
    try {
      const createdTodo = await createTodo(newTodo);
      setTodos((prevTodos) => [...prevTodos, createdTodo]);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleToggleComplete = async (todoId) => {
    try {
      const updatedTodo = await updateTodo(todoId, {
        completed: !todos.find((todo) => todo._id === todoId).completed,
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === updatedTodo._id ? updatedTodo : todo
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditTodo = async (updatedTodo) => {
    try {
      const updated = await updateTodo(updatedTodo._id, updatedTodo);
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo._id === updated._id ? updated : todo))
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteTodo = async (index) => {
    try {
      await deleteTodo(index);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== index));
    } catch (error) {
      setError(error.message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <> 
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
