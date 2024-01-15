import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home";
import Authors from "./components/Authors";
import Books from "./components/Books";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/authors" element={<Authors/>} />
        <Route path="/books" element={<Books/>} />
      </Routes>
    </>
  );
}

export default App;
