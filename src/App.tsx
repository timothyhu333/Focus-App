import { useState } from "react";

function App() {
  const [tasks, setTasks] = useState([
    { text: "Build Dashboard", completed: false },
    { text: "Add Task System", completed: false },
  ]);

  const addTask = () => {
    const taskName = prompt("Enter a task");

    if (!taskName) return;

    setTasks([
      ...tasks,
      {
        text: taskName,
        completed: false,
      },
    ]);
  };

  const completeTask = (index: number) => {
    const updatedTasks = [...tasks];

    updatedTasks[index].completed =
      !updatedTasks[index].completed;

    setTasks(updatedTasks);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🚀 MyFocus</h1>

      <button onClick={addTask}>
        Add Task
      </button>

      <h2>Tasks</h2>

      {tasks.map((task, index) => (
        <div key={index}>
          <button onClick={() => completeTask(index)}>
            {task.completed ? "✅" : "⬜"}
          </button>

          <span
            style={{
              marginLeft: "10px",
              textDecoration: task.completed
                ? "line-through"
                : "none",
            }}
          >
            {task.text}
          </span>
        </div>
      ))}

      <h2>Stats</h2>

      <p>
        Completed: {
          tasks.filter((task) => task.completed).length
        }
      </p>

      <p>Total Tasks: {tasks.length}</p>
    </div>
  );
}

export default App;