import { useEffect, useState } from "react";
import "./App.css";

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

    if (!title.trim()) {
      return;
    }

    const response = await fetch("/issues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      console.error("Failed to create issue");
      return;
    }

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

  async function deleteIssue(id) {
    const response = await fetch(`/issues/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error("Failed to delete issue");
      return;
    }

    setIssues(issues.filter((issue) => issue.id !== id));
  }

  return (
    <main className="app">
      <div className="app-shell">
        <header className="app-header">
          <p className="eyebrow">Full-Stack Project</p>
          <h1>Issue Tracker</h1>
          <p className="subtitle">
            Track, update, and manage issues with React, Express, and PostgreSQL.
          </p>
        </header>

        <form className="issue-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter a new issue title..."
          />
          <button type="submit">Create Issue</button>
        </form>

        <section className="issues-section">
          <div className="section-header">
            <h2>All Issues</h2>
            <span className="issue-count">
              {issues.length} {issues.length === 1 ? "issue" : "issues"}
            </span>
          </div>

          {issues.length === 0 ? (
            <div className="empty-state">
              <p>No issues yet.</p>
              <span>Create your first one above.</span>
            </div>
          ) : (
            <div className="issues-grid">
              {issues.map((issue) => (
                <article
                  key={issue.id}
                  className={`issue-card ${issue.status}`}
                >
                  <div className="issue-card-top">
                    <div>
                      <p className="issue-id">Issue #{issue.id}</p>
                      <h3>{issue.title}</h3>
                    </div>

                    <span className={`status-badge ${issue.status}`}>
                      {issue.status}
                    </span>
                  </div>

                  <div className="issue-actions">
                    <button
                      className="secondary-btn"
                      onClick={() => toggleStatus(issue)}
                    >
                      {issue.status === "open" ? "Close" : "Reopen"}
                    </button>

                    <button
                      className="danger-btn"
                      onClick={() => deleteIssue(issue.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;