import { useState, useMemo } from "react";
import EditCard from "./EditCard";

const TodoList = ({ todos, onToggleComplete, onEdit, onDelete }) => {
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState(null);
  const [showFinished, setShowFinished] = useState(false);

  const handleCloseEditPopup = () => {
    setShowEditPopup(false);
    setSelectedTodoId(null);
  };

  const handleUpdateTodo = (updatedTodo) => {
    onEdit(updatedTodo);
  };

  const handleDeleteTodo = (todoId) => {
    onDelete(todoId);
  };

  const sortedTodos = useMemo(() => {
    return todos
      .filter((todo) => (showFinished ? todo.completed : !todo.completed))
      .sort((a, b) => {
        const dateA = new Date(a.pending);
        const dateB = new Date(b.pending);
        return dateA - dateB;
      });
  }, [todos, showFinished]);

  return (
    <div>
      <div className="flex items-center my-4">
        <input
          id="show"
          type="checkbox"
          checked={showFinished}
          onChange={(e) => setShowFinished(e.target.checked)}
          className="form-checkbox mr-2"
        />
        <label htmlFor="show" className="mx-2">
          {showFinished ? "Hide Finished" : "Show Finished"}
        </label>
      </div>
      <div className="h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2"></div>
      <h2 className="text-2xl font-bold">Your Todos</h2>
      <div className="todos">
        {sortedTodos.map((todo) => (
          <div
            key={todo._id}
            className={`todo flex border-b border-gray-300 py-2`}
          >
            <div className="checkbox flex items-center justify-center mr-4">
              <input
                type="checkbox"
                id={`completed-${todo._id}`}
                checked={todo.completed}
                onChange={() => onToggleComplete(todo._id)}
                className="form-checkbox mr-2"
              />
            </div>
            <div className="details flex-1">
              <p className="font-semibold">{todo.title}</p>
              <p>
                {todo.description.length > 40
                  ? todo.description.substring(0, 40) + "..."
                  : todo.description}
              </p>
              <p>Pending: {todo.pending}</p>
            </div>
            <div className="buttons flex items-center">
              <button
                onClick={() => {
                  setSelectedTodoId(todo._id);
                  setShowEditPopup(true);
                }}
                className="bg-violet-600 hover:bg-violet-850 px-4 py-2 text-sm font-bold text-white rounded-md mx-1 transition-colors duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTodo(todo._id)}
                className="bg-violet-600 hover:bg-violet-850 px-4 py-2 text-sm font-bold text-white rounded-md mx-1 transition-colors duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {showEditPopup && (
        <EditCard
          todo={todos.find((todo) => todo._id === selectedTodoId)}
          onUpdate={handleUpdateTodo}
          onClose={handleCloseEditPopup}
        />
      )}
    </div>
  );
};

export default TodoList;
