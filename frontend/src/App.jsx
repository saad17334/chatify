import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch("https://chat-backend-7mix.onrender.com/")
      .then(res => res.text())
      .then(data => console.log("API Response:", data))
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <h1>Frontend Running 🚀</h1>
  );
}

export default App;