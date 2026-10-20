import { useEffect, useState } from "react";

function App() {
  const [issues, setIssues] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch("/issues")
      .then((response) => response.json())
      .then((data) => setIssues(data));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await fetch("/issues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    const newIssue = await response.json();

    setIssues([...issues, newIssue]);
    setTitle("");
  }

  return (
    <main>
      <h1>Issue Tracker</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Issue title"
        />

        <button type="submit">Create issue</button>
      </form>

      {issues.map((issue) => (
        <div key={issue.id}>
          <h2>{issue.title}</h2>
          <p>{issue.status}</p>
        </div>
      ))}
    </main>
  );
}

export default App;