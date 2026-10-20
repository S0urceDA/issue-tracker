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

  async function toggleStatus(issue) {
    const newStatus = issue.status === "open" ? "closed" : "open";

    const response = await fetch(`/issues/${issue.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      console.error("Failed to update issue");
      return;
    }

    const updatedIssue = await response.json();

    setIssues(
      issues.map((currentIssue) =>
        currentIssue.id === updatedIssue.id ? updatedIssue : currentIssue
      )
    );
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

          <button onClick={() => toggleStatus(issue)}>
            {issue.status === "open" ? "Close issue" : "Reopen issue"}
          </button>
        </div>
      ))}
    </main>
  );
}

export default App;