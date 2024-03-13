import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import Movies from "./pages/Movies";
import Landing from "./pages/Landing";
import About from "./pages/About";
import RecommendMoviesResult from "./pages/RecommendMoviesResult";

function App() {
  return (
    <>
      <div className="w-screen overflow-x-hidden min-h-screen mainContainer">
        <div>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/about" element={<About />} />
              <Route path="/recommendations_result" element={<RecommendMoviesResult />} />
            </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
