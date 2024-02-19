import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home";
import Books from "./components/books/Books";
import NotFound from "./components/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/books" element={<Books/>} />
        <Route path="/*" element={<NotFound/>} />
      </Routes>
    </>
  );
}

export default App;
