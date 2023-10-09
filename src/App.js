import logo from "./logo.svg";
import "./App.css";
import Species from "./speciesComponent";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("myTeam"))) {
      localStorage.setItem("myTeam", JSON.stringify([]));
    }
  });
  return (
    <div className="App">
      <header className="App-header">
        <Species />
      </header>
    </div>
  );
}

export default App;
