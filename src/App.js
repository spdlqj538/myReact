import "./App.css";
import React, { useRef } from "react";
import TheTable from "./TheTable";

function App() {
  const grades = useRef([1, 2, 3]);

  return (
    <div className="App">
      {grades.current.map((grade) => (
        <TheTable grade={grade} key={grade} />
      ))}
    </div>
  );
}

export default App;
