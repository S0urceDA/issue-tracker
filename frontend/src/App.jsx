import { useEffect, useState } from "react";

function App() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetch("/issues")
      .then((response) => response.json())
      .then((data) => setIssues(data));
  }, []);

  return (
    <main>
      <h1>Issue Tracker</h1>

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