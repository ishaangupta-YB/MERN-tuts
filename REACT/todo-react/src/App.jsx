import { useState, useEffect } from "react";
import Navbar from "./Components/Navbar";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pendingDate, setPendingDate] = useState("");
  const [completed, setCompleted] = useState(false);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    if (todos.length !== 0) console.log(todos);
  }, [todos]);

  const handleEdit = (e, index) => {
    e.preventDefault();
    console.log(todos[index]);
  };

  const handleDelete = (e, index) => {
    e.preventDefault();
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  const handleToggleComplete = (e, index) => {
    e.preventDefault();
    console.log(index);
    todos[index].completed = !todos[index].completed;
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const currentDate = new Date();
    let todoData = {
      title: title,
      description: description,
      completed: completed,
    };
    let selected = pendingDate ? new Date(pendingDate) : null;
    if (!selected || selected < currentDate) {
      selected = new Date(currentDate);
      selected.setDate(currentDate.getDate() + 1);
      selected = formatDate(selected);
      todoData = { ...todoData, pending: selected };
    } else todoData = { ...todoData, pending: pendingDate };
    setTodos([...todos, todoData]);
    // console.log(todos);
    setPendingDate("");
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[35%]">
        <h1 className="font-bold text-center text-3xl">Manage Your Tasks</h1>
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Add a Todo</h2>
          <div className="flex flex-col">
            <input
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              className="w-full rounded-full px-5 py-1 mb-2"
              maxLength={50}
            />
            <textarea
              rows={2}
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg px-5 py-3 mb-2"
              maxLength={1000}
            />
            <div className="flex items-center mb-2">
              <input
                placeholder="Pending Date"
                type="date"
                value={pendingDate}
                onChange={(e) => setPendingDate(e.target.value)}
                className="rounded-full px-5 py-1 mr-4"
              />
              <label htmlFor="completion" className="mr-2">
                Completed:
              </label>
              <input
                type="checkbox"
                id="completed"
                onChange={(e) => setCompleted(e.target.checked)}
                className="h-5 w-5 rounded-full border-gray-300 focus:ring-violet-800 focus:border-violet-800 text-violet-800"
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={title.length <= 3}
              className="bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white"
            >
              Add
            </button>
          </div>
        </div>
        <input className="my-4" id="show" type="checkbox" />
        <label className="mx-2" htmlFor="show">
          Show Finished
        </label>
        <div className="h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2"></div>
        <h2 className="text-2xl font-bold">Your Todos</h2>
        <div className="todos">
          {todos.map((item, index) => (
            <div
              key={index}
              className={`todo ${
                item.completed ? "line-through" : ""
              } flex border-b border-gray-300 py-2`}
            >
              <div className="checkbox flex items-center justify-center mr-4">
                <input
                  type="checkbox"
                  id={`completed-${index}`}
                  checked={item.completed}
                  onChange={(e) => handleToggleComplete(e, index)}
                  className="mr-2"
                />
                <label htmlFor={`completed-${index}`} className="select-none">
                  {item.completed ? "Completed" : "Not Completed"}
                </label>
              </div>
              <div className="details flex-1">
                <p className="font-semibold">{item.title}</p>
                <p>
                  {item.description.length > 40
                    ? item.description.substring(0, 40) + "..."
                    : item.description}
                </p>
                <p>Pending: {item.pending}</p>
              </div>
              <div className="buttons flex items-center">
                <button
                  onClick={(e) => handleEdit(e, index)}
                  className="bg-violet-600 hover:bg-violet-850 px-4 py-2 text-sm font-bold text-white rounded-md mx-1"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => handleDelete(e, index)}
                  className="bg-violet-600 hover:bg-violet-850 px-4 py-2 text-sm font-bold text-white rounded-md mx-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
