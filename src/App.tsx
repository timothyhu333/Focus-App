function App() {
  const tasks = [
    "Build Dashboard",
    "Add Task System",
    "Create Notes Section",
    "Build Achievement Tracker",
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🚀 MyFocus</h1>

      <h2>Today's Main Goal</h2>
      <p>Become an AI Engineer and build useful products.</p>

      <h2>Tasks</h2>

      {tasks.map((task, index) => (
        <div key={index}>
          ⬜ {task}
        </div>
      ))}

      <h2>Stats</h2>

      <p>Tasks Completed: 2</p>
      <p>Current Streak: 1 Day</p>

      <h2>Achievements</h2>

      <ul>
        <li>🏆 Created MyFocus</li>
        <li>🏆 First React App Running</li>
      </ul>
    </div>
  );
}

export default App;