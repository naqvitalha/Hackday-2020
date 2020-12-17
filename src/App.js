import React from "react";
import {BenchRunPage} from "./components/BenchRunPage";
import { results } from "./data/results";
import "./styles.css";
import { mapScore } from "./Util";

export default function App() {
  return (
    <div className="App">
      <BenchRunPage />
    </div>
  );
}
