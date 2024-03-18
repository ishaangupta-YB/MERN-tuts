import { useState } from "react";

function EditCardPopup({ todo, onUpdate, onClose }) {
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description);
  const [editedPendingDate, setEditedPendingDate] = useState(todo.pending);
  const [editedCompleted, setEditedCompleted] = useState(todo.completed);

  const handleUpdate = () => {
    const currentDate = new Date();
    let selected = editedPendingDate ? new Date(editedPendingDate) : null;
    if (!selected || selected < currentDate) {
      selected = new Date(currentDate);
      selected.setDate(selected.getDate() + 1);
      selected = formatDate(selected);
    }else selected = formatDate(selected);
    onUpdate({
      ...todo,
      title: editedTitle,
      description: editedDescription,
      pending: selected,
      completed: editedCompleted,
    });
    onClose();
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-md shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Edit Todo</h2>
        <label htmlFor="editedTitle" className="block mb-1">
          Title:
        </label>
        <input
          type="text"
          id="editedTitle"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 mb-2"
        />
        <label htmlFor="editedDescription" className="block mb-1">
          Description:
        </label>
        <textarea
          id="editedDescription"
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 mb-2"
        ></textarea>
        <label htmlFor="editedPendingDate" className="block mb-1">
          Pending Date:
        </label>
        <input
          type="date"
          id="editedPendingDate"
          value={editedPendingDate}
          onChange={(e) => setEditedPendingDate(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 mb-2"
        />
        <label htmlFor="editedCompleted" className="block mb-1">
          <input
            type="checkbox"
            id="editedCompleted"
            checked={editedCompleted}
            onChange={(e) => setEditedCompleted(e.target.checked)}
            className="mr-2"
          />
          Completed
        </label>
        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 mr-2"
          >
            Update
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditCardPopup;
