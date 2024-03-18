import React, { useState } from "react";

const AddTodo = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pendingDate, setPendingDate] = useState("");
  const [completed, setCompleted] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    const currentDate = new Date();
    let todoData = {
      title,
      description,
      completed,
    };
    let selected = pendingDate ? new Date(pendingDate) : null;
    if (!selected || selected < currentDate) {
      selected = new Date(currentDate);
      selected.setDate(currentDate.getDate() + 1);
      selected = formatDate(selected);
      todoData = { ...todoData, pending: selected };
    } else todoData = { ...todoData, pending: pendingDate };
    onAdd(todoData);
    setTitle("");
    setDescription("");
    setPendingDate("");
    setCompleted(false);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="addTodo my-5 flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Add a Todo</h2>
      <div className="flex flex-col">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          className="form-input rounded-full px-5 py-1 mb-2"
          maxLength={50}
        />
        <textarea
          rows={2}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-textarea rounded-lg px-5 py-3 mb-2"
          maxLength={1000}
        />
        <div className="flex items-center mb-2">
          <input
            placeholder="Pending Date"
            type="date"
            value={pendingDate}
            onChange={(e) => setPendingDate(e.target.value)}
            className="form-input rounded-full px-5 py-1 mr-4"
          />
          <label htmlFor="completion" className="mr-2">
            Completed:
          </label>
          <input
            type="checkbox"
            id="completion"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="form-checkbox h-5 w-5 rounded-full border-gray-300 focus:ring-violet-800 focus:border-violet-800 text-violet-800"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={title.length <= 3}
          className="bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white transition-colors duration-300"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddTodo;
