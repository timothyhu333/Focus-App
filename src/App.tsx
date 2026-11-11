import { useEffect, useMemo, useState } from "react";
import "./App.css";

type Tab = "today" | "tasks" | "focus" | "notes" | "progress";
type Task = { id: string; text: string; completed: boolean; createdAt: string };
type Note = { id: string; title: string; body: string; updatedAt: string };
type FocusSession = { id: string; minutes: number; completedAt: string };

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const todayKey = () => new Date().toISOString().slice(0, 10);

function readLocal<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [tab, setTab] = useState<Tab>("today");
  const [goal, setGoal] = useState(() => localStorage.getItem("myfocus-goal") || "Build a better life one focused day at a time.");
  const [tasks, setTasks] = useState<Task[]>(() => readLocal("myfocus-tasks", [
    { id: makeId(), text: "Plan my three most important tasks", completed: false, createdAt: new Date().toISOString() },
    { id: makeId(), text: "Complete one focused work session", completed: false, createdAt: new Date().toISOString() },
  ]));
  const [taskText, setTaskText] = useState("");
  const [notes, setNotes] = useState<Note[]>(() => readLocal("myfocus-notes", []));
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [sessions, setSessions] = useState<FocusSession[]>(() => readLocal("myfocus-sessions", []));
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => localStorage.setItem("myfocus-tasks", JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem("myfocus-notes", JSON.stringify(notes)), [notes]);
  useEffect(() => localStorage.setItem("myfocus-sessions", JSON.stringify(sessions)), [sessions]);
  useEffect(() => localStorage.setItem("myfocus-goal", goal), [goal]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setRunning(false);
          setSessions((items) => [{ id: makeId(), minutes: timerMinutes, completedAt: new Date().toISOString() }, ...items]);
          return timerMinutes * 60;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running, timerMinutes]);

  const completed = tasks.filter((task) => task.completed).length;
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const todaySessions = sessions.filter((session) => session.completedAt.slice(0, 10) === todayKey());
  const focusedToday = todaySessions.reduce((sum, session) => sum + session.minutes, 0);
  const totalFocus = sessions.reduce((sum, session) => sum + session.minutes, 0);
  const achievements = useMemo(() => [
    tasks.length >= 1 && "Created the first task",
    completed >= 1 && "Completed the first task",
    completed >= 5 && "Completed five tasks",
    sessions.length >= 1 && "Finished the first focus session",
    totalFocus >= 100 && "Reached 100 focused minutes",
    notes.length >= 1 && "Saved the first note",
  ].filter(Boolean) as string[], [tasks.length, completed, sessions.length, totalFocus, notes.length]);

  const addTask = (event: React.FormEvent) => {
    event.preventDefault();
    const text = taskText.trim();
    if (!text) return;
    setTasks((items) => [{ id: makeId(), text, completed: false, createdAt: new Date().toISOString() }, ...items]);
    setTaskText("");
  };

  const saveNote = (event: React.FormEvent) => {
    event.preventDefault();
    const title = noteTitle.trim();
    const body = noteBody.trim();
    if (!title && !body) return;
    setNotes((items) => [{ id: makeId(), title: title || "Untitled note", body, updatedAt: new Date().toISOString() }, ...items]);
    setNoteTitle("");
    setNoteBody("");
  };

  const chooseTimer = (minutes: number) => {
    setRunning(false);
    setTimerMinutes(minutes);
    setSecondsLeft(minutes * 60);
  };

  const timeDisplay = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span>✓</span><div><strong>MyFocus</strong><small>Personal OS</small></div></div>
        <nav>
          {(["today", "tasks", "focus", "notes", "progress"] as Tab[]).map((item) => (
            <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
              {item === "today" ? "⌂" : item === "tasks" ? "✓" : item === "focus" ? "◷" : item === "notes" ? "▤" : "↗"}
              <span>{item[0].toUpperCase() + item.slice(1)}</span>
            </button>
          ))}
        </nav>
        <p className="save-note">Your data is saved on this device.</p>
      </aside>

      <main>
        <header><div><p>{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p><h1>{tab === "today" ? "Today" : tab[0].toUpperCase() + tab.slice(1)}</h1></div><div className="avatar">T</div></header>

        {tab === "today" && <>
          <section className="hero">
            <div><span className="eyebrow">TODAY'S MAIN GOAL</span><input value={goal} onChange={(e) => setGoal(e.target.value)} aria-label="Today's main goal" /></div>
            <button onClick={() => setTab("focus")}>Start focus →</button>
          </section>
          <section className="stats-grid">
            <article><span>Tasks completed</span><strong>{completed}<small> / {tasks.length}</small></strong><div className="bar"><i style={{ width: `${completionRate}%` }} /></div></article>
            <article><span>Focus today</span><strong>{focusedToday}<small> min</small></strong><p>{todaySessions.length} completed sessions</p></article>
            <article><span>Achievements</span><strong>{achievements.length}</strong><p>Keep building momentum</p></article>
          </section>
          <section className="panel"><div className="panel-title"><div><span className="eyebrow">NEXT ACTIONS</span><h2>Tasks</h2></div><button className="link" onClick={() => setTab("tasks")}>View all</button></div>
            <div className="task-list">{tasks.slice(0, 5).map((task) => <TaskRow key={task.id} task={task} onToggle={() => setTasks(items => items.map(t => t.id === task.id ? {...t, completed: !t.completed} : t))} onDelete={() => setTasks(items => items.filter(t => t.id !== task.id))} />)}{!tasks.length && <Empty text="No tasks yet. Add your first task." />}</div>
          </section>
        </>}

        {tab === "tasks" && <section className="panel large"><div className="panel-title"><div><span className="eyebrow">PLAN & EXECUTE</span><h2>My tasks</h2></div><span>{completionRate}% complete</span></div>
          <form className="add-row" onSubmit={addTask}><input value={taskText} onChange={e => setTaskText(e.target.value)} placeholder="What needs to be done?" /><button>Add task</button></form>
          <div className="task-list">{tasks.map(task => <TaskRow key={task.id} task={task} onToggle={() => setTasks(items => items.map(t => t.id === task.id ? {...t, completed: !t.completed} : t))} onDelete={() => setTasks(items => items.filter(t => t.id !== task.id))} />)}{!tasks.length && <Empty text="Your task list is clear." />}</div>
        </section>}

        {tab === "focus" && <section className="focus-layout"><article className="timer-card"><span className="eyebrow">FOCUS TIMER</span><div className="timer">{timeDisplay}</div><p>{running ? "Stay with one task until the timer ends." : "Choose a duration and begin."}</p><div className="timer-presets">{[5, 25, 50].map(m => <button key={m} className={timerMinutes === m ? "selected" : ""} onClick={() => chooseTimer(m)}>{m} min</button>)}</div><div className="timer-actions"><button className="primary" onClick={() => setRunning(value => !value)}>{running ? "Pause" : "Start"}</button><button onClick={() => chooseTimer(timerMinutes)}>Reset</button></div></article>
          <article className="panel"><span className="eyebrow">SESSION HISTORY</span><h2>{totalFocus} focused minutes</h2>{sessions.slice(0, 8).map(s => <div className="history" key={s.id}><span>{s.minutes} minute session</span><small>{new Date(s.completedAt).toLocaleString()}</small></div>)}{!sessions.length && <Empty text="Complete a timer to record your first session." />}</article>
        </section>}

        {tab === "notes" && <section className="notes-layout"><form className="panel note-editor" onSubmit={saveNote}><span className="eyebrow">CAPTURE AN IDEA</span><input value={noteTitle} onChange={e => setNoteTitle(e.target.value)} placeholder="Note title" /><textarea value={noteBody} onChange={e => setNoteBody(e.target.value)} placeholder="Write anything you want to remember..." /><button>Save note</button></form><div className="notes-grid">{notes.map(note => <article className="note-card" key={note.id}><button aria-label="Delete note" onClick={() => setNotes(items => items.filter(n => n.id !== note.id))}>×</button><h3>{note.title}</h3><p>{note.body}</p><small>{new Date(note.updatedAt).toLocaleString()}</small></article>)}{!notes.length && <Empty text="Your notes will appear here." />}</div></section>}

        {tab === "progress" && <section className="progress-layout"><article className="panel"><span className="eyebrow">YOUR NUMBERS</span><h2>Progress snapshot</h2><div className="metric"><span>Task completion</span><strong>{completionRate}%</strong></div><div className="metric"><span>Completed tasks</span><strong>{completed}</strong></div><div className="metric"><span>Focused minutes</span><strong>{totalFocus}</strong></div><div className="metric"><span>Notes saved</span><strong>{notes.length}</strong></div></article><article className="panel"><span className="eyebrow">ACHIEVEMENTS</span><h2>Milestones</h2>{achievements.map(item => <div className="achievement" key={item}><span>★</span><div><strong>{item}</strong><small>Unlocked</small></div></div>)}{!achievements.length && <Empty text="Complete an action to unlock an achievement." />}</article></section>}
      </main>

      <nav className="mobile-nav">{(["today", "tasks", "focus", "notes", "progress"] as Tab[]).map(item => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}><span>{item === "today" ? "⌂" : item === "tasks" ? "✓" : item === "focus" ? "◷" : item === "notes" ? "▤" : "↗"}</span><small>{item}</small></button>)}</nav>
    </div>
  );
}

function TaskRow({ task, onToggle, onDelete }: { task: Task; onToggle: () => void; onDelete: () => void }) {
  return <div className={`task-row ${task.completed ? "done" : ""}`}><button className="check" onClick={onToggle}>{task.completed ? "✓" : ""}</button><span>{task.text}</span><button className="delete" onClick={onDelete}>×</button></div>;
}
function Empty({ text }: { text: string }) { return <p className="empty">{text}</p>; }
export default App;
