import  { useState } from 'react';
import EditCard from './EditCard';

const TodoList = ({ todos, onToggleComplete, onEdit, onDelete }) => {
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedTodoIndex, setSelectedTodoIndex] = useState(null);
  const [showFinished, setShowFinished] = useState(false);

  const handleCloseEditPopup = () => {
    setShowEditPopup(false);
    setSelectedTodoIndex(null);
  };

  const handleUpdateTodo = (updatedTodo) => {
    const updatedTodos = todos.map((todo, index) =>
      index === selectedTodoIndex ? updatedTodo : todo
    );
    // Update todos in parent component
    onEdit(updatedTodos);
  };

  const handleDeleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    // Update todos in parent component
    onDelete(updatedTodos);
  };

  const filteredTodos = showFinished ? todos : todos.filter((todo) => !todo.completed);

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
          Show Finished
        </label>
      </div>
      <div className="h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2"></div>
      <h2 className="text-2xl font-bold">Your Todos</h2>
      <div className="todos">
        {filteredTodos.map((item, index) => (
          <div
            key={index}
            className={`todo ${
              item.completed ? 'line-through' : ''
            } flex border-b border-gray-300 py-2`}
          >
            <div className="checkbox flex items-center justify-center mr-4">
              <input
                type="checkbox"
                id={`completed-${index}`}
                checked={item.completed}
                onChange={() => onToggleComplete(index)}
                className="form-checkbox mr-2"
              />
              <label htmlFor={`completed-${index}`} className="select-none">
                {item.completed ? 'Completed' : 'Not Completed'}
              </label>
            </div>
            <div className="details flex-1">
              <p className="font-semibold">{item.title}</p>
              <p>
                {item.description.length > 40
                  ? item.description.substring(0, 40) + '...'
                  : item.description}
              </p>
              <p>Pending: {item.pending}</p>
            </div>
            <div className="buttons flex items-center">
              <button
                onClick={() => {
                  setSelectedTodoIndex(index);
                  setShowEditPopup(true);
                }}
                className="bg-violet-600 hover:bg-violet-850 px-4 py-2 text-sm font-bold text-white rounded-md mx-1 transition-colors duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTodo(index)}
                className="bg-violet-600 hover:bg-violet-850 px-4 py-2 text-sm font-bold text-white rounded-md mx-1 transition-colors duration -300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {showEditPopup && (
        <EditCard
          todo={todos[selectedTodoIndex]}
          onUpdate={handleUpdateTodo}
          onClose={handleCloseEditPopup}
        />
      )}
    </div>
  );
};

export default TodoList;