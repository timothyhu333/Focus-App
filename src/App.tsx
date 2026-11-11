import { useState } from "react";

function App() {
  const [tasks, setTasks] = useState([
    "Build Dashboard",
    "Add Task System",
  ]);

  const addTask = () => {
    const taskName = prompt("Enter a task");

    if (!taskName) return;

    setTasks([...tasks, taskName]);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🚀 MyFocus</h1>

      <h2>Today's Goal</h2>
      <p>Build my personal productivity system.</p>

      <button onClick={addTask}>
        Add Task
      </button>

      <h2>Tasks</h2>

      {tasks.map((task, index) => (
        <div key={index}>
          ⬜ {task}
        </div>
      ))}
    </div>
  );
}

export default App;